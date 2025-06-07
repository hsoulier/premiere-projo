"use client"

import { iconProviders, type Provider } from "@/components/movie-popup.show"
import type { ShowAggregated } from "@/lib/queries"
import type { CSSProperties, ReactElement } from "react"
import Link from "next/link"
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline"
import { UsersRound } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SOURCE_PROVIDER } from "@/constants/mapping"

export const MovieCard = ({ movie }: { movie: ShowAggregated }) => {
  const cover = movie.poster || ""
  const id = movie.movie_id
  const listProvider = movie?.shows?.reduce((acc, show) => {
    const provider = show.cinemaId.split("-")[0] as Provider

    if (acc.has(provider)) return acc

    acc.set(provider, {
      label: `Cinéma ${SOURCE_PROVIDER[provider] || provider}`,
      icon: iconProviders[provider],
    })

    return acc
  }, new Map<string, { icon: ReactElement; label: string }>())

  const hasMultipleShows = movie.shows.length > 1
  const hasAVPE = movie.shows.some((show) => show.avpType === "AVPE")

  return (
    <Link
      id={`title-${id}`}
      style={{ "--img": cover } as CSSProperties}
      className="group relative after:z-10 after:inset-0 rounded-xl w-full aspect-[27/40] cursor-pointer block"
      href={`/shows/${id}`}
      prefetch={false}
    >
      <div className="size-full bg-center bg-cover rounded-[inherit] overflow-hidden">
        {cover && (
          <img
            src={cover || undefined}
            alt="Movie cover"
            className="object-cover size-full group-hover:scale-110 transition-transform duration-200 ease-out"
          />
        )}
        {!cover && (
          <div className="bg-gray-100 w-64 aspect-[7/10] rounded-2xl lg:w-full grid place-items-center">
            <VideoCameraSlashIcon className="size-12 text-gray-200" />
          </div>
        )}
      </div>
      <div className="thumb rounded-b-xl inset-x-0 h-2/5 bottom-0 bg-cover absolute backdrop-blur-sm" />
      <div className="rounded-b-xl bg-gradient-to-b h-2/5 w-full absolute bottom-0 inset-x-0 from-transparent via-40% via-black/70 to-black" />
      <div
        className="opacity-0 group-hover:opacity-20 bg-no-repeat bg-center bg-cover blur-xl absolute saturate-100 -inset-0 -z-10 transition-opacity duration-150 ease-out"
        style={{ backgroundImage: `url(${cover})` }}
      />

      <div className="flex absolute inset-x-4 top-4 items-stretch justify-end gap-2">
        {listProvider.entries().map(([_, { icon, label }], index) => (
          <TooltipProvider key={index}>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="size-8 text-gray-white inline-grid min-w-0 place-content-center rounded-lg bg-[#0B0C0E]/50 backdrop-blur-sm">
                  {icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <header className="absolute bottom-4 inset-x-4 space-y-1 z-20 text-[#F9FAFA]">
        <h3 className="text-lg font-semibold leading-[1.2]">{movie.title}</h3>
        <p className="text-sm font-light flex justify-start gap-1 items-center">
          <span>
            {movie.shows.length} séance{hasMultipleShows && "s"}
          </span>
          <span>
            {hasAVPE && (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <UsersRound className="text-primary-yellow/80 inline size-4" />
                  </TooltipTrigger>
                  <TooltipContent>Avec l'équipe du film</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </span>
        </p>
      </header>
    </Link>
  )
}
