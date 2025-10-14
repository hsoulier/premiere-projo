import { logger } from "firebase-functions"
import postgres from "postgres"

const query = async () => {
  try {
    const sql = postgres(process.env.DATABASE_URL)
    const res = await sql`select * from cinemas`

    logger.log(res.length)

    await sql.end()
  } catch (error) {
    logger.log(error)
  }
}

query()
