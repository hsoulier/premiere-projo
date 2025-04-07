"use client"
import { FilterCinema } from "@/components/filters.cinema"
import { FilterLanguage } from "@/components/filters.language"
import { FilterShows } from "@/components/filters.shows"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const Filters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isHomePage = usePathname() === "/"

  const hasFilters = searchParams.size > 0 && !searchParams.has("q")

  if (!isHomePage) return null

  return (
    <header className="flex gap-2 pb-4 lg:pb-6 relative z-30 flex-wrap mx-5">
      <FilterCinema />
      <FilterShows />
      {/* <FilterLanguage /> */}
      {hasFilters && (
        <button className="px-3" onClick={() => router.push("/")}>
          Tout effacer
        </button>
      )}
    </header>
  )
}
