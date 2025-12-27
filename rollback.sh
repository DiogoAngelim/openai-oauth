#!/bin/bash
# Manual rollback script for backend and database
# Usage: ./rollback.sh <git-tag> [--db-rollback]
# Example: ./rollback.sh v1.2.3 --db-rollback

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <git-tag> [--db-rollback]"
  exit 1
fi

ROLLBACK_TAG="$1"
DB_ROLLBACK=false
if [ "$2" == "--db-rollback" ]; then
  DB_ROLLBACK=true
fi

echo "[INFO] Checking out backend at tag $ROLLBACK_TAG..."
git fetch --tags
git checkout "$ROLLBACK_TAG"

# Build and deploy backend (customize for your infra)
echo "[INFO] Building backend Docker image..."
docker build -f apps/backend/Dockerfile -t openai-saas-backend:$ROLLBACK_TAG .

echo "[INFO] Tagging and pushing to ECR (requires AWS CLI configured)..."
ECR_REGISTRY="<your-ecr-registry>"
docker tag openai-saas-backend:$ROLLBACK_TAG $ECR_REGISTRY/openai-saas-backend:$ROLLBACK_TAG
docker push $ECR_REGISTRY/openai-saas-backend:$ROLLBACK_TAG

echo "[INFO] Updating ECS service to use image $ROLLBACK_TAG..."
aws ecs update-service --cluster openai-saas-cluster --service openai-saas-backend --force-new-deployment --region <your-region>

if $DB_ROLLBACK; then
  echo "[INFO] Rolling back database migration..."
  bash packages/prisma/rollback.sh "$ROLLBACK_TAG"
fi

echo "[SUCCESS] Rollback to $ROLLBACK_TAG complete."
