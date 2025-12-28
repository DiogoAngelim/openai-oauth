interface SentryType {
  init: () => void
  captureException: (...args: unknown[]) => void
  captureMessage: (...args: unknown[]) => void
  withScope: (fn: (() => void) | undefined) => void
}
let Sentry: SentryType | typeof import('@sentry/node')
if (process.env.NODE_ENV === 'test') {
  Sentry = {
    init: () => {},
    captureException: () => {},
    captureMessage: () => {},
    withScope: (fn?: () => void) => {
      if (fn != null) fn()
    }
  }
} else {
  Sentry = require('@sentry/node')
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.2
  })
}

module.exports = Sentry

export {}
