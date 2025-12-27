output "database_url" {
  value = "postgresql://postgres:${random_password.db.result}@${aws_db_instance.postgres.address}:5432/openai_saas?schema=public"
  sensitive = true
}
