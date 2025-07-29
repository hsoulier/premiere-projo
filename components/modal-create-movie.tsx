"use client"

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
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

const formSchema = z.object({
  director: z.string(),
  duration: z.number(),
  imdbId: z.string().min(1, {
    message: "L'ID IMDb doit être un nombre positif",
  }),
  poster: z.string(),
  posterThumb: z.string(),
  release: z.date().optional(),
  synopsis: z.string(),
  title: z.string(),
  hide: z.boolean(),
})

export const ModalCreateMovie = ({ close }: { close: () => void }) => {
  const router = useRouter()
  const supabase = useSupabaseBrowser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      director: "",
      duration: 0,
      imdbId: "",
      poster: "",
      posterThumb: "",
      release: undefined,
      synopsis: "",
      title: "",
      hide: false,
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
    e
  ) => {
    e?.preventDefault()

    if (!values.imdbId) {
      toast.error("L'ID Allociné est requis")
      return
    }

    const toastId = toast.loading("Création du film...")

    const a = await supabase.from("movies").insert({
      id: parseInt(values.imdbId),
      director: values.director,
      duration: values.duration,
      imdbId: values.imdbId,
      poster: values.poster,
      posterThumb: values.posterThumb,
      release: values.release ? values.release.toISOString() : null,
      synopsis: values.synopsis,
      title: values.title,
      scrapedAt: new Date().toISOString(),
    })

    console.log(a)

    toast.success("Modifications enregistrées", {
      description: `Le film ${values.title} a été mis à jour.`,
      duration: 2_000,
      action: {
        label: "Voir",
        onClick: () => router.push(`/films/${values.imdbId}`),
      },
      id: toastId,
    })

    close()
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
                <FormField
                  control={form.control}
                  name="imdbId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Id Allociné</FormLabel>
                      <FormControl>
                        <Input placeholder="id allociné" {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        allocine.fr/.../fichefilm_gen_cfilm=
                        <span className="underline underline-offset-2 font-semibold">
                          ID
                        </span>
                        .html
                      </FormDescription>
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
                                <span className="text-muted-foreground/50">
                                  Sélectionner une date
                                </span>
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
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button type="submit">Mettre à jour</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </AlertDialogContent>
  )
}
