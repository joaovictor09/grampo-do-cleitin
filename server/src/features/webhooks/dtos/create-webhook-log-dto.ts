import { WebhookLog } from "../entities/webhook-log";

export type CreateWebhookLogDTO = Omit<WebhookLog, 'id'>