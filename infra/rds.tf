resource "aws_db_instance" "postgres" {
  allocated_storage    = 20
  engine              = "postgres"
  engine_version      = "15.4"
  instance_class      = "db.t3.micro"
  name                = "openai_saas"
  username            = "postgres"
  password            = var.db_password
  parameter_group_name = "default.postgres15"
  skip_final_snapshot = true
  publicly_accessible = false
  vpc_security_group_ids = [aws_security_group.db.id]
}

variable "db_password" {
  description = "The password for the RDS Postgres instance."
  type        = string
  sensitive   = true
}

resource "aws_security_group" "db" {
  name        = "openai-saas-db"
  description = "Allow backend to access RDS"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.backend_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

variable "vpc_id" {
  description = "VPC ID for RDS and backend."
  type        = string
}

variable "backend_cidr" {
  description = "CIDR block for backend ECS tasks."
  type        = string
}
