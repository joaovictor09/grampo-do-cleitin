import { DrizzleWebhooksLogsRepository } from "@/infra/repositories/drizzle/webhooks-logs/drizzle-webhooks-logs-repository";

export const makeWebhooksRepository = () => new DrizzleWebhooksLogsRepository