#!/bin/bash
# Script to update the DATABASE_URL secret in AWS Secrets Manager after Terraform apply
set -e

# Get the output from Terraform
cd "$(dirname "$0")/.."
DB_URL=$(terraform output -raw database_url)
SECRET_ARN=$(aws secretsmanager list-secrets --query "SecretList[?Name=='openai-saas-db-password'].ARN | [0]" --output text)

if [ -z "$SECRET_ARN" ]; then
  echo "Secret openai-saas-db-password not found!"
  exit 1
fi

aws secretsmanager put-secret-value --secret-id "$SECRET_ARN" --secret-string "$DB_URL"
echo "DATABASE_URL updated in AWS Secrets Manager."
