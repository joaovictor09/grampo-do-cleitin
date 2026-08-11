import { WebhookLog } from "@/features/webhooks/entities/webhook-log"

export type Client = (payload: WebhookLog) => void

export interface WebhookBroker {
  publish: (id: string, payload: WebhookLog) => void
  subscribe: (id: string, fn: Client) => () => void
}
