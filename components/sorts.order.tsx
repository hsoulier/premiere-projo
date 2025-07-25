"use client"

import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { sendGAEvent } from "@next/third-parties/google"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItemIndicator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { parseAsString, useQueryState } from "nuqs"
import { useLocalStorage } from "react-use"

const values = [
  { value: "show", label: "Par séances les plus proches" },
  { value: "az", label: "Par titre de film (de A à Z)" },
  { value: "release", label: "Date de sortie du film" },
] as const

export const defaultValueOrder = values[0].value

export const keyOrder = "order" as const

type Value = (typeof values)[number]["value"]

export const FilterOrder = () => {
  const [order, setOrder] = useLocalStorage<string>(keyOrder, defaultValueOrder)
  const [_order, _setOrder] = useQueryState(keyOrder, parseAsString)

  const removeFilter = () => {
    _setOrder(defaultValueOrder)
    if (!order) return
    setOrder(defaultValueOrder)
  }
  const addFilter = (value: Value) => {
    sendGAEvent("event", "apply_sort", { name: keyOrder, value })
    setOrder(value)
    _setOrder(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden lg:flex ml-auto mr-0 focus:outline-none items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-xl text-gray-800 data-[state=open]:bg-gray-100 hover:bg-gray-100">
        Trier
        <ChevronDownIcon className="size-4 transition-transform duration-100 ease-in-out [[data-state=open]_&]:rotate-180" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        collisionPadding={20}
        className="p-2 border border-gray-200 bg-gray-background rounded-xl text-gray-700 w-fit"
      >
        {values.map(({ value, label }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={order === value}
            onCheckedChange={(checked) =>
              checked ? addFilter(value) : removeFilter()
            }
            className="flex flex-1 items-center justify-start gap-2 transition-all [&[data-state=open]>svg]:rotate-180 p-2 hover:bg-gray-100 data-[highlight]:bg-gray-100 rounded-sm outline-none relative data-[highlight]:outline-none"
          >
            <DropdownMenuItemIndicator asChild>
              <CheckIcon
                data-state={order === value ? "checked" : "unchecked"}
                className="absolute left-2 size-4 data-[state=unchecked]:text-transparent"
              />
            </DropdownMenuItemIndicator>
            <span className="ml-8 [[aria-checked=true]~&]:text-gray-white text-gray-700 whitespace-nowrap">
              {label}
            </span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
