

const DEFAULT_CITY = "paris"
const TAGS_AVP = [
  "avant-première",
  "avant-premiere-+-équipe",
  "AVP",
  "avp-equipe",
]
const previewsList: any[] = []
const CINEMAS = [
  "cinema-pathe-alesia",
  // "cinema-gaumont-aquaboulevard",
  // "cinema-les-7-batignolles",
  // "cinema-pathe-beaugrenelle",
  // "cinema-pathe-convention",
  // "cinema-pathe-la-villette",
  // "cinema-pathe-les-fauvettes",
  // "cinema-pathe-montparnos",
  // "cinema-pathe-opera-premier",
  // "cinema-pathe-parnasse",
  // "cinema-pathe-wepler",
]

const getCinemaShows = async (cinema: string) => {
  const resCinema = await fetch(
    `https://www.pathe.fr/api/cinema/${cinema}/shows?language=fr`
  )
  const dataCinema = await resCinema.json()

  console.log("dataCinema -------------------------")
  console.dir(dataCinema, { depth: null })
  console.log("------------------------------------")

  // const preFilterAVP = Object.entries(dataCinema.shows)
  //   .filter(([, value]) => value.isEarlyAVP)
  //   .map(([slug, value]) => ({
  //     title: slug.split("-").slice(0, -1).join(" "),
  //     cinema,
  //     slug,
  //     ...value,
  //   }))

  // const filteredAVP = preFilterAVP.map((show) => {
  //   const { days, ...rest } = show
  //   const obj = Object.entries(show.days).filter(([, infos]) =>
  //     TAGS_AVP.includes(
  //       infos?.flag?.toLowerCase()?.trim()?.replaceAll(" ", "-")
  //     )
  //   )
  //   return { days: obj.map(([date, infos]) => ({ date, ...infos })), ...rest }
  // })

  // const shows = filteredAVP
  //   .map((show) => {
  //     const { days, ...rest } = show
  //     return days.map((day) => ({
  //       ...day,
  //       ...rest,
  //       AVPType:
  //         day?.flag?.toLowerCase()?.trim()?.replaceAll(" ", "-") ===
  //         "avant-première"
  //           ? "AVP"
  //           : "AVPE",
  //       apiLinkInfos: `https://www.pathe.fr/api/show/${rest.slug}/showtimes/${cinema}/${day.date}?language=fr`,
  //       movieLink: `https://www.pathe.fr/films/${rest.slug}`,
  //     }))
  //   })
  //   .flat()

  // for (const show of shows) {
  //   const resShow = await fetch(show.apiLinkInfos)
  //   const dataShow = (await resShow.json())[0]

  //   const formattedShow = {
  //     name: show.title,
  //     showId: "",
  //     movieId: show.slug,
  //     cinemaName: cinema,
  //     dateShow: new Date(dataShow.time).toISOString(),
  //     linkMovie: show.movieLink,
  //     linkShow: dataShow.refCmd,
  //     version: dataShow.version,
  //     earlyType: show.AVPType,
  //     source: "pathe",
  //   }

  //   previewsList.push(formattedShow)
  // }
}

// async function getCinemaOfCity(city = DEFAULT_CITY) {
//   const res = await fetch("https://www.pathe.fr/api/cities?language=fr")
//   const data = await res.json()
//   const parisTheaters = data.find((c: any) => c.slug === city)?.cinemas
//   return parisTheaters
// }

const scrapPathe = async () => {
  console.log("🚀 Pathé scrapping started")
  console.log("------------------------------------")
  for (const cinema of CINEMAS) {
    console.log("🥷 Fetched cinema shows -> ", cinema)
    await getCinemaShows(cinema)
  }
  console.log("------------------------------------")
  console.log(
    "✅ Pathé scrapping done -> number of movies retrieved",
    previewsList.length
  )
}

scrapPathe()
