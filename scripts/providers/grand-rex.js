import { parseHTML } from "linkedom"
import playwright from "playwright"
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

export const scrapGrandRex = async () => {
  const browser = await playwright.chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  const movies = await getMoviesFromEventPage()

  console.log("ℹ️ Movies to scrap", movies.length)

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

    const link = `${rawLink.replace(
      "resa-part/1/",
      "reserver/"
    )}?utm_campaign=1`

    if (!link.includes("cotecine.fr")) {
      console.log(
        `Skipping movie "${m.title}" as it does not have a valid link`
      )
      continue
    }

    await page.goto(link)

    if (isSingleShow) {
      const errorText = await (
        await page.$("#resa-erreur .erreur")
      )?.textContent()

      const isFull =
        errorText === "Plus de places disponibles en ligne pour cette séance."

      const id = page.url().split("/").at(-2)

      const existingShow = await getShow(id)

      if (!existingShow && isFull) continue

      if (existingShow) {
        if (existingShow.isFull !== isFull) {
          console.log(
            `ℹ️ Toggle show ${existingShow.id} to status ${
              isFull ? "full" : "available"
            }`
          )
          await updateAvailabilityShow(existingShow.id, { isFull })
        }

        continue
      }

      const showTime = await page.$eval(".date_seance .s_jour", (el) =>
        el.textContent.trim()
      )

      const showTimeHour = await page.$eval(".date_seance .s_heure", (el) =>
        el.textContent.trim()
      )
      const lang = await page.$eval(".date_seance .film_version", (el) =>
        el.textContent.trim()?.replace("en ", "")
      )
      const title = await page.$eval("#titre_du_film_seul", (el) =>
        el.textContent.trim()
      )

      const movie = await getAllocineInfo({ title, directors: [director] })

      const existingMovie = await getMovie(movie.id)

      if (!existingMovie) {
        console.log(`Inserting movie ${movie.id} ${movie.title}`)

        await insertMovie(movie)
      }

      console.log(
        `1️⃣ M ${movie.title} ${
          existingMovie.release ? new Date(existingMovie.release) : "⚠️⚠️"
        } ${movie.release ? new Date(movie.release) : "⚠️⚠️"}`
      )

      continue

      const d = frenchToISODateTime(`${showTime} à ${showTimeHour}`)

      console.log(showTime, showTimeHour, d)

      const show = {
        id,
        cinemaId: "grand-rex",
        language: lang.toLowerCase(),
        date: d,
        avpType: "AVP",
        movieId: movie.id,
        linkShow: page.url(),
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

    const title = await page.$eval(
      "[name=modresa_film] > option[selected=selected]",
      (el) => el.textContent.trim()
    )

    const movie = await getAllocineInfo({ title, directors: [director] })

    if (!movie) {
      console.log(`❌ Skip movie ${title} not in Allocine`)
      continue
    }

    const existingMovie = await getMovie(movie.id)

    console.log(
      `2️⃣ M ${movie.title} ${
        existingMovie.release ? new Date(existingMovie.release) : "⚠️⚠️"
      } ${movie.release ? new Date(movie.release) : "⚠️⚠️"}`
    )

    const dates = (
      await page.$$eval(
        "select[name=modresa_jour] > option:not([value=''])",
        (options) =>
          options.map((o) => ({ label: o.textContent.trim(), value: o.value }))
      )
    ).filter((d) => {
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

      await Promise.all([
        page.waitForURL(link),
        page.selectOption("[name=modresa_jour]", value),
      ])

      const resShows = await page.waitForResponse(
        `https://legrandrex.cotecine.fr/reserver/ajax/?modresa_film=322713&modresa_jour=${value}`
      )

      const showsAvailable = await resShows.json()

      console.log(`ℹ️ Response for date ${label}`, showsAvailable)

      if (Object.keys(showsAvailable).length > 1) {
        console.log(`ℹ️ Multiple shows on this date ${label} ${label}`)

        const salles = await page.$$eval(
          "select[name=modresa_seance] > option:not([value=''])",
          (options) =>
            options.map((o) => ({
              label: o.textContent.trim(),
              value: o.value,
            }))
        )

        console.log("✨ Salles available", salles)

        for (const { label, value } of salles) {
          const linkShow = `${page.url().split("?")[0]}/D${value}`

          console.log(`ℹ️ Scraping show for date ${label} ${value}`, linkShow)

          page.waitForLoadState("domcontentloaded")

          await page.selectOption("[name=modresa_seance]", value)

          page.waitForURL(linkShow)

          page.waitForLoadState("networkidle")

          const errorText = await (
            await page.$("#resa-erreur .erreur")
          )?.textContent()

          const isFull =
            errorText ===
            "Plus de places disponibles en ligne pour cette séance."

          const id = page.url().split("/").at(-2)

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
            if (label === dates.at(-1)) continue
            await page.goBack({ waitUntil: "load" })
            continue
          }

          const showTime = await page.$eval(".date_seance .s_jour", (el) =>
            el.textContent.trim()
          )

          const showTimeHour = await page.$eval(".date_seance .s_heure", (el) =>
            el.textContent.trim()
          )
          const lang = await page.$eval(".date_seance .film_version", (el) =>
            el.textContent.trim()?.replace("en ", "")
          )

          const d = frenchToISODateTime(`${showTime} à ${showTimeHour}`)

          console.log(showTime, showTimeHour, d)

          const show = {
            id,
            cinemaId: "grand-rex",
            language: lang.toLowerCase(),
            date: d,
            avpType: "AVP",
            movieId: movie.id,
            linkShow: page.url(),
            linkMovie: m.link,
            isFull,
          }

          if (existingShow && existingShow.isFull === isFull) {
            if (label === dates.at(-1)) continue

            await page.goBack({ waitUntil: "load" })

            continue
          }

          if (existingShow && existingShow.isFull !== isFull) {
            console.log(
              `Updating show ${show.id} from ${existingShow.isFull} to ${isFull}`
            )
            await updateAvailabilityShow(id, isFull)

            if (label === dates.at(-1)) continue

            await page.goBack({ waitUntil: "load" })

            continue
          }

          await insertShow(show)

          if (label === dates.at(-1)) continue

          // Return to base page
          await page.goBack({ waitUntil: "load" })
        }

        continue
      }

      continue

      const errorText = await (
        await page.$("#resa-erreur .erreur")
      )?.textContent()

      const isFull =
        errorText === "Plus de places disponibles en ligne pour cette séance."

      const id = page.url().split("/").at(-2)

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
        if (label === dates.at(-1)) continue
        await page.goBack({ waitUntil: "load" })
        continue
      }

      const showTime = await page.$eval(".date_seance .s_jour", (el) =>
        el.textContent.trim()
      )

      const showTimeHour = await page.$eval(".date_seance .s_heure", (el) =>
        el.textContent.trim()
      )
      const lang = await page.$eval(".date_seance .film_version", (el) =>
        el.textContent.trim()?.replace("en ", "")
      )

      const d = frenchToISODateTime(`${showTime} à ${showTimeHour}`)

      console.log(showTime, showTimeHour, d)

      const show = {
        id,
        cinemaId: "grand-rex",
        language: lang.toLowerCase(),
        date: d,
        avpType: "AVP",
        movieId: movie.id,
        linkShow: page.url(),
        linkMovie: m.link,
        isFull,
      }

      if (existingShow && existingShow.isFull === isFull) {
        if (label === dates.at(-1)) continue

        await page.goBack({ waitUntil: "load" })

        continue
      }

      if (existingShow && existingShow.isFull !== isFull) {
        console.log(
          `Updating show ${show.id} from ${existingShow.isFull} to ${isFull}`
        )
        await updateAvailabilityShow(id, isFull)

        if (label === dates.at(-1)) continue

        await page.goBack({ waitUntil: "load" })

        continue
      }

      await insertShow(show)

      if (label === dates.at(-1)) continue

      // Return to base page
      await page.goBack({ waitUntil: "load" })
    }
  }

  await context.close()
  await browser.close()
}
