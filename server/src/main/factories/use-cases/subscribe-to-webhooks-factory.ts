import { SubscribeToWebhook } from "@/features/webhooks/use-cases/subscribe-to-webhook";
import { makeWebhookBroker } from "../http/webhook-broker-factory";

export const makeSubscribeToWebhook = () => new SubscribeToWebhook(makeWebhookBroker())