import { parseHTML } from "linkedom"
import { getAllocineInfo } from "../db/allocine.js"
import {
  getMovie,
  getShow,
  insertMovie,
  insertShow,
  updateAvailabilityShow,
  updateShow,
} from "../db/requests.js"
import { frenchToISODateTime } from "../utils.js"

const getMoviesPage = async () => {
  const options = { method: "GET", headers: { "Accept-Language": "fr-FR" } }
  const res = await fetch("https://www.legrandrex.com/cinema", options)
  const text = await res.text()

  const { document } = parseHTML(text)

  return document
}

const getMoviesFromEventPage = async () => {
  const doc = await getMoviesPage()

  const movies = [
    ...doc.querySelectorAll("#list-all > .row > div > .row"),
  ].filter((m) => {
    const isAVP =
      m.querySelector(".categorie-tout")?.textContent === "Avant-premieres"

    const isVIP = m
      .querySelector(".title-movie-tout")
      ?.textContent?.includes("VIP")

    return isAVP && !isVIP
  })

  return movies.map((m) => {
    const title = m
      .querySelector(".title-movie-tout")
      ?.textContent?.split("(AVP")[0]
      ?.split("(VIP")[0]
      .trim()

    const link = m.querySelector(".title-movie-tout a")?.href

    return { title, link }
  })
}

const scrapShow = async () => {}

