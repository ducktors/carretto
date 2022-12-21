import { expect, test, vi } from "vitest";
import {
	graphql,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";

import { DataloaderMongoDB } from "../lib";

test("should aggregate same queries projections and skip and limit", async () => {
	const collection = {
		find: vi
			.fn()
			.mockImplementation(
				(
					query,
					options: { projection: unknown; skip: number; limit: number },
				) => {
					expect(options!.projection).toEqual({ firstName: 1, lastName: 1 });
					expect(options.skip).toBe(0);
					expect(options.limit).toBe(15);
					return {
						toArray: () => ["Mario", "Luigi"],
					};
				},
			),
	};
	const loader = new DataloaderMongoDB(collection as any);

	const personType = new GraphQLObjectType({
		name: "Person",
		fields: () => ({
			friends: {
				type: new GraphQLList(GraphQLString),
				async resolve() {
					return loader.loadMany({
						query: { test: "test" },
						projection: { firstName: 1 },
						skip: 0,
						limit: 10,
					});
				},
			},
			otherFriends: {
				type: new GraphQLList(GraphQLString),
				async resolve() {
					return loader.loadMany({
						query: { test: "test" },
						projection: { lastName: 1 },
						skip: 5,
						limit: 15,
					});
				},
			},
		}),
	});

	const queryType = new GraphQLObjectType({
		name: "Query",
		fields: () => ({
			person: {
				type: personType,
				resolve: () => {
					return {};
				},
			},
		}),
	});

	const { errors, data } = await graphql({
		schema: new GraphQLSchema({
			types: [personType],
			query: queryType,
		}),
		source: `
      {
        person {
          friends
          otherFriends
        }
      }
    `,
	});

	expect(collection.find).toHaveBeenCalledOnce();

	expect(errors).toBe(undefined);

	expect(data!.person).toMatchObject({
		friends: ["Mario", "Luigi"],
		otherFriends: ["Mario", "Luigi"],
	});
});
