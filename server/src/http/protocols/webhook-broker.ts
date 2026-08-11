import { WebhookLog } from "@/features/webhooks/entities/webhook-log"
import { Client } from "@/infra/protocols/local-webhook-broker"

export interface WebhookBroker {
  publish: (id: string, payload: WebhookLog) => void
  subscribe: (id: string, fn: Client) => () => void
}