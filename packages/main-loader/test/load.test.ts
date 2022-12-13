import { expect, test, vi } from "vitest";
import {
	graphql,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";

import { TestLoader } from "./util/test-loader";

test("should aggregate same queries projections", async () => {
	const spy = vi.fn().mockImplementation(() => null)
	const loader = new TestLoader(spy);

	const personType = new GraphQLObjectType({
		name: "Person",
		fields: () => ({
			firstName: {
				type: new GraphQLNonNull(GraphQLString),
				async resolve() {
					await loader.load({
						query: { test: "test" },
						projection: { firstName: 1 },
					});
					return 'Mario'
				},
			},
			lastName: {
				type: new GraphQLNonNull(GraphQLString),
				async resolve() {
					await loader.load({
						query: { test: "test" },
						projection: { lastName: 1 },
					});
					return 'Rossi'
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

	expect(spy).toHaveBeenCalledOnce();
	expect(spy).toHaveBeenCalledWith({
		query: { test: "test" },
		projection: { firstName: 1, lastName: 1 }
	});

	expect(errors).toBe(undefined);

	expect(data!.person).toMatchObject({
		firstName: "Mario",
		lastName: "Rossi",
	});
});
