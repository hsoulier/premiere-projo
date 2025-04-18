import { parseHTML } from "linkedom"
import {
  getMovie,
  getShow,
  getCinemaBySlug,
  insertCinema,
  insertMovie,
  insertShow,
} from "../db/requests.js"
import { getAllocineInfo } from "../db/allocine.js"

const listAVPs = [
  "avant-premieres-et-seances-exclusives",
  "avant-premieres-avec-equipe",
]

const debug = {
  movies: 0,
  shows: 0,
}

const getDataFromPage = async (page) => {
  const res = await fetch(page)

  const data = await res.text()

  const { document } = parseHTML(data)

  return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
}

export const scrapMk2 = async () => {
  const props = await getDataFromPage(
    "https://www.mk2.com/ile-de-france/evenements"
  )

  const info = props?.pageProps?.events?.content.filter((c) =>
    listAVPs.includes(c.slug)
  )

  const events = info
    ?.map((e) => e.events.filter((a) => a.type.id === "avant-premiere"))
    .flat()

  const moviesData = []

  for (const event of events) {
    const link = `https://www.mk2.com/ile-de-france/evenement/${event.slug}`
    const props = await getDataFromPage(link)

    const sessionsByFilmAndCinema =
      props.pageProps.event.sessionsByFilmAndCinema || []

    const { title, cast, synopsis, runTime, openingDate } =
      sessionsByFilmAndCinema?.[0]?.film || {}

    const fallback = props.pageProps.event
    const directorNames = cast?.find((c) => c.personType === "Director")

    const directors = directorNames
      ? directorNames?.firstName + " " + directorNames?.lastName
      : ""

    const m = await getAllocineInfo({
      title: title || fallback.name,
      directors,
      release: new Date(openingDate).getFullYear(),
    })

    !Object.keys(sessionsByFilmAndCinema?.[0]?.film).length === 0 &&
      console.warn("no film object, fallback used for", event.slug, link)

    const movie = {
      ...m,
      synopsis: synopsis || fallback.description,
      duration: runTime || 0,
      link,
      director: m?.director || directors,
    }

    moviesData.push(movie)

    const existingMovie = await getMovie(movie.id)

    if (existingMovie) continue

    await insertMovie(movie)

    debug.movies++
  }

  for (const movie of moviesData) {
    const props = await getDataFromPage(movie.link)

    const event = props.pageProps.event

    for (const session of event.sessionsByFilmAndCinema[0].sessions) {
      const language =
        session.attributes.find((a) => a.id === "VS00000005")?.shortName ===
        "VOSTF"
          ? "vost"
          : "vf"

      const cinemaSlug = event.sessionsByFilmAndCinema[0].cinema.slug

      const cinema = await getCinemaBySlug(cinemaSlug)

      const cinemaId = cinema?.id

      const show = {
        id: session.sessionId,
        cinemaId,
        language,
        date: session.showTime,
        avpType: event.genres?.[0]?.id === "equipe-du-film" ? "AVPE" : "AVP",
        movieId: movie.id,
        linkShow: `https://www.mk2.com/panier/seance/tickets?cinemaId=${session.cinemaId}&sessionId=${session.sessionId}`,
        linkMovie: movie.link,
      }

      const existingShow = await getShow(show.id)

      if (existingShow) continue

      await insertShow(show)

      debug.shows++
    }
  }

  console.log("✅ Mk2 scrapping done", debug)
}

export const getMk2Theaters = async () => {
  const res = await fetch("https://www.mk2.com/salles")

  const data = await res.text()

  const { document } = parseHTML(data)

  const cinemasData = JSON.parse(
    document.querySelector("#__NEXT_DATA__").textContent
  ).props.pageProps.cinemaComplexes

  for (const [index, c] of cinemasData.entries()) {
    const cinema = c.cinemas[0]

    const existingCinema = await getCinemaBySlug(cinema.slug)

    if (existingCinema) continue

    await insertCinema({
      id: `mk2-${index + 1}`,
      slug: cinema.slug,
      name: cinema.name,
      arrondissement: parseInt(c.zipcode.split("750")[1]),
      address: `${c.address}, ${c.zipcode} ${cinema.city}`,
      link: `https://www.mk2.com/salle/${c.slug}`,
      source: "mk2",
    })
  }
}
