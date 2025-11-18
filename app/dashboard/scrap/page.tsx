"use client"

import { ScrapProviderButton } from "@/components/modal-scrap-movies.scrap"
import { Button, buttonVariants } from "@/components/ui/button"
import KineticLogStream, {
  logTypes,
  type Log,
} from "@/components/ui/kinetic-log-stream"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { functions } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { httpsCallable } from "firebase/functions"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

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

const scrapPathe = httpsCallable<void, Log, Log>(
  functions,
  "scrapPatheStreaming"
)

const DashboardPage = () => {
  const [logs, setLogs] = useState<Log[]>([])

  const forceScrap = async (
    endpoint: (typeof ENDPOINTS)[keyof typeof ENDPOINTS],
    key: string
  ) => {
    const toastId = toast.loading(`Lancement du scraping pour ${key}...`)

    setLogs([
      {
        message: `Lancement du scraping pour ${key}...`,
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        ...logTypes.INFO,
      },
    ])

    try {
      const { stream, data } = await scrapPathe.stream()

      for await (const chunk of stream) {
        const type =
          logTypes[chunk.type as keyof typeof logTypes] || logTypes.INFO
        setLogs((prevLogs) => [...prevLogs, { ...chunk, ...type }])
      }

      const res = await data

      setLogs((prevLogs) => [...prevLogs, { ...res, ...logTypes.SUCCESS }])
    } catch (error) {
      console.error(error)

      setLogs((prevLogs) => [
        ...prevLogs,
        {
          message: `Erreur lors du lancement du scraping pour ${key}.`,
          id: Date.now(),
          timestamp: new Date().toISOString(),
          ...logTypes.ERROR,
        },
      ])
    }

    toast.error(`Échec du lancement du scraping pour ${key}.`, {
      id: toastId,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <div className="w-full">
        <div className="flex items-center py-4">
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <ArrowLeftIcon /> Retour au tableau de bord
          </Link>
        </div>
      </div>
      <Tabs defaultValue="scrap">
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

          <KineticLogStream logs={logs} />
        </TabsContent>
        <TabsContent value="festivals">Festivals</TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardPage
