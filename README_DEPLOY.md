# Automated Deployment Guide

## Backend (NestJS on AWS ECS/Fargate)

1. **Infrastructure**: Use Terraform in `infra/` to provision RDS, ECS, and Secrets Manager.
   - Copy `infra/secrets.auto.tfvars.example` to `infra/secrets.auto.tfvars` and fill in your values.
   - Run `terraform init && terraform apply` in `infra/`.
2. **Dockerize**: Ensure `apps/backend/Dockerfile` builds the app.
3. **CI/CD**: GitHub Actions workflow at `.github/workflows/backend-deploy.yml` will:
   - Build and push Docker image to ECR
   - Update ECS service
   - (Optionally) run DB migrations
4. **Secrets**: Store sensitive values in AWS Secrets Manager. Reference them in ECS task definition.

## Frontend (Next.js on Vercel)

1. **Connect repo**: Link your GitHub repo to Vercel and select `apps/frontend` as the project root.
2. **Environment Variables**: Set `NEXT_PUBLIC_API_URL` and any others in the Vercel dashboard.
3. **Deploy**: Vercel auto-deploys on push to main/PRs.
4. **Custom rewrites**: See `apps/frontend/vercel.json` for API proxying.

## Connectivity
- Expose backend via HTTPS (e.g., api.yourdomain.com)
- Set CORS in backend to allow only your Vercel domains
- Set `NEXT_PUBLIC_API_URL` in Vercel to your backend URL

## Best Practices
- Never commit secrets to git
- Use AWS Secrets Manager and Vercel’s env management
- Use ECS and Vercel rollback features

---

For more details, see the workflow and infra files. Contact maintainers for production secrets setup.
