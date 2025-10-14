import { logger } from "firebase-functions"
import { parseHTML } from "linkedom"
import { getAllocineInfo } from "../db/allocine.js"
import {
  getMovie,
  getShow,
  insertCinema,
  insertMovie,
  insertShow,
} from "../db/requests.js"
import { fetchUrl, initBrowser, parseToDate } from "../utils.js"

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
    const res = await fetchUrl(
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
        link: `https://dulaccinemas.com${
          item.querySelector("a.btn.btn-secondary.btn-invert").href
        }`,
      })
    }
    logger.log(`Found ${items.length} movies on page ${pageIndex}`)

    if (!hasMorePages) break

    pageIndex++
  }

  const browser = await initBrowser()
  const context = await browser.newContext()
  const page = await context.newPage()

  for (const movie of movies) {
    const res = await fetchUrl(movie.link)

    const html = await res.text()
    const { document } = parseHTML(html)

    const title = document.querySelector(
      ".wrapper-horaires .movie-title"
    )?.textContent

    logger.log(`${title}`)

    const section = document.getElementById("reservation-seances-block")

    if (!section) {
      logger.warn(`No reservation section found for ${movie.title}`)
      continue
    }

    if (section.querySelectorAll("#calendarDays > ul > li").length > 1) {
      logger.warn(`Multiple days found for ${movie.title}, skipping for now.`)
    }

    const mainContent = [
      ...document.querySelectorAll(".wrapper-body .content > p"),
    ].flatMap((p) => p.innerText.trim().split("\n"))

    const director =
      mainContent
        .find(
          (line) =>
            line.includes("un film de ") ||
            line.includes("réalisation :") ||
            line.includes("réalisé par") ||
            line.includes(`${title} de `)
          // line.toLowerCase().includes(`le film ${title.toLowerCase()} de `)
        )
        ?.trim()
        ?.replace("un film de ", "")
        ?.replace(`${title} de `, "") || ""
    // ?.replace(`le film ${title} de `, "")

    const dates = [
      ...section.querySelectorAll(
        ".list-horaires > .item-horaire .seance-booking-url"
      ),
    ].map((el) => el.href)

    for (const date of dates) {
      logger.log(date)

      continue
      await page.goto(date, { waitUntil: "networkidle" })

      const screeningDate = (
        await page.locator("#text_info_session").textContent()
      )?.split(" - ")?.[0]

      const _movie = await getAllocineInfo({
        title,
        directors: [director],
      })

      if (!_movie) {
        logger.warn(`No Allocine info found for ${movie.title}`)
        continue
      }

      logger.log("🙄 Timing", screeningDate)

      const existingMovie = await getMovie(_movie.id)

      if (!existingMovie) {
        logger.log(`ℹ️ Inserting movie ${_movie.id} ${_movie.title}`)

        await insertMovie(_movie)
      }

      const lang =
        (
          await page
            .locator(".container_features_session > *[title^=Version]")
            .getAttribute("title")
        ).toLowerCase() === "version originale"
          ? "vost"
          : "vf"

      const cinemaId = [
        ...new URL(page.url()).searchParams.keys(),
      ][0].substring(3)

      const hash = page.url().substring(page.url().indexOf("#") + 1)
      const sq = new URLSearchParams(hash.substring(hash.indexOf("?")))

      logger.log("🙄 Cinema", cinemas[cinemaId], cinemaId)

      const show = {
        id: sq.get("id"),
        cinemaId: cinemas[cinemaId],
        language: lang.toLowerCase(),
        date: parseToDate(screeningDate.replaceAll(" ", " à ")),
        avpType: "AVP",
        movieId: existingMovie.id,
        linkShow: page.url(),
        linkMovie: movie.link,
        isFull: false,
      }

      logger.log("🙄 Show", show)

      const existingShow = await getShow(show.id)

      if (existingShow) {
        logger.log(`ℹ️ Show ${show.id} already exists`)
        continue
      }

      await insertShow(show)
    }
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
    const res = await fetchUrl(link)
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
