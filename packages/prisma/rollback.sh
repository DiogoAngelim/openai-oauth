#!/bin/bash
# Rollback Prisma database migration to a previous migration (manual)
# Usage: ./rollback.sh <migration-name>
# Example: ./rollback.sh 20251226033003_add_chat_message

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <migration-name>"
  exit 1
fi

MIGRATION_NAME="$1"

# This will mark the migration as rolled back in the database. Adjust as needed for your workflow.
npx prisma migrate resolve --applied "$MIGRATION_NAME" --rolled-back "$MIGRATION_NAME" --schema=packages/prisma/schema.prisma

echo "[SUCCESS] Migration $MIGRATION_NAME marked as rolled back."
