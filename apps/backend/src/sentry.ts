import * as Sentry from '@sentry/node';

// In test context, mock @sentry/node

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.2,
});

export default Sentry;
