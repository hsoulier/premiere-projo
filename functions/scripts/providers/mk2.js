import { logger } from "firebase-functions"
import { parseHTML } from "linkedom"
import {
  getMovie,
  getShow,
  getCinemaBySlug,
  insertCinema,
  insertMovie,
  insertShow,
  getCurrentFestival,
} from "../db/requests.js"
import { getAllocineInfo } from "../db/allocine.js"
import { fetchUrl } from "../utils.js"

const listAVPs = [
  "avant-premieres-et-seances-exclusives",
  "avant-premieres-avec-equipe",
]

const debug = { movies: 0, shows: 0 }

const getDataFromPage = async (page) => {
  const res = await fetchUrl(page)

  const data = await res.text()

  const { document } = parseHTML(data)

  return JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
}

/**
 *
 * @param {string} urlFestival
 */
export const scrapMk2Festival = async (urlFestival) => {
  const pathname = new URL(urlFestival).pathname

  const slugFestival = pathname.split("/").at(-1)

  const page = `https://prod-paris.api.mk2.com/events/${slugFestival}?cinema-group=ile-de-france`

  try {
    const res = await fetch(page)

    if (!res.ok) {
      const data = await res.text()
      console.log("Response text:", data)
      throw new Error(`Failed to fetch festival data: ${res.statusText}`)
    }

    const data = await res.json()

    const linkedCinemas = data.linkedCinemas?.map((c) => c.id) || []

    const startFestival = new Date(data.startDate)
    const endFestival = new Date(data.endDate)
    const eventId = data.id
    const nameFestival = data.name

    const sessionsForLinkedMovies = data.sessionsByFilmAndCinema.filter(
      ({ cinema }) => linkedCinemas.includes(cinema.id)
    )

    const _screeningsByMovie = sessionsForLinkedMovies?.reduce((acc, curr) => {
      const { sessions, cinema, film } = curr || {}

      if (!sessions) return acc

      const movieId = film.id

      if (!acc.has(movieId)) {
        const director =
          film.cast?.find((c) => c.personType === "Director") || {}
        acc.set(movieId, {
          movie: {
            imdbId: "",
            id: movieId,
            title: film.title,
            synopsis: film.synopsis,
            duration: film.runTime,
            release: film.openingDate,
            slug: film.slug,
            director: director
              ? `${director.firstName} ${director.lastName}`
              : "",
            poster: film.graphicUrl,
            posterThumb: film.graphicUrl,
          },
          screenings: [],
        })
      }

      const screening = sessions
        ?.filter(
          ({ showTime, globalEventId }) =>
            new Date(showTime) > startFestival &&
            new Date(showTime) <= endFestival &&
            globalEventId === eventId
        )
        .map((screening) => ({
          lang:
            (screening.attributes.find(({ id }) => id.startsWith("VS000"))
              ?.shortName || "VO") === "VO"
              ? "vost"
              : "vf",
          showTime: screening.showTime,
          isFull: screening.isSoldOut,
          id: screening.sessionId,
          cinemaSlug: cinema.slug,
          cinemaId: cinema.id,
        }))

      acc.get(movieId).screenings.push(...screening)

      return acc
    }, new Map())

    const screeningsByMovie = Array.from(_screeningsByMovie.values())

    console.log("🔍 Found screenings for movies:", screeningsByMovie.length)

    if (!screeningsByMovie || !screeningsByMovie.length) return

    for (const { movie, screenings } of screeningsByMovie || [{}]) {
      if (!movie || !screenings?.length) {
        logger.warn("Missing data for movie or shows", movie, screenings)
        continue
      }

      const m = await getAllocineInfo({
        release: movie.release,
        title: movie.title,
        directors: [movie.director],
      })

      // ? If allocine data is empty -> use mk2 data
      if (!m?.id) {
        m.id = parseInt(movie.id.slice(2))
        m.imdbId = ""
        m.title = movie.title
        m.synopsis = movie.synopsis
        m.duration = movie.duration
        m.release = new Date(movie.release)
        m.director = movie.director
        m.poster = movie.poster
        m.posterThumb = movie.posterThumb
      }

      const existingMovie = await getMovie(m.id)

      if (!existingMovie) {
        await insertMovie(m)

        debug.movies++
      }

      for (const show of screenings) {
        const { id: cinemaId } = await getCinemaBySlug(show.cinemaSlug)

        if (!cinemaId)
          throw new Error(`Cinema not found for slug: ${show.cinemaSlug}`)

        const dateWithTimezone = new Date(show.showTime)

        dateWithTimezone.setHours(dateWithTimezone.getHours() + 1)

        const showData = {
          id: show.id,
          cinemaId,
          language: show.lang,
          date: dateWithTimezone,
          avpType: "AVP",
          movieId: m.id,
          linkShow: `https://www.mk2.com/panier/seance/tickets?cinemaId=${show.cinemaId}&sessionId=${show.id}`,
          linkMovie: `https://www.mk2.com/ile-de-france/evenement/${movie.slug}`,
          festival: nameFestival,
          isFull: show.isFull,
        }

        // TODO: Check of the data has changed to full and update field (between the api data and the existing show)
        const existingShow = await getShow(showData.id)

        if (existingShow) {
          continue

          // ? To force update if needed
          // await updateShow(showData.id, showData)
        } else {
          await insertShow(showData)
        }
        debug.shows++
      }
    }

    console.log("✅ Mk2 Festival scrapping done", debug)

    return debug
  } catch (error) {
    console.error(error)
  }
}

export const scrapMk2 = async () => {
  try {
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
        props.pageProps.event?.sessionsByFilmAndCinema || []

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

      !Object.keys(sessionsByFilmAndCinema?.[0]?.film || {}).length === 0 &&
        logger.warn("no film object, fallback used for", event.slug, link)

      const movie = {
        ...m,
        synopsis: synopsis || fallback.description,
        duration: runTime || 0,
        link,
        director: m?.director || directors,
      }

      moviesData.push(movie)

      if (!movie.id) {
        logger.warn("no id for", movie.title, link)
        continue
      }

      const existingMovie = await getMovie(movie.id)

      if (existingMovie) continue

      if (movie.release) {
        const temp = new Date(movie.release)
        temp.setDate(temp.getDate() + 1)
        movie.release = temp
      }

      await insertMovie(movie)

      debug.movies++
    }

    for (const movie of moviesData) {
      const props = await getDataFromPage(movie.link)

      const event = props.pageProps.event

      if (!movie.id) {
        logger.warn("no id for movie", movie)
        continue
      }

      if (!event.sessionsByFilmAndCinema?.length) {
        logger.warn("⚠️ no sessions for event", event.slug, movie.link)
        continue
      }

      for (const session of event.sessionsByFilmAndCinema?.[0]?.sessions) {
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
          logger.warn("no movie or cinema id for", show.id, show.linkShow)
          continue
        }

        const existingShow = await getShow(show.id)

        if (existingShow) continue

        await insertShow(show)

        debug.shows++
      }
    }

    const festivals = getCurrentFestival(new Date(), "mk2")

    console.log("🔍 Found festivals to scrape:", festivals.length)

    for (const festival of festivals) {
      await scrapMk2Festival(festival.festival_url)
    }

    logger.log("✅ Mk2 scrapping done", debug)
  } catch (error) {
    logger.error("❌ Error while scrapping Mk2:")
    logger.error(error)
  }
}

export const getMk2Theaters = async () => {
  const res = await fetchUrl("https://www.mk2.com/salles")

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
