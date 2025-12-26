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
