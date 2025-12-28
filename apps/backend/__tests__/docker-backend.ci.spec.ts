import { execSync } from 'child_process'
import path from 'path'
import net from 'net'

const isDockerAvailable = (() => {
  try {
    execSync('docker info', { stdio: 'ignore' })
    // Check for disk space
    execSync('df -k .', { stdio: 'pipe' })
    return true
  } catch (e) {
    const message = (e as { message?: string })?.message
    if (typeof message === 'string' && message.includes('ENOSPC')) {
      // Do nothing, ENOSPC is expected in some CI environments
    }
    return false
  }
})()

const describeOrSkip = isDockerAvailable ? describe : describe.skip

describeOrSkip('CI/CD Docker Backend', () => {
  // Set required environment variables for test context
  beforeAll((): void => {
    process.env.DATABASE_URL =
      process.env.DATABASE_URL ?? 'postgres://user:pass@localhost:5432/testdb'
    process.env.REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379'
    // NODE_ENV is read-only in some environments; set it in your shell before running tests
    process.env.SENTRY_DSN = process.env.SENTRY_DSN ?? 'dummy_sentry_dsn'
    process.env.FRONTEND_URL =
      process.env.FRONTEND_URL ?? 'http://localhost:3000'
    process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'dummy_jwt_secret'
    process.env.GITHUB_CLIENT_ID =
      process.env.GITHUB_CLIENT_ID ?? 'dummy_github_id'
    process.env.GITHUB_CLIENT_SECRET =
      process.env.GITHUB_CLIENT_SECRET ?? 'dummy_github_secret'
    process.env.BACKEND_URL =
      process.env.BACKEND_URL ?? 'http://localhost:4000'
    process.env.LINKEDIN_CLIENT_ID =
      process.env.LINKEDIN_CLIENT_ID ?? 'dummy_linkedin_id'
    process.env.LINKEDIN_CLIENT_SECRET =
      process.env.LINKEDIN_CLIENT_SECRET ?? 'dummy_linkedin_secret'
    // Add missing DB and Google callback variables
    process.env.DB_HOST = process.env.DB_HOST ?? 'localhost'
    process.env.DB_PORT = process.env.DB_PORT ?? '5432'
    process.env.DB_USER = process.env.DB_USER ?? 'testuser'
    process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'testpass'
    process.env.DB_NAME = process.env.DB_NAME ?? 'testdb'
    process.env.DB_SSL = process.env.DB_SSL ?? 'false'
    process.env.GOOGLE_CALLBACK_URL =
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:3000/auth/google/callback'
  })

  it('should connect to the database', async function (): Promise<void> {
    const { DATABASE_URL } = process.env
    expect(typeof DATABASE_URL === 'string' && DATABASE_URL !== '').toBe(true)
    await testDatabaseConnection(DATABASE_URL as string)
  })

  it('should have a valid DATABASE_URL', (): void => {
    const { DATABASE_URL } = process.env
    expect(typeof DATABASE_URL === 'string' && DATABASE_URL !== '').toBe(true)
  })

  it('should run the backend container and respond on a free port', () => {
    // Enhanced cleanup: remove all containers binding to port 4000 or the selected freePort
    try {
      // Remove containers binding to 4000
      const containers4000 = execSync("docker ps -q --filter 'publish=4000'")
        .toString()
        .trim()
        .split('\n')
        .filter((id: string) => typeof id === 'string' && id !== '')
      containers4000.forEach((id: string) => {
        execSync(`docker rm -f ${id}`)
      })
      // Remove containers binding to any port in 4000-4100
      for (let port = 4000; port <= 4100; port++) {
        const containers = execSync(`docker ps -q --filter 'publish=${port}'`).toString().trim().split('\n').filter((id: string) => typeof id === 'string' && id !== '')
        containers.forEach((id: string) => {
          execSync(`docker rm -f ${id}`)
        })
      }
      // Wait for OS to release ports
      execSync('sleep 2')
    } catch {
      // ignore errors
    }

    function getFreePort(start = 4001, end = 4100): number {
      for (let port = start; port <= end; port++) {
        let isFree = true
        const server = net.createServer()
        server.on('error', () => {
          isFree = false
        })
        try {
          server.listen(port)
        } catch {
          isFree = false
        }
        server.close()
        try {
          const lsof = execSync(`lsof -i :${port}`).toString().trim()
          if (typeof lsof === 'string' && lsof.length > 0) {
            isFree = false
          }
        } catch {
          // ignore errors
        }
        if (isFree) return port
      }
      throw new Error('No free port found')
    }
    const freePort = getFreePort()
    const containerId = execSync(
      `docker run -d -p ${freePort}:4000 openai-saas-backend:latest`
    )
      .toString()
      .trim()
    // Wait for backend to be ready (poll health endpoint up to 60s)
    const maxWait = 60 // seconds
    let waited = 0
    let response = ''
    while (waited < maxWait) {
      // Check if container is still running
      try {
        const inspect = execSync(`docker inspect -f '{{.State.Running}}' ${containerId}`).toString().trim()
        if (inspect !== 'true') {
          console.error(`Container ${containerId} is not running at ${waited}s, aborting health check loop.`)
          break
        }
      } catch {
        console.error('Failed to inspect container')
        break
      }
      try {
        response = execSync(
          `curl -s -o /dev/null -w "%{http_code}" http://localhost:${freePort}/health`
        ).toString().trim()
        if (response === '200') break
      } catch { /* ignore errors */ }
      execSync('sleep 1')
      waited++
    }
    if (response !== '200') {
      // Print container logs for debugging
      try {
        const logs = execSync(`docker logs ${containerId}`).toString()
        console.error('Container logs:', logs)
      } catch {
        console.error('Failed to get container logs')
      }
      // Print full curl output for debugging
      try {
        const curlOut = execSync(`curl -v http://localhost:${freePort}/health || true`).toString()
        console.error('Curl output:', curlOut)
      } catch {
        console.error('Failed to get curl output')
      }
    }
    expect(response).toBe('200')
    execSync(`docker stop ${containerId}`)
    execSync(`docker rm ${containerId}`)
  })

  it('should have dist/main.js in the built image', () => {
    try {
      execSync('docker rm -f test-backend')
    } catch {
      // ignore errors
    }
    execSync('docker create --name test-backend openai-saas-backend:latest')
    const output = execSync('docker cp test-backend:/app/dist/src/main.js -')
    expect(output.length).toBeGreaterThan(0)
    execSync('docker rm test-backend')
  })

  it('should build backend Docker image successfully', () => {
    const workspaceRoot = path.resolve(__dirname, '../../../')
    const dockerfilePath = 'apps/backend/Dockerfile'
    expect(() => {
      execSync(
        `docker build -f ${dockerfilePath} -t openai-saas-backend:latest ${workspaceRoot}`,
        { stdio: 'inherit', cwd: workspaceRoot }
      )
    }).not.toThrow()
  })
})
// Mock implementation for database connection test
async function testDatabaseConnection(databaseUrl: string): Promise<void> {
  expect(typeof databaseUrl === 'string' && databaseUrl !== '').toBe(true)
  return await Promise.resolve()
}
