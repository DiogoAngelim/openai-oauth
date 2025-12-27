resource "google_sql_database_instance" "main" {
  name             = var.db_instance_name
  database_version = "POSTGRES_15"
  region           = var.gcp_region
  project          = var.gcp_project

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = false
    }
  }
}

resource "google_sql_database" "default" {
  name     = var.db_name
  instance = google_sql_database_instance.main.name
  project  = var.gcp_project
}

resource "google_sql_user" "default" {
  name     = var.db_user
  instance = google_sql_database_instance.main.name
  password = var.db_password
  project  = var.gcp_project
}

output "database_url" {
  value = "postgresql://${var.db_user}:${var.db_password}@${google_sql_database_instance.main.public_ip_address}:5432/${var.db_name}?sslmode=disable"
  sensitive = true
}
