import { LocalWebhookBroker } from "@/infra/protocols/local-webhook-broker";
import { InMemoryWebhookLogsRepository } from "@/infra/repositories/in-memory/webhooks-logs/in-memory-webhooks-logs-repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  let webhookBroker: LocalWebhookBroker;
  let webhookLogsRepository: InMemoryWebhookLogsRepository;
  let sut: SubscribeToWebhook;

  beforeEach(() => {
    webhookBroker = new LocalWebhookBroker();
    webhookLogsRepository = new InMemoryWebhookLogsRepository();
    sut = new SubscribeToWebhook(webhookBroker, webhookLogsRepository);
  });

  it("should notify the listener when the broker publishes to the subscribed id", async () => {
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
    const onEvent = vi.fn();

    await sut.execute({ id: "webhook-01", onEvent });

    webhookBroker.publish("webhook-02", makeWebhookLog({ webhookId: "webhook-02" }));

    expect(onEvent).not.toHaveBeenCalled();
  });

  it("should stop receiving events after closeConnection is called", async () => {
    const onEvent = vi.fn();

    const { closeConnection } = await sut.execute({ id: "webhook-03", onEvent });

    closeConnection();

    webhookBroker.publish("webhook-03", makeWebhookLog({ webhookId: "webhook-03" }));

    expect(onEvent).not.toHaveBeenCalled();
  });

  it("should not query the repository when no lastEventId is provided", async () => {
    const fetchAfterSpy = vi.spyOn(webhookLogsRepository, "fetchAfter");
    const onEvent = vi.fn();

    await sut.execute({ id: "webhook-01", onEvent });

    expect(fetchAfterSpy).not.toHaveBeenCalled();
    expect(onEvent).not.toHaveBeenCalled();
  });

  it("should replay logs missed since lastEventId before resuming live events", async () => {
    const onEvent = vi.fn();

    const missedLog = makeWebhookLog({
      id: "log-02",
      receivedAt: "2026-01-01T00:00:01.000Z",
    });
    const fetchAfterSpy = vi
      .spyOn(webhookLogsRepository, "fetchAfter")
      .mockResolvedValue([missedLog]);

    await sut.execute({ id: "webhook-01", onEvent, lastEventId: "log-01" });

    expect(fetchAfterSpy).toHaveBeenCalledWith("log-01");
    expect(onEvent).toHaveBeenCalledWith({
      data: missedLog,
      event: "webhook",
      id: missedLog.id,
    });
  });

  it("should buffer events published while the backlog is being fetched and send them in order after the replay", async () => {
    const onEvent = vi.fn();

    const missedLog = makeWebhookLog({
      id: "log-02",
      receivedAt: "2026-01-01T00:00:01.000Z",
    });
    const liveLogDuringReplay = makeWebhookLog({
      id: "log-03",
      receivedAt: "2026-01-01T00:00:02.000Z",
    });

    vi.spyOn(webhookLogsRepository, "fetchAfter").mockImplementation(async () => {
      // simulates a webhook arriving live while the backlog query is still in flight
      webhookBroker.publish("webhook-01", liveLogDuringReplay);
      return [missedLog];
    });

    await sut.execute({ id: "webhook-01", onEvent, lastEventId: "log-01" });

    expect(onEvent).toHaveBeenNthCalledWith(1, {
      data: missedLog,
      event: "webhook",
      id: missedLog.id,
    });
    expect(onEvent).toHaveBeenNthCalledWith(2, {
      data: liveLogDuringReplay,
      event: "webhook",
      id: liveLogDuringReplay.id,
    });
    expect(onEvent).toHaveBeenCalledTimes(2);
  });

  it("should not duplicate a log that is both published live and returned by the backlog query", async () => {
    const onEvent = vi.fn();
    const log = makeWebhookLog({ id: "log-02" });

    vi.spyOn(webhookLogsRepository, "fetchAfter").mockImplementation(async () => {
      webhookBroker.publish("webhook-01", log);
      return [log];
    });

    await sut.execute({ id: "webhook-01", onEvent, lastEventId: "log-01" });

    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent).toHaveBeenCalledWith({
      data: log,
      event: "webhook",
      id: log.id,
    });
  });

  it("should resume sending live events directly once the replay finishes", async () => {
    const onEvent = vi.fn();

    vi.spyOn(webhookLogsRepository, "fetchAfter").mockResolvedValue([]);

    await sut.execute({ id: "webhook-01", onEvent, lastEventId: "log-01" });

    const liveLog = makeWebhookLog({ id: "log-02" });
    webhookBroker.publish("webhook-01", liveLog);

    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent).toHaveBeenCalledWith({
      data: liveLog,
      event: "webhook",
      id: liveLog.id,
    });
  });
});
