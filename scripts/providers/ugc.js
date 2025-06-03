import { parseHTML } from "linkedom"
import { JSDOM } from "jsdom"
import {
  getCinemaByName,
  getMovie,
  insertMovie,
  getShow,
  insertShow,
} from "../db/requests.js"
import { getAllocineInfo } from "../db/allocine.js"

const TYPE_SHOWS = [
  "Avant-première avec équipe",
  "Avant-première",
  "Festival de Cannes",
]

const debug = { movies: 0, shows: 0 }

const removeAccents = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

const slugify = (input) => {
  if (!input) return ""

  // make lower case and trim
  const slug = input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .trim()
    .replace(/[\s-]+/g, "_")

  return slug
}

async function getFirstDate(id) {
  const res = await fetch(
    `https://www.ugc.fr/showingsFilmAjaxAction!getDaysByFilm.action?reloadShowingsTopic=reloadShowings&dayForm=dayFormDesktop&filmId=${id}&day=&regionId=1&defaultRegionId=1`
  )
  const html = await res.text()
  const { document } = parseHTML(html)

  const dates = document.querySelectorAll(".slider-item")
  const dateList = [...dates].map((date) => {
    const text = date.id.trim()
    const dateFormatted = text.split("nav_date_1_")[1]
    return dateFormatted
  })

  return dateList.length > 0 ? dateList[0] : ""
}

function urlAVPMovie(id, firstDate) {
  return `https://www.ugc.fr/showingsFilmAjaxAction!getShowingsByFilm.action?filmId=${id}&day=${firstDate}&regionId=1`
}

const getShows = async (info) => {
  for (const { link, id: movieId } of info) {
    const id = link.split("_").at(-1).replace(".html", "")

    const firstDate = await getFirstDate(id)
    const res2 = await fetch(urlAVPMovie(id, firstDate), {
      headers: { "Content-Language": "fr-FR" },
    })
    const html2 = await res2.text()
    const { document: document2 } = new JSDOM(html2).window

    // ? Get All show types for each projection card
    const showTypes = document2.querySelectorAll(
      ".component--screening-cards li button .screening-detail"
    )

    // ? Filter show types by only previews with team and previews without team
    const previews = [...showTypes].filter((show) => {
      return TYPE_SHOWS.includes(show?.textContent?.trim())
    })

    for (const preview of previews) {
      const el = preview?.closest("button[type=button]")
      const attributes = Object.assign({}, el?.dataset)

      if (!attributes) continue

      // const existingShow = await getShow(attributes?.showing)

      // if (existingShow) continue

      const cinemaId = (await getCinemaByName(attributes.cinema))?.id

      if (!movieId || !cinemaId) continue

      const details = {
        id: attributes?.showing,
        cinemaId,
        language: attributes?.version === "VOSTF" ? "vost" : "vf",
        date: "",
        avpType:
          preview?.textContent?.trim() === "Avant-première avec équipe"
            ? "AVPE"
            : "AVP",
        movieId,
        linkShow: `https://www.ugc.fr/reservationSeances.html?id=${attributes?.showing}`,
        linkMovie: link,
        festival:
          preview?.textContent?.trim() === "Festival de Cannes"
            ? "Festival de Cannes"
            : null,
      }

      const dateRaw = attributes?.seancedate?.split("/")
      const hour = attributes?.seancehour?.split(":")

      if (dateRaw && hour) {
        details.date = new Date(
          dateRaw[2],
          dateRaw[1] - 1,
          dateRaw[0],
          hour[0] - (process.env.CI ? 2 : 0), // When in CI we are in UTC+0
          hour[1]
        )
      }

      const existingShow = await getShow(details.id)

      if (existingShow) continue

      await insertShow(details)

      debug.shows++
    }
  }
}

const retrieveAvp = async () => {
  const $pathe = await fetch(
    "https://www.ugc.fr/filmsAjaxAction!getFilmsAndFilters.action?filter=onPreview&page=30010&cinemaId=&reset=false&"
  )
  const html = await $pathe.text()
  const { document } = parseHTML(html)

  const $movies = [
    ...document.querySelectorAll(".results-container > .row > *"),
  ]

  const moviesWithAVP = $movies.map((movie) => {
    const $link = movie.querySelector(".img-wrapper a")

    return {
      title: $link?.getAttribute("title").toLowerCase().trim(),
      link: `https://www.ugc.fr/${$link?.href}`,
    }
  })

  return moviesWithAVP
}

