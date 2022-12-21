import { expect, test, vi } from "vitest";
import {
	graphql,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";

import { DataloaderMongoDB } from "../lib";

test("should aggregate same queries projections", async () => {
	const collection = {
		findOne: vi
			.fn()
			.mockImplementation((query, options: { projection: unknown }) => {
				expect(options!.projection).toEqual({ firstName: 1, lastName: 1 });
				return {
					firstName: "Mario",
					lastName: "Rossi",
				};
			}),
	};
	const loader = new DataloaderMongoDB(collection as any);

	const personType = new GraphQLObjectType({
		name: "Person",
		fields: () => ({
			firstName: {
				type: new GraphQLNonNull(GraphQLString),
				async resolve() {
					const result = await loader.load({
						query: { test: "test" },
						projection: { firstName: 1 },
					});
					return result?.firstName;
				},
			},
			lastName: {
				type: new GraphQLNonNull(GraphQLString),
				async resolve() {
					const result = await loader.load({
						query: { test: "test" },
						projection: { lastName: 1 },
					});
					return result?.lastName;
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
          firstName
          lastName
        }
      }
    `,
	});

	expect(collection.findOne).toHaveBeenCalledOnce();

	expect(errors).toBe(undefined);

	expect(data!.person).toMatchObject({
		firstName: "Mario",
		lastName: "Rossi",
	});
});
