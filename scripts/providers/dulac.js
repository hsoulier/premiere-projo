import { parseHTML } from "linkedom"
import playwright from "playwright"
import { getAllocineInfo } from "../db/allocine.js"
import {
  getMovie,
  getShow,
  insertCinema,
  insertMovie,
  insertShow,
} from "../db/requests.js"
import { frenchToISODateTime } from "../utils.js"

const cinemas = {
  "0821": "majestic-bastille",
  "0820": "arlequin",
  "0822": "escurial",
  "0823": "majestic-passy",
  "0824": "reflet-medicis",
}

export const scrapDulac = async () => {
  const movies = []
  let pageIndex = 0

  while (true) {
    console.group(`ℹ️ Scraping Dulac cinemas page ${pageIndex}`)

    const res = await fetch(
      `https://dulaccinemas.com/portail/evenements?page=${pageIndex}`
    )
    const html = await res.text()

    const { document } = parseHTML(html)

    const items = document.querySelectorAll(".view-content > div > ul.row > li")

    const hasMorePages = items.length >= 16

    for (const item of items) {
      const title = item.querySelector(".field--name-title").textContent.trim()
      if (!title.toLowerCase().startsWith("avant-première ")) continue

      movies.push({
        title,
        link: item.querySelector("a.btn.btn-secondary.btn-invert").href,
      })
    }
    console.log(`Found ${items.length} movies on page ${pageIndex}`)

    console.groupEnd()

    if (!hasMorePages) break

    pageIndex++
  }

  const browser = await playwright.chromium.launch({ timeout: 5_000 })
  const context = await browser.newContext()
  const page = await context.newPage()

  for (const movie of movies) {
    console.group(`${movie.title}`)
    const res = await fetch(`https://dulaccinemas.com${movie.link}`)
    const html = await res.text()
    const { document } = parseHTML(html)

    const section = document.getElementById("reservation-seances-block")

    if (!section) {
      console.warn(`No reservation section found for ${movie.title}`)
      continue
    }

    if (section.querySelectorAll("#calendarDays > ul > li").length > 1) {
      console.warn(`Multiple days found for ${movie.title}, skipping for now.`)
    }

    const dates = [
      ...section.querySelectorAll(
        ".list-horaires > .item-horaire .seance-booking-url"
      ),
    ].map((el) => el.href)

    const dateShow =
      section.querySelector("[data-seance-date]").dataset.seanceDate

    for (const date of dates) {
      await page.goto(date, { waitUntil: "domcontentloaded" })

      const res = await page.waitForRequest("**/ajax/get_data_session.php")

      const data = await (await res.response()).json()

      const dataMovie = data?.data_movie

      const dataSession = data?.data_session

      if (!dataMovie || !dataSession || data?.error_label) {
        console.warn(`No data found for ${movie.title} on ${dateShow}`)
        continue
      }

      const title = dataMovie.title

      const _movie = await getAllocineInfo({
        title,
        directors: [dataMovie.director],
      })

      if (!_movie) {
        console.warn(`No Allocine info found for ${movie.title}`)
        continue
      }

      const existingMovie = await getMovie(_movie.id)

      if (!existingMovie) {
        console.log(`ℹ️ Inserting movie ${_movie.id} ${_movie.title}`)

        await insertMovie({
          ..._movie,
          synopsis: dataMovie.synopsis,
          director: dataMovie.director,
          duration: dataMovie.duration,
          imdbId: dataMovie.imdb_id,
        })
      }

      const lang =
        (
          await page
            .locator(".container_features_session > *[title^=Version]")
            .getAttribute("title")
        ).toLowerCase() === "version originale"
          ? "vost"
          : "vf"

      const cinemaId = new URL(page.url()).searchParams.get("nc")

      const showTimeHour = `${dataSession.hour.substring(
        0,
        2
      )}h${dataSession.hour.substring(2, 4)}`

      const year = parseInt(dataSession.date.substring(0, 4))
      const month = parseInt(dataSession.date.substring(4, 6)) - 1 // JS Date months are 0-based
      const day = parseInt(dataSession.date.substring(6, 8))

      const showTime = new Date(year, month, day).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        weekday: "long",
      })

      const d = frenchToISODateTime(`${showTime} à ${showTimeHour}`)

      const show = {
        id: dataSession.id,
        cinemaId: cinemas[cinemaId],
        language: lang.toLowerCase(),
        date: d,
        avpType: "AVP",
        movieId: existingMovie.id,
        linkShow: page.url(),
        linkMovie: `https://dulaccinemas.com${movie.link}`,
        isFull: false,
      }

      const existingShow = await getShow(show.id)

      if (existingShow) {
        console.log(`ℹ️ Show ${show.id} already exists`)
        continue
      }

      await insertShow(show)
    }

    console.groupEnd()
  }

  await browser.close()
}

const insertCinemas = async () => {
  const cinemas = {
    "majestic-bastille":
      "https://dulaccinemas.com/cinema/majestic-bastille/2736",
    arlequin: "https://dulaccinemas.com/cinema/larlequin/2625",
    escurial: "https://dulaccinemas.com/cinema/escurial/2794",
    "majestic-passy": "https://dulaccinemas.com/cinema/majestic-passy/2853",
    "reflet-medicis": "https://dulaccinemas.com/cinema/reflet-medicis/2950",
  }

  for (const [id, link] of Object.entries(cinemas)) {
    const res = await fetch(link)
    const html = await res.text()
    const { document } = parseHTML(html)

    const name = document
      .querySelector("title")
      .textContent?.split("|")[0]
      .trim()

    const rawAddress =
      document.querySelector(".adress")?.textContent.trim() || ""

    const arrondissement = parseInt(
      rawAddress.split(" Paris ")[1]?.trim() || ""
    )
    const address = `${rawAddress.split(" Paris ")[0].trim()} PARIS`
    const source = "dulac"

    await insertCinema({
      id,
      name,
      slug: id,
      arrondissement,
      address,
      link,
      source,
    })
  }
}
