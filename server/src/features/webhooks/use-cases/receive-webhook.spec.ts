import { LocalWebhookBroker } from "@/infra/protocols/local-webhook-broker";
import { InMemoryWebhookLogsRepository } from "@/infra/repositories/in-memory/webhooks-logs/in-memory-webhooks-logs-repository";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CreateWebhookLogDTO } from "../dtos/create-webhook-log-dto";
import { ReceiveWebhookUseCase } from "./receive-webhook";

function makeWebhook(overrides: Partial<CreateWebhookLogDTO> = {}): CreateWebhookLogDTO {
  return {
    webhookId: "webhook-01",
    method: "POST",
    headers: {},
    query: {},
    body: { foo: "bar" },
    receivedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("ReceiveWebhookUseCase", () => {
  let webhooksRepository: InMemoryWebhookLogsRepository;
  let webhookBroker: LocalWebhookBroker;
  let sut: ReceiveWebhookUseCase;

  beforeEach(() => {
    webhooksRepository = new InMemoryWebhookLogsRepository();
    webhookBroker = new LocalWebhookBroker();
    sut = new ReceiveWebhookUseCase(webhooksRepository, webhookBroker);
  });

  it("should save the webhook log", async () => {
    const { webhookLog } = await sut.execute({ webhook: makeWebhook() });

    expect(webhookLog.id).toEqual(expect.any(String));
    expect(webhookLog.webhookId).toBe("webhook-01");
  });

  it("should publish the saved log to the broker under the webhook id", async () => {
    const publishSpy = vi.spyOn(webhookBroker, "publish");

    const { webhookLog } = await sut.execute({ webhook: makeWebhook() });

    expect(publishSpy).toHaveBeenCalledWith("webhook-01", webhookLog);
  });
});
