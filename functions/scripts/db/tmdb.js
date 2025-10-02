import { getMovieByTitle } from "./requests.js"

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  },
}

const years = [
  new Date().getFullYear() + 1,
  new Date().getFullYear(),
  new Date().getFullYear() - 1,
]

const getMovieFromYears = async (title) => {
  const encodedTitle = encodeURIComponent(title)
  let movie = null

  for (const year of years) {
    const query = `query=${encodedTitle}&include_adult=true&language=fr-FR&page=1&year=${year}`
    const url = `https://api.themoviedb.org/3/search/movie?${query}`

    const res = await fetch(url, options)
    const json = await res.json()

    if (json.total_results !== 0) {
      movie = json.results[0]
      break
    }

    continue
  }

  if (!movie) console.log(`❌ [TMDB] No movie found for ${title}`)

  return movie
}

export const getTmDbInfo = async (title) => {
  try {
    const existingMovie = await getMovieByTitle(title)

    if (existingMovie) return existingMovie

    const result = await getMovieFromYears(title)

    if (!result) return null

    const id = result.id

    const info = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=imdb_id%2Cposter_path%2Crelease_date%2Ctitle%2Coverview%2Cruntime&language=fr-FR`,
      options
    ).then((res) => res.json())

    const director = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?language=fr-FR`,
      options
    )
      .then((res) => res.json())
      .then((r) => r?.crew?.find((a) => a.job === "Director").name)

    return {
      id: parseInt(id, 10),
      title: info.title,
      synopsis: info.overview,
      director,
      duration: info.runtime,
      release: info.release_date,
      imdbId: info.imdb_id,
      poster: `https://image.tmdb.org/t/p/w1280${info.poster_path}`,
    }
  } catch (error) {
    console.error("❌ [TMDB] Error", error)
    return null
  }
}
