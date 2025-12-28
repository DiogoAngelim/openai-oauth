terraform {
  required_providers {
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0.0"
    }
  }
}
resource "random_password" "db" {
  length  = 24
  special = true
}

output "db_password" {
  value     = random_password.db.result
  sensitive = true
}
