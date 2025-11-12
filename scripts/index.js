import "dotenv/config"
import { sql } from "./utils.js"

const getAllCurrentScreenings = async () => {
  const res = await sql`SELECT * FROM shows WHERE shows.date >= now()`

  return res
}

const markScreeningAsFull = async (screeningId) => {
  // await sql`UPDATE shows SET isFull = true WHERE id = ${screeningId}`
}

const main = async () => {
  try {
    const screenings = await getAllCurrentScreenings()

    const screeningsToPutFull = []

    for (const screening of screenings) {
      const isPathe = screening.cinemaId.startsWith("pathe-")
      const isUgc = screening.cinemaId.startsWith("ugc-")
      const isMk2 = screening.cinemaId.startsWith("mk2-")

      if (isMk2) {
        const res = await fetch(screening.linkShow)

        if (!res.ok) {
          console.log(
            `Response ${res.status}: ${screening.linkShow} ${screening.id}`
          )
        } else {
          console.log(`Screening with id ${screening.id} is still available.`)
        }
      }

      continue

      if (isUgc) {
        const res = await fetch(screening.linkShow)

        if (!res.ok) {
          console.log(
            `Screening with id ${screening.id} is no longer available. Deleting...`
          )
        } else {
          const page = await res.text()

          if (
            page.includes("La séance est déjà complète.") &&
            !screening.isFull
          ) {
            console.log(`ℹ️ Screening with id ${screening.id} is full`)
            screeningsToPutFull.push(screening.id)
          }
        }
      }

      if (isPathe) {
        const res = await fetch(
          `https://www.pathe.fr/api/showtime/${screening.id}?language=fr`
        )

        if (!res.ok) {
          console.log(
            `Real problem fetching Pathe screening ${screening.id} ${res.statusText}`
          )
        }

        const data = await res.json()

        if (!data.bookable) {
          console.log(`ℹ️ Screening with id ${screening.id} is full`)
          screeningsToPutFull.push(screening.id)
        }
      }

      const res = await fetch(screening.linkShow)

      if (!res.ok) {
        console.log(
          `Screening with id ${screening.id} is no longer available. Deleting...`
        )

        console.log(`No response status: ${res.status}`)
        console.log(`Response status text: ${screening.linkShow}`)
      } else {
        console.log(`Screening with id ${screening.id} is still available.`)
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    await sql.end()
  }
}

main()
