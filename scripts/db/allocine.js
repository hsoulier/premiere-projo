const SILENT = false

export const getAllocineInfo = async ({
  title,
  release = null,
  directors = [],
}) => {
  try {
    const haveRelease = Boolean(release)
    const yearRelease = haveRelease
      ? new Date(release).getFullYear()
      : new Date().getFullYear()

    const query = new URLSearchParams({ title })

    const sluggedTitle = query.toString().split("=")[1]

    const res = await fetch(
      `https://allocine.fr/_/autocomplete/mobile/movie/${sluggedTitle}`
    )

    const json = await res.json()

    const results = json?.results

    if (!results?.length) {
      !SILENT && console.error(`❌ [ALLOCINE] No results for ${title}`)
      return { id: null }
    }

    if (results.length === 1) {
      !SILENT && console.log(`✅ [ALLOCINE] Only one result found for ${title}`)
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
        posterThumb: movie.data.poster_path
          ? `https://fr.web.img6.acsta.net/c_450_600${movie.data.poster_path}`
          : null,
      }
    }

    const fromSameYear = results?.filter(({ last_release }) => {
      const year = new Date(last_release).getFullYear()

      return haveRelease ? year === yearRelease : year > yearRelease - 5
    })

    const fromSameDirector = results?.filter(({ data }) => {
      const directorsLowered = directors?.map((a) => a.toLowerCase())
      const directorsFromMovie = data?.director_name?.map((a) =>
        a.toLowerCase()
      )

      return directorsFromMovie?.some((director) =>
        directorsLowered?.includes(director)
      )
    })

    const hasSameName = results?.filter(({ label }) => {
      return label === title || label.toLowerCase() === title.toLowerCase()
    })

    const restResults = [fromSameDirector, fromSameYear, hasSameName].filter(
      Boolean
    )

    const flattenedResults = [...restResults?.flat()]

    const commonItems = fromSameDirector.filter((item) =>
      fromSameYear.some((i) => i?.entity_id === item?.entity_id)
    )

    const rankedResultsByOccurrences = Object.values(
      flattenedResults.reduce((acc, movie) => {
        const key = movie?.entity_id

        if (!acc[key]) acc[key] = { ...movie, count: 0 }

        acc[key].count += 1
        return acc
      }, {})
    ).sort((a, b) => b.count - a.count)

    if (
      (rankedResultsByOccurrences?.[0]?.count || 0) >
      (rankedResultsByOccurrences?.[1]?.count || 0)
    ) {
      !SILENT &&
        console.log(
          `✅ [ALLOCINE] Best match for ${title} is ${rankedResultsByOccurrences[0].entity_id}`
        )

      const movie = rankedResultsByOccurrences[0]

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

    if (rankedResultsByOccurrences.length > 1) {
      !SILENT &&
        console.log(`⚠️ [ALLOCINE] Multiple matches found for ${title}`)
    }

    if (rankedResultsByOccurrences.length === 1) {
      !SILENT &&
        console.log("✅ [ALLOCINE] All movies have entity_id", sluggedTitle)
    }

    if (rankedResultsByOccurrences.length === 0) {
      !SILENT && console.error(`❌ [ALLOCINE] No results for ${title}`)
      return { id: null }
    }

    const movie = rankedResultsByOccurrences[0]

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
