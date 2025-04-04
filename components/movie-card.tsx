"use client"

import { useRouter } from "next/navigation"
import { providers, type Provider } from "@/components/movie-popup.show"
import type { ShowAggregated } from "@/lib/queries"
import type { CSSProperties } from "react"
import Link from "next/link"

export const MovieCard = ({ movie }: { movie: ShowAggregated }) => {
  const router = useRouter()

  const cover = movie.poster || ""
  const id = movie.movie_id

  const mProviders = [
    ...new Set(movie?.shows.map((show) => show?.cinemaId.split("-")[0])),
  ]

  const hasMultipleShows = movie.shows.length > 1

  return (
    <Link
      id={`title-${id}`}
      style={{ "--img": cover } as CSSProperties}
      className="group relative after:z-10 after:inset-0 rounded-xl w-full aspect-[27/40] cursor-pointer block"
      href={`/shows/${id}`}
    >
      <div className="size-full bg-center bg-cover rounded-[inherit] overflow-hidden">
        <img
          src={cover || undefined}
          alt="Movie cover"
          className="object-cover size-full group-hover:scale-110 transition-transform duration-200 ease-out"
        />
      </div>
      <div className="thumb rounded-b-xl inset-x-0 h-2/5 bottom-0 bg-cover absolute backdrop-blur-sm" />
      <div className="rounded-b-xl bg-gradient-to-b h-2/5 w-full absolute bottom-0 inset-x-0 from-transparent via-40% via-black/70 to-black" />
      <div
        className="opacity-0 group-hover:opacity-20 bg-no-repeat bg-center bg-cover blur-xl absolute saturate-100 -inset-0 -z-10 transition-opacity duration-150 ease-out"
        style={{ backgroundImage: `url(${cover})` }}
      />

      <div className="flex absolute inset-x-4 top-4 items-stretch justify-end gap-2">
        {mProviders.map((provider, index) => (
          <div
            key={index}
            className="size-8 text-gray-white inline-grid min-w-0 place-content-center rounded-lg bg-[#0B0C0E]/50 backdrop-blur-sm"
          >
            {providers[provider as Provider]}
          </div>
        ))}
      </div>

      <header className="absolute bottom-4 inset-x-4 space-y-1 z-20 text-[#F9FAFA]">
        <h3 className="text-lg font-semibold leading-[1.2]">{movie.title}</h3>
        <p className="text-sm font-light flex justify-between">
          {movie.shows.length} séance{hasMultipleShows && "s"}
        </p>
      </header>
    </Link>
  )
}
