import { UseCase } from "@/core/protocols/use-case";
import { WebhookBroker } from "@/features/webhooks/protocols/webhook-broker";
import { WebhookLog } from "../entities/webhook-log";

interface OnEventParams {
  data: WebhookLog
  event?: string
  id?: string
}

interface SubscribeToWebhookRequest {
  id: string
  onEvent: (params: OnEventParams) => void
}
interface SubscribeToWebhookResponse {
  closeConnection: () => void
}

export class SubscribeToWebhook implements UseCase<SubscribeToWebhookRequest, SubscribeToWebhookResponse> {
  constructor(private readonly webhookBroker: WebhookBroker) {}

  async execute(request: SubscribeToWebhookRequest): Promise<SubscribeToWebhookResponse> {
    const { id, onEvent } = request
    
    const off = this.webhookBroker.subscribe(id, (webhookLog) =>
      onEvent({
        data: webhookLog, 
        event: 'webhook', 
        id: String(Date.now())
      }),
    )

    return {
      closeConnection: off
    }
  }
}