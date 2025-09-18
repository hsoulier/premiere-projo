"use client"
import { GrandRexIcon } from "@/components/icons/grand-rex"
import { Mk2Icon } from "@/components/icons/mk2"
import { PatheIcon } from "@/components/icons/pathe"
import { UGCIcon } from "@/components/icons/ugc"
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { UsersRound, Calendar, Clock, PencilIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { sendGAEvent } from "@next/third-parties/google"
import { LouxorIcon } from "@/components/icons/louxor"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { ModalEditShow } from "@/components/modal-edit-show"
import type { Shows } from "@/app/films/[id]/page.content"

export const providers = {
  ugc: <UGCIcon className="w-6 text-black dark:text-white" />,
  pathe: <PatheIcon className="w-6 text-white" />,
  mk2: <Mk2Icon className="w-6 text-black dark:text-white" />,
  grand: <GrandRexIcon className="w-6 text-black dark:text-white" />,
  louxor: <LouxorIcon special className="w-6" />,
}

export const CardScreening = ({
  show,
  cinemaId,
}: {
  show: NonNullable<Shows[keyof Shows]>[number]
  cinemaId: string
}) => {
  const user = useAuth()

  const { id } = useParams<{ id: string }>()
  const [open, setOpen] = useState<boolean>(false)

  const [date, time] = new Date(show.date || "")
    .toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
    .split(" ")

  console.log({ show })
  return (
    <div
      data-id={show.id}
      className="p-4 border border-gray-100 rounded-xl relative"
    >
      {user?.id && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger className="absolute top-2 right-2 p-2 rounded-lg bg-accent backdrop-blur-sm hover:bg-black/20 transition-colors duration-200 ease-in-out text-black">
            <PencilIcon className="size-5" />
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <ModalEditShow
              movieId={parseInt(id)}
              showId={show.id}
              close={() => setOpen(false)}
            />
          </AlertDialogPortal>
        </AlertDialog>
      )}
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
            provider: cinemaId,
          })
        }
        className="mt-4 rounded-lg w-full bg-gray-100 h-10 text-sm font-light grid place-content-center"
      >
        Réserver
      </Link>
    </div>
  )
}
