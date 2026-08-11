export type Webhook = {
  method: string
  headers: Record<string, string>
  query: Record<string, unknown>
  body: unknown
  receivedAt: string
}