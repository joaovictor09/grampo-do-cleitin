import fastify, { type FastifyReply } from "fastify";
import { webhooksRoutes } from "@/http/controllers/webhooks/routes";
import fastifyCors from "@fastify/cors";
import { z, ZodError } from "zod";
import { env } from "@/env";

export const app = fastify();

app.register(webhooksRoutes);
app.register(fastifyCors, {
  origin: true
})

app.get("/", (_, res: FastifyReply) => {
	res.send("Hello World");
});

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validation error", issues: z.treeifyError(error) });
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
	}

	return reply.status(500).send({
		message: "Internal server error.",
	});
});
