import { expect, test, vi } from "vitest";
import { URL } from 'node:url'
import { request } from 'undici'
import { stringify } from 'node:querystring'
import {
	graphql,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString,
} from "graphql";

import { DataloaderHttp } from "../lib";

vi.mock('undici')

const url = 'http://localhost:3000'

test("should aggregate same queries projections", async () => {
	vi.mocked(request).mockImplementationOnce((input: string) => {
		expect(input).toBe(`${url}/?${stringify({ projection: ['firstName', 'lastName'] })}&skip=0&limit=15`)
		return Promise.resolve({ body: { json: () => (['Mario', 'Luigi']) } })
	});
	const loader = new DataloaderHttp();

	const personType = new GraphQLObjectType({
		name: "Person",
		fields: () => ({
			friends: {
				type: new GraphQLList(GraphQLString),
				async resolve() {
					return loader.loadMany({
						query: new URL(url),
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
						query: new URL(url),
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

	expect(errors).toBe(undefined);

	expect(data!.person).toMatchObject({
		friends: ["Mario", "Luigi"],
		otherFriends: ["Mario", "Luigi"],
	});
});
