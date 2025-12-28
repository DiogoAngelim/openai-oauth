import 'dotenv/config'
import express from 'express'

const app = express()
const port = process.env.PORT || 4000

app.get('/health', (_req, res) => res.send('OK'))

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
