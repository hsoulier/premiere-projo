"use client"

import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import { sendGAEvent } from "@next/third-parties/google"

export const ThemeSwitch = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <div className="grid place-content-center size-10 shrink-0 border border-gray-100 rounded-2xl bg-gray-background">
      {resolvedTheme === "dark" && (
        <button
          onClick={() => {
            sendGAEvent("event", "switch_theme", { theme: "light" })
            setTheme("light")
          }}
          aria-label="Switch to light mode"
        >
          <MoonIcon className="size-5 text-gray-900" />
        </button>
      )}
      {resolvedTheme === "light" && (
        <button
          onClick={() => {
            sendGAEvent("event", "switch_theme", { theme: "dark" })
            setTheme("dark")
          }}
          aria-label="Switch to dark mode"
        >
          <SunIcon className="size-5 text-gray-900" />
        </button>
      )}
    </div>
  )
}
