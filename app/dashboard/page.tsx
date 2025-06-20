"use client"

import { DataTableDemo } from "@/components/table-movies"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { auth } from "@/lib/firebase"
import { getShowsAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { onAuthStateChanged } from "firebase/auth"
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If the user is not authenticated, redirect to the login page
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [])

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!data || data.length === 0) {
    return <div className="container mx-auto p-4">No data available</div>
  }

  return (
    <div className="container mx-auto p-4">
      <DataTableDemo data={data} />
    </div>
  )
}

export default DashboardPage
