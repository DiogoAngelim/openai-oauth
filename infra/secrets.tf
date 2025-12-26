resource "aws_secretsmanager_secret" "db_password" {
  name = "openai-saas-db-password"
}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}

resource "aws_secretsmanager_secret" "openai_api_key" {
  name = "openai-saas-openai-api-key"
}

resource "aws_secretsmanager_secret_version" "openai_api_key" {
  secret_id     = aws_secretsmanager_secret.openai_api_key.id
  secret_string = var.openai_api_key
}

variable "db_password" {
  description = "RDS Postgres password."
  type        = string
  sensitive   = true
}

variable "openai_api_key" {
  description = "OpenAI API key."
  type        = string
  sensitive   = true
}
