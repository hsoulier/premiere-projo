import { Footer } from "@/components/navigation"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
              <BreadcrumbPage>FAQ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mt-9 mb-16">
          <h1 className="text-center text-3xl font-semibold">FAQ</h1>
          <p className="mt-12 leading-7 text-gray-800">
            Bienvenue dans notre Foire Aux Questions ! À quoi ça sert Première
            Projo ? Comment la plateforme fonctionne et est mise à jours ?
            Comment assister à une avant-première à Paris ? Comment ajouter
            votre cinéma ou votre film sur notre plateforme ? Vous êtes au bon
            endroit.
          </p>
        </section>

        <Accordion type="multiple" className="flex flex-col w-full gap-8">
          <AccordionItem
            value="item-1"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Qu’est-ce qu’est Première Projo ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Créé par et pour des passionnés de cinéma, Première Projo a été
                créé par{" "}
                <Link href="https://bento.me/anthonyreungere">Anthony</Link>{" "}
                (Créateur du projet, designer et à la communication) ainsi que{" "}
                <Link href="https://hsoulier.dev">Hippolyte</Link> (dev).{" "}
                <Link href="/a-propos">
                  Découvrir l’équipe de Première Projo →
                </Link>
              </p>
              <p>
                Elle est la première plateforme qui référence les
                avant-premières de films dans les cinémas de Paris ! En un seul
                et même endroit, découvrez des séances uniques et exclusives,
                des films en exclusivité et rencontrer les équipes de film !
                Avec Première Projo, ne ratez plus aucune avant-première à Paris
                !
              </p>
              <br />
              <p>
                Pour en savoir plus, redirigez vous vers notre page{" "}
                <Link href="/a-propos">À propos →</Link>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Qu’est-ce qu’une avant-première ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Une avant-première est une projection d’un film qui a lieu
                plusieurs jours, semaines voire mois avant sa sortie officielle
                en salles. Ces projections sont souvent accompagnées d'une
                présentation ou d'une rencontre avec les équipes du film
                (réalisateurs, acteurs, producteurs…).
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Comment réserver une avant-première ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Première Projo ne propose pas directement de vente de billets.
                Nous sommes simplement une plateforme référençant les séances en
                avant-première. Pour réserver, vous serez rediriger directement
                vers les plateformes de réservation des cinémas. Sur ces
                cinémas, les réservation d’une avant-première se fait comme une
                réservation d’une séance classique, de nombreux cinémas
                acceptent les cartes à abonnement des cinémas Pathé, UGC et MK2.
              </p>
              <br />
              <p>
                Pour en savoir, visitez notre page pour savoir{" "}
                <Link href="/comment-assister-avant-premiere">
                  Comment assister à une avant-première →
                </Link>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-4"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Comment sont ajoutées les séances sur Première Projo ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Nous mettons à jour automatiquement et cela plusieurs fois par
                jour toutes les avant-premières disponibles dans les cinémas que
                nous proposons. De ce fait, vous avez accès à la liste la plus
                complète des avant-premières actuellement disponibles à la
                réservation.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-5"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Comment rencontrer les équipes de film ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                De nombreuses séances en avant-première sont projetés en étant
                accompagnés d’une présentation en présence des équipes des films
                ou au moins du réalisateur/réalisatrice. Sur Première Projo,
                vous pouvez connaître les séances en présence des équipes des
                film par le filtre “Type de séances” puis “AVP en présence de
                l’équipe du film” ainsi que l’icône jaune pour signifier cela.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-6"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Comment ne rater aucune avant-première ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Chaque semaine à Paris, des dizaines d’avant-premières sont
                organisées à travers tous les cinémas de la capitale. Sur
                Première Projo, nous mettons à jours très régulièrement les
                avant-premières prévues à Paris.
              </p>
              <br />
              <p>
                Consultez régulièrement notre site pour ne rater aucune
                projection et suivez-nous sur les réseaux sociaux pour être
                informés des séances exceptionnelles et des nouveautés pour
                notre plateforme.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-7"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Où ont lieu les avant-premières à Paris ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Les avant-premières ont lieu dans l’ensemble des cinémas
                parisiens. Sur Première Projo, nous référençons toutes les
                cinémas UGC, Pathé, MK2 ainsi que d’autres cinémas comme Le
                Grand Rex, Le Louxor,... Nous souhaitons ajouter au fur et à
                mesure d’autres cinémas indépendants.{" "}
                <Link href="/cinemas">Voir la liste des cinémas →</Link>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-8"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Je suis exploitant de cinéma, comment je peux ajouter mon cinéma
              sur Première Projo ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Si vous souhaitez faire apparaître votre cinéma sur Première
                Projo et ses réseaux, il suffit de nous contact directement à{" "}
                <Link href="mailto:contact@premiereprojo.fr">
                  contact@premiereprojo.fr
                </Link>
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-9"
            className="bg-[rgba(23,24,28,0.5)] rounded-2xl border-none pb-2 data-[state=open]:pb-6"
          >
            <AccordionTrigger className="p-6 font-semibold text-xl pb-4">
              Je suis distributeur de films, comment je peux ajouter mon film
              sur Première Projo ?
            </AccordionTrigger>
            <AccordionContent className="px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              <p>
                Si vous souhaitez faire apparaître votre film sur Première Projo
                et ses réseaux, il suffit de nous contact directement à{" "}
                <Link href="mailto:contact@premiereprojo.fr">
                  contact@premiereprojo.fr
                </Link>
              </p>
            </AccordionContent>
          </AccordionItem>

          <p className="bg-[rgba(23,24,28,0.5)] rounded-2xl pb-6">
            <span className="block p-6 font-semibold text-xl pb-4">
              Vous avez une autre question ?
            </span>
            <span className="inline-block px-6 leading-7 text-gray-800 font-light [&_a]:text-gray-white [&_a]:font-medium [&_a]:underline [&_a]:underline-offset-2 pb-0">
              Contactez-nous à{" "}
              <Link href="mailto:contact@premiereprojo.fr">
                contact@premiereprojo.fr
              </Link>{" "}
              ou directement sur les réseaux sociaux de Première Projo
            </span>
          </p>
        </Accordion>
      </main>
      <Footer />
    </>
  )
}

export default FAQPage
