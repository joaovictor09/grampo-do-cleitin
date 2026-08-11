import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeSubscribeToWebhook } from "@/main/factories/use-cases/subscribe-to-webhooks-factory";

export async function connectWebhookSSE(
	request: FastifyRequest,
	reply: FastifyReply,
) {
  reply.hijack()
  const subscribeToWebhookUseCase = makeSubscribeToWebhook()

  const paramsSchema = z.object({
    id: z.string()
  })

  const { id } = paramsSchema.parse(request.params)

  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
    'Access-Control-Allow-Origin': request.headers.origin ?? '*',
  })
  reply.raw.flushHeaders()

  const send = (data: unknown, event?: string, id?: string): void => {
    if (reply.raw.writableEnded) return
    if (id) reply.raw.write(`id: ${id}\n`)
    if (event) reply.raw.write(`event: ${event}\n`)
    reply.raw.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  send({ ok: true }, 'connected')

  const ping = setInterval(() => reply.raw.write(': ping\n\n'), 15_000)

  const { closeConnection } = await subscribeToWebhookUseCase.execute({
    id,
    onEvent: ({ data, event, id }) => send(data, event, id),
  })

  request.raw.on('close', () => {
    clearInterval(ping)
    closeConnection()
    reply.raw.end()
  })
}