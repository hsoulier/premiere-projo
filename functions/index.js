import { setGlobalOptions, logger } from "firebase-functions"
import { onRequest, onCall, HttpsError } from "firebase-functions/https"
import { scraper } from "./scripts/scrapper.js"

setGlobalOptions({ region: "europe-west1" })

export const scrapPatheStreaming = onCall(
  { timeoutSeconds: 180, region: "europe-west1", cors: ["*"] },
  async (request, response) => {
    try {
      await scraper.scrapPathe(request, response)

      await scraper.close()

      return {
        message: "Pathé Scraping done",
        type: "SUCCESS",
        date: new Date().toLocaleTimeString(),
        id: `success-${Date.now() + Math.random()}`,
      }
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Pathé:", error)

      throw new HttpsError(500, "Error while scrapping Pathé")
    }
  }
)

export const scrapUGC = onRequest(
  { timeoutSeconds: 180 },
  async (_, response) => {
    try {
      await scraper.scrapUGC()

      await scraper.close()
      response.send("Hello from Firebase!")
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping UGC:", error)
      response.status(500).send("Error while scrapping UGC")
    }
  }
)

export const scrapMK2 = onRequest(
  { timeoutSeconds: 180 },
  async (_, response) => {
    try {
      await scraper.scrapMk2()

      await scraper.close()
      response.send("Hello from Firebase!")
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Mk2:", error)
      response.status(500).send("Error while scrapping Mk2")
    }
  }
)

export const scrapMK2Festival = onRequest(
  { timeoutSeconds: 180 },
  async (req, response) => {
    try {
      const url = req.body?.url

      if (!url) {
        response.status(400).send("Missing 'url' in request body")
        return
      }

      const a = await scraper.scrapMk2Festival(url)

      await scraper.close()
      response.json(a)
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Mk2:", error)
      response.status(500).send("Error while scrapping Mk2")
    }
  }
)

export const scrapGrandRex = onRequest(
  { timeoutSeconds: 180 },
  async (_, response) => {
    try {
      await scraper.scrapGrandRex()

      await scraper.close()
      response.send("Hello from Firebase!")
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Le Grand Rex:", error)
      response.status(500).send("Error while scrapping Le Grand Rex")
    }
  }
)

export const scrapLouxor = onRequest(
  { timeoutSeconds: 180 },
  async (_, response) => {
    try {
      await scraper.scrapLouxor()

      await scraper.close()
      response.send("Hello from Firebase!")
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Le Louxor:", error)
      response.status(500).send("Error while scrapping Le Louxor")
    }
  }
)

export const scrapDulac = onRequest(
  { timeoutSeconds: 180 },
  async (_, response) => {
    try {
      await scraper.scrapDulac()

      await scraper.close()
      response.send("Hello from Firebase!")
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Dulac:", error)
      response.status(500).send("Error while scrapping Dulac")
    }
  }
)

export const scrapStudio28 = onRequest(
  { timeoutSeconds: 180 },
  async (_, response) => {
    try {
      await scraper.scrapStudio28()

      await scraper.close()
      response.send("Hello from Firebase!")
    } catch (error) {
      await scraper.close()
      logger.error("❌ Error while scrapping Studio 28:", error)
      response.status(500).send("Error while scrapping Studio 28")
    }
  }
)

export const scrapAllCinemas = onRequest(
  { timeoutSeconds: 540 },
  async (_, response) => {
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
  }
)
