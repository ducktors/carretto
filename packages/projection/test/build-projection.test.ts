import { expect, test } from 'vitest';
import { graphql, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLUnionType } from 'graphql';

import { buildProjection } from '../lib'

test('should build projection', async () => {
  const dogType = new GraphQLObjectType({
    name: 'Dog',
    fields: () => ({
      name: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve() {
          return 'Rex';
        },
      },
      age: {
        type: new GraphQLNonNull(GraphQLInt),
        async resolve() {
          return 5;
        },
      },
    }),
  });

  const personType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve(source, args, context, info) {
          expect(buildProjection(info)).toEqual({ firstName: 1 })
          return 'Mario';
        },
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve(source, args, context, info) {
          expect(buildProjection(info)).toEqual({ lastName: 1 })
          return 'Rossi';
        },
      },
      dog: {
        type: dogType,
      },
    }),
  });

  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      person: {
        type: personType,
        resolve: (source, args, context, info) => {
          expect(buildProjection(info)).toEqual({ firstName: 1, lastName: 1, dog: { name: 1, age: 1 } })
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
          dog {
            name
            age
          }
        }
      }
    `,
  });

  expect(errors).toBe(undefined);
});

test('should build projection with inline fragments', async () => {
  const dogType = new GraphQLObjectType({
    name: 'Dog',
    fields: () => ({
      name: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve(source, args, context, info) {
          expect(buildProjection(info)).toEqual({ name: 1 })
          return 'Rex';
        },
      },
      age: {
        type: new GraphQLNonNull(GraphQLInt),
        async resolve(source, args, context, info) {
          expect(buildProjection(info)).toEqual({ age: 1 })
          return 5;
        },
      },
    }),
  });

  const catType = new GraphQLObjectType({
    name: 'Cat',
    fields: () => ({
      name: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve(source, args, context, info) {
          expect(buildProjection(info)).toEqual({ name: 1 })
          return 'Kitty';
        },
      },
      breed: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve(source, args, context, info) {
          expect(buildProjection(info)).toEqual({ breed: 1 })
          return 'breed';
        },
      },
    }),
  });

  const personType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
      firstName: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve() {
          return 'Mario';
        },
      },
      lastName: {
        type: new GraphQLNonNull(GraphQLString),
        async resolve() {
          return 'Rossi';
        },
      },
      pet: {
        type: new GraphQLUnionType({
          name: 'Pet',
          types: [dogType, catType]
        }),
      },
    }),
  });

  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      person: {
        type: personType,
        resolve: (source, args, context, info) => {
          expect(buildProjection(info)).toEqual({ firstName: 1, lastName: 1, pet: { name: 1, age: 1, breed: 1 } })
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
          pet {
            ... on Dog {
              name
              age
            }
            ... on Cat {
              name
              breed
            }
          }
        }
      }
    `,
  });

  expect(errors).toBe(undefined);
});
