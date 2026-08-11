import { FastifyReply, FastifyRequest } from "fastify";
import { z } from 'zod'
import { makeReceiveWebhookFactory } from "@/main/factories/use-cases/receive-webhook-factory";

export async function receiveWebhook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  
  const paramsSchema = z.object({
    id: z.string()
  })

  const { id } = paramsSchema.parse(request.params)
  
  const receiveWebhookUseCase = makeReceiveWebhookFactory()

  const { webhookLog } = await receiveWebhookUseCase.execute({
    webhook: {
      webhookId: id,
      method: request.method,
      headers: request.headers,
      query: request.query,
      body: request.body,
      receivedAt: new Date().toISOString(),
    }
  })

  return reply.code(200).send({ webhookLog })
}