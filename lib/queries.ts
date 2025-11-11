import { LIST_MULTIPLEX, SOURCE_PROVIDER } from "@/constants/mapping"
import type { TypedSupabaseClient } from "@/types/supabase"
import { parse } from "date-fns"

const getBaseQuery = (client: TypedSupabaseClient, isDashboard = false) => {
  const query = client
    .from("movies")
    .select(
      `movie_id:id,title,poster,posterThumb,release,director,synopsis,duration,hide,shows(*)`
    )

  if (isDashboard) {
    return query
  }

  return query.not("hide", "is", true)
}

export const getMoviesAggregated = async (
  client: TypedSupabaseClient,
  searchParams: { [key: string]: string | string[] | undefined },
  isDashboard = false
) => {
  const { c, avpType, lang, q } = searchParams
  const now = new Date().toISOString()

  let query = getBaseQuery(client, isDashboard)

  if ("avpType" in searchParams && avpType) {
    query = query.eq("shows.avpType", avpType.toString())
  }

  if ("lang" in searchParams && lang) {
    query = query.eq("shows.language", lang.toString())
  }

  if ("q" in searchParams && q) {
    query = query.ilike("title", `%${q}%`)
  }

  if ("date" in searchParams && searchParams.date) {
    const dateParam = searchParams.date.toString()

    const parsed = parse(dateParam, "dd MM uuuu", new Date())

    const start = new Date(parsed)
    start.setHours(0, 0, 0, 0)

    const end = new Date(parsed)
    end.setDate(end.getDate() + 1)

    query = query
      .gte("shows.date", start.toISOString())
      .lt("shows.date", end.toISOString())
  } else {
    // By default, only show upcoming shows
    query = query.gte("shows.date", now)
  }

  const finalQuery = isDashboard
    ? query.order("release")
    : query.order("release").not("shows", "is", null)

  const response = await finalQuery

  const cinemasRaw = c?.toString().split(",") || []

  const cinemas = cinemasRaw.filter((cinema) => {
    return !LIST_MULTIPLEX.includes(cinema as (typeof LIST_MULTIPLEX)[number])
  })

  const multiplexSelected = cinemasRaw.filter((c) =>
    LIST_MULTIPLEX.includes(c as (typeof LIST_MULTIPLEX)[number])
  )

  const data = response.data
    ?.map((movie) => {
      const shows = movie.shows.filter((show) => {
        // ? Remove experimental other cinemas
        if (
          !show.cinemaId.startsWith("mk2-") &&
          !show.cinemaId.startsWith("ugc-") &&
          !show.cinemaId.startsWith("pathe-") &&
          !show.cinemaId.startsWith("grand-") &&
          !show.cinemaId.startsWith("louxor")
          // !show.cinemaId.startsWith("majestic-passy") &&
          // !show.cinemaId.startsWith("majestic-bastille") &&
          // !show.cinemaId.startsWith("arlequin") &&
          // !show.cinemaId.startsWith("escurial") &&
          // !show.cinemaId.startsWith("reflet-medicis")
        )
          return false

        if (cinemasRaw.length === 0) return true

        const cinema = show.cinemaId

        const isInCinema =
          cinemas.includes(cinema) ||
          multiplexSelected.some((c) => cinema.startsWith(c))

        return isInCinema
      })

      return { ...movie, shows }
    })
    .filter((movie) => (isDashboard ? true : movie.shows.length > 0))

  return data
}

export const getMovieAggregated = async (
  client: TypedSupabaseClient,
  id: string
) => {
  const now = new Date().toISOString()

  const [movie, showsOriginal] = await Promise.all([
    client.from("movies").select("*").eq("id", parseInt(id)).single(),
    client
      .from("shows")
      .select("*,cinemas(*)")
      .gte("date", now)
      .eq("movieId", parseInt(id)),
  ])

  const shows = (showsOriginal?.data || []).reduce((acc, show) => {
    const cinema = show.cinemas
    const source = cinema?.source

    if (!cinema || !source) return acc

    const s = source as keyof typeof SOURCE_PROVIDER

    if (acc[s]) {
      acc[s].push(show)
      acc[s].sort((a, b) => {
        const aTime = new Date(a.date || "").getTime()
        const bTime = new Date(b.date || "").getTime()

        return aTime - bTime
      })
    } else {
      acc[s] = [show]
    }

    return acc
  }, {} as Record<keyof typeof SOURCE_PROVIDER, (typeof showsOriginal)["data"]>)

  return { movie: movie.data, shows }
}

export const getShow = async (client: TypedSupabaseClient, id: string) => {
  const show = await client.from("shows").select("*").eq("id", id).single()

  return show.data
}

export const getCinemas = async (client: TypedSupabaseClient) => {
  const res = await client.from("cinemas").select("*")

  return res.data
}

export const getMovieBase = async (client: TypedSupabaseClient, id: string) => {
  const movie = await client
    .from("movies")
    .select("*")
    .eq("id", parseInt(id))
    .single()

  return movie.data
}

export const getDatesOfShows = async (client: TypedSupabaseClient) => {
  const { data } = await client
    .from("shows")
    .select("date, movieId!inner(hide)")
    .gte("date", new Date().toISOString())
    .not("movieId.hide", "is", true)
    .order("date", { ascending: true })

  return data
}

export type ShowAggregated = NonNullable<
  Awaited<ReturnType<typeof getMoviesAggregated>>
>[number]
