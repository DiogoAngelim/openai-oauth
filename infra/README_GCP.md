# Google Cloud Infrastructure Setup

## Prerequisites

- Set the following environment variables and GitHub secrets before running Terraform or CI/CD:
  - `GCP_PROJECT` (your GCP project ID, secret)
  - `GCP_REGION` (default: us-central1, secret)
  - `DB_INSTANCE_NAME` (default: openai-saas-db, secret)
  - `DB_USER` (default: postgres, secret)
  - `DB_PASSWORD` (your database password, secret)
  - `DB_NAME` (default: openai_saas, secret)
  - `BACKEND_IMAGE` (container image for backend, e.g. gcr.io/project/image:tag, secret)
  - `GCP_SA_KEY` (Google Cloud service account JSON key, secret)

## Deployment Steps

1. **Prepare Google Cloud:**
   - Create a GCP project.
   - Enable Cloud SQL, Cloud Run, and Artifact Registry APIs.
   - Create a service account with permissions for Cloud SQL, Cloud Run, Artifact Registry, and download its JSON key.

2. **Set Secrets in GitHub:**
   - In your GitHub repo, add these secrets:
     - GCP_PROJECT
     - GCP_REGION
     - DB_INSTANCE_NAME
     - DB_USER
     - DB_PASSWORD
     - DB_NAME
     - BACKEND_IMAGE (e.g., gcr.io/your-project/your-backend:latest)
     - GCP_SA_KEY (contents of the service account JSON key)

3. **Backend CI/CD (Cloud Run):**
   - Push to main branch.
   - GitHub Actions will:
     - Build and push the backend Docker image.
     - Run Terraform to provision Cloud SQL and Cloud Run.
     - Deploy the backend and output the Cloud Run URL.

4. **Frontend (Vercel):**
   - In Vercel dashboard, set:
     - NEXT_PUBLIC_API_URL = (Cloud Run backend URL from previous step)
   - Push frontend code to your repo (Vercel auto-deploys).

5. **Done!**
   - Frontend is live on Vercel, talking to backend on Cloud Run, which connects securely to Cloud SQL.

## Integration

- The backend will use the DATABASE_URL from Cloud SQL.
- The frontend (on Vercel) should set `NEXT_PUBLIC_API_URL` to the backend Cloud Run URL.

## GitHub Actions Secrets Required

- `GCP_PROJECT`
- `GCP_REGION`
- `DB_INSTANCE_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `BACKEND_IMAGE`
- `GCP_SA_KEY` (service account JSON key)
