import type { FastifyInstance } from "fastify";
import { connectWebhookSSE } from "./connect-webhook-sse";
import { receiveWebhook } from "./receive-webhook";

export async function webhooksRoutes(app: FastifyInstance) {
	app.get("/events/:id", connectWebhookSSE);
	app.all("/hook/:id", receiveWebhook);
}