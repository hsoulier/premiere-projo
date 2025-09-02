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

// ex: "jeudi 04 sept. - 20h00"
export const parseFrenchDateString = (input) => {
  // Mapping French month abbreviations to month numbers (0-based for JS Date)
  const monthMap = {
    "janv.": 0,
    "févr.": 1,
    mars: 2,
    "avr.": 3,
    mai: 4,
    juin: 5,
    "juil.": 6,
    août: 7,
    "sept.": 8,
    "oct.": 9,
    "nov.": 10,
    "déc.": 11,
  }

  // Trim and extract with regex
  const regex = /(\w+)\s+(\d{2})\s+(\w+\.)\s+-\s+(\d{2})h(\d{2})/
  const [, , day, monthAbbr, hour, minute] = input.trim().match(regex) || []

  if (!monthAbbr || !(monthAbbr in monthMap)) return null

  const now = new Date()
  let year = now.getFullYear()
  // If this year's September is past, use next year
  if (
    monthMap[monthAbbr] < now.getMonth() ||
    (monthMap[monthAbbr] === now.getMonth() && parseInt(day) < now.getDate())
  ) {
    year += 1
  }

  const date = new Date(
    year,
    monthMap[monthAbbr],
    parseInt(day),
    parseInt(hour),
    parseInt(minute)
  )

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
