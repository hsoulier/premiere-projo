import { sql } from "./utils.js"
import { scrapUGC } from "./providers/ugc.js"
import { scrapPathe } from "./providers/pathe2.js"
import { scrapMk2 } from "./providers/mk2.js"
import { scrapGrandRex } from "./providers/grand-rex.js"

const init = async () => {
  console.group("🛠️ scraping Pathé")
  await scrapPathe()
  console.groupEnd()

  console.group("🛠️ scraping Mk2")
  await scrapMk2()
  console.groupEnd()

  console.group("🛠️ scraping UGC")
  await scrapUGC()
  console.groupEnd()

  console.group("🛠️ scraping Le Grand Rex")
  await scrapGrandRex()
  console.groupEnd()

  await sql.end()
}

// const getCinemas = async () => {
//   await getMk2Theaters()
//   await getUGCTheaters()
//   await getPatheTheaters()

//   sql.end()
// }

init()
