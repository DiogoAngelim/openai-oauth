type SentryType = {
  init: (...args: any[]) => void;
  captureException: (...args: any[]) => void;
  captureMessage: (...args: any[]) => void;
  withScope: (fn: (() => void) | undefined) => void;
};


import * as SentryNodeImport from '@sentry/node';

let Sentry: SentryType;
if (process.env.NODE_ENV === 'test') {
  Sentry = {
    init: () => { },
    captureException: () => { },
    captureMessage: () => { },
    withScope: (fn?: () => void) => {
      if (fn != null) fn();
    },
  };
} else {
  const SentryNode = (SentryNodeImport as any).default || SentryNodeImport;
  SentryNode.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.2,
  });
  Sentry = SentryNode;
}

export default Sentry;
