import "dotenv/config"

import { sql } from "./utils.js"
import { scrapUGC } from "./providers/ugc.js"
import { scrapPathe } from "./providers/pathe.js"
import { scrapMk2 } from "./providers/mk2.js"
import { scrapGrandRex } from "./providers/grand-rex.js"
import { scrapLouxor } from "./providers/louxor.js"
import { scrapDulac } from "./providers/dulac.js"
import { scrapStudio28 } from "./providers/studio-28.js"

export const scraper = {
  scrapUGC,
  scrapPathe,
  scrapMk2,
  scrapGrandRex,
  scrapLouxor,
  scrapDulac,
  scrapStudio28,
  close: async () => await sql.end(),
}
