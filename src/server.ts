import fastifyCors from "@fastify/cors";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import Fastify from "fastify";
import "dotenv/config";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

export const buildFastify = () => {
	const fastify = Fastify({
		logger: true,
	}).withTypeProvider<TypeBoxTypeProvider>();

	// Register plugins
	fastify.register(fastifyCors, {
		origin: ["http://localhost:5175"],
		credentials: true,
	});

	// Declare a route
	fastify.get("/", (request, reply) => {
		reply.send({ hello: "world" });
	});

	fastify.post(
		"/message",
		{
			schema: {
				body: Type.Object({
					message: Type.String(),
				}),
			},
		},
		async (request, reply) => {
			const model = new ChatOpenAI({
				modelName: "gryphe/mythomax-l2-13b:free",
				configuration: {
					baseURL: "https://openrouter.ai/api/v1",
				},
			});

			const aiMessage = await model.invoke([
				new HumanMessage(request.body.message),
			]);

			reply.send({ aiMessage });
		},
	);

	// Run the server!
	fastify.listen({ port: 3002 }, (err, address) => {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
	});

	return fastify;
};

buildFastify();
