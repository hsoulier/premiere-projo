import { metadata } from "@/app/layout"
import useSupabaseServer from "@/hooks/use-supabase-server"
import { getShowAggregated } from "@/lib/queries"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = "force-static"

// request comes in, at most once every 30 minutes.
export const revalidate = 1_800

export const generateStaticParams = () => []

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params
  const supabase = useSupabaseServer(await cookies())

  const response = await getShowAggregated(supabase, id)

  const shows = Object.values(response.shows).reduce((acc, show) => {
    acc += show?.length || 0

    return acc
  }, 0)

  const title = `${response.movie?.title} | ${shows} avant-premières | PremiereProjo`

  return {
    ...metadata,
    title,
    description: response.movie?.synopsis || metadata.description,
    twitter: {
      ...metadata.twitter,
      title,
      description: response.movie?.synopsis || "",
      images: [response.movie?.poster || ""],
      card: "summary_large_image",
      creator: "@anthonyreungere",
    },
    openGraph: {
      ...metadata.openGraph,
      title: `${shows} avant-premières de ${response.movie?.title}` || "",
      description: response.movie?.synopsis || "",
      url: `https://premiereprojo.fr/films/${id}`,
      images: [
        {
          url: response.movie?.poster || "",
          width: 800,
          height: 600,
          alt: response.movie?.title || "",
        },
      ],
    },
  }
}

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  redirect("/films/" + id)
}

export default Page
