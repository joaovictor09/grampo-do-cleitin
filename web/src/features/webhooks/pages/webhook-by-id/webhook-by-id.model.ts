import { useEffect, useState } from "react"
import { SSEClient } from "#/data/protocols/sse"
import { Webhook } from "../../types/webhook"

interface UseWebookByIdProps {
  webhookId: string
  sseClient: SSEClient
}

export function useWebookById({ webhookId, sseClient }: UseWebookByIdProps) {
  const [logs, setLogs] = useState<Webhook[]>([])
  const [hookUrl, setHookUrl] = useState('Carregando...')

  useEffect(() => {
    setHookUrl(`${window.location.origin}/hook/${webhookId}`)

    const { close } = sseClient.connect({
      listeners: [{
        event: 'webhook',
        listener: (e) => {
          setLogs((prev) => [JSON.parse(e.data) as Webhook, ...prev])
        }
      }],
      url: `http://localhost:8080/events/${webhookId}`,
      onError: (e) => console.log('sse erro', e.type, e),
      onOpen: () => console.log('sse aberto')
    })

    return () => close()
  }, [webhookId, hookUrl])

    return {
      hookUrl,
      logs
    }
}