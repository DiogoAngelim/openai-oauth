terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0"
    }
  }
  required_version = ">= 1.3.0"
}

provider "google" {
  project = var.gcp_project
  region  = var.gcp_region
}
