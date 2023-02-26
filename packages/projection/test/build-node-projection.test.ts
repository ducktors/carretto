import { expect, test } from 'vitest';

import { buildNodeProjection } from '../lib/build-node-projection'
import { FieldNode, Kind } from 'graphql';

test('should {} if node is not supported type', async () => {
  const node = {
    kind: 'different'
  }

  expect(buildNodeProjection(node as FieldNode)).toEqual({})
});

test('should build projection for node with no selectionSet', async () => {
  const node = {
    kind: Kind.FIELD,
    name: { value: 'foo' },
  }

  expect(buildNodeProjection(node as FieldNode)).toEqual({ foo: 1 })
});

test('should build projection for node with selectionSet', async () => {
  const node = {
    kind: Kind.FIELD,
    name: { value: 'foo', kind: Kind.NAME },
    selectionSet: {
      kind: Kind.SELECTION_SET,
      selections: [{
        kind: Kind.FIELD,
        name: { value: 'nestedField', kind: Kind.NAME }
      }]
    }
  }

  expect(buildNodeProjection(node as FieldNode)).toEqual({ nestedField: 1 })
});

test('should build projection for node with selectionSet and children selectionSed', async () => {
  const node = {
    kind: Kind.FIELD,
    name: { value: 'foo', kind: Kind.NAME },
    selectionSet: {
      kind: Kind.SELECTION_SET,
      selections: [{
        kind: Kind.FIELD,
        name: { value: 'nestedField', kind: Kind.NAME },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [{
            kind: Kind.FIELD,
            name: { value: 'moreNestedField', kind: Kind.NAME }
          }]
        }
      }]
    }
  }

  expect(buildNodeProjection(node as FieldNode)).toEqual({ nestedField: { moreNestedField: 1 } })
});

test('should build projection for node with INLINE_FRAGMENT', async () => {
  const node = {
    kind: Kind.FIELD,
    name: { value: 'foo', kind: Kind.NAME },
    selectionSet: {
      kind: Kind.SELECTION_SET,
      selections: [{
        kind: Kind.INLINE_FRAGMENT,
        name: { value: 'nestedField', kind: Kind.NAME },
        selectionSet: {
          kind: Kind.SELECTION_SET,
          selections: [{
            kind: Kind.FIELD,
            name: { value: 'moreNestedField', kind: Kind.NAME }
          }]
        }
      }]
    }
  }

  expect(buildNodeProjection(node as FieldNode)).toEqual({ moreNestedField: 1 })
});
