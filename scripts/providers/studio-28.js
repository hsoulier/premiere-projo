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

export const scrapStudio28 = async () => {
  const pageEvents = await (
    await fetch("https://www.cinema-studio28.fr/avant-premiere/")
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
    await fetch("https://www.monticketstudio28.cotecine.fr/reserver/")
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
    console.group("🛠️ Scraping movie:", movie.title)
    const resDays = await fetch(
      `https://www.monticketstudio28.cotecine.fr/reserver/ajax/?modresa_film=${movie.value}`
    )

    const days = await resDays.json()

    const _movie = await getAllocineInfo({ title: movie.title, directors: [] })

    if (!_movie.id) {
      console.error(`❌ Movie ${movie.title} not found in Allocine`)
      continue
    }

    const existingMovie = await getMovie(_movie.id)

    if (!existingMovie) {
      console.log("🎬  movie not found:", _movie.title)
      continue
    }

    for (const [day] of Object.entries(days)) {
      console.group("ℹ️ Day:", day)

      const shows = await (
        await fetch(
          `https://www.monticketstudio28.cotecine.fr/reserver/ajax/?modresa_film=${movie.value}&modresa_jour=${day}`
        )
      ).json()

      for (const [id, show] of Object.entries(shows)) {
        const linkShow = `https://www.monticketstudio28.cotecine.fr/reserver/F${movie.value}/D${id}`

        console.log("🔗 Link:", linkShow)
        console.log("ℹ️ Show:", show)
      }
      console.groupEnd()
    }
    console.groupEnd()

    // const { document: docPageMovie } = parseHTML(pageMovie)

    // const title = docPageMovie.querySelector(".css-zezy6m")?.textContent
    // const director = docPageMovie.querySelector(".css-1v4g3y5")?.textContent
    // const link = docPageMovie.querySelector(".css-12ph13l")?.href

    // console.log("🎬 Movie:", title)
    // console.log("ℹ️ Director:", director)
    // console.log("🔗 Date:", link)
  }
}