const retrieveAvpFestival = async () => {
  const page = await fetch("https://www.ugc.fr/evenement_875.html")
  const html = await page.text()
  const { document } = parseHTML(html)

  const numberOfCols = document.querySelectorAll(
    ".card-body > .container > .row > .col-sm"
  ).length

  const $movies = Array.from({ length: numberOfCols }, (_, i) =>
    [
      ...document.querySelectorAll(
        `.card-body > .container > .row > .col-sm:nth-of-type(${
          i + 1
        }) > font[color=#0047BA]`
      ),
    ].map((m, j) => {
      const text = m.textContent.trim()

      const textWithoutCompetition = text.split(" | ").slice(0, -1).join(" | ")

      const competition = text.split(" | ").pop().toLowerCase()

      // When 2 directors the title is "TILE, Director 1, Director 2"
      const splittedTitle = textWithoutCompetition.split(", ")

      const director = splittedTitle
        .filter((d) => d.toUpperCase() !== d)
        .join(", ")
        .toLowerCase()

      const title = splittedTitle
        .filter((d) => d.toUpperCase() === d)
        .join(", ")
        .toLowerCase()

      return {
        title,
        director,
        competition,
        link: document.querySelector(
          `.card-body > .container > .row > .col-sm:nth-of-type(${
            i + 1
          }) > a:nth-of-type(${j + 1})`
        )?.href,
      }
    })
  ).flat()

  const $moviesWithoutMoviePage = $movies.filter((m) =>
    m.link?.startsWith("https://www.ugc.fr/reservationSeances.html")
  )

  const moviesWithMoviePage = $movies
    .filter(
      (m) => !m.link?.includes("https://www.ugc.fr/reservationSeances.html")
    )
    .map((m) => {
      if (m.link.startsWith("https://www.ugc.fr/film_")) {
        return m
      }

      const id = m.link.split("?id=").at(-1)

      return {
        ...m,
        link: `https://www.ugc.fr/film_${slugify(m.title)}_${id}.html`,
      }
    })

  const getMoviePage = async (movie) => {
    const page = await fetch(
      `https://www.ugc.fr/searchAjaxAction!getPreviewResults.action?page=30004&searchKey=${encodeURIComponent(
        removeAccents(movie.title.toUpperCase())
      )}`
    )

    const html = await page.text()
    const { document } = parseHTML(html)

    const results = [
      ...document.querySelectorAll(
        ".results-container > .container > .row > div > .row > .col-md-6"
      ),
    ]

    const result = results.find((r) => {
      const title =
        r
          .querySelector(`.info-wrapper .block--title a`)
          ?.textContent.trim()
          ?.toUpperCase() || ""

      const director =
        r
          .querySelector(".info-wrapper .p--medium a")
          ?.textContent.trim()
          ?.toLowerCase() || ""

      return (
        removeAccents(title) === removeAccents(movie.title.toUpperCase()) &&
        director === movie.director.toLowerCase()
      )
    })

    !result && console.log("⚠️ No result in search for", movie.title)

    return {
      ...movie,
      link: `https://www.ugc.fr/${result?.querySelector("a")?.href}`,
    }
  }

  const moviesWithoutMoviePage = await Promise.all(
    $moviesWithoutMoviePage.map(getMoviePage)
  )

  return [...moviesWithMoviePage, ...moviesWithoutMoviePage]
}

export const scrapUGC = async () => {
  try {
    const moviesWithAVPClassic = await retrieveAvp()
    const moviesWithAVPFestival = await retrieveAvpFestival()

    const moviesWithAVP = [...moviesWithAVPClassic, ...moviesWithAVPFestival]

    const newMovies = []

    for (const movie of moviesWithAVP) {
      const page = await fetch(movie.link)

      const html = await page.text()
      const { document } = parseHTML(html)

      const [meta, synopsis] = [
        ...document.querySelectorAll(".group-info .color--dark-blue"),
      ]

      const text = meta?.innerHTML
        .trim()
        .replaceAll("\t", "")
        .replaceAll("\n", "")
        .split("<br>")

      const [hours, minutes] = text?.[0]?.includes("· ")
        ? text[0].split("· ").at(-1).split("h")
        : [0, 0]

      const duration = parseInt(hours) * 60 + parseInt(minutes)

      const months = [
        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre",
      ]

      const directors =
        text
          ?.find((t) => t.startsWith("De "))
          ?.toLowerCase()
          ?.split("de ")
          ?.slice(1) || []

      const releaseSplitted =
        text
          ?.find((t) => t.startsWith("Sortie le "))
          ?.toLowerCase()
          ?.split("sortie le ")
          ?.at(-1)
          ?.split(" ") || ""

      const release = releaseSplitted
        ? new Date(
            Date.UTC(
              parseInt(releaseSplitted[2]),
              months.indexOf(releaseSplitted[1]),
              parseInt(releaseSplitted[0]) - (process.env.CI ? 2 : 0) // When in CI we are in UTC+0
            )
          )
        : new Date()

      const m = await getAllocineInfo({
        title: movie.title,
        release,
        directors,
      })

      newMovies.push({
        ...m,
        synopsis: synopsis?.textContent.trim(),
        link: movie.link,
        director: m?.director || directors,
        duration,
      })
    }

    for (const movie of newMovies) {
      const { link, ...m } = movie

      if (!m?.id) continue

      const existingMovie = await getMovie(m.id)

      if (existingMovie) continue

      if (m.release) {
        const temp = new Date(m.release)
        temp.setDate(temp.getDate() + 1)
        m.release = temp
      }

      await insertMovie(m)

      debug.movies++
    }

    await getShows(newMovies)

    console.log("✅ UGC scrapping done", debug)
  } catch (error) {
    console.error("❌ Error while scrapping UGC:")
    console.error(error)
  }
}

export const getUGCTheaters = async () => {
  const $cinema = await fetch(
    "https://www.ugc.fr/cinemasAjaxAction!getCinemasList.action?id=1&latitude=&longitude="
  )
  const html = await $cinema.text()
  const { document } = parseHTML(html)

  const cinemasElements = [
    ...document.querySelectorAll(".text-wrapper.flex-grow-1"),
  ]

  for (const [index, cinema] of cinemasElements.entries()) {
    const name = cinema.querySelector("a").textContent.trim()
    const address = cinema.querySelector(".address").textContent
    const link = cinema.querySelector("a").href

    const existingCinema = await getCinemaByName(name)

    if (existingCinema) continue

    await insertCinema({
      id: `ugc-${index + 1}`,
      slug: link.replace(".html", ""),
      name,
      arrondissement: parseInt(address.split("  750")[1]),
      address,
      link: `https://www.ugc.fr/${link}`,
      source: "ugc",
    })
  }
}
