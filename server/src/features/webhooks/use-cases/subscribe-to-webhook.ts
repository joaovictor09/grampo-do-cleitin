import { UseCase } from "@/core/protocols/use-case";
import { WebhookBroker } from "@/features/webhooks/protocols/webhook-broker";
import { WebhookLog } from "../entities/webhook-log";
import { WebhookLogRepository } from "../repositories/webhooks-log-repository";

interface OnEventParams {
  data: WebhookLog
  event?: string
  id?: string
}

interface SubscribeToWebhookRequest {
  id: string
  onEvent: (params: OnEventParams) => void
  lastEventId?: string
}
interface SubscribeToWebhookResponse {
  closeConnection: () => void
}

export class SubscribeToWebhook implements UseCase<SubscribeToWebhookRequest, SubscribeToWebhookResponse> {
  constructor(
    private readonly webhookBroker: WebhookBroker,
    private readonly webhookLogRepository: WebhookLogRepository
  ) {}

  async execute(request: SubscribeToWebhookRequest): Promise<SubscribeToWebhookResponse> {
    const { id, onEvent, lastEventId } = request
    let retrying = false
    const buffer = new Map<string, WebhookLog>()

    const off = this.webhookBroker.subscribe(id, (webhookLog) => {
      if (retrying) {
        buffer.set(webhookLog.id, webhookLog)
        return
      }
      
      this.send(webhookLog, onEvent)
    }) 

    if (lastEventId) {
      retrying = true
      
      const webhookLogs = await this.webhookLogRepository.fetchAfter(lastEventId)
      webhookLogs.forEach(webhookLog => buffer.set(webhookLog.id, webhookLog))

      const sortedBuffer = [...buffer.entries()]
        .sort((a, b) => a[1].receivedAt.localeCompare(b[1].receivedAt))
        .map(item => item[1])
      
      sortedBuffer.forEach((webhookLog) => this.send(webhookLog, onEvent))
      
      retrying = false
    }

    return {
      closeConnection: off
    }
  }

  private send(webhookLog: WebhookLog, handler: (params: OnEventParams) => void) {
    handler({
      data: webhookLog, 
      event: 'webhook', 
      id: webhookLog.id
    })
  } 
}