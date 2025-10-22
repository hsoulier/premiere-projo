import fetch from "node-fetch"
import { HttpsProxyAgent } from "https-proxy-agent"
import { logger } from "firebase-functions"
import "firebase-functions/logger/compat"
import {
  getCinemaBySlug,
  getMovie,
  getShow,
  insertMovie,
  insertShow,
} from "../db/requests.js"
import { getAllocineInfo } from "../db/allocine.js"
import { parseToDate } from "../utils.js"

const proxyUrl = process.env.PROXY_URL || ""
const agent = new HttpsProxyAgent(proxyUrl)

const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
  "equipe",
]

const specialTitles = [
  "séance all inclusive : ",
  "la séance live :",
  "horror cinéma club :",
  "horror cinema club -",
  "la soirée des passionnés :",
  "la séance feel good : ",
  "la séance tenante : ",
  "séance tenante : ",
  "les rendez-vous de l'animé : ",
  "les rendez-vous de l'anime : ",
  "les vendredis de l’horreur :",
  "la séance ciné-club : ",
]

const specialTitlesSlug = [
  "seance-all-inclusive-",
  "la-séance-live-",
  "horror-cinema-club-",
  "la-soiree-des-passionnes-",
  "la-soiree-feel-good-",
  "seance-tenante-",
  "les-rendez-vous-de-l-anime-",
  "les-vendredis-de-l-horreur-",
  "la-seance-cine-club",
]

const cannesFestivalTitles = ["un certain regard"]

const debug = { movies: 0, shows: 0 }

const CINEMAS = [
  "cinema-pathe-alesia",
  "cinema-gaumont-aquaboulevard",
  "cinema-les-7-batignolles",
  "cinema-pathe-beaugrenelle",
  "cinema-pathe-convention",
  "cinema-pathe-la-villette",
  "cinema-pathe-les-fauvettes",
  "cinema-pathe-montparnos",
  "cinema-pathe-opera-premier",
  "cinema-pathe-parnasse",
  "cinema-pathe-wepler",
  "cinema-pathe-palace",
  "cinema-pathe-bnp-paribas",
]

const fetchData = async (url, { fr } = { fr: true }) => {
  try {
    const res = await fetch(`${url}?${fr ? "language=fr" : ""}`, {
      agent,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-GB,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Priority: "u=1, i",
        Referer: "https://www.pathe.fr/",
        "Sec-Ch-Ua":
          '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      },
    })
    if (!res.ok) {
      logger.error(`❌ Error ${res.status} while fetching ${url}`)
      logger.error(await res.text())

      throw new Error(`Error ${res.status} while fetching ${url}`)
    }

    return await res.json()
  } catch (error) {
    logger.error(`❌ Error while fetching ${url}:`)
    logger.error(error)
    return null
  }
}

