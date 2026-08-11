import { ReceiveWebhookUseCase } from "@/features/webhooks/use-cases/receive-webhook";
import { makeWebhooksRepository } from "../repositories/webhooks-repository-factory";
import { makeWebhookBroker } from "../http/webhook-broker-factory";

export const makeReceiveWebhookFactory = () => new ReceiveWebhookUseCase(makeWebhooksRepository(), makeWebhookBroker())