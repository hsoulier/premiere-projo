import { parseHTML } from "linkedom"
import { getAllocineInfo } from "../db/allocine.js"
import { getMovie, getShow, insertMovie, insertShow } from "../db/requests.js"
import { parseToDate } from "../utils.js"

export const scrapLouxor = async () => {
  const pageEvents = await (
    await fetch("https://www.cinemalouxor.fr/evenements/")
  ).text()

  const { document: docPageEvents } = parseHTML(pageEvents)

  const moviesFromLouxorWebsite = [
    ...docPageEvents.querySelectorAll(".css-1mzdl2j"),
  ]
    .filter(
      ({ textContent }) => textContent && textContent.includes("Avant-première")
    )
    .map((el) => {
      const parent = el.closest(".css-r5qzfa")

      return {
        title: parent
          .querySelector("h2")
          ?.textContent.split(" · ")
          .at(-1)
          .toLowerCase(),
        link: parent.querySelector("a.css-ju3hew").href,
      }
    })

  const pageShows = await (
    await fetch("https://www.louxor-reserver.cotecine.fr/reserver/")
  ).text()

  const { document: docPageShows } = parseHTML(pageShows)

  const movies = [
    ...docPageShows.querySelectorAll(
      "select[name=modresa_film] > option:not([value=''])"
    ),
  ]
    .filter(({ textContent }) =>
      moviesFromLouxorWebsite.find(
        ({ title }) => textContent.toLowerCase() === title.toLowerCase()
      )
    )
    .map((el) => ({
      value: el.value,
      title: el.textContent,
      link: moviesFromLouxorWebsite.find(
        ({ title }) => el.textContent.toLowerCase() === title.toLowerCase()
      ).link,
    }))

  for (const movie of movies) {
    console.group("🛠️ Scraping movie:", movie.title)
    const resDays = await fetch(
      `https://www.louxor-reserver.cotecine.fr/reserver/ajax/?modresa_film=${movie.value}`
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
      await insertMovie(_movie)
    }

    for (const [day] of Object.entries(days)) {
      console.group("ℹ️ Day:", day)

      const shows = await (
        await fetch(
          `https://www.louxor-reserver.cotecine.fr/reserver/ajax/?modresa_film=${movie.value}&modresa_jour=${day}`
        )
      ).json()

      for (const [id, show] of Object.entries(shows)) {
        const linkShow = `https://www.louxor-reserver.cotecine.fr/reserver/F${movie.value}/D${id}`

        const hours = show.substr(0, 5)

        const [showId, language] = id.split("/")

        const showToInsert = {
          avpType: "AVP",
          cinemaId: "louxor",
          id: showId,
          date: parseToDate(`${day} à ${hours}`),
          language,
          linkMovie: `https://www.cinemalouxor.fr${movie.link}`,
          linkShow,
          movieId: _movie.id,
        }

        const existingShow = await getShow(showToInsert.id)

        if (existingShow) {
          console.log("🎥 Show already exists:", showToInsert.id)
          continue
        }

        await insertShow(showToInsert)
      }
      console.groupEnd()
    }
    console.groupEnd()
  }
}
