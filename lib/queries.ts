import { values } from "@/components/filters.cinema"
import type { SOURCE_PROVIDER } from "@/constants/mapping"
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
    .select(`movie_id:id,title, poster,release,shows(*)`)

  console.log("searchParams", c)
  const cinemasRaw = c?.toString().split(",") || []
  const multiplexSource = values.map(({ value }) => value)

  const cinemas = cinemasRaw.filter((cinema) => {
    return !multiplexSource.includes(cinema as (typeof multiplexSource)[number])
  })

  const multiplexIndex = cinemasRaw.findIndex((cinema) => {
    return multiplexSource.includes(cinema as (typeof multiplexSource)[number])
  })

  if (multiplexIndex !== -1) {
    query = query.ilike("shows.cinemaId", `%${cinemasRaw[multiplexIndex]}%`)
  }

  if (cinemas.length > 0) {
    query = query.in("shows.cinemaId", cinemas)
  }

  if ("avpType" in searchParams && avpType) {
    query = query.eq("shows.avpType", avpType.toString())
  }
  if ("lang" in searchParams && lang) {
    query = query.eq("shows.language", lang.toString())
  }

  if ("q" in searchParams && q) {
    query = query.ilike("title", `%${q}%`)
  }

  return query.gte("shows.date", now).order("release").not("shows", "is", null)
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
  Awaited<ReturnType<typeof getShowsAggregated>>["data"]
>[number]
