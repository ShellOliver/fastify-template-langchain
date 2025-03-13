import assert from "node:assert";
import { test } from "node:test";
import type { FastifyInstance } from "fastify";
import supertest from "supertest";
import { buildFastify } from "../server";

test("GET `/` route", async (t) => {
	const fastify: FastifyInstance = buildFastify();

	t.after(() => fastify.close());

	await fastify.ready();

	const response = await supertest(fastify.server)
		.get("/")
		.expect(200)
		.expect("Content-Type", "application/json; charset=utf-8");

	assert.deepStrictEqual(response.body, { hello: "world" });
});
