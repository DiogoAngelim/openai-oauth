variable "vpc_id" {
  description = "VPC ID for all resources."
  type        = string
}

variable "backend_cidr" {
  description = "CIDR block for backend ECS tasks."
  type        = string
}

variable "db_password" {
  description = "RDS Postgres password."
  type        = string
  sensitive   = true
}

variable "redis_subnet_ids" {
  description = "Subnet IDs for Redis."
  type        = list(string)
}

# Google Cloud variables for backend and database integration
variable "gcp_project" {
  description = "The Google Cloud project ID."
  type        = string
}

variable "gcp_region" {
  description = "The Google Cloud region."
  type        = string
  default     = "us-central1"
}

variable "db_instance_name" {
  description = "Cloud SQL instance name."
  type        = string
  default     = "openai-saas-db"
}

variable "db_user" {
  description = "Database user."
  type        = string
  default     = "postgres"
}



variable "db_name" {
  description = "Database name."
  type        = string
  default     = "openai_saas"
}
