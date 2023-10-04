import { test } from "node:test";
import { hash } from "../lib/hash";
import { ObjectId } from "mongodb";
import assert from "node:assert";

test("should transform ObjectId", () => {
  const id = new ObjectId();
  assert.strictEqual(hash({ id }), hash({ id: id.toString() }));
});
