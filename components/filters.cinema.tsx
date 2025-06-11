"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  providers,
  LIST_MULTIPLEX,
  type allProviders,
} from "@/constants/mapping"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

type Value =
  | (typeof allProviders)[number]["value"]
  | (typeof providers)[number]["cinemas"][number]["id"]

export const FilterCinema = () => {
  const [cinemaQuery, setCinemaQuery] = useQueryState(
    "c",
    parseAsArrayOf(parseAsString)
      .withOptions({ clearOnDefault: true })
      .withDefault([])
  )

  const hasValue = cinemaQuery && cinemaQuery?.length > 0

  const removeFilter = (value: Value) => {
    if (!cinemaQuery) return
    setCinemaQuery(cinemaQuery.filter((v) => v !== value))
  }
  const addFilter = (value: Value) =>
    setCinemaQuery([...(cinemaQuery || []), value])

  const addProvider = (value: (typeof LIST_MULTIPLEX)[number]) => {
    const provider = providers.find((p) => p.value === value)

    if (!provider) return

    const newCinemas = provider.cinemas.map((c) => c.id)
    setCinemaQuery([...(cinemaQuery || []), ...newCinemas])
  }

  const removeProvider = (value: (typeof LIST_MULTIPLEX)[number]) => {
    const provider = providers.find((p) => p.value === value)
    if (!provider) return

    const newCinemas = cinemaQuery?.filter((v) => !v.startsWith(value))

    setCinemaQuery(newCinemas || [])
  }

  return (
    <Popover>
      <PopoverTrigger className="focus:outline-none flex items-center gap-2 px-3 py-[10px] border border-gray-200 rounded-xl text-gray-800 data-[state=open]:bg-gray-100 hover:bg-gray-100">
        Cinéma{" "}
        {hasValue && (
          <span className="bg-gray-100 rounded-lg px-2.5">
            {cinemaQuery?.length}
          </span>
        )}{" "}
        <ChevronDownIcon className="size-4 transition-transform duration-100 ease-in-out [[data-state=open]_&]:rotate-180" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="p-2 border border-gray-200 bg-gray-background rounded-xl text-gray-700 max-h-80 overflow-y-auto"
      >
        <Accordion type="single" collapsible className="space-y-1">
          {providers.map(({ value, label, cinemas }) => {
            return (
              <AccordionItem key={value} value={value} className="border-b-0">
                <AccordionPrimitive.Header>
                  <AccordionPrimitive.Trigger asChild>
                    <div className="flex flex-1 items-center justify-start gap-2 transition-all [&[data-state=open]>svg]:rotate-180 p-2">
                      <Checkbox
                        checked={
                          cinemas.every(({ id }) => cinemaQuery.includes(id))
                            ? true
                            : cinemaQuery?.some((c) => c.startsWith(value))
                            ? "indeterminate"
                            : false
                        }
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={(checked) =>
                          checked ? addProvider(value) : removeProvider(value)
                        }
                      />
                      <span className="[[aria-checked=true]~&]:text-gray-white text-gray-700">
                        {label}
                      </span>
                      <ChevronDown className="ml-auto mr-0 h-4 w-4 shrink-0 transition-transform duration-200" />
                    </div>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="pb-0">
                  <ul className="space-y-1">
                    {cinemas.map(({ id, name }) => (
                      <li key={id} className="pl-8 flex items-center gap-2 p-2">
                        <Checkbox
                          checked={
                            cinemaQuery?.includes(id) ||
                            cinemaQuery?.includes(value)
                          }
                          id={id}
                          onCheckedChange={(checked) =>
                            checked ? addFilter(id) : removeFilter(id)
                          }
                        />
                        <label htmlFor={id} className="w-full">
                          {name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
        <div
          className="flex flex-1 items-center justify-start gap-2 transition-all [&[data-state=open]>svg]:rotate-180 p-2 cursor-pointer"
          onClick={() =>
            !cinemaQuery.includes("grand-rex")
              ? addFilter("grand-rex")
              : removeFilter("grand-rex")
          }
        >
          <Checkbox
            checked={cinemaQuery.includes("grand-rex")}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={(checked) =>
              checked ? addFilter("grand-rex") : removeFilter("grand-rex")
            }
          />
          <span className="[[aria-checked=true]~&]:text-gray-white text-gray-700">
            Le Grand Rex
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
