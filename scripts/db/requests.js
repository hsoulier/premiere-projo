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
    console.log(`select * from cinemas where slug = ${slug}`)
    console.error(error.message)
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
    console.error(movie, error)

    throw error
  }
}

export const updateMovie = async (id, movie) => {
  try {
    const data = await sql`
    update movies set ${sql(movie, "director", "poster")}
    where id = ${id}`

    return data[0]
  } catch (error) {
    console.error(movie, error)

    throw error
  }
}

export const insertShow = async (show) => {
  try {
    const data = await sql`
    insert into shows ${sql(
      show,
      "id",
      "language",
      "date",
      "avpType",
      "cinemaId",
      "movieId",
      "linkShow",
      "linkMovie"
    )}
    returning *
  `
    return data[0]
  } catch (error) {
    console.error(show, error)

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
    console.error(cinema, error)

    throw error
  }
}

export const listMovies = async () => {
  const data = await sql`select * from movies`

  return data
}
