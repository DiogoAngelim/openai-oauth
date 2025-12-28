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
    if (
      typeof message === 'string' &&
      message.includes('ENOSPC')
    ) {
      // Do nothing, ENOSPC is expected in some CI environments
    }
    return false
  }
})()

const describeOrSkip = isDockerAvailable ? describe : describe.skip

describeOrSkip('CI/CD Docker Backend', () => {
  it('should build backend Docker image successfully', () => {
    const workspaceRoot = path.resolve(__dirname, '../../../')
    const dockerfilePath = 'apps/backend/Dockerfile'
    expect(() => {
      execSync(`docker build -f ${dockerfilePath} -t openai-saas-backend:latest ${workspaceRoot}`, { stdio: 'inherit', cwd: workspaceRoot })
    }).not.toThrow()
  })

  it('should have dist/main.js in the built image', () => {
    execSync('docker create --name test-backend openai-saas-backend:latest')
    const output = execSync('docker cp test-backend:/app/dist/main.js -')
    expect(output.length).toBeGreaterThan(0)
    execSync('docker rm test-backend')
  })

  it('should run the backend container and respond on a free port', () => {
    try {
      const containers = execSync("docker ps -q --filter 'publish=4000'").toString().trim().split('\n').filter((id: string) => !!id)
      containers.forEach((id: string) => {
        execSync(`docker rm -f ${id}`)
      })
    } catch (e) {
      // ignore errors
    }

    function getFreePort(start = 4000, end = 4100) {
      for (let port = start; port <= end; port++) {
        let isFree = true
        const server = net.createServer()
        server.on('error', () => { isFree = false })
        try {
          server.listen(port)
        } catch (e) {
          isFree = false
        }
        server.close()
        try {
          const lsof = execSync(`lsof -i :${port}`).toString().trim()
          if (typeof lsof === 'string' && lsof.length > 0) {
            isFree = false
          }
        } catch (e) {
          // ignore errors
        }
        if (isFree) return port
      }
      throw new Error('No free port found')
    }
    const freePort = getFreePort()
    const containerId = execSync(`docker run -d -p ${freePort}:4000 openai-saas-backend:latest`).toString().trim()
    execSync('sleep 15')
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${freePort}/health`)
    expect(response.toString().trim()).toBe('200')
    execSync(`docker stop ${containerId}`)
    execSync(`docker rm ${containerId}`)
  })

  it('should have a valid DATABASE_URL', (): void => {
    const { DATABASE_URL } = process.env
    expect(DATABASE_URL).toBeDefined()
    expect(DATABASE_URL).not.toBeNull()
    expect(typeof DATABASE_URL).toBe('string')
    expect(DATABASE_URL).not.toBe('')
  })

  it('should connect to the database', async function (): Promise<void> {
    const { DATABASE_URL } = process.env
    expect(typeof DATABASE_URL).toBe('string')
    expect(DATABASE_URL !== undefined && DATABASE_URL !== null && DATABASE_URL !== '').toBe(true)

    await testDatabaseConnection(DATABASE_URL as string)
  })
})
function testDatabaseConnection(arg0: string): Promise<void> {
  // TODO: Implement actual database connection logic here
  throw new Error('Function not implemented.')
}

