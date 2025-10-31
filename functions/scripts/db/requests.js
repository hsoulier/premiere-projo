import { logger } from "firebase-functions"
import { sql } from "../utils.js"

export const getCinemaByName = async (name) => {
  const data = await sql`select * from cinemas where name = ${name}`

  return data[0]
}

export const getCinemaBySlug = async (slug) => {
  try {
    const data = await sql`select * from cinemas where slug = ${slug}`

    return data?.[0]
  } catch (error) {
    console.error(`select * from cinemas where slug = ${slug}`)
    logger.error(error.message)
  }
}

export const getShow = async (id) => {
  const data = await sql`select * from shows where id = ${id}`

  return data?.[0]
}

export const getMovie = async (id) => {
  const data = await sql`select * from movies where id = ${id}`

  return data?.[0]
}

export const getMovieByTitle = async (title) => {
  const data =
    await sql`select * from movies where unaccent(LOWER(title)) ILIKE unaccent(LOWER(${title})) `

  return data?.[0]
}

export const listShows = async () => {
  const data = await sql`select * from shows`

  return data
}

export const listMovies = async () => {
  const data = await sql`select * from movies`

  return data
}

export const insertMovie = async (movie) => {
  try {
    const data = await sql`
    insert into movies ${sql(
      movie,
      "id",
      "title",
      "duration",
      "synopsis",
      "director",
      "release",
      "imdbId",
      "poster"
    )}
    returning *`

    return data[0]
  } catch (error) {
    logger.error(movie, error)

    throw error
  }
}

export const updateMovie = async (id, movie) => {
  try {
    const data = await sql`
    update movies set ${sql(
      { scrapedAt: new Date(), ...movie },
      "director",
      "poster",
      "scrapedAt"
    )}
    where id = ${id}`

    return data[0]
  } catch (error) {
    logger.error(movie, error)

    throw error
  }
}

export const insertShow = async (show) => {
  try {
    const data = await sql`
    insert into shows ${sql(
      { festival: null, isFull: false, scrapedAt: new Date(), ...show },
      "id",
      "language",
      "date",
      "avpType",
      "cinemaId",
      "movieId",
      "linkShow",
      "linkMovie",
      "festival",
      "scrapedAt",
      "isFull"
    )}
    returning *
  `
    return data[0]
  } catch (error) {
    logger.error(show, error)

    throw error
  }
}

export const insertCinema = async (cinema) => {
  try {
    const data = await sql`
    insert into cinemas ${sql(
      cinema,
      "id",
      "name",
      "slug",
      "arrondissement",
      "address",
      "link",
      "source"
    )}
    returning *
  `
    return data[0]
  } catch (error) {
    logger.error(cinema, error)

    throw error
  }
}

export const deleteShow = async (id) => {
  try {
    const data = await sql`delete from shows where id = ${id} returning *`

    return data[0]
  } catch (error) {
    logger.error(`Error deleting show with id ${id}:`, error)

    throw error
  }
}

export const updateShow = async (id, show) => {
  try {
    const data = await sql`
    update shows set ${sql(
      { ...show },
      "language",
      "date",
      "avpType",
      "cinemaId",
      "movieId",
      "linkShow",
      "linkMovie",
      "festival",
      "isFull"
    )}
    where id = ${id}
    returning *
  `
    return data[0]
  } catch (error) {
    logger.error(show, error)

    throw error
  }
}

export const updateAvailabilityShow = async (id, show) => {
  try {
    const data = await sql`
    update shows set ${sql(show, "isFull")}
    where id = ${id}
    returning *
  `

    return data[0]
  } catch (error) {
    logger.error(show, error)

    throw error
  }
}
