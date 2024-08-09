import assert from 'node:assert';
import { after, before, test } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { Document, MongoClient, ObjectId, WithId } from 'mongodb';
import { DataloaderMongoDB } from '../lib';

let client: MongoClient;
let mongod: MongoMemoryServer;
before(async () => {
  mongod = await MongoMemoryServer.create();
  client = new MongoClient(mongod.getUri());
  await client.connect();
});

after(async () => {
  await client.close();
  await mongod.stop();
});

test('should aggregate same queries projections and skip and limit', async (t) => {
  const personId = new ObjectId();
  const otherPersonId = new ObjectId();

  const db = client.db('test');
  const collection = db.collection<WithId<Document>>('people');

  await collection.insertOne({
    _id: personId,
    firstName: 'Mario',
    lastName: 'Rossi',
  });
  await collection.insertOne({
    _id: otherPersonId,
    firstName: 'Luigi',
    lastName: 'Rossi',
  });

  t.mock.method(collection, 'find');
  const loader = new DataloaderMongoDB(collection as any);

  const results = await Promise.all([
    loader.loadMany({
      query: { lastName: 'Rossi' },
      projection: { firstName: 1 },
    }),
    loader.loadMany({
      query: { lastName: 'Rossi' },
      projection: { lastName: 1 },
    }),
  ]);

  assert.strictEqual(collection.find.mock.calls.length, 1);

  assert.equal(results[0][0]?.firstName, 'Mario');
  assert.equal(results[0][0]?.lastName, 'Rossi');
  assert.equal(results[0][1]?.firstName, 'Luigi');
  assert.equal(results[0][1]?.lastName, 'Rossi');
});
