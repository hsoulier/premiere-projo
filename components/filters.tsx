"use client"
import { FilterCinema } from "@/components/filters.cinema"
import { FilterLanguage } from "@/components/filters.language"
import { FilterOrder } from "@/components/filters.order"
import { FilterShows } from "@/components/filters.shows"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const keysToKeep = ["q", "order"]

export const Filters = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const isHomePage = usePathname() === "/"

  const hasFilters =
    [...searchParams.keys()].filter((key) => !keysToKeep.includes(key)).length >
    0

  const removeFilters = () => {
    const params = new URLSearchParams(searchParams)

    for (const key of params.keys()) {
      if (!keysToKeep.includes(key)) params.delete(key)
    }

    router.push(`/?${params.toString()}`)
  }

  if (!isHomePage) return null

  return (
    <header className="flex gap-2 pb-4 lg:pb-6 relative z-30 flex-wrap mx-5">
      <FilterCinema />
      <FilterShows />
      {/* <FilterLanguage /> */}
      {hasFilters && (
        <button className="px-3" onClick={removeFilters}>
          Tout effacer
        </button>
      )}

      <FilterOrder />
    </header>
  )
}
