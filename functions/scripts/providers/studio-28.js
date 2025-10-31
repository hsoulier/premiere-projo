import { logger } from "firebase-functions"
import { parseHTML } from "linkedom"
import { getAllocineInfo } from "../db/allocine.js"
import { getMovie } from "../db/requests.js"
import { fetchUrl } from "../utils.js"

export const scrapStudio28 = async () => {
  const pageEvents = await (
    await fetchUrl("https://www.cinema-studio28.fr/avant-premiere/")
  ).text()

  const { document: docPageEvents } = parseHTML(pageEvents)

  // TODO: Change selector to match the actual structure of the page
  const moviesFromWebsite = [...docPageEvents.querySelectorAll(".css-1mzdl2j")]
    .filter(
      ({ textContent }) => textContent && textContent.includes("Avant-première")
    )
    .map((el) => {
      const parent = el.closest(".css-r5qzfa")

      return {
        title: parent
          .querySelector("h2")
          ?.textContent.replace("Avant-première · ", "")
          .toLowerCase(),
        link: parent.querySelector("a.css-ju3hew").href,
      }
    })

  const pageShows = await (
    await fetchUrl("https://www.monticketstudio28.cotecine.fr/reserver/")
  ).text()

  const { document: docPageShows } = parseHTML(pageShows)

  const movies = [
    ...docPageShows.querySelectorAll(
      "select[name=modresa_film] > option:not([value=''])"
    ),
  ]
    .filter(({ textContent }) =>
      moviesFromWebsite.find((e) => e.title === textContent.toLowerCase())
    )
    .map((el) => ({ value: el.value, title: el.textContent }))

  for (const movie of movies) {
    const resDays = await fetchUrl(
      `https://www.monticketstudio28.cotecine.fr/reserver/ajax/?modresa_film=${movie.value}`
    )

    const days = await resDays.json()

    const _movie = await getAllocineInfo({ title: movie.title, directors: [] })

    if (!_movie.id) {
      logger.error(`❌ Movie ${movie.title} not found in Allocine`)
      continue
    }

    const existingMovie = await getMovie(_movie.id)

    if (!existingMovie) {
      logger.log("🎬  movie not found:", _movie.title)
      continue
    }

    for (const [day] of Object.entries(days)) {
      logger.log("ℹ️ Day:", day)

      const shows = await (
        await fetchUrl(
          `https://www.monticketstudio28.cotecine.fr/reserver/ajax/?modresa_film=${movie.value}&modresa_jour=${day}`
        )
      ).json()

      for (const [id, show] of Object.entries(shows)) {
        const linkShow = `https://www.monticketstudio28.cotecine.fr/reserver/F${movie.value}/D${id}`

        logger.log("🔗 Link:", linkShow)
        logger.log("ℹ️ Show:", show)
      }
    }

    // const { document: docPageMovie } = parseHTML(pageMovie)

    // const title = docPageMovie.querySelector(".css-zezy6m")?.textContent
    // const director = docPageMovie.querySelector(".css-1v4g3y5")?.textContent
    // const link = docPageMovie.querySelector(".css-12ph13l")?.href

    // logger.log("🎬 Movie:", title)
    // logger.log("ℹ️ Director:", director)
    // logger.log("🔗 Date:", link)
  }
}
