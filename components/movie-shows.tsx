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
import { UsersRound, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { sendGAEvent } from "@next/third-parties/google"
import { LouxorIcon } from "@/components/icons/louxor"
import { CardScreening } from "@/components/card-screening"
import type { Shows } from "@/app/films/[id]/page.content"

export const providers = {
  ugc: <UGCIcon className="w-6 text-black dark:text-white" />,
  pathe: <PatheIcon className="w-6 text-white" />,
  mk2: <Mk2Icon className="w-6 text-black dark:text-white" />,
  grand: <GrandRexIcon className="w-6 text-black dark:text-white" />,
  louxor: <LouxorIcon special className="w-6" />,
}

export const MovieShows = ({ shows }: { shows: Shows }) => {
  const { id } = useParams<{ id: string }>()

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={Object.keys(shows)}
    >
      {Object.entries(shows).map(([key, value]) => (
        <AccordionItem value={key} key={key} className="border-none py-0">
          <AccordionTrigger
            className="hover:no-underline py-4"
            onClick={() =>
              sendGAEvent("event", "show_provider_click", {
                movie_id: id,
                provider: key,
              })
            }
          >
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
              {value?.map((show, index) => (
                <CardScreening show={show} key={index} cinemaId={key} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
