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
