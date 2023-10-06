import assert from 'node:assert';
import { test } from 'node:test';
import { ObjectId } from 'mongodb';
import { hash } from '../lib/hash';

test('should transform ObjectId', () => {
  const id = new ObjectId();
  assert.strictEqual(hash({ id }), hash({ id: id.toString() }));
});
