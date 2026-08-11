import { WebhookByIdPage } from '#/features/webhooks/pages/webhook-by-id'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$webhookId')({ component: RouteComponent })

function RouteComponent() {
  const { webhookId } = Route.useParams()
  return <WebhookByIdPage webhookId={webhookId} />
}