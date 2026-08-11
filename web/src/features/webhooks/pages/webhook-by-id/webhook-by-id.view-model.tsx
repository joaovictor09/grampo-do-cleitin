import { makeSSEClientFactory } from "#/main/factories/http/browser-sse-client-factory"
import { useWebookById } from "./webhook-by-id.model"
import { WebhookByIdPageView } from "./webhook-by-id.view"

interface WebhookByIdViewModel {
  webhookId: string
}

export function WebhookByIdViewModel({ webhookId }: WebhookByIdViewModel) {
  const sseClient = makeSSEClientFactory()
  const { ...methods } = useWebookById({ webhookId, sseClient })
  
  return <WebhookByIdPageView {...methods} />
}