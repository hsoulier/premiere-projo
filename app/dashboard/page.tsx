"use client"

import { DataTableMovies } from "@/components/table-movies"
import { useAuth } from "@/hooks/use-auth"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const DashboardPage = () => {
  const router = useRouter()

  const supabase = useSupabaseBrowser()

  const { data, isLoading } = useQuery({
    queryKey: [],
    queryFn: async () => await getShowsAggregated(supabase, {}),
  })

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user

      if (!user?.email) {
        // If the user is not authenticated, redirect to the login page
        router.push("/login")
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!data || data.length === 0) {
    return <div className="container mx-auto p-4">No data available</div>
  }

  const movies = data.map((item) => {
    const noDirector = !Boolean(item?.director ?? "")
    const noDuration = !Boolean(item?.duration ?? "")
    const noSynopsis = !Boolean(item?.synopsis ?? "")
    const noPoster = !Boolean(item?.poster ?? "")

    const errors = [noDirector, noDuration, noSynopsis, noPoster].filter(
      Boolean
    ).length

    return { ...item, errors }
  })

  return (
    <div className="container mx-auto p-4">
      <DataTableMovies data={movies} />
    </div>
  )
}

export default DashboardPage
