import {
  getCinemaBySlug,
  getMovie,
  getShow,
  insertMovie,
  insertShow,
} from "../db/requests.js"
import { getAllocineInfo } from "../db/allocine.js"

const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
]

const specialTitles = [
  "séance all inclusive : ",
  "la séance live :",
  "horror cinéma club :",
]

const previewsList = new Map()
const moviesUnique = new Set()

const debug = {
  movies: 0,
  shows: 0,
}

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
]

const fetchData = async (url, { fr } = { fr: true }) => {
  const res = await fetch(`${url}?${fr ? "language=fr" : ""}`)
  return await res.json()
}

const getCinemaShows2 = async (cinema) => {
  const dataCinema = await fetchData(
    `https://www.pathe.fr/api/cinema/${cinema}/shows`
  )

  const $movies = Object.entries(dataCinema.shows).reduce((acc, [slug, v]) => {
    if (!v.isEarlyAVP) return acc
    return [...acc, { ...v, slug }]
  }, [])

  $movies.map((m) => {
    const days = Object.values(m.days)

    if (days.filter((d) => d.tags.some((i) => TAGS_AVP.includes(i)))) {
      previewsList.set(m.slug, { ...m, cinema })
      moviesUnique.add(m.slug)
    }
  })
}

const getTitle = async (slug) => {
  const data = await fetchData(`https://www.pathe.fr/api/show/${slug}`)

  if (data.genres.includes("Courts-Métrages")) {
    console.log(`🚫 Skip short movie (${slug})`)
    return null
  }

  if (data.genres.includes("Documentaire")) {
    console.log(`🚫 Skip docu (${slug})`)
    return null
  }

  const isSpecialTitle = specialTitles.some((s) =>
    data.title.trim().toLowerCase().includes(s)
  )

  data.title = isSpecialTitle
    ? data.title.split(":").slice(1).join(":").trim()
    : data.title.trim()

  const movie = await getAllocineInfo({
    title: data.title,
    release: data.releaseAt.FR_FR,
    directors: data.directors,
  })

  if (!movie) {
    const { title, synopsis, directors, duration, releaseAt, posterPath } = data

    return {
      id: slug.split("-").at(-1),
      title,
      synopsis: synopsis?.replaceAll("<br/>", "\n") || "",
      director: directors || "",
      duration,
      release: releaseAt.FR_FR,
      imdbId: "",
      poster: posterPath?.lg || "",
    }
  }

  return {
    ...movie,
    release: movie?.release || data.releaseAt.FR_FR,
    synopsis: data.synopsis,
    duration: data.duration,
    poster: movie?.poster || data.posterPath?.lg || "",
  }
}

export const scrapPathe = async () => {
  for (const cinema of CINEMAS) {
    await getCinemaShows2(cinema)
  }

  for (const slug of [...moviesUnique].filter(Boolean)) {
    const movie = await getTitle(slug)

    if (!movie) continue

    const existingMovie = await getMovie(movie.id)

    if (!existingMovie) {
      await insertMovie(movie)

      debug.movies++
    }

    if (!previewsList.has(slug)) continue

    const showsEl = previewsList.get(slug)

    for (const day in showsEl.days) {
      const data = await fetchData(
        `https://www.pathe.fr/api/show/${slug}/showtimes/${showsEl.cinema}/${day}`,
        { fr: false }
      )

      for (const date of data) {
        const currentCinema = await getCinemaBySlug(showsEl.cinema)

        if (!currentCinema) continue

        const show = {
          id: date.refCmd.split("/").at(-2),
          cinemaId: currentCinema?.id,
          language: date.version === "vf" ? "vf" : "vost",
          date: new Date(date.time),
          avpType: showsEl.days[day].tags.includes("avp-equipe")
            ? "AVPE"
            : "AVP",
          movieId: movie.id,
          linkShow: date.refCmd,
          linkMovie: `https://www.pathe.fr/films/${slug}`,
        }

        const existingShow = await getShow(show.id)

        if (existingShow) continue

        await insertShow(show)

        debug.shows++
      }
    }
  }

  console.log("✅ Pathe scrapping done", debug)
}

export const getPatheTheaters = async () => {
  const data = await fetchData("https://www.pathe.fr/api/cinemas")

  const newCinemas = data.reduce((acc, cinema, index) => {
    const isInParis = cinema.citySlug === "paris"
    if (!isInParis) return acc

    const details = cinema.theaters[0]

    acc.push({
      id: `pathe-${index + 1}`,
      slug: cinema.slug,
      name: cinema.name,
      arrondissement: parseInt(details.addressZip.replace("750", "")),
      address: `${details.addressLine1}, ${details.addressZip} ${details.addressCity}`,
      link: `https://www.pathe.fr/cinema/${cinema.slug}`,
      source: "pathe",
    })

    return acc
  }, [])

  for (const cinema of newCinemas) {
    const existingCinema = await getCinemaBySlug(cinema.slug)

    if (existingCinema) continue

    await insertCinema(cinema)
  }
}
