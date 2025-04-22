"use client"

import { Logo } from "@/components/logo"
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { useDebounce } from "react-use"

const ThemeSwitch = dynamic(
  () => import("./theme-switch").then((m) => m.ThemeSwitch),
  { ssr: false }
)

export const Navigation = () => {
  const [search, setSearch] = useQueryState("q", { defaultValue: "" })
  const [dSearch, setDSearch] = useState<string>(search)

  useDebounce(() => setSearch(dSearch), 300, [dSearch])

  const clear = () => {
    setSearch("")
    setDSearch("")
  }

  useEffect(() => {
    if (!search) setDSearch("")
  }, [search])

  return (
    <div className="mx-auto max-w-screen-2xl sticky top-0 z-50 bg-gradient-to-b from-20% from-gray-background to-gray-background/0">
      <nav className="flex items-center justify-between py-6 z-50 px-5 space-x-5">
        <Link href="/">
          <Logo className="h-8" />
        </Link>
        <search
          role="search"
          className="grow lg:absolute left-1/2 lg:-translate-x-1/2"
        >
          <form className="relative grow h-10 rounded-2xl bg-gray-100 lg:h-12 lg:w-[40vw] flex items-center">
            <div className="p-4 lg:block lg:pl-4 text-gray-400">
              <MagnifyingGlassIcon className="size-4 lg:block" />
            </div>
            <input
              type="search"
              name="q"
              placeholder="Rechercher une avant-première..."
              className="min-w-0 w-fit h-full lg:w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-800 bg-red-20 placeholder-shown:text-ellipsis grow"
              value={dSearch}
              onChange={(e) => setDSearch(e.target.value)}
            />
            {!!search && (
              <button className="p-4" type="button" onClick={clear}>
                <span className="sr-only">Effacer la recherche</span>
                <XMarkIcon className="size-5 stroke-gray-400" />
              </button>
            )}
          </form>
        </search>
        <ThemeSwitch />
      </nav>
    </div>
  )
}

