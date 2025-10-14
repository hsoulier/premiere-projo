import { logger } from "firebase-functions"
import { parseHTML } from "linkedom"
import { listMovies, updateMovie } from "./db/requests.js"
import { sql } from "./utils.js"

const init = async () => {
  const movies = await listMovies()

  for (const movie of movies) {
    const oneMonthAgo = new Date()

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

    if (movie.release && new Date(movie.release) < oneMonthAgo) {
      logger.log(`❌ ${movie.title} is already released`)
      continue
    }

    const query = new URLSearchParams({ title: movie.title.toLowerCase() })

    const sluggedTitle = query.toString().split("=")[1]

    const moviePage = await fetch(
      `https://www.allocine.fr/film/fichefilm_gen_cfilm=${movie.id}.html`
    )

    const html = await moviePage.text()

    const { document } = parseHTML(html)

    const synopsis = [
      ...document.querySelectorAll("#synopsis-details .content-txt .bo-p"),
    ]
      .map((a) => (a.textContent || "").trim())
      .filter((a) => a.length > 0)
    // .at(-1)

    logger.log(
      movie.title,
      `https://www.allocine.fr/film/fichefilm_gen_cfilm=${movie.id}.html`,
      synopsis
    )

    continue

    const res = await fetch(
      `https://allocine.fr/_/autocomplete/mobile/movie/${sluggedTitle}`
    )

    const json = await res.json()

    const results = json?.results

    const info = results.find(({ entity_id }) => movie.id === entity_id)

    if (!info) {
      logger.error(`❌ No results for ${movie.title}`)
      continue
    }

    const updatedData = {
      director: movie.director || "",
      poster: movie.poster || "",
    }

    if (info.data.poster_path) {
      updatedData.poster = `https://fr.web.img6.acsta.net${info.data.poster_path}`
    }

    if (info.data?.director_name?.[0]) {
      updatedData.director = info.data.director_name[0]
    }

    if (Object.keys(updatedData).length === 0) {
      logger.log(`❌ No updates for ${movie.title}`)
      continue
    }

    logger.log(`✅ Updating ${movie.title}`)

    await updateMovie(movie.id, updatedData)
  }

  await sql.end()
}

init()
