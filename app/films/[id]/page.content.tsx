"use client"

import { SOURCE_PROVIDER } from "@/constants/mapping"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getMovieAggregated } from "@/lib/queries"
import { numToTime } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, PencilIcon, UsersRound } from "lucide-react"
import { useParams } from "next/navigation"
import { parseAsString, useQueryState } from "nuqs"
import { UGCIcon } from "@/components/icons/ugc"
import { PatheIcon } from "@/components/icons/pathe"
import { Mk2Icon } from "@/components/icons/mk2"
import { VideoCameraSlashIcon } from "@heroicons/react/24/outline"
import { Footer } from "@/components/navigation"
import { GrandRexIcon } from "@/components/icons/grand-rex"
import { MovieShows } from "@/components/movie-shows"
import { NoShows } from "@/components/no-shows"
import { LouxorIcon } from "@/components/icons/louxor"
import { sendGAEvent } from "@next/third-parties/google"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ModalEditMovie } from "@/components/modal-edit-movie"

export const providers = {
  ugc: <UGCIcon className="w-6 text-black dark:text-white" />,
  pathe: <PatheIcon className="w-6 text-white" />,
  mk2: <Mk2Icon className="w-6 text-black dark:text-white" />,
  grand: <GrandRexIcon className="w-6 text-black dark:text-white" />,
  louxor: <LouxorIcon special className="w-6 text-black dark:text-white" />,
}

export type Shows = Awaited<ReturnType<typeof getMovieAggregated>>["shows"]

