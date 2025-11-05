"use client"

import type { getMoviesAggregated } from "@/lib/queries"

export const TABLE_IDS = {
  CINEMAS: "17361",
  MOVIES: "17366",
  SHOWS: "17373",
}

export const PROJECT_ID = "ixrirhfbmbmmlsvhnccf"

export type Data = NonNullable<
  Awaited<ReturnType<typeof getMoviesAggregated>>
>[number] & { errors: number }
