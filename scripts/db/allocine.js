export const getAllocineInfo = async ({ title, release, directors }) => {
  try {
    const query = new URLSearchParams({ title })

    const sluggedTitle = query.toString().split("=")[1]

    const res = await fetch(
      `https://allocine.fr/_/autocomplete/mobile/movie/${sluggedTitle}`
    )

    const json = await res.json()

    const results = json?.results

    if (!results?.length) {
      console.error(`❌ [ALLOCINE] No results for ${title}`)
      return
    }

    if (results.length === 1) {
      const movie = results[0]

      return {
        id: movie.entity_id,
        title: movie.label,
        duration: "0",
        synopsis: "",
        director: movie.data.director_name[0] || "",
        release: movie.last_release,
        imdbId: movie.entity_id,
        poster: movie.data.poster_path
          ? `https://fr.web.img5.acsta.net${movie.data.poster_path}`
          : null,
      }
    }

    const fromSameYear = results?.filter(
      ({ last_release }) =>
        new Date(last_release).getFullYear() === new Date(release).getFullYear()
    )

    const fromSameDirector = results?.filter(({ data }) =>
      data?.director_name.includes(directors)
    )

    const restResults = [fromSameDirector, fromSameYear].filter(Boolean)

    const flattenedResults = [...restResults?.flat()]

    const mapMatches = new Map(
      flattenedResults.map((movie) => [movie.entity_id, movie])
    )

    if (mapMatches.size > 1) {
      console.log(
        "⚠️ [ALLOCINE] Multiple results for",
        title,
        results.map((movie) => movie.entity_id)
      )
    }
    if (mapMatches.size === 1) {
      console.log("✅ [ALLOCINE] All movies have entity_id", sluggedTitle)
    }

    const movie = mapMatches.get(flattenedResults[0].entity_id)

    return {
      id: movie.entity_id,
      title: movie.label,
      duration: "0",
      synopsis: "",
      director: movie.data.director_name[0] || "",
      release: movie.last_release,
      imdbId: movie.entity_id,
      poster: movie.data.poster_path
        ? `https://fr.web.img5.acsta.net${movie.data.poster_path}`
        : "",
    }
  } catch (error) {
    console.error(`❌ [ALLOCINE] ${error} ${title}`)
  }
}
