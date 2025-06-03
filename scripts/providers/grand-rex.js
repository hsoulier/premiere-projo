import { parseHTML } from "linkedom"

const getMoviesPage = async () => {
  const options = { method: "GET", headers: { "Accept-Language": "fr-FR" } }
  const res = await fetch("https://www.legrandrex.com/cinema", options)
  const text = await res.text()

  const { document } = parseHTML(text)

  return document
}

const getMoviesFromEventPage = async () => {
  const doc = await getMoviesPage()

  const movies = [
    ...doc.querySelectorAll("#list-all > .row > div > .row"),
  ].filter((m) => {
    const isAVP =
      m.querySelector(".categorie-tout")?.textContent === "Avant-premieres"

    const isVIP = m
      .querySelector(".title-movie-tout")
      ?.textContent?.endsWith("VIP")

    return isAVP && !isVIP
  })

  return movies.map((m) => {
    const title = m
      .querySelector(".title-movie-tout")
      ?.textContent?.split("(AVP")[0]
      ?.split("(VIP")[0]
      .trim()

    const link = m.querySelector(".title-movie-tout a")?.href

    return { title, link }
  })
}

const getMovieInfos = async () => {
  const movies = await getMoviesFromEventPage()

  console.dir(movies, { depth: null })

  for (const m of movies) {
    const res = await fetch(m.link)
    const text = await res.text()

    const { document } = parseHTML(text)

    const pageTitle = document
      .querySelector(".title-movie-affiche")
      ?.textContent?.trim()

    const description = [...document.querySelectorAll(".infos-page li")].map(
      (d) => d.textContent?.trim()
    )

    console.table(description)

    continue

    const projections = description.findIndex((d) =>
      d.includes("détail des projections:")
    )

    console.log(projections, description[1].split("\n"))

    if (projections > -1) {
      const end = description.lastIndexOf((d) =>
        d.toLowerCase().startsWith("- le")
      )
      console.log(
        end,
        projections,
        description.slice(projections, end - projections)
      )
    } else {
      console.log("une seule projection", m.title)
    }

    // ? Reupere pas les horaires de la semaine courante ??
    // const rows = [...document.querySelectorAll("div.seances > div:not(.hide)")]

    // const index = rows.findIndex((r) => r.querySelector(".box-time-calendar"))

    // const description = document
    //   .querySelector(".box-time-calendar")
    //   ?.textContent?.trim()

    // console.log(
    //   index,
    //   rows?.length,
    //   // rows[index].textContent?.trim(),
    //   m.title,
    //   description,
    //   m.link
    // )
  }

  // return movies.map(async (m) => {
  //   const res = await fetch(m.link)
  //   const text = await res.text()

  //   const { document } = parseHTML(text)

  //   const times = [
  //     ...document.querySelectorAll(
  //       'a[href="#seances"][role=button] > div:not(.hide)'
  //     ),
  //   ]

  //   // ? Reupere pas les horaires de la semaine courante ??
  //   const rows = [...document.querySelectorAll("div.seances > div:not(.hide)")]

  //   const index = rows.findIndex((r) => r.querySelector(".box-time-calendar"))

  //   const description = document
  //     .querySelector(".box-time-calendar")
  //     ?.textContent?.trim()

  //   // console.log(m.title, description, times.length, m.link)

  //   console.log(
  //     index,
  //     rows?.length,
  //     times?.length,
  //     // rows[index].textContent?.trim(),
  //     times[index]?.textContent?.trim(),
  //     m.date
  //   )

  //   return {
  //     ...m,
  //     description,
  //   }
  // })
}

getMovieInfos()
