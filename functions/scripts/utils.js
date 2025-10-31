import fetch from "node-fetch"
import { HttpsProxyAgent } from "https-proxy-agent"
import postgres from "postgres"
import * as chrono from "chrono-node/fr"
import chromium from "@sparticuz/chromium"
import playwright from "playwright-core"

const connectionString = process.env.DATABASE_URL

export const sql = postgres(connectionString)

export const dashToISODateTime = (dateString, hours) => {
  const [year, month, day] = dateString.split("-").map(Number)
  const [hour, minute] = hours.split("h").map(Number)

  const date = new Date(year, month - 1, day, hour, minute)

  // Format date to ISO string with local timezone offset
  const pad = (n) => n.toString().padStart(2, "0")
  const offset = -date.getTimezoneOffset()
  const sign = offset >= 0 ? "+" : "-"
  const offsetHours = pad(Math.floor(Math.abs(offset) / 60))
  const offsetMinutes = pad(Math.abs(offset) % 60)

  const isoString =
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}` +
    `${sign}${offsetHours}:${offsetMinutes}`

  return isoString
}

export const parseToDate = (dateString) => {
  const options = process.env.CI
    ? { timezone: "UTC" }
    : { timezone: "Europe/Paris" }
  const result = chrono.parseDate(dateString, options)

  return result
}

export const initBrowser = async () => {
  const executablePath = await chromium.executablePath()
  return await playwright.chromium.launch({
    executablePath,
    args: chromium.args,
    headless: true,
    timeout: 5_000,
  })
}

/**
 *
 * @param {string} url
 * @param {RequestInit} url
 * @returns
 */
export const fetchUrl = async (url, init = {}) => {
  const proxyUrl = process.env.PROXY_URL || ""
  const agent = new HttpsProxyAgent(proxyUrl)

  return await fetch(url, {
    ...init,
    agent,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-GB,en;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Priority: "u=1, i",
      Referer: "https://www.pathe.fr/",
      "Sec-Ch-Ua":
        '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"macOS"',
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
      ...init.headers,
    },
  })
}
