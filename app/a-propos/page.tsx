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

const AboutPage = () => {
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
              <BreadcrumbPage>À propos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mt-9 mb-16">
          <h1 className="text-center text-3xl font-semibold">À propos</h1>
          <p className="mt-12 leading-7 text-gray-800 font-light">
            Première Projo, la première plateforme qui référence les
            avant-premières de films dans les cinémas de Paris ! En un seul et
            même endroit, découvrez des séances uniques et exclusives, des films
            en exclusivité et rencontrer les équipes de film ! Avec Première
            Projo, ne ratez plus aucune avant-première à Paris !
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Notre mission
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Proposer une solution simple et idéale pour connaître toutes les
            futures avant-premières, découvrir des films en exclusivité et cela
            bien avant leur sortie nationale, ne jamais rater une projection
            parfois difficile à avoir ainsi que de rencontrer des réalisateurs,
            réalisatrices et des équipes de films.
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Qui sommes-nous ?
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Première Projo est une plateforme totalement bénévole pensé par et
            pour des passionnés de cinéma (mais pas que !).
          </p>
          <div className="mt-6 gap-8 grid grid-cols-2">
            <div className="rounded-2xl bg-gray-100/50 p-8 flex flex-col gap-6 items-center justify-center">
              <div className="flex flex-col items-center">
                <img
                  src="/antho-avatar.jpg"
                  alt="Anthony"
                  className="size-16 rounded-full mb-4"
                />
                <h2 className="text-xl text-gray-white font-medium inline-flex items-center">
                  Anthony{" "}
                  <Link
                    href="https://letterboxd.com/antho_/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 inline-block ml-2"
                    >
                      <g clipPath="url(#clip0_1103_25724)">
                        <path
                          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                          fill="#2E3038"
                        />
                        <path
                          d="M12.0005 15.3581C13.8583 15.3581 15.3643 13.8543 15.3643 11.9993C15.3643 10.1444 13.8583 8.64062 12.0005 8.64062C10.1427 8.64062 8.63672 10.1444 8.63672 11.9993C8.63672 13.8543 10.1427 15.3581 12.0005 15.3581Z"
                          fill="#00E054"
                        />
                        <mask
                          id="mask0_1103_25724"
                          style={{ maskType: "luminance" }}
                          maskUnits="userSpaceOnUse"
                          x="14"
                          y="8"
                          width="8"
                          height="8"
                        >
                          <path
                            d="M21.0725 8.64062H14.8398V15.4273H21.0725V8.64062Z"
                            fill="white"
                          />
                        </mask>
                        <g mask="url(#mask0_1103_25724)">
                          <path
                            d="M17.7075 15.3581C19.5653 15.3581 21.0713 13.8543 21.0713 11.9993C21.0713 10.1444 19.5653 8.64062 17.7075 8.64062C15.8498 8.64062 14.3438 10.1444 14.3438 11.9993C14.3438 13.8543 15.8498 15.3581 17.7075 15.3581Z"
                            fill="#40BCF4"
                          />
                        </g>
                        <mask
                          id="mask1_1103_25724"
                          style={{ maskType: "luminance" }}
                          maskUnits="userSpaceOnUse"
                          x="2"
                          y="8"
                          width="8"
                          height="8"
                        >
                          <path
                            d="M9.15845 8.64062H2.92578V15.4273H9.15845V8.64062Z"
                            fill="white"
                          />
                        </mask>
                        <g mask="url(#mask1_1103_25724)">
                          <path
                            d="M6.28956 15.3581C8.14732 15.3581 9.65333 13.8543 9.65333 11.9993C9.65333 10.1444 8.14732 8.64062 6.28956 8.64062C4.43179 8.64062 2.92578 10.1444 2.92578 11.9993C2.92578 13.8543 4.43179 15.3581 6.28956 15.3581Z"
                            fill="#FF8000"
                          />
                        </g>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.14638 13.7755C8.8234 13.2597 8.63672 12.6502 8.63672 11.9971C8.63672 11.344 8.8234 10.7345 9.14638 10.2188C9.46937 10.7345 9.65604 11.344 9.65604 11.9971C9.65604 12.6502 9.46937 13.2597 9.14638 13.7755Z"
                          fill="#556677"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.8534 10.2188C15.1764 10.7345 15.3631 11.344 15.3631 11.9971C15.3631 12.6502 15.1764 13.2597 14.8534 13.7755C14.5304 13.2597 14.3438 12.6502 14.3438 11.9971C14.3438 11.344 14.5304 10.7345 14.8534 10.2188Z"
                          fill="#556677"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1103_25724">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                </h2>
                <p className="font-light text-gray-700 text-center">
                  Créateur, designer et communication
                </p>
              </div>
              <div className="gap-4 flex flex-col items-center">
                <p>Films préférés</p>
                <ul className="grid-cols-3 grid gap-2 ">
                  <li>
                    <img
                      src="https://a.ltrbxd.com/resized/film-poster/5/1/9/8/7/51987-2001-a-space-odyssey-0-230-0-345-crop.jpg?v=a69c46a272"
                      alt="2001 : L'odysée de l'espace"
                      className="rounded-lg aspect-[27/40] object-cover"
                    />
                  </li>
                  <li>
                    <img
                      src="https://medias.boutique.lab.arte.tv/prod/78432_vod_thumb_414885.jpg"
                      alt="Anatomie d'une chute"
                      className="rounded-lg aspect-[27/40] object-cover"
                    />
                  </li>
                  <li>
                    <img
                      src="https://a.ltrbxd.com/resized/sm/upload/kv/7n/p8/tv/fMC8JBWx2VjsJ53JopAcFjqmlYv-0-230-0-345-crop.jpg?v=3d69c00608"
                      alt="Mulholland drive"
                      className="rounded-lg aspect-[27/40] object-cover"
                    />
                  </li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl bg-gray-100/50 p-8 flex flex-col gap-6 items-center justify-center">
              <div className="flex flex-col items-center">
                <img
                  src="https://a.ltrbxd.com/resized/avatar/upload/1/1/2/6/8/3/8/4/shard/avtr-0-220-0-220-crop.jpg?v=11c89b525a"
                  alt="Hippolyte"
                  className="size-16 rounded-full mb-4"
                />
                <h2 className="text-xl text-gray-white font-medium inline-flex items-center">
                  Hippolyte{" "}
                  <Link
                    href="https://letterboxd.com/Hipposoulier/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-6 inline-block ml-2"
                    >
                      <g clipPath="url(#clip0_1103_25724)">
                        <path
                          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                          fill="#2E3038"
                        />
                        <path
                          d="M12.0005 15.3581C13.8583 15.3581 15.3643 13.8543 15.3643 11.9993C15.3643 10.1444 13.8583 8.64062 12.0005 8.64062C10.1427 8.64062 8.63672 10.1444 8.63672 11.9993C8.63672 13.8543 10.1427 15.3581 12.0005 15.3581Z"
                          fill="#00E054"
                        />
                        <mask
                          id="mask0_1103_25724"
                          style={{ maskType: "luminance" }}
                          maskUnits="userSpaceOnUse"
                          x="14"
                          y="8"
                          width="8"
                          height="8"
                        >
                          <path
                            d="M21.0725 8.64062H14.8398V15.4273H21.0725V8.64062Z"
                            fill="white"
                          />
                        </mask>
                        <g mask="url(#mask0_1103_25724)">
                          <path
                            d="M17.7075 15.3581C19.5653 15.3581 21.0713 13.8543 21.0713 11.9993C21.0713 10.1444 19.5653 8.64062 17.7075 8.64062C15.8498 8.64062 14.3438 10.1444 14.3438 11.9993C14.3438 13.8543 15.8498 15.3581 17.7075 15.3581Z"
                            fill="#40BCF4"
                          />
                        </g>
                        <mask
                          id="mask1_1103_25724"
                          style={{ maskType: "luminance" }}
                          maskUnits="userSpaceOnUse"
                          x="2"
                          y="8"
                          width="8"
                          height="8"
                        >
                          <path
                            d="M9.15845 8.64062H2.92578V15.4273H9.15845V8.64062Z"
                            fill="white"
                          />
                        </mask>
                        <g mask="url(#mask1_1103_25724)">
                          <path
                            d="M6.28956 15.3581C8.14732 15.3581 9.65333 13.8543 9.65333 11.9993C9.65333 10.1444 8.14732 8.64062 6.28956 8.64062C4.43179 8.64062 2.92578 10.1444 2.92578 11.9993C2.92578 13.8543 4.43179 15.3581 6.28956 15.3581Z"
                            fill="#FF8000"
                          />
                        </g>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.14638 13.7755C8.8234 13.2597 8.63672 12.6502 8.63672 11.9971C8.63672 11.344 8.8234 10.7345 9.14638 10.2188C9.46937 10.7345 9.65604 11.344 9.65604 11.9971C9.65604 12.6502 9.46937 13.2597 9.14638 13.7755Z"
                          fill="#556677"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M14.8534 10.2188C15.1764 10.7345 15.3631 11.344 15.3631 11.9971C15.3631 12.6502 15.1764 13.2597 14.8534 13.7755C14.5304 13.2597 14.3438 12.6502 14.3438 11.9971C14.3438 11.344 14.5304 10.7345 14.8534 10.2188Z"
                          fill="#556677"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_1103_25724">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                </h2>
                <p className="font-light text-gray-700 text-center">
                  Développeur de l'internet
                </p>
              </div>
              <div className="gap-4 flex flex-col items-center">
                <p>Films préférés</p>
                <ul className="grid-cols-3 grid gap-2 ">
                  <li>
                    <img
                      src="https://a.ltrbxd.com/resized/sm/upload/pf/lk/cj/4e/nCx0EESDNxwXGn7rkCU6cvXTpIB-0-230-0-345-crop.jpg?v=67361260f7"
                      alt="Porco Rosso"
                      className="rounded-lg aspect-[27/40] object-cover"
                    />
                  </li>
                  <li>
                    <img
                      src="https://a.ltrbxd.com/resized/film-poster/1/8/7/9/8/6/187986-ex-machina-0-230-0-345-crop.jpg?v=2b4212d498"
                      alt="Ex Machina"
                      className="rounded-lg aspect-[27/40] object-cover"
                    />
                  </li>
                  <li>
                    <img
                      src="https://a.ltrbxd.com/resized/sm/upload/iw/eg/4g/nm/3w79tTsv6tmlT8Jww6snyPrgVok-0-230-0-345-crop.jpg?v=778c7ae8b8"
                      alt="Prisoners"
                      className="rounded-lg aspect-[27/40] object-cover"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            À qui s’adresse Première Projo ?
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Première Projo s’adresse à un large public. D’abord aux spectateurs
            curieux qui ne suivent pas toujours toute l’actualité des cinémas,
            des distributeurs ou des films, et qui souhaitent retrouver en un
            seul endroit toutes les avant-premières à Paris. La plateforme est
            également pensée pour les cinéphiles passionnés, toujours à l’affût
            des nouvelles sorties et désireux de ne rater aucune projection
            spéciale.{" "}
          </p>

          <p className="font-light leading-7 text-gray-800">
            Elle constitue aussi une opportunité pour les salles de cinéma, qui
            peuvent mettre en avant leurs séances et bénéficier d’une visibilité
            supplémentaire auprès d’un public ciblé. Enfin, Première Projo
            s’adresse aux professionnels du cinéma — distributeurs, producteurs,
            exploitants, attachés de presse — qui y trouvent une vitrine dédiée
            à la diffusion et à la promotion des projections de leurs films en
            avant-première.
          </p>
        </section>

        <section className="flex flex-col gap-3 mb-16">
          <h2 className="text-2xl font-semibold text-gray-white">
            Contacter Première Projo
          </h2>
          <p className="font-light leading-7 text-gray-800">
            Vous avez des questions ou des remarques ? N’hésitez pas à consulter{" "}
            <Link
              href="/faq"
              className="underline underline-offset-2 text-gray-white font-medium"
            >
              notre page FAQ !
            </Link>
          </p>
          <p className="font-light leading-7 text-gray-800">
            Vous souhaiteriez ajouter votre film ou votre cinéma sur notre site
            ? Ou vous avez une question spécifique, contactez-nous à l’adresse
            suivante :{" "}
            <Link
              className="underline underline-offset-2 text-gray-white font-medium"
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

export default AboutPage
