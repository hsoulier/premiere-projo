"use client"

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { useQuery } from "@tanstack/react-query"
import { getShow } from "@/lib/queries"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PROJECT_ID, TABLE_IDS } from "@/components/table-movies"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useEffect } from "react"

const formSchema = z.object({
  id: z.string(), // not null (PK)
  language: z.string().nullable(), // text null
  date: z.date().nullable(), // timestamp with time zone null
  cinemaId: z.string(), // not null (FK -> cinemas.id)
  movieId: z.number(), // not null (FK -> movies.id)
  linkShow: z.string().nullable(), // text null
  linkMovie: z.string().nullable(), // text null
  festival: z.string().nullable(), // text null
  scrapedAt: z
    .date()
    .nullable() // timestamp with time zone, default now
    .default(() => new Date()),
  isFull: z.boolean().nullable().default(false), // boolean default false
  avpType: z.string(), // public.AVP type (domain/enum?) → as string
})

export const ModalEditShow = ({
  id,
  close,
  showId,
}: {
  id: number
  close: () => void
  showId?: string
}) => {
  const router = useRouter()
  const supabase = useSupabaseBrowser()

  const { data } = useQuery({
    queryKey: ["show", showId],
    enabled: !!showId,
    queryFn: async () => await getShow(supabase, id.toString()),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      language: null,
      date: null,
      cinemaId: "",
      movieId: 0,
      linkShow: null,
      linkMovie: null,
      festival: null,
      scrapedAt: new Date(),
      isFull: false,
      avpType: null,
    },
  })

  useEffect(() => {
    if (!data) return

    if (!showId) {
      form.reset({
        avpType: "",
        cinemaId: "",
        date: null,
        festival: "",
        id: "",
        isFull: false,
        language: "",
        linkMovie: "",
        linkShow: "",
        movieId: id,
        scrapedAt: new Date(),
      })
    }

    form.reset({
      id: data?.id || "",
      avpType: data?.avpType || "",
      cinemaId: data?.cinemaId || "",
      date: data.date ? new Date(data?.date) : null,
      isFull: data?.isFull || false,
      language: data?.language || "",
      linkMovie: data?.linkMovie || "",
      linkShow: data?.linkShow || "",
      movieId: id,
      scrapedAt: new Date(),
    })
  }, [data])

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
    e
  ) => {
    e?.preventDefault()

    const toastId = toast.loading("Enregistrement des modifications...")

    if (showId) {
      const a = await supabase
        .from("shows")
        .update({
          ...values,
          date: values.date ? format(values.date, "yyyy-MM-dd HH:mm:ss") : null,
        })
        .eq("id", showId)
    } else {
      const a = await supabase.from("shows").insert([
        {
          ...values,
          date: values.date ? format(values.date, "yyyy-MM-dd HH:mm:ss") : null,
        },
      ])
    }

    toast.success("Modifications enregistrées", {
      description: showId
        ? "La séance a bien été mise à jour"
        : "La séance a bien été créée",
      duration: 2_000,
      action: {
        label: "Voir",
        onClick: () => router.push(`/films/${id}`),
      },
      id: toastId,
    })

    close()
  }

  if (!data) {
    return (
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Loading...</AlertDialogTitle>
          <VisuallyHidden.Root>
            <AlertDialogDescription />
          </VisuallyHidden.Root>
        </AlertDialogHeader>
      </AlertDialogContent>
    )
  }

  return (
    <AlertDialogContent className="max-w-max max-h-[90vh] overflow-auto">
      <AlertDialogTitle>Editer une séance</AlertDialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AlertDialogDescription asChild>
            <div className="space-y-4 md:space-y-0">
              <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Affiche HD</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="url de l'image en haute qualité"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            {!!showId && (
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  window.open(
                    `https://supabase.com/dashboard/project/${PROJECT_ID}/editor/${TABLE_IDS.SHOWS}?filter=id:eq:${showId}`,
                    "_blank"
                  )
                }
              >
                Voir sur Supabase
              </Button>
            )}
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button type="submit">
              {!!showId ? "Mettre à jour" : "Créer la séance"}
            </Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogContent>
  )
}
