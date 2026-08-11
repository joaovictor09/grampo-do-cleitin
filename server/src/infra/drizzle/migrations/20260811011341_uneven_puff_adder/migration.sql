CREATE TABLE "webhook_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"webhook_id" varchar(255) NOT NULL,
	"method" varchar(10) NOT NULL,
	"headers" jsonb NOT NULL,
	"query" jsonb,
	"body" jsonb,
	"received_at" timestamp with time zone NOT NULL
);
