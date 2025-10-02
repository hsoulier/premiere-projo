import postgres from "postgres"

const query = async () => {
  try {
    const sql = postgres(process.env.DATABASE_URL)
    const res = await sql`select * from cinemas`

    console.log(res.length)

    await sql.end()
  } catch (error) {
    console.log(error)
  }
}

query()
