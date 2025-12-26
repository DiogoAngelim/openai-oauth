
let Sentry: any;
if (process.env.NODE_ENV === 'test') {
  Sentry = {
    init: () => { },
    captureException: () => { },
    captureMessage: () => { },
    withScope: (fn: any) => fn && fn(),
  };
} else {
  Sentry = require('@sentry/node');
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.2,
  });
}

module.exports = Sentry;
