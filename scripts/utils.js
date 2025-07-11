import "dotenv/config"
import postgres from "postgres"

const connectionString = process.env.DATABASE_URL

export const sql = postgres(connectionString)

export const frenchToISODateTime = (
  frenchDateTime,
  year = new Date().getFullYear()
) => {
  // Map French months to month numbers (0-based for JS Date)
  const months = {
    janvier: 0,
    fevrier: 1,
    mars: 2,
    avril: 3,
    mai: 4,
    juin: 5,
    juillet: 6,
    aout: 7,
    septembre: 8,
    octobre: 9,
    novembre: 10,
    decembre: 11,
  }
  // Regex to extract day, month, hour, minute
  const regex = /(\d{1,2})\s+([a-z]+)\s+a\s+(\d{1,2})h(\d{2})?/i
  const match = frenchDateTime
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .match(regex)

  console.log(
    "French date-time:",
    frenchDateTime.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    "Match:",
    match
  )
  if (!match) throw new Error("Invalid French date-time format")
  const day = parseInt(match[1], 10)
  const monthName = match[2].toLowerCase()
  const month = months[monthName]
  if (month === undefined) throw new Error("Unknown French month: " + monthName)
  const hour = parseInt(match[3], 10)
  const minute = match[4] ? parseInt(match[4], 10) : 0

  // Construct local date object
  const date = new Date(year, month, day, hour, minute)

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
