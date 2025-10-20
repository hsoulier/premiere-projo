import { Footer } from "@/components/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link"

const FAQPage = () => {
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
              <BreadcrumbPage>
                Comment assister à une avant-première ?
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mt-9 mb-16">
          <h1 className="text-center text-3xl font-semibold">
            Comment assister à<br />
            une avant-première à Paris ?
          </h1>
          <p className=" mt-12 leading-7 text-gray-800 font-light">
            Découvrez tout ce qu’il faut savoir pour pouvoir assister à une
            projection en avant-première et tout cela grâce à Première Projo :
            Qu’est-ce qu’une avant-première, comment ça fonctionne, où chercher,
            comment réserver et surtout comment ne rien rater !
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Qu’est-ce qu’une avant-première ?
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Une avant-première est une projection exceptionnelle d’un film avant
            sa sortie officielle en salles. Ces projections peuvent avoir lieu
            plusieurs jours, semaines voire mois à l’avance, et sont parfois
            accompagnées d'une présentation ou d'une rencontre avec les équipes
            du film (réalisateurs, acteurs, producteurs, distributeurs…). Elles
            ont lieu dans de nombreuses salles à travers la France mais Paris,
            la capitale du cinéma, en voit tous les jours être proposés au
            cinéphiles mais pas que ! Elles ont notamment lieu dans les cinémas
            UGC, Pathé, MK2 ainsi que dans d’autres cinémas indépendants comme
            le Grand Rex et bien d’autres. Vous pouvez connaître{" "}
            <Link
              href="/cinemas"
              className="underline underline-offset-2 text-gray-white"
            >
              la liste des cinémas disponibles
            </Link>{" "}
            actuellement sur Première Projo →
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Qu’est-ce qu’une avant-première ?
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Il peut parfois s’avérer compliquer de s’informer sur toutes les
            avant-premières prévues à Paris ou de connaître celles qui seront
            présentées par les équipes des films. Auparavant, il fallait
            s’informer régulièrement sur les sites des cinémas (UGC, Pathé, MK2,
            Le Grand Rex…), sur leurs réseaux sociaux, sur certains médias
            d’actualité et de s’abonner à des newsletters. Aujourd’hui, Première
            Projo est la plateforme qui référence toutes les avant-premières de
            films prévues à Paris.
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Comment assister à une avant-première avec Première Projo ?
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Sur Première Projo, il est très simple de pouvoir découvrir et
            assister à des avant-premières.
            <ul className="list-disc list-inside">
              <li>
                Il suffit de naviguer sur la page d’accueil de{" "}
                <Link href="/" className="underline underline-offset-2">
                  PremiereProjo.fr
                </Link>
              </li>
              <li>
                Utiliser les filtres si vous le souhaitez (cinémas,
                avant-premières avec équipe du film, la barre de recherche)
              </li>
              <li>Sélectionner votre film</li>
              <li>
                Réserver votre séance directement sur la plateforme du cinéma
              </li>
              <li>sélectionné Votre séance en avant-première est réservée !</li>
            </ul>
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Restez informés des avant-premières à venir
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Chaque semaine à Paris, des dizaines d’avant-premières sont
            organisées à travers tous les cinémas de la capitale. Sur Première
            Projo, nous mettons à jours très régulièrement les avant-premières
            prévues à Paris. Consultez régulièrement notre site pour ne rater
            aucune projection et suivez-nous sur les réseaux sociaux pour être
            informés des séances exceptionnelles et des nouveautés pour notre
            plateforme.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default FAQPage
