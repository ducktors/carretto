import { expect, test } from "vitest";
import { hash } from "../lib/hash";
import { ObjectId } from "mongodb";

test('should transform ObjectId', () => {
  const id = new ObjectId()
  expect(hash({ id })).toBe(hash({ id: id.toString() }))
})
