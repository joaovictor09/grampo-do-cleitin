import { CreateWebhookLogDTO } from "@/features/webhooks/dtos/create-webhook-log-dto";
import { WebhookLog } from "@/features/webhooks/entities/webhook-log";
import { WebhookLogRepository } from "@/features/webhooks/repositories/webhooks-log-repository";
import { db } from "@/infra/drizzle";
import { webhookLogsTable } from "@/infra/drizzle/schema";
import { and, asc, eq, gt } from "drizzle-orm";

export class DrizzleWebhooksLogsRepository implements WebhookLogRepository {
  async fetchAll(): Promise<WebhookLog[]> {
    const logs = await db.select().from(webhookLogsTable)

    return logs.map((log) => ({
      ...log,
      receivedAt: log.receivedAt.toISOString(),
    }))
  }

  async save(webhook: CreateWebhookLogDTO): Promise<WebhookLog> {
    const { body, headers, method, query, receivedAt, webhookId } = webhook
    
    const [webhookLog] = await db
      .insert(webhookLogsTable)
      .values({
        body,
        headers,
        method,
        receivedAt: new Date(receivedAt),
        webhookId,
        query
      })
      .returning()

      return {
        ...webhookLog,
        receivedAt: webhookLog.receivedAt.toISOString(),
      }
  }

  async fetchAfter(webhookLogId: string): Promise<WebhookLog[]> {
    const [actualWebhookLog] = await db
      .select()
      .from(webhookLogsTable)
      .where(eq(webhookLogsTable.id, webhookLogId))

    if (!actualWebhookLog) {
      return []
    }

    const webhookLogs = await db
      .select()
      .from(webhookLogsTable)
      .where(
        and(
          eq(webhookLogsTable.webhookId, actualWebhookLog.webhookId),
          gt(webhookLogsTable.receivedAt, actualWebhookLog.receivedAt)
        )
      )
      .orderBy(asc(webhookLogsTable.receivedAt))

    return webhookLogs.map(log => ({
      ...log,
      receivedAt: log.receivedAt.toISOString()
    }))
  }

}