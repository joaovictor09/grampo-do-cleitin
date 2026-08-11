import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const webhookLogsTable = pgTable("webhook_logs", {
  id: uuid().primaryKey().defaultRandom(),
  webhookId: varchar("webhook_id", { length: 255 }).notNull(),
  method: varchar({ length: 10 }).notNull(),
  headers: jsonb().$type<Record<string, unknown>>().notNull(),
  query: jsonb().$type<unknown>(),
  body: jsonb().$type<unknown>(),
  receivedAt: timestamp("received_at", { withTimezone: true }).notNull(),
});
