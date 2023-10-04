import { test, before, after } from "node:test";
import assert from "node:assert";

import { DataloaderMongoDB } from "../lib";
import { Document, MongoClient, ObjectId, WithId } from "mongodb";
import { setup, teardown } from "vitest-mongodb";

let client: MongoClient;
before(async () => {
  await setup();
  client = new MongoClient(global.__MONGO_URI__);
  await client.connect();
});

after(async () => {
  await client.close();
  await teardown();
});

test("should aggregate same queries projections and skip and limit", async (t) => {
  const personId = new ObjectId();
  const otherPersonId = new ObjectId();

  const db = client.db("test");
  const collection = db.collection<WithId<Document>>("people");

  await collection.insertOne({
    _id: personId,
    firstName: "Mario",
    lastName: "Rossi",
  });
  await collection.insertOne({
    _id: otherPersonId,
    firstName: "Luigi",
    lastName: "Rossi",
  });

  t.mock.method(collection, "find");
  const loader = new DataloaderMongoDB(collection as any);

  const results = await Promise.all([
    loader.loadMany({
      query: { lastName: "Rossi" },
      projection: { firstName: 1 },
    }),
    loader.loadMany({
      query: { lastName: "Rossi" },
      projection: { lastName: 1 },
    }),
  ]);

  assert.strictEqual(collection.find.mock.calls.length, 1);

  assert.equal(results[0][0]!.firstName, "Mario");
  assert.equal(results[0][0]!.lastName, "Rossi");
  assert.equal(results[0][1]!.firstName, "Luigi");
  assert.equal(results[0][1]!.lastName, "Rossi");
});
