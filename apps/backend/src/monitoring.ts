import { collectDefaultMetrics, Registry } from "prom-client";

// In test context, mock prom-client

const registry = new Registry();
collectDefaultMetrics({ register: registry });

export { registry };
