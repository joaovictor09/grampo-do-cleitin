import { WebhookLog } from "@/features/webhooks/entities/webhook-log";
import { Client, WebhookBroker } from "@/features/webhooks/protocols/webhook-broker";
import { redis } from "@/infra/redis";

const CHANNEL_PREFIX = "webhook:";

export class RedisWebhookBroker implements WebhookBroker {
  private readonly subscriber = redis.duplicate();
  private readonly listeners = new Map<string, Set<Client>>();

  constructor() {
    this.subscriber.on("message", (channel, message) => {
      const id = channel.slice(CHANNEL_PREFIX.length);
      const payload = JSON.parse(message) as WebhookLog;

      this.listeners.get(id)?.forEach((fn) => fn(payload));
    });
  }

  publish(id: string, payload: WebhookLog): void {
    redis.publish(`${CHANNEL_PREFIX}${id}`, JSON.stringify(payload));
  }

  subscribe(id: string, fn: Client): () => void {
    const channel = `${CHANNEL_PREFIX}${id}`;

    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
      this.subscriber.subscribe(channel);
    }

    this.listeners.get(id)!.add(fn);

    return () => {
      const set = this.listeners.get(id);
      if (!set) return;

      set.delete(fn);

      if (set.size === 0) {
        this.listeners.delete(id);
        this.subscriber.unsubscribe(channel);
      }
    };
  }

  async close(): Promise<void> {
    await this.subscriber.quit();
  }
}

export const redisWebhookBroker = new RedisWebhookBroker();
