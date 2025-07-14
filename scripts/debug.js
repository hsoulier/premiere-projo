import { parseHTML } from "linkedom"
import {
  listShows,
  deleteShow,
  updateMovie,
  listMovies,
} from "./db/requests.js"
import { sql } from "./utils.js"

const init = async () => {
  try {
    const movies = await listMovies()

    const baseUrl = "https://fr.web.img6.acsta.net"
    // const baseUrl = "https://fr.web.img5.acsta.net"
    const newBaseUrl = "https://fr.web.img6.acsta.net/c_450_600"

    for (const movie of movies) {
      const poster = movie.poster

      if (!poster || !poster.startsWith(baseUrl)) {
        console.log(`⏭️ movie ${movie.id} with poster: ${poster}`)
        continue
      }

      const posterThumb = movie.poster.replace(baseUrl, newBaseUrl)

      await sql`
      update movies set ${sql({ posterThumb }, "posterThumb")}
      where id = ${movie.id}`
    }

    sql.end()
  } catch (error) {
    console.error(error)
    sql.end()
  }
}

init()
