terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0.0"
    }
  }
}


resource "aws_ecr_repository" "backend" {
  name = "openai-saas-backend"
}

