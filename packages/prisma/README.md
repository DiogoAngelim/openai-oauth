## Usage

- To generate the Prisma client:
  ```sh
  pnpm run prisma:generate --filter backend
  ```
- To run migrations:
  ```sh
  pnpm run migrate:deploy --filter backend
  ```
- To rollback migrations:
  ```sh
  pnpm run db:rollback --filter backend
  ```

See the main `README.md` for more details.