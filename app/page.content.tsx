"use client"

import { EmptyResponse } from "@/components/empty-response"
import { MovieCard } from "@/components/movie-card"
import { Footer } from "@/components/navigation"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export const Content = () => {
  const searchParams = useSearchParams()

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
    queryFn: async () => {
      const response = await getShowsAggregated(supabase, options)

      return response.data
    },
  })

  if (!isLoading && data?.length === 0) {
    return (
      <>
        <main className="grow w-full px-4 lg:px-5 max-w-screen-2xl grid place-items-center">
          <EmptyResponse />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="mx-auto px-4 lg:px-5 max-w-screen-2xl gap-x-4 gap-y-6 grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] grow">
        {data?.map((movie) => (
          <MovieCard key={movie.movie_id} movie={movie} />
        ))}
        {/* <MoviePopup /> */}
      </main>
      {!isLoading && <Footer />}
    </>
  )
}
