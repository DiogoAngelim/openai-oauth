const { execSync } = require('child_process');

describe('CI/CD Docker Backend', () => {
  it('should build backend Docker image successfully', () => {
    // Build Docker image from workspace root
    expect(() => {
      execSync('docker build -f apps/backend/Dockerfile -t openai-saas-backend:latest .', { stdio: 'inherit' });
    }).not.toThrow();
  });

  it('should have dist/main.js in the built image', () => {
    // Create a container and check for dist/main.js
    execSync('docker create --name test-backend openai-saas-backend:latest');
    const output = execSync('docker cp test-backend:/app/dist/main.js -');
    expect(output.length).toBeGreaterThan(0);
    execSync('docker rm test-backend');
  });

  it('should run the backend container and respond on port 4000', () => {
    // Run the container and check if it starts
    const containerId = execSync('docker run -d -p 4000:4000 openai-saas-backend:latest').toString().trim();
    // Wait a few seconds for the server to start
    execSync('sleep 15');
    // Check if the server responds (replace with actual health endpoint if available)
    let success = false;
    for (let port = 4000; port <= 4003; port++) {
      try {
        const response = execSync(`curl -s -o /dev/null -w "%{http_code}" http://localhost:${port}/health`);
        if (response.toString().trim() === '200') {
          success = true;
          break;
        }
      } catch (e) {}
    }
    expect(success).toBe(true);
    execSync(`docker stop ${containerId}`);
    execSync(`docker rm ${containerId}`);
  });
});