export const scrapPathe = async () => {
  try {
    const resShows = await fetchData("https://www.pathe.fr/api/shows")

    const allShows = resShows?.shows

    const movieSlugs = allShows?.map((s) => s.slug)

    for (const cinemaSlug of CINEMAS) {
      const currentCinema = await getCinemaBySlug(cinemaSlug)
      const res = await fetchData(
        `https://www.pathe.fr/api/cinema/${cinemaSlug}/shows`
      )

      const shows = Object.entries(res.shows)

      for (const [movieSlug, showData] of shows) {
        // Skip specific movies
        if (
          movieSlug === "horror-cinema-club-avant-premiere-your-monster-48429"
        )
          continue

        const movieData = allShows.find((s) => s.slug === movieSlug)

        if (!movieData) continue

        if (movieData.genres.includes("Courts-Métrages")) {
          logger.log(`🚫 Skip short movie (${movieSlug})`)
          continue
        }

        if (movieData.genres.includes("Documentaire")) {
          logger.log(`ℹ️ documentary (${movieSlug})`)
          // logger.log(`🚫 Skip docu (${movieSlug})`)
          // continue
        }

        const specificMovieIndex = specialTitlesSlug.findIndex((s) =>
          movieSlug.startsWith(s)
        )

        const hasSpecial = specificMovieIndex !== -1

        const specialSlug = hasSpecial
          ? movieSlugs.find((s) =>
              s.startsWith(
                movieSlug
                  .replace(specialTitlesSlug[specificMovieIndex], "")
                  .split("-")
                  .slice(0, -1)
                  .join("-")
              )
            )
          : ""

        const cleanMovieSlug = hasSpecial ? specialSlug || movieSlug : movieSlug

        const isSpecialTitle = specialTitles.some((s) =>
          movieData.title.trim().toLowerCase().includes(s)
        )

        const days = Object.entries(showData.days)

        const title = isSpecialTitle
          ? movieData.title.split(":").slice(1).join(":").trim()
          : movieData.title.trim()

        const hasAVP = days.some(([_, dayData]) =>
          TAGS_AVP.some((tag) => dayData.tags?.includes(tag))
        )

        if (!hasAVP) continue

        const movie = await getAllocineInfo({
          title,
          release: movieData.releaseAt?.[0],
          directors: Array.isArray(movieData.directors)
            ? movieData.directors
            : [movieData?.directors || ""],
        })

        const movieToInsert = { ...movie }

        if (!movie || !movie.id) {
          const {
            title,
            synopsis,
            directors,
            duration,
            releaseAt,
            posterPath,
          } = movieData

          movieToInsert.id = movieSlug.split("-").at(-1)
          movieToInsert.title = title
          movieToInsert.synopsis = synopsis?.replaceAll("<br/>", "\n") || ""
          movieToInsert.director = directors || ""
          movieToInsert.duration = duration || 0
          movieToInsert.release = releaseAt?.[0]
          movieToInsert.imdbId = ""
          movieToInsert.poster = posterPath?.lg || ""
        }

        movieToInsert.release = movie?.release || movieData.releaseAt?.[0]
        movieToInsert.synopsis = movieData?.synopsis || ""
        movieToInsert.duration = movieData.duration
        movieToInsert.poster = movie?.poster || movieData.posterPath?.lg || ""

        if (!movieToInsert || !movieToInsert.id) {
          logger.log(`🚫 Skip movie (${movieSlug})`)
          continue
        }

        const existingMovie = await getMovie(movieToInsert.id)

        if (!existingMovie) {
          await insertMovie(movieToInsert)
          debug.movies++
        }

        for (const [day, dayData] of days) {
          const hasAVP = TAGS_AVP.some((tag) => dayData.tags?.includes(tag))

          if (!hasAVP) continue

          const hasBeenReleased =
            movieData.releaseAt?.[0] && movieData.releaseAt?.[0] < day

          if (hasBeenReleased) continue

          const res = await fetchData(
            `https://www.pathe.fr/api/show/${cleanMovieSlug}/showtimes/${cinemaSlug}/${day}`
          )

          for (const show of res) {
            const showToInsert = {
              id: show.refCmd.split("/").at(-2),
              cinemaId: currentCinema?.id,
              language: show.version === "vf" ? "vf" : "vost",
              date: parseToDate(show.time),
              avpType:
                show.tags.includes("avp-equipe") || show.tags.includes("equipe")
                  ? "AVPE"
                  : "AVP",
              movieId: movie.id,
              linkShow: show.refCmd,
              linkMovie: `https://www.pathe.fr/films/${movieSlug}`,
              festival: cannesFestivalTitles.some((a) =>
                a.startsWith(
                  show?.specialShowtimeDetails?.titleScreening.toLowerCase()
                )
              )
                ? "Festival de Cannes"
                : null,
            }

            if (!showToInsert.movieId) {
              logger.log(
                `🚫 Skip show without movie ID (${movieSlug})`,
                showToInsert
              )
              continue
            }

            const existingShow = await getShow(showToInsert.id)

            if (existingShow) continue

            await insertShow(showToInsert)
            debug.shows++
          }
        }
      }
    }

    logger.log(debug, { depth: null })
    logger.log("✅ Pathe scrapping done", debug)
  } catch (error) {
    logger.error("❌ Error while scrapping Pathé:")
    logger.error(error)
  }
}
