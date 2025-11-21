import "dotenv/config"
import { sql } from "./utils.js"
import { scrapMk2Festival } from "./providers/mk2.js"
import { getCurrentFestival } from "./db/requests.js"
import { writeFile, writeFileSync } from "node:fs"
import { array } from "zod"

// const init = async () => {
//   try {
//     const movies = await listMovies()

//     const baseUrl = "https://fr.web.img6.acsta.net"
//     // const baseUrl = "https://fr.web.img5.acsta.net"
//     const newBaseUrl = "https://fr.web.img6.acsta.net/c_450_600"

//     for (const movie of movies) {
//       const poster = movie.poster

//       if (!poster || !poster.startsWith(baseUrl)) {
//         logger.log(`⏭️ movie ${movie.id} with poster: ${poster}`)
//         continue
//       }

//       const posterThumb = movie.poster.replace(baseUrl, newBaseUrl)

//       await sql`
//       update movies set ${sql({ posterThumb }, "posterThumb")}
//       where id = ${movie.id}`
//     }

//     sql.end()
//   } catch (error) {
//     logger.error(error)
//     sql.end()
//   }
// }

const CINEMAS = [
  // "cinema-pathe-alesia",
  // "cinema-gaumont-aquaboulevard",
  // "cinema-les-7-batignolles",
  // "cinema-pathe-beaugrenelle",
  "cinema-pathe-convention",
  "cinema-pathe-la-villette",
  // "cinema-pathe-les-fauvettes",
  // "cinema-pathe-montparnos",
  // "cinema-pathe-opera-premier",
  // "cinema-pathe-parnasse",
  // "cinema-pathe-wepler",
  // "cinema-pathe-palace",
  // "cinema-pathe-bnp-paribas",
]

const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
  "equipe",
]

const init = async () => {
  const resShows = await fetch("https://www.pathe.fr/api/shows")

  const allShows = (await resShows.json())?.shows ?? []

  // const movieSlugs = allShows?.map((s) => s.slug)

  const availableMovies = new Map()

  for (const cinemaSlug of CINEMAS) {
    console.log(`Fetching shows for cinema: ${cinemaSlug}`)

    const res = await fetch(
      `https://www.pathe.fr/api/cinema/${cinemaSlug}/shows`
    )

    const data = await res.json()

    const shows = data.shows

    const arrayedShows = Object.entries(shows).map(([slug, info]) => ({
      slug,
      cinemaSlug,
      ...info,
    }))

    const screeningAVP = arrayedShows.filter((s) => {
      const days = Object.entries(s.days)

      return days.some(([_, dayData]) =>
        TAGS_AVP.some((tag) => dayData.tags?.includes(tag))
      )
    })

    const movieData = allShows.filter((s) => {
      const isInThisCinema = arrayedShows.some(({ slug }) => s.slug === slug)

      if (!isInThisCinema) return false

      const isShortMovie = s.genres.includes("Courts-Métrages")
      const isDocumentary = s.genres.includes("Documentaire")

      if (isShortMovie || isDocumentary) {
        console.log(
          `⏭️ Skipping ${s.title} (${s.slug}) - short movie or documentary`
        )
        return false
      }

      return true
    })

    const movieDataAVPOnly = allShows.filter((s) => {
      const isInThisCinema = screeningAVP.some(({ slug }) => s.slug === slug)

      if (!isInThisCinema) return false

      const isShortMovie = s.genres.includes("Courts-Métrages")
      const isDocumentary = s.genres.includes("Documentaire")

      if (isShortMovie || isDocumentary) {
        console.log(
          `⏭️ Skipping ${s.title} (${s.slug}) - short movie or documentary`
        )
        return false
      }

      return true
    })

    for (const movie of movieData) {
      if (!availableMovies.has(movie.slug)) {
        availableMovies.set(movie.slug, [])
      }
      const cinemas = availableMovies.get(movie.slug)

      availableMovies.set(movie.slug, [...cinemas, cinemaSlug])
    }

    console.log(
      `Found ${arrayedShows.length} OR ${movieDataAVPOnly.length} on ${movieData.length} movies`
    )
  }

  // console.dir(availableMovies, { depth: null })
  console.log(`Found ${availableMovies.size}`)

  // const moviesToKeep = Object.entries(shows).filter(([slug, info]) => {})

  // writeFileSync("./pathe-shows-convention.json", JSON.stringify(data, null, 2))

  // const shows = Object.entries(res.shows)
  // await scrapMk2Festival(
  //   "https://www.mk2.com/ile-de-france/evenement/festival-cheries-cheris-2025"
  // )

  // await sql.end()
}
init()
