import { CreateWebhookLogDTO } from "../dtos/create-webhook-log-dto"
import { WebhookLog } from "../entities/webhook-log"

export interface WebhookLogRepository {
  save(webhook: CreateWebhookLogDTO): Promise<WebhookLog>
  fetchAll(): Promise<any>
  fetchAfter(webhookLogId: string): Promise<WebhookLog[]>
}