export const scrapGrandRex = async () => {
  const movies = await getMoviesFromEventPage()

  console.log("ℹ️ Movies to scrap", movies)

  for (const m of movies) {
    const textMovie = await (await fetch(m.link)).text()

    console.log(`ℹ️ Scraping movie ${m.title} ${m.link}`)

    const { document: movieDoc } = parseHTML(textMovie)

    const directorRow = movieDoc
      .querySelector(".infos-page > li:nth-of-type(2)")
      .textContent.trim()

    if (!directorRow.startsWith("De ")) {
      console.log(`Skipping movie "${m.title}" as it does not have a director`)
      continue
    }

    const director = directorRow.replace("De ", "").trim()

    const rawLink = movieDoc.querySelector("#book-film")?.dataset?.url || ""

    const isSingleShow = rawLink.includes("/VOST/") || rawLink.includes("/VF/")

    const link = `${rawLink.replace("resa-part/1/", "reserver/")}`

    if (!link.includes("cotecine.fr")) {
      console.log(
        `Skipping movie "${m.title}" as it does not have a valid link`
      )
      continue
    }

    const grandRexMovieId = link.split("/").at(-2).substring(1)

    const res = await fetch(link)

    const html = await res.text()

    const { document: showsDoc } = parseHTML(html)

    console.log(`ℹ️ has multiple shows: ${isSingleShow}`)

    if (isSingleShow) {
      const showDoc = showsDoc

      const movie = await getAllocineInfo({
        title: m.title,
        directors: [director],
      })

      const existingMovie = await getMovie(movie.id)

      if (!movie && !existingMovie) {
        console.log(`❌ Skip movie ${title} not in Allocine`)
        continue
      }

      const errorText = showDoc.querySelector(
        "#resa-erreur .erreur"
      )?.textContent

      const isFull =
        errorText === "Plus de places disponibles en ligne pour cette séance."

      const id = link
        .split("/")
        .filter((e) => e !== "VF" && e !== "VOST" && e)
        .join("")

      const existingShow = await getShow(id)

      if (isFull && (!existingShow || (existingShow && isFull))) {
        if (existingShow && existingShow.isFull !== isFull) {
          console.log(
            `ℹ️ Toggle show ${existingShow.id} to status ${
              isFull ? "full" : "available"
            }`
          )
          await updateAvailabilityShow(existingShow.id, { isFull })
        }

        continue
      }

      const showTime = showDoc
        .querySelector(".date_seance .s_jour")
        ?.textContent.trim()

      const showTimeHour = showDoc
        .querySelector(".date_seance .s_heure")
        ?.textContent.trim()

      const lang = showDoc
        .querySelector(".date_seance .film_version")
        ?.textContent.trim()
        ?.replace("en ", "")

      console.log(showTime, showTimeHour)

      const d = frenchToISODateTime(`${showTime} à ${showTimeHour}`)

      const show = {
        id,
        cinemaId: "grand-rex",
        language: lang.toLowerCase(),
        date: d,
        avpType: "AVP",
        movieId: movie.id,
        linkShow: link,
        linkMovie: m.link,
        isFull,
      }

      if (existingShow && existingShow.isFull === isFull) continue

      if (existingShow && existingShow.isFull !== isFull) {
        console.log(
          `Updating show ${show.id} from ${existingShow.isFull} to ${isFull}`
        )
        await updateAvailabilityShow(id, isFull)

        continue
      }

      await insertShow(show)

      continue
    }

    const title = showsDoc
      .querySelector("[name=modresa_film] > option[selected=selected]")
      ?.textContent.trim()

    const movie = await getAllocineInfo({ title, directors: [director] })

    if (!movie) {
      console.log(`❌ Skip movie ${title} not in Allocine`)
      continue
    }

    const existingMovie = await getMovie(movie.id)

    const dates = [
      ...showsDoc.querySelectorAll(
        "select[name=modresa_jour] > option:not([value=''])"
      ),
    ]
      .map((o) => ({ label: o.textContent.trim(), value: o.value }))
      .filter((d) => {
        const date = new Date(frenchToISODateTime(`${d.label} à 02h00`))

        return date.getTime() < new Date(existingMovie.release).getTime()
      })

    console.log("✨ Dates available", dates.length)

    if (!existingMovie) {
      console.log(`Inserting movie ${movie.id} ${movie.title}`)

      await insertMovie(movie)
    }

    for (const { label, value } of dates) {
      console.log(`ℹ️ Scraping show for date ${label}`)

      const resShows = await fetch(
        `https://legrandrex.cotecine.fr/reserver/ajax/?modresa_film=${grandRexMovieId}&modresa_jour=${value}`
      )

      const showsAvailable = await resShows.json()

      console.log(`ℹ️ Response for date ${label}`, showsAvailable)

      for (const [value, label] of Object.entries(showsAvailable)) {
        const linkShow = link.endsWith("/D")
          ? `${link}${value}`
          : `${link}/D${value}`

        const res = await fetch(linkShow)

        const html = await res.text()

        const { document: showDoc } = parseHTML(html)

        console.log(`ℹ️ Scraping show for date ${label} ${value}`, linkShow)

        const errorText = showDoc.querySelector(
          "#resa-erreur .erreur"
        )?.textContent

        const isFull =
          errorText === "Plus de places disponibles en ligne pour cette séance."

        const id = value
          .split("/")
          .filter((e) => e !== "VF" && e !== "VOST")
          .join("")

        const existingShow = await getShow(id)

        if (isFull && (!existingShow || (existingShow && isFull))) {
          if (existingShow && existingShow.isFull !== isFull) {
            console.log(
              `ℹ️ Toggle show ${existingShow.id} to status ${
                isFull ? "full" : "available"
              }`
            )
            await updateAvailabilityShow(existingShow.id, { isFull })
          }

          continue
        }

        const showTime = showDoc
          .querySelector(".date_seance .s_jour")
          ?.textContent.trim()

        const showTimeHour = showDoc
          .querySelector(".date_seance .s_heure")
          ?.textContent.trim()

        const lang = showDoc
          .querySelector(".date_seance .film_version")
          ?.textContent.trim()
          ?.replace("en ", "")

        console.log(showTime, showTimeHour)

        const d = frenchToISODateTime(`${showTime} à ${showTimeHour}`)

        const show = {
          id,
          cinemaId: "grand-rex",
          language: lang.toLowerCase(),
          date: d,
          avpType: "AVP",
          movieId: movie.id,
          linkShow: linkShow,
          linkMovie: m.link,
          isFull,
        }

        if (existingShow && existingShow.isFull === isFull) continue

        if (existingShow && existingShow.isFull !== isFull) {
          console.log(
            `Updating show ${show.id} from ${existingShow.isFull} to ${isFull}`
          )
          await updateAvailabilityShow(id, isFull)

          continue
        }

        await insertShow(show)
      }
    }
  }
}
