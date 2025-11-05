import { Content } from "@/app/page.content"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getMoviesAggregated } from "@/lib/queries"
import { getQueryClient } from "@/lib/query-client"
import {
  dehydrate,
  HydrationBoundary,
  queryOptions,
} from "@tanstack/react-query"
import { cookies } from "next/headers"

type AwaitSearchParams = Promise<{
  [key: string]: string | string[] | undefined
}>

const Page = async ({ searchParams }: { searchParams: AwaitSearchParams }) => {
  const queryClient = getQueryClient()

  const cookieStore = await cookies()
  const awaitedSearchParams = await searchParams

  const supabase = useSupabaseServer(cookieStore)

  await queryClient.prefetchQuery(
    queryOptions({
      queryKey: [
        "shows",
        `cinemaId-${awaitedSearchParams.cinemaId}`,
        `source-${awaitedSearchParams.source}`,
        `avpType-${awaitedSearchParams.avpType}`,
        `lang-${awaitedSearchParams.lang}`,
        `q-${awaitedSearchParams.q}`,
        `date-${awaitedSearchParams.date}`,
      ],
      queryFn: async () =>
        await getMoviesAggregated(supabase, awaitedSearchParams),
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Content />
    </HydrationBoundary>
  )
}

export default Page
