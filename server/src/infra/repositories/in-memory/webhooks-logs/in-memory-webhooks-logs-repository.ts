import { CreateWebhookLogDTO } from "@/features/webhooks/dtos/create-webhook-log-dto";
import { WebhookLog } from "@/features/webhooks/entities/webhook-log";
import { WebhookLogRepository } from "@/features/webhooks/repositories/webhooks-log-repository";
import { randomUUID } from "node:crypto";

export class InMemoryWebhookLogsRepository implements WebhookLogRepository {
  private itens: WebhookLog[] = [] 

  async save(data: CreateWebhookLogDTO): Promise<WebhookLog> {
    const id = randomUUID()
    
    const webhook = {
      id,
      ...data
    }
    
    this.itens.push(webhook)

    return webhook
  }

  async fetchAll(): Promise<WebhookLog[]> {
    return this.itens
  }

  async fetchAfter(webhookLogId: string): Promise<WebhookLog[]> {
    const actualWebhook = this.itens.find(log => log.id === webhookLogId)

    if (!actualWebhook) {
      return []
    }

    const webhookLogs = this.itens
      .filter(
        (log) => 
          log.webhookId === actualWebhook.webhookId &&
          log.receivedAt > actualWebhook.receivedAt
      )
      .sort((a, b) => a.receivedAt.localeCompare(b.receivedAt))

    return webhookLogs
  }

}