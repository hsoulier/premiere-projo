"use client"

import { UGCIcon } from "@/components/icons/ugc"
import { PatheIcon } from "@/components/icons/pathe"
import { Mk2Icon } from "@/components/icons/mk2"

export const providers = {
  ugc: <UGCIcon className="w-6 text-white" />,
  pathe: <PatheIcon className="w-6 text-white" />,
  mk2: <Mk2Icon className="w-6 text-white" />,
} as const

export type Provider = keyof typeof providers

// export const MoviePopupShow = ({ show }: { show: ShowAggregated }) => {
//   const searchParams = useSearchParams()
//   const showId = searchParams.get("id")

//   if (!showId) return null

//   const releaseDate = new Date(show?.date || "")
//   const releaseDateString = releaseDate.toLocaleDateString("fr-FR", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "2-digit",
//   })
//   const releaseTimeString = releaseDate.toLocaleTimeString("fr-FR", {
//     hour: "2-digit",
//     minute: "2-digit",
//   })

//   return (
//     <div
//       key={show.id}
//       className="bg-gray-background/50 flex-col xl:flex-row gap-2 xl:flex-nowrap justify-between items-start border border-gray-200 p-4 rounded-2xl flex flex-wrap lg:flex-nowrap mb-4 lg:items-center"
//     >
//       <div className="flex flex-nowrap gap-2">
//         {providers[show.cinemas.source as Provider]} {show.cinemas.name}
//         <span>
//           ({show?.cinemas.arrondissement || ""}
//           <sup>e</sup>)
//         </span>
//       </div>
//       <div className="lg:contents self-start space-x-4">
//         <span>{releaseDateString}</span>
//         <span>{releaseTimeString}</span>
//       </div>
//       <Link
//         href={show.linkShow || ""}
//         className="inline-flex gap-2 lg:ml-4 lg:size-8 px-2 p-1 rounded-md bg-gray-900 text-gray-background dark:bg-gray-white"
//       >
//         <span className="lg:hidden">Réserver un place</span>
//         <ArrowRightIcon className="size-6" />
//       </Link>
//     </div>
//   )
// }
