export interface WebhookLog {
  id: string
  webhookId: string
  method: string;
	headers: Record<string, unknown>;
	query: unknown;
	body: unknown;
	receivedAt: string;
}