export const Footer = () => {
  return (
    <footer className="mt-32 flex flex-col items-stretch justify-between gap-4 pb-16 mx-auto px-4 lg:px-5 max-w-screen-2xl">
      <div className="flex items-center justify-between">
        <Logo className="h-6" />
        <div className="flex gap-8">
          <a href="https://x.com/premiereprojo" target="_blank">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
            >
              <path
                d="M17.2213 3.75H19.9803L13.9224 10.6477L21 20.0046H15.4459L11.0973 14.3185L6.11896 20.0046H3.35988L9.77774 12.627L3 3.75H8.6921L12.6208 8.94427L17.2213 3.75ZM16.2556 18.3851H17.7851L7.88837 5.30948H6.24492L16.2556 18.3851Z"
                className="fill-gray-800 dark:fill-gray-white"
              />
            </svg>
          </a>
          <a href="https://www.instagram.com/premiereprojo/" target="_blank">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
            >
              <path
                d="M12.0009 3C9.55664 3 9.24988 3.01069 8.28986 3.05438C7.33172 3.09825 6.6777 3.24994 6.10544 3.47251C5.51349 3.70239 5.01135 4.0099 4.51109 4.51034C4.01046 5.0106 3.70295 5.51274 3.47232 6.1045C3.24919 6.67695 3.09731 7.33115 3.05419 8.28892C3.01125 9.24894 3 9.55589 3 12.0002C3 14.4445 3.01088 14.7503 3.05438 15.7103C3.09844 16.6685 3.25013 17.3225 3.47251 17.8947C3.70258 18.4867 4.01008 18.9888 4.51053 19.4891C5.0106 19.9897 5.51274 20.298 6.10431 20.5279C6.67695 20.7504 7.33115 20.9021 8.28911 20.946C9.24913 20.9897 9.5557 21.0004 11.9998 21.0004C14.4443 21.0004 14.7501 20.9897 15.7101 20.946C16.6683 20.9021 17.323 20.7504 17.8957 20.5279C18.4874 20.298 18.9888 19.9897 19.4889 19.4891C19.9895 18.9888 20.297 18.4867 20.5277 17.8949C20.7489 17.3225 20.9008 16.6683 20.9458 15.7105C20.9889 14.7505 21.0002 14.4445 21.0002 12.0002C21.0002 9.55589 20.9889 9.24913 20.9458 8.28911C20.9008 7.33097 20.7489 6.67695 20.5277 6.10469C20.297 5.51274 19.9895 5.0106 19.4889 4.51034C18.9883 4.00971 18.4876 3.7022 17.8951 3.47251C17.3214 3.24994 16.667 3.09825 15.7088 3.05438C14.7488 3.01069 14.4432 3 11.9981 3H12.0009ZM11.1935 4.62191C11.4332 4.62153 11.7006 4.62191 12.0009 4.62191C14.404 4.62191 14.6888 4.63053 15.6378 4.67366C16.5153 4.71379 16.9915 4.86041 17.3088 4.9836C17.7288 5.14673 18.0283 5.34174 18.3431 5.65674C18.6581 5.97175 18.8531 6.27176 19.0166 6.69176C19.1398 7.00865 19.2866 7.48491 19.3265 8.36242C19.3697 9.31119 19.379 9.5962 19.379 11.9981C19.379 14.4001 19.3697 14.6851 19.3265 15.6338C19.2864 16.5113 19.1398 16.9876 19.0166 17.3045C18.8535 17.7245 18.6581 18.0236 18.3431 18.3384C18.0281 18.6534 17.729 18.8484 17.3088 19.0115C16.9919 19.1353 16.5153 19.2815 15.6378 19.3217C14.689 19.3648 14.404 19.3742 12.0009 19.3742C9.5977 19.3742 9.31288 19.3648 8.36411 19.3217C7.48659 19.2812 7.01033 19.1345 6.69289 19.0113C6.27288 18.8482 5.97287 18.6532 5.65787 18.3382C5.34286 18.0232 5.14786 17.7239 4.98435 17.3037C4.86116 16.9869 4.71435 16.5106 4.67441 15.6331C4.63128 14.6843 4.62266 14.3993 4.62266 11.9959C4.62266 9.59245 4.63128 9.30895 4.67441 8.36018C4.71454 7.48266 4.86116 7.0064 4.98435 6.68914C5.14748 6.26913 5.34286 5.96912 5.65787 5.65412C5.97287 5.33911 6.27288 5.14411 6.69289 4.9806C7.01015 4.85685 7.48659 4.7106 8.36411 4.67029C9.19438 4.63278 9.51614 4.62153 11.1935 4.61966V4.62191ZM16.8052 6.11632C16.2089 6.11632 15.7251 6.59951 15.7251 7.19596C15.7251 7.79223 16.2089 8.27599 16.8052 8.27599C17.4014 8.27599 17.8852 7.79223 17.8852 7.19596C17.8852 6.5997 17.4014 6.11632 16.8052 6.11632ZM12.0009 7.37822C9.44845 7.37822 7.37897 9.4477 7.37897 12.0002C7.37897 14.5527 9.44845 16.6212 12.0009 16.6212C14.5534 16.6212 16.6222 14.5527 16.6222 12.0002C16.6222 9.4477 14.5534 7.37822 12.0009 7.37822ZM12.0009 9.00013C13.6577 9.00013 15.001 10.3432 15.001 12.0002C15.001 13.657 13.6577 15.0003 12.0009 15.0003C10.344 15.0003 9.00088 13.657 9.00088 12.0002C9.00088 10.3432 10.344 9.00013 12.0009 9.00013Z"
                className="fill-gray-800 dark:fill-gray-white"
              />
            </svg>
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between text-gray-600 flex-col md:flex-row">
        <div className="flex items-center gap-4">
          <span>
            Concept et design par{" "}
            <a
              className="underline text-gray-white"
              href="https://x.com/anthonyreungere"
            >
              @Antho
            </a>
          </span>
          |
          <span>
            Developpé par{" "}
            <a
              className="underline text-gray-white"
              href="https://hsoulier.dev/"
            >
              @Hippo
            </a>
          </span>
        </div>

        <div>
          Pour contacter{" "}
          <a className="text-gray-white" href="mailto:contact@premiereprojo.fr">
            Première Projo
          </a>
        </div>
      </div>
    </footer>
  )
}
