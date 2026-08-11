import { useState } from "react"
import { SearchBar } from "../../components/search-bar"
import { WebhookList } from "../../components/webhook-list"
import { WebhookDetail } from "../../components/webhook-detail"
import { Webhook } from "../../types/webhook"
import { useWebookById } from "./webhook-by-id.model"

type WebhookById = ReturnType<typeof useWebookById>

export function WebhookByIdPageView({ hookUrl, logs }: WebhookById) {
  const [selected, setSelected] = useState<Webhook | null>(null)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <SearchBar url={hookUrl}/>

      <div className="flex-1 min-h-0 flex">
        <div className="w-1/4 shrink-0 border-r h-full px-2 py-4">
          <WebhookList webhooks={logs} selected={selected} onSelect={setSelected} />
        </div>

        <WebhookDetail webhook={selected} />
      </div>
    </div>
  )
}