const { execSync } = require('child_process');

module.exports = async () => {
  // Run prisma generate before any tests
  execSync('npx prisma generate --schema=../../packages/prisma/schema.prisma', { stdio: 'inherit' });
};
