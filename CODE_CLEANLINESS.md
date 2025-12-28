# Codebase Cleanliness & Maintenance Guidelines

## Ongoing Recommendations

- **Review and resolve all TODO and FIXME comments regularly.**
  - Track open TODOs in issues or your project board.
- **Replace `any` types and `@ts-expect-error` with specific types as code matures.**
  - Especially after migrating to Drizzle ORM.
- **Remove or clarify legacy comments and inline notes as features are completed.**
- **Avoid using `var` and unnecessary `console.log` in production code.**
- **Run lint, typecheck, and tests before every commit and PR.**
- **Keep .env.example up to date with all required variables.**
- **Document all major architectural or refactor decisions in the repo (e.g., in a `docs/` folder or README).**

## How to Track and Address TODOs

- Use your issue tracker to create tasks for each TODO.
- Assign and prioritize them as part of your sprint or workflow.

## Example: Cleaning Up a TODO

```ts
// TODO: Integrate with Stripe or Paddle
```

- Create an issue: "Integrate billing with Stripe or Paddle."
- Assign, implement, and close the issue when done.

---

**Maintainer Tip:**
Regularly review your codebase for lingering TODOs and type workarounds. This keeps your project healthy and easy for new contributors to onboard.
