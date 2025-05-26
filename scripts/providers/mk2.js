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

const debug = { movies: 0, shows: 0 }

const getDataFromPage = async (page) => {
  const res = await fetch(page)

  const data = await res.text()

  const { document } = parseHTML(data)

  return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
}

const scrapAVPFestival = async () => {
  const pages = [
    "https://prod-paris.api.mk2.com/events/reprise-un-certain-regard-2025?cinema-group=ile-de-france",
    "https://prod-paris.api.mk2.com/events/reprise-quinzaine-des-cineastes-2025?cinema-group=ile-de-france",
    "https://prod-paris.api.mk2.com/events/reprise-selection-officielle-festival-cannes-2025?cinema-group=ile-de-france",
  ]

  try {
    const res = await Promise.all(pages.map((p) => fetch(p)))

    const data = await Promise.all(res.map((r) => r.json()))

    const sessionsByFilmAndCinema = data.map((d) => d.sessionsByFilmAndCinema)

    const moviesWithSession = sessionsByFilmAndCinema
      .map((sessions, index) =>
        sessions.map((session, j) => {
          return {
            movie: session.film,
            shows: session.sessions,
            cinemaSlug: session.cinema.slug,
          }
        })
      )
      .flat()

    for (const { movie, shows, cinemaSlug } of moviesWithSession) {
      const { id: cinemaId } = await getCinemaBySlug(cinemaSlug)

      if (!cinemaId) throw new Error(`Cinema not found for slug: ${cinemaSlug}`)

      const d = movie.cast.find((c) => c.personType === "Director")

      const m = await getAllocineInfo({
        release: movie.openingDate,
        title: movie.title,
        directors: [`${d.firstName} ${d.lastName}`],
      })

      if (movie.title === "Caravan") m.id = "48265"

      if (m?.id === "") {
        console.warn("No ID found for movie", movie.title, movie.openingDate)
        throw new Error(
          `No ID found for movie: ${movie.title} (${movie.openingDate})`
        )
      }

      const existingMovie = await getMovie(m.id)

      if (!existingMovie) {
        await insertMovie({
          ...m,
          synopsis: movie.synopsis,
          duration: movie.runTime || 0,
          link: `https://www.mk2.com/ile-de-france/evenement/${movie.slug}`,
          director: m?.director || [],
        })

        debug.movies++
      }

      for (const show of shows) {
        const foundLanguage = show.attributes.find(
          (a) => a.id === "VS00000005"
        )?.shortName

        const language =
          foundLanguage === "VOSTF" || foundLanguage === "VO" ? "vost" : "vf"

        const showData = {
          id: show.sessionId,
          cinemaId,
          language,
          date: show.showTime,
          avpType: "AVP",
          movieId: m.id,
          linkShow: `https://www.mk2.com/panier/seance/tickets?cinemaId=${show.cinemaId}&sessionId=${show.sessionId}`,
          linkMovie: `https://www.mk2.com/ile-de-france/evenement/${movie.slug}`,
          festival: "Festival de Cannes",
        }

        const existingShow = await getShow(showData.id)

        if (existingShow) continue

        await insertShow(showData)

        debug.shows++
      }
    }
  } catch (error) {
    console.error(error)
  }
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
      ? [directorNames?.firstName + " " + directorNames?.lastName]
      : []

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

    if (!movie.id) {
      console.warn("no id for", movie.title, link)
      continue
    }

    const existingMovie = await getMovie(movie.id)

    if (existingMovie) continue

    await insertMovie(movie)

    debug.movies++
  }

  for (const movie of moviesData) {
    const props = await getDataFromPage(movie.link)

    const event = props.pageProps.event

    if (!movie.id) {
      console.warn("no id for movie", movie)
      continue
    }

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

      if (!show.movieId || !show.cinemaId) {
        console.warn("no movie or cinema id for", show.id, show.linkShow)
        continue
      }

      const existingShow = await getShow(show.id)

      if (existingShow) continue

      await insertShow(show)

      debug.shows++
    }
  }

  await scrapAVPFestival()

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
