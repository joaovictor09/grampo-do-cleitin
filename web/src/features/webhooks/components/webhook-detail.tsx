import { cn } from "#/lib/utils";
import { METHOD_COLORS } from "#/features/utils/method-colors";
import { Webhook } from "../types/webhook";
import { CopyButton } from "./copy-button";

interface WebhookDetailProps {
  webhook: Webhook | null
}

export function WebhookDetail({ webhook }: WebhookDetailProps) {
  if (!webhook) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center text-sm text-muted-foreground">
        Selecione uma requisição para ver os detalhes
      </div>
    )
  }

  const { method, headers, query, body, receivedAt } = webhook
  const date = new Date(receivedAt).toLocaleString("pt-BR", { hour12: false })

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-auto">
      <div className="shrink-0 flex items-center gap-3 border-b px-6 py-4">
        <strong className={cn("text-sm font-semibold tracking-wide", METHOD_COLORS[method] ?? "text-foreground")}>
          {method}
        </strong>
        <span className="text-xs text-muted-foreground font-mono">{date}</span>
      </div>

      <div className="flex flex-col gap-6 px-6 py-4">
        <DetailSection title="Headers" entries={Object.entries(headers ?? {})} />
        <DetailSection title="Query" entries={Object.entries(query ?? {})} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Body</h3>
            {!!body && <CopyButton value={JSON.stringify(body, null, 2)} />}
          </div>
          <pre className="text-xs bg-muted/40 border rounded-lg p-4 overflow-auto font-mono whitespace-pre-wrap break-all">
            {body ? JSON.stringify(body, null, 2) : "—"}
          </pre>
        </div>
      </div>
    </div>
  )
}

interface DetailSectionProps {
  title: string
  entries: [string, unknown][]
}

function DetailSection({ title, entries }: DetailSectionProps) {
  if (entries.length === 0) return null

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{title}</h3>
      <div className="flex flex-col rounded-lg border divide-y">
        {entries.map(([key, value]) => (
          <div key={key} className="group flex items-center gap-4 px-3 py-2 text-xs">
            <span className="text-muted-foreground font-mono shrink-0">{key}</span>
            <span className="font-mono truncate flex-1">{String(value)}</span>
            <CopyButton
              value={String(value)}
              className="opacity-0 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

