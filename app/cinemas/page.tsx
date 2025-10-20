import { Footer } from "@/components/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getCinemas } from "@/lib/queries"
import { ArrowUpRightIcon, MapPinIcon } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"

const CinemasPage = async () => {
  const supabase = useSupabaseServer(await cookies())

  const response = await getCinemas(supabase)

  const cinemasByChain = response?.reduce((acc, cinema) => {
    const chain = cinema.source || "Indépendant"

    if (!acc[chain]) {
      acc[chain] = []
    }

    acc[chain].push(cinema)

    return acc
  }, {} as Record<string, typeof response>)

  return (
    <>
      <main className="max-w-[940px] mx-auto px-4 mt-[52px]">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-500" href="/">
                Accueil
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Les cinémas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mt-9 mb-16">
          <h1 className="text-center text-3xl font-semibold">
            Les cinémas sur Première Projo
          </h1>
          <p className="mt-12 leading-7 text-gray-800">
            Sur Première Projo, nous référons totues les avant-premières de de
            film à Paris à travers de nombreux cinémas parisiens comme les
            cinémas UGC, Pathé, MK2 et d’autres cinémas.
          </p>
          <p className="mt-4 leading-7 text-gray-800">
            Sur notre site, vous pouvez filtrer par un ensemble de cinémas comme
            tous les UGC, tous les Pathé ou MK2 et même en filtrant de manière
            plus en sélectionnant UGC Les Halles, MK2 Bibliothèque, Pathé
            Palace,.... Avec tous ces cinémas, vous ne pourrez plus rater de
            séances en avant-premières dont celles avec la présence des équipes
            de film pour pouvoir rencontrer les réalisateurs, réalisatrices,
            acteurs, actrices et autres ! Retrouvez ci-dessous la liste de
            toutes les salles de cinéma disponibles sur Première Projo
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-6">
            Les cinémas UGC
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-6">
            {cinemasByChain?.ugc?.map((cinema) => (
              <div
                className="relative p-4 rounded-xl border border-gray-100 flex flex-col gap-3"
                key={cinema.id}
              >
                <button className="right-2 top-2 size-8 inline-grid place-items-center rounded-lg bg-gray-100 text-gray-700 absolute">
                  <ArrowUpRightIcon className="size-4" />
                </button>
                <h3 className="font-medium text-lg">{cinema.name}</h3>
                <p className="inline-flex gap-1 items-center truncate">
                  <MapPinIcon className="inline-block size-4 text-gray-500 shrink-0" />
                  <span className="truncate">{cinema.address}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-6">
            Les cinémas Pathé
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-6">
            {cinemasByChain?.pathe?.map((cinema) => (
              <div
                className="relative p-4 rounded-xl border border-gray-100 flex flex-col gap-3"
                key={cinema.id}
              >
                <button className="right-2 top-2 size-8 inline-grid place-items-center rounded-lg bg-gray-100 text-gray-700 absolute">
                  <ArrowUpRightIcon className="size-4" />
                </button>
                <h3 className="font-medium text-lg">{cinema.name}</h3>
                <p className="inline-flex gap-1 items-center truncate">
                  <MapPinIcon className="inline-block size-4 text-gray-500 shrink-0" />
                  <span className="truncate">{cinema.address}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-6">
            Les cinémas MK2
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-6">
            {cinemasByChain?.mk2?.map((cinema) => (
              <div
                className="relative p-4 rounded-xl border border-gray-100 flex flex-col gap-3"
                key={cinema.id}
              >
                <button className="right-2 top-2 size-8 inline-grid place-items-center rounded-lg bg-gray-100 text-gray-700 absolute">
                  <ArrowUpRightIcon className="size-4" />
                </button>
                <h3 className="font-medium text-lg">{cinema.name}</h3>
                <p className="inline-flex gap-1 items-center truncate">
                  <MapPinIcon className="inline-block size-4 text-gray-500 shrink-0" />
                  <span className="truncate">{cinema.address}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 space-y-3">
          <h2 className="text-2xl font-semibold text-gray-white">
            Les cinémas indépendants
          </h2>
          <p className="leading-7 text-gray-800">
            Les cinémas indépendants parisiens couvrent également de nombreuses
            avant-premières à Paris, dont des films qui rentrent dans une autre
            programmation que celles des cinémas majeurs. Ils proposent des
            avant-premières souvent plus intimistes avec un temps d’échange plus
            long et plus profond. Nous ajoutons les cinémas indépendants
            parisiens au fur et à mesure, notre but est de pouvoir tous les
            recenser et de couvrir un maximum d’avant-premières à Paris
          </p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-x-4 gap-y-6">
            {[
              ...(cinemasByChain?.grand ?? []),
              ...(cinemasByChain?.louxor ?? []),
            ]?.map((cinema) => (
              <div
                className="relative p-4 rounded-xl border border-gray-100 flex flex-col gap-3"
                key={cinema.id}
              >
                <button className="right-2 top-2 size-8 inline-grid place-items-center rounded-lg bg-gray-100 text-gray-700 absolute">
                  <ArrowUpRightIcon className="size-4" />
                </button>
                <h3 className="font-medium text-lg">{cinema.name}</h3>
                <p className="inline-flex gap-1 items-center truncate">
                  <MapPinIcon className="inline-block size-4 text-gray-500 shrink-0" />
                  <span className="truncate">{cinema.address}</span>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 space-y-3">
          <h2 className="text-2xl font-semibold text-gray-white">
            Ajouter votre cinéma
          </h2>
          <p className="leading-7 text-gray-800">
            Vous êtes exploitant d’une salle de cinéma ou vous souhaiteriez voir
            votre cinéma de quartier sur Première Projo ? Contactez-nous à
            l’adresse suivante :{" "}
            <Link
              className="underline underline-offset-2 text-gray-white"
              href="mailto:contact@premiereprojo.fr"
            >
              contact@premiereprojo.fr
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default CinemasPage
