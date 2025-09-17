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
import { useMutation } from "@tanstack/react-query"
import { getMovieAggregated } from "@/lib/queries"
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

const formSchema = z.object({
  director: z.string(),
  duration: z.number(),
  id: z.number(),
  imdbId: z.string(),
  poster: z.string(),
  posterThumb: z.string(),
  release: z.date().optional(),
  synopsis: z.string(),
  title: z.string(),
  hide: z.boolean(),
})

export const ModalEditMovie = ({
  id,
  close,
}: {
  id: number
  close: () => void
}) => {
  const router = useRouter()
  const supabase = useSupabaseBrowser()

  const mutation = useMutation({
    mutationFn: async () => await getMovieAggregated(supabase, id.toString()),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const data = await mutation.mutateAsync()

      return {
        director: data?.movie?.director || "",
        duration: data?.movie?.duration || 0,
        id: data?.movie?.id || 0,
        imdbId: data?.movie?.imdbId || "",
        poster: data?.movie?.poster || "",
        posterThumb: data?.movie?.posterThumb || "",
        release: data?.movie?.release
          ? new Date(data.movie.release)
          : undefined,
        synopsis: data?.movie?.synopsis || "",
        title: data?.movie?.title || "",
        hide: data?.movie?.hide ?? false,
      }
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
    e
  ) => {
    e?.preventDefault()

    const toastId = toast.loading("Enregistrement des modifications...")

    const a = await supabase
      .from("movies")
      .update({
        director: values.director,
        duration: values.duration,
        imdbId: values.imdbId,
        poster: values.poster,
        release: values.release ? values.release.toISOString() : null,
        synopsis: values.synopsis,
        title: values.title,
        hide: values.hide,
      })
      .eq("id", id)

    toast.success("Modifications enregistrées", {
      description: `Le film ${values.title} a été mis à jour.`,
      duration: 2_000,
      action: {
        label: "Voir",
        onClick: () => router.push(`/films/${values.id}`),
      },
      id: toastId,
    })

    close()
  }

  const toggleHidden = async (checked: boolean) => {
    await supabase.from("movies").update({ hide: checked }).eq("id", id)

    toast.success(
      `Le film a été ${checked ? "caché" : "affiché"} avec succès.`,
      { duration: 2_000 }
    )
  }

  if (!mutation.data) {
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
      <AlertDialogTitle>Editer le film</AlertDialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AlertDialogDescription asChild>
            <div
              aria-description="Edit movie details"
              className="md:grid grid-cols-3 gap-4 space-y-4 md:space-y-0"
            >
              <div aria-description="Covers of the movie" className="space-y-4">
                <FormField
                  control={form.control}
                  name="poster"
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
                <FormField
                  control={form.control}
                  name="posterThumb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Affiche SD</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="url de l'image en basse qualité"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div aria-description="Basic metadata" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input placeholder="titre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="director"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Réalisateur</FormLabel>
                      <FormControl>
                        <Input placeholder="Réalisateur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="durée du film"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormDescription>Durée du film</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="release"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Date de sortie</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            defaultMonth={
                              field.value ? field.value : new Date()
                            }
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Sélectionnez la date de sortie du film.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div
                aria-description="Synopsis et images"
                className="w-80 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="synopsis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Synopsis</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex grow h-52 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-x-none"
                          placeholder="Synopsis"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <div className="inline-flex items-center space-x-2">
              <Switch
                id="hide-movie"
                defaultChecked={mutation.data.movie?.hide || false}
                onCheckedChange={toggleHidden}
              />
              <Label htmlFor="hide-movie">Masquer le film</Label>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                window.open(
                  `https://supabase.com/dashboard/project/${PROJECT_ID}/editor/${TABLE_IDS.MOVIES}?filter=id:eq:${id}`,
                  "_blank"
                )
              }
            >
              Voir sur Supabase
            </Button>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button type="submit">Mettre à jour</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogContent>
  )
}
