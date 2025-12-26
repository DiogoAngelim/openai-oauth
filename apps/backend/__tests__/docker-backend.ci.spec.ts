const { execSync } = require('child_process');

describe('CI/CD Docker Backend', () => {
  it('should build backend Docker image successfully', () => {
    // Build Docker image from monorepo root with correct Dockerfile path
    const path = require('path');
    // Assume test is run from anywhere, so find monorepo root
    const workspaceRoot = path.resolve(__dirname, '../../../');
    const dockerfilePath = 'apps/backend/Dockerfile';
    expect(() => {
      execSync(`docker build -f ${dockerfilePath} -t openai-saas-backend:latest ${workspaceRoot}`, { stdio: 'inherit', cwd: workspaceRoot });
    }).not.toThrow();
  });

  it('should have dist/main.js in the built image', () => {
    // Create a container and check for dist/main.js
    execSync('docker create --name test-backend openai-saas-backend:latest');
    const output = execSync('docker cp test-backend:/app/dist/main.js -');
    expect(output.length).toBeGreaterThan(0);
    execSync('docker rm test-backend');
  });

  it('should run the backend container and respond on a free port', () => {
    // Clean up any containers using port 4000 before running
    try {
      const containers = execSync("docker ps -q --filter 'publish=4000'").toString().trim().split('\n').filter(Boolean);
      containers.forEach((id: string) => {
        execSync(`docker rm -f ${id}`);
      });
    } catch (e) {
      // Ignore errors if no containers found
    }

    // Improved free port finder
    const net = require('net');
    function getFreePort(start = 4000, end = 4100) {
      for (let port = start; port <= end; port++) {
        let isFree = true;
        const server = net.createServer();
        server.on('error', () => { isFree = false; });
        try {
          server.listen(port);
        } catch (e) {
          isFree = false;
        }
        server.close();
        // Double-check with lsof if port is in use
        try {
          const lsof = execSync(`lsof -i :${port}`).toString().trim();
          if (lsof.length > 0) isFree = false;
        } catch (e) {
          // lsof throws if port is free
        }
        if (isFree) return port;
      }
      throw new Error('No free port found');
    }
    const freePort = getFreePort();
    // Run the container and check if it starts
    const containerId = execSync(`docker run -d -p ${freePort}:4000 openai-saas-backend:latest`).toString().trim();
    // Wait a few seconds for the server to start
    execSync('sleep 15');
    // Check if the server responds (replace with actual health endpoint if available)
    const response = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${freePort}/health`);
    expect(response.toString().trim()).toBe('200');
    execSync(`docker stop ${containerId}`);
    execSync(`docker rm ${containerId}`);
  });
});
