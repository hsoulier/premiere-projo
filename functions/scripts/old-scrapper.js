import { sql } from "./utils.js"
import { scrapUGC } from "./providers/ugc.js"
import { scrapPathe } from "./providers/pathe.js"
import { scrapMk2 } from "./providers/mk2.js"
import { scrapGrandRex } from "./providers/grand-rex.js"
import { scrapLouxor } from "./providers/louxor.js"

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

  console.group("🛠️ scraping Louxor")
  await scrapLouxor()
  console.groupEnd()

  // console.group("🛠️ scraping Dulac cinemas")
  // await scrapDulac()
  // console.groupEnd()

  // console.group("🛠️ scraping Studio 28")
  // await scrapStudio28()
  // console.groupEnd()

  await sql.end()
}

init()
