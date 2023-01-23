import { expect, test } from "vitest";

import { hash } from "../lib/hash";
import { Key } from "../lib/key";
import { createQueriesMapFactory } from "../lib/create-queries-map-factory";

const createQueriesMap = createQueriesMapFactory()

test("should return a map of keys with query as key", () => {
	const keys: Key<any>[] = [
		{ query: "query1", projection: { firstName: 1 } },
		{ query: "query2", projection: { lastName: 1 } },
	];
	expect(createQueriesMap(keys)).toEqual(
		new Map(keys.map((key) => [hash(key.query), key])),
	);
});

test("should return a map of keys with query as key and merged projections for same query", () => {
	const keys: Key<any>[] = [
		{ query: "query", projection: { firstName: 1 } },
		{ query: "query", projection: { lastName: 1 } },
	];
	expect(createQueriesMap(keys)).toEqual(
		new Map([
			[
				hash(keys[0].query),
				{
					...keys[0],
					projection: { ...keys[0].projection, ...keys[1].projection },
				},
			],
		]),
	);
});

test("should return a map of keys with query as key and min of skip and max of limit", () => {
	const keys: Key<any>[] = [
		{ query: "query", projection: {}, skip: 1, limit: 10 },
		{ query: "query", projection: {}, skip: 2, limit: 15 },
	];
	expect(createQueriesMap(keys)).toEqual(
		new Map([
			[
				hash(keys[0].query),
				{
					...keys[0],
					projection: { ...keys[0].projection, ...keys[1].projection },
					skip: 1,
					limit: 15,
				},
			],
		]),
	);
});
