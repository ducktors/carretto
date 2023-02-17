import { expect, test, vi } from 'vitest';
import { URL } from 'node:url';
import { request } from 'undici';
import { stringify } from 'node:querystring';
import { graphql, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql';

import { DataloaderHttp } from '../lib';

vi.mock('undici');

const url = 'http://localhost:3000';

test('should aggregate same queries projections', async () => {
  vi.mocked(request).mockImplementationOnce((input: string) => {
    expect(input).toBe(
      `${url}/?${stringify({ projection: ['firstName', 'lastName'] })}&skip=0&limit=0`,
    );
    return Promise.resolve({ body: { json: () => ({ firstName: 'Mario', lastName: 'Rossi' }) } });
  });
  const loader = new DataloaderHttp();

  const personType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve() {
          const result = await loader.load({
            query: new URL(url),
            projection: { firstName: 1 },
          });
          return result?.firstName;
        },
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve() {
          const result = await loader.load({
            query: new URL(url),
            projection: { lastName: 1 },
          });
          return result?.lastName;
        },
      },
    }),
  });

  const queryType = new GraphQLObjectType({
    name: 'Query',
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

  expect(errors).toBe(undefined);

  expect(data!.person).toMatchObject({
    firstName: 'Mario',
    lastName: 'Rossi',
  });
});
