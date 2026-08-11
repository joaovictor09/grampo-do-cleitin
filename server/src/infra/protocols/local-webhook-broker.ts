import { WebhookLog } from "@/features/webhooks/entities/webhook-log";
import { Client, WebhookBroker } from "@/features/webhooks/protocols/webhook-broker";

const rooms = new Map<string, Set<Client>>();

export class LocalWebhookBroker implements WebhookBroker{
  subscribe(id: string, fn: Client): () => void {
    if (!rooms.has(id)) rooms.set(id, new Set());
    rooms.get(id)!.add(fn);

    return () => {
      const set = rooms.get(id);
      if (!set) return;
      set.delete(fn);
      if (set.size === 0) rooms.delete(id);
    };
  }

  publish(id: string, payload: WebhookLog): void {
    rooms.get(id)?.forEach((fn) => fn(payload));
  }
}