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
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs"

const mk2 = [
  {
    id: "mk2-1",
    name: "Bibliothèque",
  },
  {
    id: "mk2-2",
    name: "Nation",
  },
  {
    id: "mk2-3",
    name: "Quai de Loire",
  },
  {
    id: "mk2-4",
    name: "Bastille (côté Beaumarchais)",
  },
  {
    id: "mk2-5",
    name: "Odéon (côté St Michel)",
  },
  {
    id: "mk2-6",
    name: "Beaubourg",
  },
  {
    id: "mk2-7",
    name: "Parnasse",
  },
  {
    id: "mk2-8",
    name: "Gambetta",
  },
  {
    id: "mk2-9",
    name: "Odéon (côté St Germain)",
  },
  {
    id: "mk2-10",
    name: "Quai de Seine",
  },
  {
    id: "mk2-11",
    name: "Bastille (côté Fg St Antoine)",
  },
] as const

const ugc = [
  {
    id: "ugc-1",
    name: "UGC Ciné Cité Les Halles",
  },
  {
    id: "ugc-2",
    name: "UGC Ciné Cité Maillot",
  },
  {
    id: "ugc-3",
    name: "UGC Montparnasse",
  },
  {
    id: "ugc-4",
    name: "UGC Rotonde",
  },
  {
    id: "ugc-5",
    name: "UGC Odéon",
  },
  {
    id: "ugc-6",
    name: "UGC Danton",
  },
  {
    id: "ugc-7",
    name: "UGC Ciné Cité Bercy",
  },
  {
    id: "ugc-8",
    name: "UGC Lyon Bastille",
  },
  {
    id: "ugc-9",
    name: "UGC Gobelins",
  },
  {
    id: "ugc-10",
    name: "UGC Opéra",
  },
  {
    id: "ugc-11",
    name: "UGC Ciné Cité Paris 19",
  },
] as const

const pathe = [
  {
    id: "pathe-28",
    name: "Pathé Alésia",
  },
  {
    id: "pathe-29",
    name: "Pathé Aquaboulevard",
  },
  {
    id: "pathe-30",
    name: "Pathé Convention",
  },
  {
    id: "pathe-31",
    name: "Pathé Les Fauvettes",
  },
  {
    id: "pathe-50",
    name: "Pathé Beaugrenelle",
  },
  {
    id: "pathe-51",
    name: "Pathé Parnasse",
  },
  {
    id: "pathe-54",
    name: "Pathé Wepler",
  },
  {
    id: "pathe-55",
    name: "Pathé La Villette",
  },
  {
    id: "pathe-67",
    name: "Pathé Montparnos",
  },
  {
    id: "pathe-69",
    name: "Les 7 Batignolles",
  },
  {
    id: "pathe-73",
    name: "Le Miramar",
  },
  {
    id: "pathe-74",
    name: "Pathé Palace",
  },
  {
    id: "pathe-75",
    name: "La Géode",
  },
] as const

const values = [
  { value: "pathe", label: "Pathé", cinemas: pathe },
  { value: "ugc", label: "UGC", cinemas: ugc },
  { value: "mk2", label: "MK2", cinemas: mk2 },
  // { value: "indy", label: "Indépendant", cinemas: [] },
] as const

type Value =
  | (typeof values)[number]["value"]
  | (typeof values)[number]["cinemas"][number]["id"]

export const FilterCinema = () => {
  const [cinemaQuery, setCinemaQuery] = useQueryState(
    "c",
    parseAsArrayOf(parseAsString)
  )

  const hasValue = cinemaQuery && cinemaQuery?.length > 0

  const removeFilter = (value: Value) => {
    if (!cinemaQuery) return
    setCinemaQuery(cinemaQuery.filter((v) => v !== value))
  }
  const addFilter = (value: Value) => {
    setCinemaQuery([...(cinemaQuery || []), value])
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
        asChild
      >
        <Accordion type="single" collapsible className="space-y-1">
          {values.map(({ value, label, cinemas }) => (
            <AccordionItem key={value} value={value} className="border-b-0">
              <AccordionPrimitive.Header>
                <AccordionPrimitive.Trigger asChild>
                  <div className="flex flex-1 items-center justify-start gap-2 transition-all [&[data-state=open]>svg]:rotate-180 p-2">
                    <Checkbox
                      defaultChecked={
                        cinemaQuery?.includes(value) ||
                        cinemaQuery?.some((c) => c.startsWith(value))
                          ? "indeterminate"
                          : false
                      }
                      onClick={(e) => e.stopPropagation()}
                      onCheckedChange={(checked) =>
                        checked ? addFilter(value) : removeFilter(value)
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
                        checked={cinemaQuery?.includes(id)}
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
          ))}
        </Accordion>
      </PopoverContent>
    </Popover>
  )
}
