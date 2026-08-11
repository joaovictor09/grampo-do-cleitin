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

  fetchAll(): Promise<any> {
    throw new Error("Method not implemented.");
  }

}