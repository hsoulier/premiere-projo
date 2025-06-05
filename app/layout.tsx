import type { Metadata } from "next"
import { Suspense } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/next"
import { Bricolage_Grotesque } from "next/font/google"
import { Providers } from "@/app/providers"
import { Filters } from "@/components/filters"
import { Navigation } from "@/components/navigation"
import { cn } from "@/lib/utils"
import { NuqsAdapter } from "nuqs/adapters/next/app"

import "./globals.css"

const font = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://premiereprojo.fr"),
  title: "Première Pro | Toutes les avant-premières à Paris",
  description:
    "Découvrez toutes les avant-premières de films à Paris en un seul coup d'œil ! 🎬 Retrouvez les projections exclusives des cinémas UGC, Pathé, MK2 et le Grand Rex. Ne manquez aucune sortie anticipée et vivez la magie du cinéma avant tout le monde. Consultez les horaires et réservez vos places dès maintenant !",
  keywords: ["avant-première", "cinéma", "paris", "ugc", "pathé", "mk2"],
  authors: [
    { name: "Anthony Reungère", url: "https://bento.me/anthonyreungere" },
    { name: "Hippolyte Soulier", url: "https://hsoulier.dev" },
  ],
  robots: "index, follow",
  applicationName: "Première Projo",
  icons:
    "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>",
  openGraph: {
    title: "Première Pro | Toutes les avant-premières à Paris",
    description:
      "Découvrez toutes les avant-premières de films à Paris en un seul coup d'œil ! 🎬 Retrouvez les projections exclusives des cinémas UGC, Pathé, MK2 et le Grand Rex. Ne manquez aucune sortie anticipée et vivez la magie du cinéma avant tout le monde. Consultez les horaires et réservez vos places dès maintenant !",
    type: "website",
    siteName: "Première Projo",
    countryName: "France",
    locale: "fr-FR",
    url: "https://premiereprojo.fr",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Première Projo",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "relative dark:text-gray-white bg-gray-background min-h-screen max-w-screen font-sans antialiased pb-64",
          font.variable
        )}
      >
        <NuqsAdapter>
          <Providers>
            <Suspense>
              <Navigation />
              <header className="mx-auto w-full max-w-screen-2xl">
                <Filters />
              </header>

              {children}
              <Analytics />
            </Suspense>
          </Providers>
        </NuqsAdapter>
        <GoogleAnalytics gaId="G-3Q9NWLKWHZ" />
      </body>
    </html>
  )
}
