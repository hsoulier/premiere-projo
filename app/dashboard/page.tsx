"use client"

import { DataTableMovies } from "@/components/table-movies"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    queryFn: async () => await getShowsAggregated(supabase, {}, true),
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
    <Tabs defaultValue="movies" className="container mx-auto p-4">
      <TabsList>
        <TabsTrigger value="movies">Films</TabsTrigger>
        <TabsTrigger value="shows">Séances</TabsTrigger>
      </TabsList>
      <TabsContent value="movies">
        <DataTableMovies data={movies} />
      </TabsContent>
      <TabsContent value="shows">
        <div className="container mx-auto p-4">
          <p className="text-gray-500">
            Shows data table will be implemented soon.
          </p>
          {/* <DataTableMovies data={movies} /> */}
        </div>
      </TabsContent>
    </Tabs>
  )
}

export default DashboardPage
