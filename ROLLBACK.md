# Rollback & Versioning Instructions

This project supports automated and manual rollback/versioning for safe deployments.

## 1. One-Click Rollback (GitHub Actions)

- Go to the **Actions** tab in GitHub.
- Select **Rollback Backend to Previous Tag** workflow.
- Click **Run workflow** and enter the desired tag (e.g., `v1.2.3`).
- The workflow will checkout, build, and redeploy the backend at that tag.
- (Optional) For DB rollback, run the manual script below.

## 2. Manual Rollback (Shell Script)

- From the project root, run:
  ```sh
  ./rollback.sh <git-tag> [--db-rollback]
  # Example:
  ./rollback.sh v1.2.3 --db-rollback
  ```
- This will checkout the code, build, push, and redeploy the backend.
- If `--db-rollback` is provided, it will also run the DB rollback script.

## 3. Manual Database Migration Rollback

- To mark a migration as rolled back:

  ```sh

  ./rollback.sh <migration-name>
  # Example:
  ./rollback.sh 20251226033003_add_chat_message
  ```

- This marks the migration as rolled back in the database (no destructive down migration).

## 4. Notes

- Always verify the application and database after rollback.
- For destructive DB rollbacks, review and test migration scripts carefully.
- Container registry and deployment details may need to be customized for your cloud provider or environment.

---

For questions, see the scripts or contact the maintainers.
