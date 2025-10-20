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

const MentionsLegalesPage = () => {
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
              <BreadcrumbPage>Mentions légales</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mt-9 mb-16">
          <h1 className="text-center text-3xl font-semibold">
            Mentions légales
          </h1>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-3">
            Éditeur du site
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Le site Première Projo est un projet bénévole et indépendant, conçu
            par des passionnés de cinéma dans le but de référencer les
            avant-premières de films dans les cinémas parisiens.
          </p>
          <h3 className="text-xl font-medium">
            Responsable de la publication :
          </h3>
          <p className="font-light leading-7 text-gray-800">
            Monsieur Anthony Reungère, créateur de Première Projo à titre
            bénévole.
            <br />
            Contact :{" "}
            <Link
              href="mailto:contact@premiereprojo.fr"
              className="underline underline-offset-2 text-gray-white"
            >
              contact@premiereprojo.fr
            </Link>
            <br />
            Le site ne constitue en aucun cas une activité commerciale ou
            professionnelle. Aucun revenu n’est généré, aucun service payant
            n’est proposé.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-3 text-2xl font-semibold text-gray-white">
            Hébergement
          </h2>

          <h3 className="text-xl font-medium">Le site est hébergé par :</h3>
          <p className="font-light leading-7 text-gray-800">
            La société Amazon Web Services (AWS) <br />
            Adresse : 410 Terry Avenue North PO Box 81226, Seattle, WA
            981808-1226 – USA
            <br />
            Site :{" "}
            <Link
              href="https://aws.amazon.com/fr/"
              className="underline underline-offset-2"
            >
              https://aws.amazon.com/fr/
            </Link>
            <br />
            Le stockage des données personnelles des utilisateurs est
            exclusivement réalisé sur les centres de données ("clusters") de la
            société Amazon Inc, dont le siège social est situé 10 Terry Avenue
            North, Seattle, WA. Tous les clusters Amazon sur lesquels les
            données du Site sont stockées sont localisés dans des Etats membres
            de l'Union Européenne.
          </p>

          <h3 className="mt-6 text-xl font-medium">
            Le nom de domaine est hébergé par :
          </h3>
          <p className="font-light leading-7 text-gray-800">
            La société OVH
            <br />
            Adresse : 2 rue Kellermann - 59100 Roubaix - France
            <br />
            Site :{" "}
            <Link href="https://www.ovhcloud.com/fr/">
              https://www.ovhcloud.com/fr/
            </Link>
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-3">
            Données personnelles
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Première Projo ne collecte pas de données personnelles sensibles.
            Aucune création de compte, inscription à une newsletter ou
            transaction financière n’est proposée. Les seules données
            éventuellement collectées sont anonymes et servent à des fins de
            statistiques de fréquentation via des outils de mesure d’audience
            (ex. : Google Analytics).
            <br />
            Vous pouvez nous contacter à tout moment pour toute question
            relative à la confidentialité à l’adresse suivante :{" "}
            <Link
              href="/cinemas"
              className="underline underline-offset-2 text-gray-white font-medium"
            >
              contact@premiereprojo.fr
            </Link>
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-3">
            Propriété intellectuelle
          </h2>
          <p className="font-light leading-7 text-gray-800">
            L’ensemble des contenus présents sur le site (textes, images,
            visuels, logo, nom, etc.) sont la propriété de leurs auteurs
            respectifs ou utilisés avec autorisation. Toute reproduction ou
            utilisation non autorisée est interdite.
            <br />
            Les affiches, visuels de films et autres éléments promotionnels sont
            la propriété exclusive de leurs ayants droit (distributeurs,
            studios, etc.) et sont utilisés uniquement à des fins d’information.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-white mb-3">
            Conditions d’utilisation
          </h2>
          <p className="font-light leading-7 text-gray-800">
            L’utilisation du site Première Projo est entièrement gratuite. Nous
            ne demandons aucunement aux utilisateurs de saisir quelconque
            information personnelle durant leur navigation sur le site ou même
            durant la réservation de séance qui se s’effectue exclusivement sur
            des sites extérieurs à Première Projo. Le site ne garantit pas
            l’exhaustivité ou l’exactitude des informations fournies, celles-ci
            étant régulièrement mises à jour à titre bénévole. Toutes
            informations liées aux séances (dates, horaires, présence de
            personnes tierces, ...) peuvent être amenées à être modifiées selon
            les cinémas proposant ces séances.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default MentionsLegalesPage
