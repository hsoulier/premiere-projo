"use client"

import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getMoviesAggregated } from "@/lib/queries"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"

export const Test = () => {
  const searchParams = useSearchParams()
  const supabase = useSupabaseBrowser()

  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ["shows"],
      queryFn: async () => {
        const response = await getMoviesAggregated(
          supabase,
          Object.fromEntries(searchParams)
        )

        return response.data
      },
    })
  )

  return (
    <div>
      {data?.map((show) => (
        <div key={show.id}>{show.movies.title}</div>
      ))}
    </div>
  )
}
