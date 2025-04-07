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
              className="min-w-0 w-fit h-full lg:w-full bg-transparent outline-none placeholder:text-gray-400 text-gray-800 bg-red-20 placeholder-shown:text-ellipsis"
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
