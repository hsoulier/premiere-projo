"use client"
import { GrandRexIcon } from "@/components/icons/grand-rex"
import { Mk2Icon } from "@/components/icons/mk2"
import { PatheIcon } from "@/components/icons/pathe"
import { UGCIcon } from "@/components/icons/ugc"
import { type Provider } from "@/components/movie-popup.show"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SOURCE_PROVIDER } from "@/constants/mapping"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { getShowAggregated } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import { UsersRound, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { sendGAEvent } from "@next/third-parties/google"
import { LouxorIcon } from "@/components/icons/louxor"

export const providers = {
  ugc: <UGCIcon className="w-6 text-black dark:text-white" />,
  pathe: <PatheIcon className="w-6 text-white" />,
  mk2: <Mk2Icon className="w-6 text-black dark:text-white" />,
  grand: <GrandRexIcon className="w-6 text-black dark:text-white" />,
  louxor: <LouxorIcon special className="w-6" />,
}

export const MovieShows = ({ shows }: { shows: Record<string, any> }) => {
  const { id } = useParams<{ id: string }>()

  const supabase = useSupabaseBrowser()

  const { data, error, status, isLoading } = useQuery({
    queryKey: [`show-${id}`],
    queryFn: async () => {
      const response = await getShowAggregated(supabase, id)

      return response
    },
  })

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={Object.keys(shows)}
    >
      {Object.entries(shows).map(([key, value]) => (
        <AccordionItem value={key} key={key} className="border-none py-0">
          <AccordionTrigger className="hover:no-underline py-4">
            <div className="flex items-center justify-start w-full gap-1 hover:no-underline text-2xl">
              <span className="font-semibold inline-flex items-center gap-2">
                {providers[key as Provider]}{" "}
                {SOURCE_PROVIDER[key as keyof typeof SOURCE_PROVIDER]}
              </span>
              <span className="font-light text-gray-500">
                ({value?.length})
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-6 pt-6 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {value?.map((show: Record<string, any>, index: number) => {
                const [date, time] = new Date(show.date || "")
                  .toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
                  .split(" ")
                return (
                  <div
                    key={index}
                    data-id={show.id}
                    className="p-4 border border-gray-100 rounded-xl"
                  >
                    <p className="font-medium mb-3">
                      {show.avpType === "AVPE" && (
                        <UsersRound className="text-primary-yellow inline size-4 mr-2" />
                      )}
                      {show.cinemas.name}
                    </p>
                    <div className="flex justify-start gap-4 font-light">
                      <span>
                        <Calendar className="inline size-4 text-gray-500 mr-1" />
                        {date}
                      </span>
                      <span>
                        <Clock className="inline size-4 text-gray-500 mr-1" />
                        {time.split(":").slice(0, 2).join(":")}
                      </span>
                    </div>
                    <Link
                      href={show.linkShow || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        sendGAEvent("event", "book_show_click", {
                          movie_id: id,
                          show_id: show.id,
                          provider: key,
                        })
                      }
                      className="mt-4 rounded-lg w-full bg-gray-100 h-10 text-sm font-light grid place-content-center"
                    >
                      Réserver
                    </Link>
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
