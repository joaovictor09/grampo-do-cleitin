import { Webhook } from "../types/webhook";
import { WebhookCard } from "./webhook-card";

interface WebhookListProps {
  webhooks: Webhook[]
  selected?: Webhook | null
  onSelect?: (webhook: Webhook) => void
}

export function WebhookList({ webhooks, selected, onSelect }: WebhookListProps) {
  return (
    <aside className="flex flex-col gap-4 h-full min-h-0">
      <div className="shrink-0 flex items-center justify-between text-sm">
        <span>Requisições</span>
        <span className="flex items-center gap-1 text-muted-foreground">
          <span className="size-2 rounded-full bg-green-500" />
          live
        </span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-auto">
        {webhooks.length === 0 && (
          <span className="text-sm text-muted-foreground">Nenhuma requisição recebida ainda</span>
        )}
        {webhooks.map((webhook, index) => (
          <WebhookCard
            key={index}
            webhook={webhook}
            selected={selected === webhook}
            onClick={() => onSelect?.(webhook)}
          />
        ))}
      </div>
    </aside>
  )
}