import { Footer } from "@/components/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowUpRightIcon, MoveUpRightIcon } from "lucide-react"
import Link from "next/link"

const NousContacterPage = () => {
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
              <BreadcrumbPage>Nous contacter</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <section className="mt-9 mb-16">
          <h1 className="text-center text-3xl font-semibold mb-16">
            Nous contacter
          </h1>
          <div className="grid gap-8 grid-cols-2">
            <div className="rounded-2xl bg-gray-100/50 p-8 flex flex-col gap-4 items-center justify-center">
              <h2 className="text-2xl text-gray-white font-semibold">
                Foire Aux Questions
              </h2>
              <p className="font-light text-gray-700 text-center">
                N’hésitez pas à consulter notre FAQ regroupant une liste de
                questions pouvant vous informer à propos de Première Projo,
                comment réserver une séance, comment rencontrer les équipes,...!
              </p>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "mt-2 font-medium"
                )}
                href="/faq"
              >
                Lire la page FAQ
              </Link>
            </div>
            <div className="rounded-2xl bg-gray-100/50 p-8 flex flex-col gap-4 items-center justify-center">
              <h2 className="text-2xl text-gray-white font-semibold">
                Prendre contact
              </h2>
              <p className="font-light text-gray-700 text-center">
                Une question spécifique ? Une envie d’ajouter votre cinéma,
                votre film ou tout autre collaboration ? Contactez nous par mail
                :<br />
                <Link
                  className="underline underline-offset-2 text-gray-white"
                  href="mailto:contact@premiereprojo.fr"
                >
                  contact@premiereprojo.fr
                </Link>
              </p>
              <Link
                className={cn(buttonVariants(), "mt-2 font-medium")}
                href="mailto:contact@premiereprojo.fr"
              >
                Nous contacter
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-100 p-8 flex flex-col gap-4 items-start">
              <h2 className="text-xl text-gray-white font-semibold">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block mr-2 size-6 text-gray-700"
                >
                  <path
                    d="M17.2213 3.75H19.9803L13.9224 10.6477L21 20.0046H15.4459L11.0973 14.3185L6.11896 20.0046H3.35988L9.77774 12.627L3 3.75H8.6921L12.6208 8.94427L17.2213 3.75ZM16.2556 18.3851H17.7851L7.88837 5.30948H6.24492L16.2556 18.3851Z"
                    fill="currentColor"
                  />
                </svg>
                Suis nous sur X/Twitter
              </h2>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "mt-2 font-medium py-2 px-3 w-auto h-auto [&_svg]:size-6 leading-none"
                )}
                href="https://x.com/premiereprojo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nous follow <ArrowUpRightIcon />
              </Link>
            </div>
            <div className="rounded-2xl border border-gray-100 p-8 flex flex-col gap-4 items-start">
              <h2 className="text-xl text-gray-white font-semibold">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block mr-2 size-6 text-gray-700"
                >
                  <path
                    d="M12.0008 3C9.55657 3 9.24982 3.01069 8.28981 3.05438C7.33167 3.09825 6.67766 3.24994 6.10541 3.47251C5.51346 3.70238 5.01133 4.00989 4.51108 4.51033C4.01045 5.01058 3.70294 5.51271 3.47232 6.10447C3.24919 6.67691 3.09731 7.33111 3.05419 8.28887C3.01125 9.24888 3 9.55582 3 12.0001C3 14.4444 3.01088 14.7502 3.05438 15.7102C3.09844 16.6683 3.25013 17.3223 3.47251 17.8946C3.70257 18.4865 4.01007 18.9887 4.51052 19.4889C5.01058 19.9896 5.51271 20.2978 6.10428 20.5277C6.67691 20.7502 7.33111 20.9019 8.28906 20.9458C9.24907 20.9895 9.55563 21.0002 11.9997 21.0002C14.4442 21.0002 14.75 20.9895 15.71 20.9458C16.6681 20.9019 17.3229 20.7502 17.8955 20.5277C18.4873 20.2978 18.9887 19.9896 19.4887 19.4889C19.9894 18.9887 20.2969 18.4865 20.5275 17.8948C20.7487 17.3223 20.9006 16.6681 20.9456 15.7104C20.9888 14.7504 21 14.4444 21 12.0001C21 9.55582 20.9888 9.24907 20.9456 8.28906C20.9006 7.33092 20.7487 6.67691 20.5275 6.10466C20.2969 5.51271 19.9894 5.01058 19.4887 4.51033C18.9881 4.0097 18.4875 3.70219 17.895 3.47251C17.3212 3.24994 16.6668 3.09825 15.7087 3.05438C14.7487 3.01069 14.4431 3 11.998 3H12.0008ZM11.1935 4.62189C11.4331 4.62152 11.7005 4.62189 12.0008 4.62189C14.4039 4.62189 14.6887 4.63052 15.6376 4.67364C16.5151 4.71377 16.9914 4.86039 17.3086 4.98358C17.7287 5.14671 18.0281 5.34171 18.3429 5.65672C18.6579 5.97172 18.8529 6.27172 19.0164 6.69173C19.1396 7.0086 19.2864 7.48486 19.3264 8.36237C19.3695 9.31113 19.3789 9.59613 19.3789 11.998C19.3789 14.3999 19.3695 14.6849 19.3264 15.6337C19.2862 16.5112 19.1396 16.9875 19.0164 17.3043C18.8533 17.7243 18.6579 18.0234 18.3429 18.3382C18.0279 18.6532 17.7288 18.8482 17.3086 19.0114C16.9918 19.1351 16.5151 19.2814 15.6376 19.3215C14.6889 19.3646 14.4039 19.374 12.0008 19.374C9.59763 19.374 9.31282 19.3646 8.36406 19.3215C7.48655 19.281 7.01029 19.1344 6.69285 19.0112C6.27285 18.848 5.97284 18.653 5.65784 18.338C5.34284 18.023 5.14783 17.7238 4.98433 17.3036C4.86114 16.9867 4.71433 16.5105 4.67439 15.6329C4.63127 14.6842 4.62264 14.3992 4.62264 11.9958C4.62264 9.59238 4.63127 9.30888 4.67439 8.36012C4.71452 7.48261 4.86114 7.00635 4.98433 6.6891C5.14746 6.2691 5.34284 5.96909 5.65784 5.65409C5.97284 5.33909 6.27285 5.14408 6.69285 4.98058C7.0101 4.85683 7.48655 4.71058 8.36406 4.67027C9.19432 4.63277 9.51607 4.62152 11.1935 4.61964V4.62189ZM16.805 6.11628C16.2088 6.11628 15.725 6.59948 15.725 7.19592C15.725 7.79218 16.2088 8.27593 16.805 8.27593C17.4013 8.27593 17.885 7.79218 17.885 7.19592C17.885 6.59966 17.4013 6.11628 16.805 6.11628ZM12.0008 7.37817C9.44838 7.37817 7.37892 9.44763 7.37892 12.0001C7.37892 14.5526 9.44838 16.6211 12.0008 16.6211C14.5533 16.6211 16.622 14.5526 16.622 12.0001C16.622 9.44763 14.5533 7.37817 12.0008 7.37817ZM12.0008 9.00006C13.6576 9.00006 15.0009 10.3431 15.0009 12.0001C15.0009 13.6569 13.6576 15.0001 12.0008 15.0001C10.3439 15.0001 9.00081 13.6569 9.00081 12.0001C9.00081 10.3431 10.3439 9.00006 12.0008 9.00006Z"
                    fill="currentColor"
                  />
                </svg>
                Suis nous sur Instagram
              </h2>
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "mt-2 font-medium py-2 px-3 w-auto h-auto [&_svg]:size-6 leading-none"
                )}
                href="https://instagram.com/premiereprojo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nous follow <ArrowUpRightIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default NousContacterPage
