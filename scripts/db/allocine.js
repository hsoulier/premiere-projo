const SILENT = false

export const getAllocineInfo = async ({ title, release, directors = [] }) => {
  try {
    const yearRelease = new Date(`${release || ""}`).getFullYear()

    const query = new URLSearchParams({ title })

    const sluggedTitle = query.toString().split("=")[1]

    const res = await fetch(
      `https://allocine.fr/_/autocomplete/mobile/movie/${sluggedTitle}`
    )

    const json = await res.json()

    const results = json?.results

    if (!results?.length) {
      !SILENT && console.error(`❌ [ALLOCINE] No results for ${title}`)
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
      ({ last_release }) => new Date(last_release).getFullYear() === yearRelease
    )

    const fromSameDirector = results?.filter(({ data }) => {
      const directorsLowered = directors?.map((a) => a.toLowerCase())
      const directorsFromMovie = data?.director_name?.map((a) =>
        a.toLowerCase()
      )

      return directorsFromMovie?.some((director) =>
        directorsLowered?.includes(director)
      )
    })

    const restResults = [fromSameDirector, fromSameYear].filter(Boolean)

    const flattenedResults = [...restResults?.flat()]

    const commonItems = fromSameDirector.filter((item) =>
      fromSameYear.some((i) => i?.entity_id === item?.entity_id)
    )

    const mapMatches = new Map(
      flattenedResults.map((movie) => [movie?.entity_id, movie])
    )

    if (commonItems.length === 1) {
      const movie = commonItems[0]

      return {
        id: movie?.entity_id,
        title: movie.label,
        duration: "0",
        synopsis: "",
        director: movie.data.director_name[0] || "",
        release: movie.last_release,
        imdbId: movie?.entity_id,
        poster: movie.data.poster_path
          ? `https://fr.web.img5.acsta.net${movie.data.poster_path}`
          : null,
      }
    }

    if (mapMatches.size > 1) {
      !SILENT &&
        console.log(
          "⚠️ [ALLOCINE] Multiple results for",
          title,
          results.map((movie) => movie.entity_id)
        )
    }

    if (mapMatches.size === 1) {
      !SILENT &&
        console.log("✅ [ALLOCINE] All movies have entity_id", sluggedTitle)
    }

    if (mapMatches.size === 0) {
      !SILENT && console.error(`❌ [ALLOCINE] No results for ${title}`)
      return
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
    !SILENT && console.error(`❌ [ALLOCINE] ${title}`)
    !SILENT && console.error(error)
  }
}
