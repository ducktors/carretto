import { expect, test } from 'vitest'

import { mergeProjections } from '../lib/merge-projections'

test('should return {} when projections are not provided', () => {
  expect(mergeProjections()).toEqual({})
})

test('should return old when curr is not provided', () => {
  expect(mergeProjections({ foo: 1 })).toEqual({ foo: 1 })
})

test('should return curr when old is not provided', () => {
  expect(mergeProjections(undefined, { foo: 1 })).toEqual({ foo: 1 })
})

test('should merge old and curr', () => {
  expect(mergeProjections({ bar: 1 }, { foo: 1 })).toEqual({ bar: 1, foo: 1 })
})

test('should return higher-level key only when dot notation is provided, old nested', () => {
  expect(mergeProjections({ 'foo.bar': 1 }, { foo: 1 })).toEqual({ foo: 1 })
})

test('should return higher-level key only when dot notation is provided, curr nested', () => {
  expect(mergeProjections({ foo: 1 }, { 'foo.bar': 1 })).toEqual({ foo: 1 })
})

test('should return higher-level key only when dot notation is provided, both nested', () => {
  expect(mergeProjections({ 'foo.nested': 1 }, { 'foo.bar': 1 })).toEqual({ 'foo.nested': 1, 'foo.bar': 1 })
})
