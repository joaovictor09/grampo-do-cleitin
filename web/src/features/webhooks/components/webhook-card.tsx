import { cn } from "#/lib/utils";
import { Card, CardContent } from "#/components/ui/card";
import { METHOD_COLORS } from "#/features/utils/method-colors";
import { Webhook } from "../types/webhook";

interface WebhookCardProps {
  webhook: Webhook
  selected?: boolean
  onClick?: () => void
}

export function WebhookCard({ webhook, selected, onClick }: WebhookCardProps) {
  const { headers, method, receivedAt } = webhook
  const contentType = headers?.["content-type"] ?? headers?.["Content-Type"] ?? "—"
  const time = new Date(receivedAt).toLocaleTimeString("pt-BR", { hour12: false })

  return (
    <Card
      onClick={onClick}
      className={cn(
        "gap-1 py-3 cursor-pointer transition-colors hover:bg-accent/50",
        selected && "border-primary bg-accent/50"
      )}
    >
      <CardContent className="flex flex-col gap-1 px-4">
        <div className="flex items-center justify-between gap-2">
          <strong className={cn("text-xs font-semibold tracking-wide", METHOD_COLORS[method] ?? "text-foreground")}>
            {method}
          </strong>
          <span className="text-xs text-muted-foreground font-mono">{time}</span>
        </div>
        <span className="text-xs text-muted-foreground truncate">{contentType}</span>
      </CardContent>
    </Card>
  )
}