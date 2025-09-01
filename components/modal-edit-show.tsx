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
import { useMutation, useQuery } from "@tanstack/react-query"
import { getCinemas, getMovieBase, getShow } from "@/lib/queries"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import * as chrono from "chrono-node/fr"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { PROJECT_ID, TABLE_IDS } from "@/components/table-movies"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  id: z.string(),
  language: z.string().default("vo"),
  date: z.date(),
  cinemaId: z.string(),
  movieId: z.number(),
  linkShow: z.url(),
  linkMovie: z.url(),
  scrapedAt: z.date().default(() => new Date()),
  isFull: z.boolean().default(false),
  avpType: z.string().default("AVP"),
})

export const ModalEditShow = ({
  movieId,
  close,
  showId,
}: {
  movieId: number
  close: () => void
  showId?: number
}) => {
  const router = useRouter()
  const supabase = useSupabaseBrowser()

  const { data, mutateAsync } = useMutation({
    mutationFn: async () => await getShow(supabase, showId?.toString() || ""),
  })

  const { data: cinemas } = useQuery({
    queryKey: ["cinemas"],
    queryFn: async () => await getCinemas(supabase),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      const defaultForm = {
        id: "",
        avpType: "AVP",
        cinemaId: "",
        date: new Date(),
        isFull: false,
        language: "",
        linkMovie: "",
        linkShow: "",
        movieId,
        scrapedAt: new Date(),
      }

      if (showId) {
        const data = await mutateAsync()

        if (!data) return defaultForm

        return {
          ...defaultForm,

          id: data?.id || "",
          avpType: data?.avpType || "",
          cinemaId: data?.cinemaId || "",
          date: data?.date ? new Date(data?.date) : new Date(),
          isFull: data?.isFull || false,
          language: data?.language || "",
          linkMovie: data?.linkMovie || "",
          linkShow: data?.linkShow || "",
          movieId: movieId,
        }
      }

      return defaultForm
    },
  })

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
    values,
    e
  ) => {
    e?.preventDefault()

    const toastId = toast.loading("Enregistrement des modifications...")

    const row = {
      ...values,
      date: values.date ? values.date.toISOString() : null,
    }

    console.log("submit", { row, showId })

    try {
      if (showId) {
        const updated = await supabase
          .from("shows")
          .update(row)
          .eq("id", showId.toString())
          .select()

        console.log("updated", updated)
      } else {
        const id = new Date().getTime().toString(36)

        console.log({ ...row, id })

        const inserted = await supabase
          .from("shows")
          .insert([{ ...row, id }])
          .select()

        console.log("inserted", inserted)
      }
    } catch (error) {
      console.log(error)
      toast.error("Une erreur est survenue lors de la mise à jour", {
        description: "Veuillez réessayer plus tard.",
        duration: 5_000,
        id: toastId,
      })
      return
    }

    toast.success("Modifications enregistrées", {
      description: showId
        ? "La séance a bien été mise à jour"
        : "La séance a bien été créée",
      duration: 2_000,
      action: {
        label: "Voir",
        onClick: () => router.push(`/films/${movieId}`),
      },
      id: toastId,
    })

    close()
  }

  if ((!data && showId) || !cinemas) {
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
    <AlertDialogContent className="min-w-96 w-auto max-w-none max-h-[90vh] overflow-auto">
      <AlertDialogTitle>Editer une séance</AlertDialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Langue de la séance</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Sélectionner une langue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { value: "vo", label: "VO" },
                            { value: "vf", label: "VF" },
                          ].map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="cinemaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cinéma</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Sélectionner un cinéma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cinemas?.map(({ id, name }) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkShow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien de la séance</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkMovie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien du film</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de la séance</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="vendredi 20 janvier 2025 à 20h00"
                        onChange={(e) => {
                          field.onChange(
                            chrono.parseDate(e.target.value, {
                              timezone: "CEST",
                            })
                          )
                        }}
                        defaultValue={
                          field.value ? field.value.toLocaleString("fr-FR") : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="avpType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Langue de la séance</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Type AVP" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "AVPE", label: "AVP avec équipe" },
                          { value: "AVP", label: "AVP classique" },
                        ].map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFull"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        defaultChecked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>

                    <FormLabel className="mt-0">
                      Marquer comme complet
                    </FormLabel>
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
