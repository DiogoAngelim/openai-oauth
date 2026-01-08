# TypeScript/Jest/Testing Library Type Conflict

## Problem
TypeScript type conflicts between `@types/jest` and `@testing-library/jest-dom` are a known ecosystem issue. Both packages attempt to extend the `Matchers` interface, resulting in errors like:

```
Interface 'Matchers<R, T>' cannot simultaneously extend types 'TestingLibraryMatchers<any, R>' and 'TestingLibraryMatchers<T, R>'.
```

## Workarounds
- There is currently **no reliable fix** for this issue with TypeScript 5.x, Jest 29.x, and jest-dom 5.x/6.x.
- Suppressing errors with `@ts-nocheck` or global overrides does **not** work for node_modules.
- Tests will still run and pass; only typecheck fails.
- You may ignore these errors during development and CI until upstream fixes are released.

## References
- [Testing Library Issue](https://github.com/testing-library/jest-dom/issues/533)
- [Jest Issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60924)

## Recommendation
- Keep `@types/jest@29.5.11` and `@testing-library/jest-dom@5.16.5`.
- Do **not** install `@types/testing-library__jest-dom`.
- Document this limitation for your team.
- Monitor upstream for a fix and update dependencies when available.
