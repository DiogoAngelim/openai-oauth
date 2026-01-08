import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
// Allow CORS for frontend
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}))
const port = process.env.PORT ?? 3000

// Example: Read GCP and DB settings from environment variables
const gcpProject = process.env.GCP_PROJECT_NAME
const gcpRegion = process.env.GCP_REGION
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

app.get('/health', (_req, res) => res.send('OK'))

// Endpoint to check loaded environment variables (for debugging)
app.get('/env', (_req, res) => {
  res.json({
    gcpProject,
    gcpRegion,
    dbHost,
    dbUser,
    dbPassword:
      typeof dbPassword === 'string' && dbPassword !== '' ? '***' : undefined // Hide actual password
  })
})

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`)
})
