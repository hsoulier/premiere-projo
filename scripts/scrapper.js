import { sql } from "./utils.js"
import { scrapUGC } from "./providers/ugc.js"
import { scrapPathe } from "./providers/pathe2.js"
import { scrapMk2 } from "./providers/mk2.js"

const init = async () => {
  // console.group("🛠️ scrapping Pathé")
  // await scrapPathe()
  // console.groupEnd()

  console.group("🛠️ scrapping Mk2")
  await scrapMk2()
  console.groupEnd()

  // console.group("🛠️ scrapping UGC")
  // await scrapUGC()
  // console.groupEnd()

  await sql.end()
}

// const getCinemas = async () => {
//   await getMk2Theaters()
//   await getUGCTheaters()
//   await getPatheTheaters()

//   sql.end()
// }

init()
