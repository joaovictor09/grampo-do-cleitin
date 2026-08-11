import { app } from "@/main/app";
import { env } from "@/env";
import { db } from "@/infra/drizzle";
import { redis } from "@/infra/redis";
import { redisWebhookBroker } from "@/infra/protocols/redis-webhook-broker";

app
	.listen({
		host: "0.0.0.0",
		port: env.PORT,
	})
	.then(() => {
		console.log("🚀 HTTP Server Running!");
	});

async function shutdown(signal: string) {
	console.log(`\n${signal} received, shutting down gracefully...`);

	try {
		await app.close();
		await redisWebhookBroker.close();
		await redis.quit();
		await db.$client.end();

		console.log("Shutdown complete.");
		process.exit(0);
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
