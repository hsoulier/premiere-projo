"use client"

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import { useQuery } from "@tanstack/react-query"
import { getShowAggregated } from "@/lib/queries"
import { useEffect } from "react"
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

const formSchema = z.object({
  director: z.string(),
  duration: z.number(),
  id: z.number(),
  imdbId: z.string(),
  poster: z.string(),
  release: z.date().optional(),
  synopsis: z.string(),
  title: z.string(),
  hide: z.boolean(),
})

export const ModalEditMovie = ({ id }: { id: number }) => {
  const supabase = useSupabaseBrowser()

  const { data, isLoading } = useQuery({
    queryKey: [`movie-details-${id}`],
    queryFn: async () => await getShowAggregated(supabase, id.toString()),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    if (!data?.movie) return

    console.log("data", data.movie)

    form.reset({
      director: data.movie.director || "",
      duration: data.movie.duration || 0,
      id: data.movie.id,
      imdbId: data.movie.imdbId || "",
      poster: data.movie.poster || "",
      release: data.movie.release ? new Date(data.movie.release) : undefined,
      synopsis: data.movie.synopsis || "",
      title: data.movie.title || "",
      hide: data.movie.hide ?? false,
    })
  }, [data?.movie])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await supabase
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
      .eq("id", values.id)

    console.log(values)
  }

  if (isLoading) {
    return (
      <AlertDialogHeader>
        <AlertDialogTitle>Loading...</AlertDialogTitle>
      </AlertDialogHeader>
    )
  }

  return (
    <>
      <AlertDialogTitle>Editer le film</AlertDialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AlertDialogDescription asChild>
            <div>
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director</FormLabel>
                    <FormControl>
                      <Input placeholder="director" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
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
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>Durée du film</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="synopsis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Synopsis</FormLabel>
                    <FormControl>
                      <Input placeholder="director" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="release"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de sortie</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
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
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
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
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <Button type="submit">Mettre à jour</Button>
          </AlertDialogFooter>
        </form>
      </Form>
    </>
  )
}
