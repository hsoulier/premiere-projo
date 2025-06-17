import type { MetadataRoute } from "next"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL

export const sql = postgres(connectionString || "")

export const getRawMovies = async () => {
  const data = await sql`select * from movies where release > now()`

  return data
}

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const movies = await getRawMovies()

  const BASE_URL =
    process.env.NODE_ENV === "production"
      ? "https://premiereprojo.fr"
      : `http://localhost:${process.env.PORT || 3000}`

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...movies.map((movie) => ({
      url: `${BASE_URL}/films/${movie.id}`,
      lastModified: movie.scrapedAt ? new Date(movie.scrapedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    })),
  ]
}

export default sitemap
