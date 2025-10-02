import { parseHTML } from "linkedom"

const metadataMovie = async (id) => {
  const page = await fetch(`https://www.imdb.com/fr/title/${id}/`, {
    method: "GET",
  })

  const pageHtml = await page.text()
  const { document } = parseHTML(pageHtml)

  const data = document.getElementById("__NEXT_DATA__").textContent

  const json = JSON.parse(data)

  const movie = json.props.pageProps

  return {
    imdbId: movie?.titleId || "",
    poster: movie.aboveTheFoldData?.primaryImage.url || "",
    director:
      movie.aboveTheFoldData.directorsPageTitle[0].credits[0].name.nameText
        .text,
  }
}

export const getImDbInfo = async (title, runtime) => {
  try {
    const query = new URLSearchParams()

    query.set("q", title)
    query.set(
      "release_date",
      `${new Date().getFullYear()}-01-01,${new Date().getFullYear() + 1}-12-31`
    )
    runtime && query.set("runtime", `${runtime - 5},${runtime + 5}`)

    const res = await fetch(
      `https://www.imdb.com/search/title/?${query.toString()}`,
      { method: "GET" }
    )

    const html = await res.text()
    const { document } = parseHTML(html)

    const data = document.getElementById("__NEXT_DATA__").textContent

    const json = JSON.parse(data)

    const movies =
      json.props.pageProps.searchResults.titleResults.titleListItems

    if (!movies.length) return

    const movie = movies[0]

    const id = movie?.titleId

    const res2 = await metadataMovie(id)

    return res2
  } catch (error) {
    console.error(`❌ [IMDB] ${error} ${title}`)
  }
}
