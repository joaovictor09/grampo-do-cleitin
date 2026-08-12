import { SubscribeToWebhook } from "@/features/webhooks/use-cases/subscribe-to-webhook";
import { makeWebhookBroker } from "../http/webhook-broker-factory";
import { makeWebhooksRepository } from "../repositories/webhooks-repository-factory";

export const makeSubscribeToWebhook = () => new SubscribeToWebhook(makeWebhookBroker(), makeWebhooksRepository())