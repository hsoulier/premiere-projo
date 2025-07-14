"use client"

import { EmptyResponse } from "@/components/empty-response"
import { MovieCard } from "@/components/movie-card"
import { Footer } from "@/components/navigation"
import { defaultValueOrder, keyOrder } from "@/components/sorts.order"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { useLocalStorage } from "react-use"

export const Content = () => {
  const searchParams = useSearchParams()

  const [orderFromLs] = useLocalStorage<string>(keyOrder)
  const orderFromUrl = searchParams.get("order")

  const order = orderFromUrl || orderFromLs || defaultValueOrder

  const supabase = useSupabaseBrowser()

  const options = Object.fromEntries(searchParams)

  const { data, isLoading } = useQuery({
    queryKey: [
      "shows",
      `cinemaId-${searchParams.get("c") || ""}`,
      `source-${searchParams.get("source") || ""}`,
      `avpType-${searchParams.get("avpType") || ""}`,
      `lang-${searchParams.get("lang") || ""}`,
      `q-${searchParams.get("q") || ""}`,
    ],
    queryFn: async () => await getShowsAggregated(supabase, options),
  })

  if (!isLoading && data?.length === 0) {
    return (
      <>
        <main className="mx-auto grow w-full px-4 lg:px-5 max-w-screen-2xl grid place-items-center">
          <EmptyResponse />
        </main>
        <Footer />
      </>
    )
  }

  const movies = data?.sort((a, b) => {
    if (order === "az") {
      return a.title?.localeCompare(b.title || "", "fr") || 0
    }

    if (order === "release") {
      const releaseA = new Date(a.release || "").getTime()
      const releaseB = new Date(b.release || "").getTime()
      return releaseA - releaseB
    }

    const earlierShowA = a.shows.sort(
      (x, y) =>
        new Date(x.date || "").getTime() - new Date(y.date || "").getTime()
    )?.[0]
    const earlierShowB = b.shows.sort(
      (x, y) =>
        new Date(x.date || "").getTime() - new Date(y.date || "").getTime()
    )?.[0]

    return earlierShowA?.date && earlierShowB?.date
      ? new Date(earlierShowA.date).getTime() -
          new Date(earlierShowB.date).getTime()
      : 0
  })

  return (
    <>
      <main className="mx-auto w-auto px-4 lg:px-5 2xl:max-w-screen-2xl gap-x-4 gap-y-6 grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] grow">
        {movies?.map((movie) => (
          <MovieCard key={movie.movie_id} movie={movie} />
        ))}
      </main>
      {!isLoading && <Footer />}
    </>
  )
}
