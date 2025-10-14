import { setGlobalOptions, logger } from "firebase-functions"
import { onRequest } from "firebase-functions/https"
import { scraper } from "./scripts/scrapper.js"

setGlobalOptions({ region: "europe-west1" })

export const scrapPathe = onRequest(async (_, response) => {
  try {
    await scraper.scrapPathe()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Pathé:", error)
    response.status(500).send("Error while scrapping Pathé")
  }
})

export const scrapUGC = onRequest(async (_, response) => {
  try {
    await scraper.scrapUGC()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping UGC:", error)
    response.status(500).send("Error while scrapping UGC")
  }
})

export const scrapMK2 = onRequest(async (_, response) => {
  try {
    await scraper.scrapMk2()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Mk2:", error)
    response.status(500).send("Error while scrapping Mk2")
  }
})

export const scrapMK2Festival = onRequest(async (req, response) => {
  try {
    const url = req.body?.url

    if (!url) {
      response.status(400).send("Missing 'url' in request body")
      return
    }

    await scraper.scrapMk2Festival(url)

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Mk2:", error)
    response.status(500).send("Error while scrapping Mk2")
  }
})

export const scrapGrandRex = onRequest(async (_, response) => {
  try {
    await scraper.scrapGrandRex()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Le Grand Rex:", error)
    response.status(500).send("Error while scrapping Le Grand Rex")
  }
})

export const scrapLouxor = onRequest(async (_, response) => {
  try {
    await scraper.scrapLouxor()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Le Louxor:", error)
    response.status(500).send("Error while scrapping Le Louxor")
  }
})

export const scrapDulac = onRequest(async (_, response) => {
  try {
    await scraper.scrapDulac()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Dulac:", error)
    response.status(500).send("Error while scrapping Dulac")
  }
})

export const scrapStudio28 = onRequest(async (_, response) => {
  try {
    await scraper.scrapStudio28()

    await scraper.close()
    response.send("Hello from Firebase!")
  } catch (error) {
    await scraper.close()
    logger.error("❌ Error while scrapping Studio 28:", error)
    response.status(500).send("Error while scrapping Studio 28")
  }
})

export const scrapAllCinemas = onRequest(async (_, response) => {
  try {
    await scraper.scrapPathe()
    await scraper.scrapMk2()
    await scraper.scrapUGC()
    await scraper.scrapGrandRex()
    await scraper.scrapLouxor()
    await scraper.scrapDulac()
    await scraper.scrapStudio28()

    await scraper.close()

    response.send("Hello from Firebase!")
  } catch (error) {
    logger.error("❌ Error while scrapping all cinemas:", error)
    await scraper.close()
    response.status(500).send("Error while scrapping all cinemas")
  }
})
