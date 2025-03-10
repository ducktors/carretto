import assert from 'node:assert';
import { after, before, test } from 'node:test';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { type Document, MongoClient, ObjectId, type WithId } from 'mongodb';
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

test('should aggregate same queries projections', async (t) => {
  const personId = new ObjectId();
  const db = client.db('test');
  const collection = db.collection<WithId<Document>>('people');
  await collection.insertOne({
    _id: personId,
    firstName: 'Mario',
    lastName: 'Rossi',
  });
  t.mock.method(collection, 'findOne');
  const loader = new DataloaderMongoDB(collection);

  const results = await Promise.all([
    loader.load({
      query: { _id: personId },
      projection: { firstName: 1 },
    }),
    loader.load({
      query: { _id: personId },
      projection: { lastName: 1 },
    }),
  ]);

  assert.strictEqual(collection.findOne.mock.calls.length, 1);

  assert.equal(results[0]?.firstName, 'Mario');
  assert.equal(results[0]?.lastName, 'Rossi');
});
