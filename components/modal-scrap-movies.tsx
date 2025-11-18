"use client"

import {
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { ScrapProviderButton } from "@/components/modal-scrap-movies.scrap"

export const ENDPOINTS = {
  all: "https://europe-west1-premiereprojo.cloudfunctions.net/scrapAllCinemas",
  ugc: "https://europe-west1-premiereprojo.cloudfunctions.net/scrapUGC",
  pathe: "https://europe-west1-premiereprojo.cloudfunctions.net/scrapPathe",
  mk2: "https://europe-west1-premiereprojo.cloudfunctions.net/scrapMK2",
  "mk2-festival":
    "https://europe-west1-premiereprojo.cloudfunctions.net/scrapMK2Festival",
  "grand-rex":
    "https://europe-west1-premiereprojo.cloudfunctions.net/scrapGrandRex",
  dulac: "https://europe-west1-premiereprojo.cloudfunctions.net/scrapDulac",
  louxor: "https://europe-west1-premiereprojo.cloudfunctions.net/scrapLouxor",
  studio28:
    "https://europe-west1-premiereprojo.cloudfunctions.net/scrapStudio28",
} as const

export const ModalScrapMovies = () => {
  // const router = useRouter()
  // const supabase = useSupabaseBrowser()

  const forceScrap = async (
    endpoint: (typeof ENDPOINTS)[keyof typeof ENDPOINTS],
    key: string
  ) => {
    const toastId = toast.loading(`Lancement du scraping pour ${key}...`)
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (!response.ok) {
        throw new Error(
          `Erreur lors du scraping pour ${key} : ${response.statusText}`
        )
      }
      toast.success(`Scraping pour ${key} lancé avec succès !`, {
        id: toastId,
      })
    } catch (error) {
      console.error(error)
      toast.error(`Échec du lancement du scraping pour ${key}.`, {
        id: toastId,
      })
    }
  }

  return (
    <AlertDialogContent className="max-w-max h-[60vh] overflow-auto grid-rows-[min-content,auto,min-content]">
      <AlertDialogTitle>Forcer le scraping des films</AlertDialogTitle>

      <Tabs defaultValue="scrap" className="w-full">
        <TabsList>
          <TabsTrigger value="scrap">Scraping</TabsTrigger>
          <TabsTrigger value="festivals">Festivals</TabsTrigger>
        </TabsList>
        <TabsContent value="scrap">
          <div className="mt-4 flex gap-4">
            {Object.entries(ENDPOINTS).map(([key, endpoint]) => (
              <ScrapProviderButton
                key={key}
                variant="outline"
                onClick={() => forceScrap(endpoint, key)}
              >
                Scrap {key}
              </ScrapProviderButton>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="festivals">Festivals</TabsContent>
      </Tabs>

      <AlertDialogFooter className="mt-auto mb-0 self-stretch">
        <AlertDialogCancel>Fermer</AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
