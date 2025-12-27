resource "google_cloud_run_service" "backend" {
  name     = "openai-saas-backend"
  location = var.gcp_region
  project  = var.gcp_project

  template {
    spec {
      containers {
        image = var.backend_image
        env = [
          {
            name  = "DATABASE_URL"
            value = "postgresql://${var.db_user}:${var.db_password}@${google_sql_database_instance.main.public_ip_address}:5432/${var.db_name}?sslmode=disable"
          },
          {
            name  = "NODE_ENV"
            value = "production"
          }
        ]
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

variable "backend_image" {
  description = "Container image for backend (e.g. gcr.io/project/image:tag)"
  type        = string
}

output "backend_url" {
  value = google_cloud_run_service.backend.status[0].url
}
