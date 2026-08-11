import { LocalWebhookBroker } from "@/infra/protocols/local-webhook-broker";
import { describe, expect, it, vi } from "vitest";
import { WebhookLog } from "../entities/webhook-log";
import { SubscribeToWebhook } from "./subscribe-to-webhook";

function makeWebhookLog(overrides: Partial<WebhookLog> = {}): WebhookLog {
  return {
    id: "log-01",
    webhookId: "webhook-01",
    method: "POST",
    headers: {},
    query: {},
    body: {},
    receivedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("SubscribeToWebhook", () => {
  it("should notify the listener when the broker publishes to the subscribed id", async () => {
    const webhookBroker = new LocalWebhookBroker();
    const sut = new SubscribeToWebhook(webhookBroker);
    const onEvent = vi.fn();

    await sut.execute({ id: "webhook-01", onEvent });

    const webhookLog = makeWebhookLog();
    webhookBroker.publish("webhook-01", webhookLog);

    expect(onEvent).toHaveBeenCalledWith({
      data: webhookLog,
      event: "webhook",
      id: expect.any(String),
    });
  });

  it("should not notify listeners subscribed to a different id", async () => {
    const webhookBroker = new LocalWebhookBroker();
    const sut = new SubscribeToWebhook(webhookBroker);
    const onEvent = vi.fn();

    await sut.execute({ id: "webhook-01", onEvent });

    webhookBroker.publish("webhook-02", makeWebhookLog({ webhookId: "webhook-02" }));

    expect(onEvent).not.toHaveBeenCalled();
  });

  it("should stop receiving events after closeConnection is called", async () => {
    const webhookBroker = new LocalWebhookBroker();
    const sut = new SubscribeToWebhook(webhookBroker);
    const onEvent = vi.fn();

    const { closeConnection } = await sut.execute({ id: "webhook-03", onEvent });

    closeConnection();

    webhookBroker.publish("webhook-03", makeWebhookLog({ webhookId: "webhook-03" }));

    expect(onEvent).not.toHaveBeenCalled();
  });
});
