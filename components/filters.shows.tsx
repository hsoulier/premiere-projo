"use client"

import { FilmIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

const values = [
  { value: "AVP", label: "AVP classiques", Icon: FilmIcon },
  // {
  //   value: "AVP-real",
  //   label: "AVP en présence du réalisateur",
  //   Icon: UserIcon,
  // },
  {
    value: "AVPE",
    label: "AVP en présence de l'équipe",
    Icon: UserGroupIcon,
  },
] as const

type Value = (typeof values)[number]["value"]

export const FilterShows = () => {
  const [avpType, setAvpType] = useQueryState(
    "avpType",
    parseAsArrayOf(parseAsString)
  )

  const hasValue = avpType && avpType?.length > 0

  const removeFilter = (value: Value) => {
    if (!avpType) return
    setAvpType(avpType.filter((v) => v !== value))
  }
  const addFilter = (value: Value) => {
    setAvpType([...(avpType || []), value])
  }

  return (
    <Popover>
      <PopoverTrigger className="focus:outline-none flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-xl text-gray-800 data-[state=open]:bg-gray-100 hover:bg-gray-100">
        Type de séances{" "}
        {hasValue && (
          <span className="bg-gray-100 rounded-lg px-2.5">
            {avpType?.length}
          </span>
        )}{" "}
        <ChevronDownIcon className="size-4 transition-transform duration-100 ease-in-out [[data-state=open]_&]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        collisionPadding={20}
        className="p-2 border border-gray-200 bg-gray-background rounded-xl text-gray-700 max-h-80 overflow-y-auto"
      >
        {values.map(({ value, label }) => (
          <div
            key={value}
            className="flex flex-1 items-center justify-start gap-2 transition-all [&[data-state=open]>svg]:rotate-180 p-2"
          >
            <Checkbox
              defaultChecked={avpType?.includes(value)}
              onClick={(e) => e.stopPropagation()}
              id={value}
              onCheckedChange={(checked) => {
                checked ? addFilter(value) : removeFilter(value)
              }}
            />
            <label
              htmlFor={value}
              className="[[aria-checked=true]~&]:text-gray-white text-gray-700 whitespace-nowrap"
            >
              {label}
            </label>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
