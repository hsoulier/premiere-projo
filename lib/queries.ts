import { LIST_MULTIPLEX, multiplex, SOURCE_PROVIDER } from "@/constants/mapping"
import type { TypedSupabaseClient } from "@/types/supabase"

export const getShowsAggregated = async (
  client: TypedSupabaseClient,
  searchParams: {
    [key: string]: string | string[] | undefined
  }
) => {
  const { c, avpType, lang, q } = searchParams
  const now = new Date().toISOString()

  let query = client
    .from("movies")
    .select(
      `movie_id:id,title,poster,release,director,synopsis,duration,hide,shows(*)`
    )
    .not("hide", "is", true)

  if ("avpType" in searchParams && avpType) {
    query = query.eq("shows.avpType", avpType.toString())
  }
  if ("lang" in searchParams && lang) {
    query = query.eq("shows.language", lang.toString())
  }

  if ("q" in searchParams && q) {
    query = query.ilike("title", `%${q}%`)
  }

  const response = await query
    .gte("shows.date", now)
    .order("release")
    .not("shows", "is", null)

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
    .filter((movie) => movie.shows.length > 0)

  return data
}

export const getShowAggregated = async (
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

export type ShowAggregated = NonNullable<
  Awaited<ReturnType<typeof getShowsAggregated>>
>[number]
