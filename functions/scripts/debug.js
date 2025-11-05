import "dotenv/config"
import { sql } from "./utils.js"
import { scrapMk2Festival } from "./providers/mk2.js"

// const init = async () => {
//   try {
//     const movies = await listMovies()

//     const baseUrl = "https://fr.web.img6.acsta.net"
//     // const baseUrl = "https://fr.web.img5.acsta.net"
//     const newBaseUrl = "https://fr.web.img6.acsta.net/c_450_600"

//     for (const movie of movies) {
//       const poster = movie.poster

//       if (!poster || !poster.startsWith(baseUrl)) {
//         logger.log(`⏭️ movie ${movie.id} with poster: ${poster}`)
//         continue
//       }

//       const posterThumb = movie.poster.replace(baseUrl, newBaseUrl)

//       await sql`
//       update movies set ${sql({ posterThumb }, "posterThumb")}
//       where id = ${movie.id}`
//     }

//     sql.end()
//   } catch (error) {
//     logger.error(error)
//     sql.end()
//   }
// }

const init = async () => {
  await scrapMk2Festival(
    "https://www.mk2.com/ile-de-france/evenement/festival-cheries-cheris-2025"
  )

  await sql.end()
}
init()