export const Content = () => {
  const { id } = useParams<{ id: string }>()

  const user = useAuth()
  const [open, setOpen] = useState<boolean>(false)
  const [avpType, setAvpType] = useQueryState(
    "avpType",
    parseAsString.withOptions({ clearOnDefault: true })
  )

  const supabase = useSupabaseBrowser()

  const { data, error, status, isLoading } = useQuery({
    queryKey: [`show-${id}`],
    queryFn: async () => {
      const response = await getMovieAggregated(supabase, id)

      return response
    },
  })

  if (status === "pending") {
    return <div>Loading...</div>
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>
  }

  const movie = data?.movie
  const shows = !avpType
    ? data.shows
    : Object.entries(data.shows).reduce<typeof data.shows>(
        (acc, [key, value]) => {
          if (!value) return acc

          const shows = value.filter((show) => show.avpType === avpType)

          if (shows.length === 0) return acc

          acc[key as keyof typeof SOURCE_PROVIDER] = shows
          return acc
        },
        {} as Record<
          keyof typeof SOURCE_PROVIDER,
          Awaited<
            ReturnType<typeof getMovieAggregated>
          >["shows"][keyof typeof SOURCE_PROVIDER]
        >
      )

  if (!movie) return <div>Movie not found</div>

  const hasDuration = movie.duration && movie.duration !== 0

  return (
    <>
      <main className="mx-5 lg:max-w-5xl lg:mx-auto">
        <button
          className="inline-flex items-center gap-1 p-2 text-sm font-light"
          onClick={() => history.back()}
        >
          <ChevronLeft />
          Retour
        </button>
        <div className="flex flex-col gap-8">
          <div className="mt-6 grid grid-cols-5 gap-4 lg:grid-cols-6 lg:gap-12">
            <div className="relative col-span-2 lg:col-span-2 h-fit">
              {movie.poster && (
                <img
                  src={movie.poster || ""}
                  alt="Movie cover"
                  className="object-cover w-64 aspect-[7/10] group-hover:scale-110 transition-transform duration-200 ease-out rounded-2xl lg:w-full"
                />
              )}
              {!movie.poster && (
                <div className="bg-gray-100 max-w-64 aspect-[7/10] rounded-2xl lg:w-full grid place-items-center">
                  <VideoCameraSlashIcon className="size-12 text-gray-200" />
                </div>
              )}
              <div
                className="opacity-75 bg-no-repeat bg-center bg-cover blur-2xl absolute saturate-200 inset-0 -z-10 transition-opacity duration-150 ease-out"
                style={{ backgroundImage: `url(${movie.poster || ""})` }}
              />

              {user?.id && (
                <AlertDialog open={open} onOpenChange={setOpen}>
                  <AlertDialogTrigger className="absolute top-2 right-2 p-2 rounded-lg bg-black/20 backdrop-blur-sm hover:bg-black/50 transition-colors duration-200 ease-in-out text-white">
                    <PencilIcon className="size-5" />
                  </AlertDialogTrigger>
                  <AlertDialogPortal>
                    <ModalEditMovie
                      id={movie.id}
                      close={() => setOpen(false)}
                    />
                  </AlertDialogPortal>
                </AlertDialog>
              )}
            </div>

            <div className="space-y-2 col-span-3 lg:col-span-4">
              <h1 className="text-2xl font-semibold flex flex-wrap gap-1 lg:flex-nowrap">
                {movie.title}
                {/* <span className="flex-shrink-0 font-normal lg:ml-4 bg-gray-100 inline-flex gap-2 p-2 rounded-xl text-xs">
              <UserGroupIcon className="size-4 text-gray-500" />
              {mappingAVP[show?.avpType as keyof typeof mappingAVP]}
            </span> */}
              </h1>

              <div className="space-y-3">
                <div className="gap-1 flex flex-col">
                  <span className="font-light text-gray-500">Réalisé par</span>
                  <span className="font-light">{movie.director}</span>
                </div>

                <div className="gap-1 flex flex-col">
                  <span className="font-light text-gray-500">
                    Sortie prévue le
                  </span>

                  <span className="font-light">
                    {movie.release &&
                    parseInt(movie.release?.split("-")[0] || "") >
                      new Date().getFullYear() - 2
                      ? new Date(movie.release || "").toLocaleDateString(
                          "fr-FR"
                        )
                      : "Prochainement en salles"}
                  </span>
                </div>

                <div className="gap-1 flex flex-col">
                  <span className="font-light text-gray-500">Durée</span>
                  <span className="font-light">
                    {hasDuration ? numToTime(movie.duration || 0) : "Inconnue"}
                  </span>
                </div>

                <div className="gap-1 flex-col hidden lg:flex">
                  <span className="font-light text-gray-500">Synopsis</span>
                  <p
                    className="font-light"
                    dangerouslySetInnerHTML={{
                      __html: movie.synopsis?.replace(/\n/g, "<br />") || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <MoviePopupRating /> */}
          <div className="gap-1 flex flex-col lg:hidden">
            <span className="font-light text-gray-500">Synopsis</span>
            <p className="font-light">{movie.synopsis}</p>
          </div>
        </div>
        <section className="flex flex-col gap-12 my-12">
          <div className="md:flex md:gap-3 gap-5 flex-wrap grid grid-cols-2">
            <button
              onClick={() => {
                sendGAEvent("event", "filter_movie", {
                  movie_id: id,
                  avp_type: "AVP",
                })
                setAvpType(null)
              }}
              aria-pressed={avpType === "AVPE"}
              className="h-10 px-3 rounded-lg border border-transparent bg-gray-100 font-medium text-sm transition-colors duration-200 ease-in-out aria-pressed:bg-transparent aria-pressed:border-gray-100 aria-pressed:text-gray-500"
            >
              Toutes les séances
            </button>
            <button
              onClick={() => {
                sendGAEvent("event", "filter_movie", {
                  movie_id: id,
                  avp_type: "AVPE",
                })
                setAvpType("AVPE")
              }}
              aria-pressed={avpType === "AVPE"}
              className="h-10 px-3 rounded-lg border border-primary-yellow/50 inline-flex items-center gap-2 transition-colors duration-200 ease-in-out aria-pressed:text-gray-800 dark:aria-pressed:bg-[#241E00] dark:aria-pressed:text-[#FDD700] dark:aria-[pressed=false]:bg-transparent dark:aria-[pressed=false]:text-[#FDD70080] dark:aria-pressed:border-transparent bg-[#FCDE36] text-gray-800 aria-[pressed=false]:opacity-50 justify-center"
            >
              <UsersRound className="inline size-4" />
              <span>
                <span className="hidden md:inline">Avec l'équipe du film</span>
                <span className="inline md:hidden">Avec l'équipe</span>
              </span>
            </button>
          </div>
          {Object.keys(shows).length > 0 && <MovieShows shows={shows} />}
          {Object.keys(shows).length === 0 && <NoShows />}
        </section>
      </main>
      {!isLoading && <Footer />}
    </>
  )
}
