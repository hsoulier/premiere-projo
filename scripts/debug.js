import { parseHTML } from "linkedom"
import { listShows, deleteShow } from "./db/requests.js"
import { sql } from "./utils.js"

const init = async () => {
  try {
    const shows = await listShows()

    const today = new Date()

    const bugged = []

    for (const show of shows) {
      if (new Date(show.date) <= today) continue

      const [_, time] = new Date(show.date || "")
        .toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
        .split(" ")

      if (show.cinemaId.startsWith("ugc")) {
        const res = await fetch(show.linkShow)

        const data = await res.text()

        const { document } = parseHTML(data)

        const hourBase = document
          .querySelector(".showing-time")
          .textContent.trim()

        const hour =
          hourBase.split("H")[0] +
          ":" +
          hourBase.split("H")[1].substring(0, 2).padEnd(2, "0") +
          ":00"

        hour !== time && bugged.push(show.id)

        console.log(show.linkShow, hour, time, hour !== time ? "❌" : "✅")
      }

      if (show.cinemaId.startsWith("mk2")) {
        const sq = new URLSearchParams(show.linkShow.split("?")[1])

        const res = await fetch(
          `https://prod-paris.api.mk2.com/sessions/${sq.get(
            "cinemaId"
          )}/${sq.get("sessionId")}`
        )

        const data = await res.json()

        const { showTime } = data

        const hour = new Date(showTime)
          .toLocaleString("fr-FR", { timeZone: "Europe/Paris" })
          .split(" ")[1]

        hour !== time && bugged.push(show.id)

        console.log(show.linkShow, hour, time, hour !== time ? "❌" : "✅")
      }

      // if (show.cinemaId.startsWith("pathe")) {
      //   const [_, __, ___, id] = show.linkShow.split("/")

      //   const cinemaId = id.split("S")[0].substring(1)
      //   const showId = id.split("S")[1].substring(1)

      //   const res = await fetch(
      //     `https://s.pathe.fr/api/fr-FR/order/${cinemaId}/${showId}/booking`
      //   )

      //   const data = await res.json()

      //   const hour = data?.bookingInfo?.showings?.[0]?.projectionStartdate

      //   console.log(show.movieId, "pathe", hour, time)
      // }
    }

    console.log("Bugged shows:", bugged)

    for (const id of bugged) {
      await deleteShow(id)
    }

    sql.end()
  } catch (error) {
    console.error(error)
    sql.end()
  }
}

init()
