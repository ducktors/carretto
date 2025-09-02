---

<p align="center">
<img align="center" alt="CARRETTO" src="https://user-images.githubusercontent.com/1620916/216588133-2ebcacd8-0ede-4b01-a863-cffdd0e041c6.png">
</p>

---

![chariot_full_of_barrels_covered_by_a_cloath_pulled_by_a_e402c499-fc99-412b-b57a-024e6377974d](https://user-images.githubusercontent.com/1620916/216587459-568a3504-7998-4979-952c-e75fd03440b9.png)

[![CI](https://github.com/ducktors/carretto/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ducktors/carretto/actions/workflows/ci.yml) [![Test](https://github.com/ducktors/carretto/actions/workflows/test.yaml/badge.svg)](https://github.com/ducktors/carretto/actions/workflows/test.yaml) [![Coverage Status](https://coveralls.io/repos/github/ducktors/carretto/badge.svg)](https://coveralls.io/github/ducktors/carretto) [![Maintainability](https://api.codeclimate.com/v1/badges/1099ccb45fa45a4d0507/maintainability)](https://codeclimate.com/github/ducktors/carretto/maintainability)
[![main-loader](https://img.shields.io/npm/v/@carretto/main-loader?label=main-loader)](https://www.npmjs.com/package/@carretto/main-loader)
[![mongodb](https://img.shields.io/npm/v/@carretto/mongodb?label=mongodb)](https://www.npmjs.com/package/@carretto/mongodb)
[![http](https://img.shields.io/npm/v/@carretto/http?label=http)](https://www.npmjs.com/package/@carretto/http)

# Carretto

Carretto is a modular utility suite designed to simplify and enhance working with [dataloader](https://github.com/graphql/dataloader) in TypeScript/Node.js projects. It provides a robust foundation and powerful adapters for efficient batching and caching across REST APIs and MongoDB, allowing for seamless query aggregation and field projection with minimal setup.

---

## Installation

You will need Node.js v18+ and [pnpm](https://pnpm.io/) 10+.

```bash
# Install the Carretto package you need (example with MongoDB adapter)
pnpm add @carretto/http
```

---

## Quick Start

The following example demonstrates how to perform efficient batched queries using `DataloaderHttp`:

```typescript
import { DataloaderHttp } from "@carretto/http";

const loader = new DataloaderHttp();

// Load a resource using a RESTful endpoint with field projections
const result = await loader.load({
  query: new URL("http://localhost:3000/users"),
  projection: { firstName: 1, lastName: 1 },
});

console.log(result);
// Output (example): { firstName: 'Mario', lastName: 'Rossi' }
```

This pattern gives you deduplicated, batched API calls with customizable field projections.

---

## API & Configuration Options

### Main Concept: Key Object

All loaders use a `key` object with the following fields:

- `query` (object or URL): Defines the resource or query for the backend (DB query, REST endpoint, etc).
- `projection` (object): Which resource fields to retrieve `{ fieldName: 1 }`.
- `skip` (optional, number): Items to skip (pagination).
- `limit` (optional, number): Max number of items to return (pagination).
- `sort` (optional, object): Sort order (MongoDB only).

**Query aggregation:** All calls with equivalent `query` values are batched into a single backend request.

### Loader Adapters

#### 1. `DataloaderHttp`

Fetches and batches resources from HTTP endpoints.

```typescript
import { DataloaderHttp } from "@carretto/http";

const loader = new DataloaderHttp();
await loader.load({
  query: new URL("http://api.example.com/data"),
  projection: { fieldA: 1, fieldB: 1 },
  skip: 5,
  limit: 10,
});
```

#### 2. `DataloaderMongoDB`

Batches MongoDB queries for fine-grained control over expected fields, pagination, and sorting.

```typescript
import { DataloaderMongoDB } from "@carretto/mongodb";

const loader = new DataloaderMongoDB(db.collection("Users"));
await loader.load({
  query: { age: { $gt: 30 } },
  projection: { firstName: 1, lastName: 1 },
  sort: { createdAt: -1 },
});
```

#### 3. `MainLoader` (Base/Advanced)

Build your own adapters for custom data sources.

---

## Advanced Examples

### 1. REST API with Projection Merging

Batch multiple requests with different projections—Carretto merges requested fields and sends a single HTTP call:

```typescript
const loader = new DataloaderHttp();
const [a, b] = await Promise.all([
  loader.load({
    query: new URL("http://api/my"),
    projection: { firstName: 1 },
  }),
  loader.load({ query: new URL("http://api/my"), projection: { lastName: 1 } }),
]);
// Both requests hit backend only once with merged projection: { firstName: 1, lastName: 1 }
```

### 2. MongoDB: Aggregated Queries with Paging

Combining requests for different slices of a dataset results in optimized backend queries:

```typescript
const loader = new DataloaderMongoDB(collection);
const [usersA, usersB] = await Promise.all([
  loader.loadMany({
    query: { status: "active" },
    projection: { name: 1 },
    skip: 0,
    limit: 10,
  }),
  loader.loadMany({
    query: { status: "active" },
    projection: { email: 1 },
    skip: 5,
    limit: 15,
  }),
]);
// Only one .find() call is performed with skip: 0, limit: 15 and merged projection
```

### 3. Extending with a Custom Adapter

Leverage `MainLoader` to introduce a new database or data source:

```typescript
import { MainLoader } from "@carretto/main-loader";

class MyCustomLoader extends MainLoader<MyType, MyQueryType> {
  protected async execute(key) {
    // Integrate any backend with batching/projection logic
    return myBackend.query(key.query, key.projection, key.skip, key.limit);
  }
}
```

---

## Contributing Guidelines

We welcome contributions of all kinds:

- **Bug reports:** Use the [issue templates](.github/ISSUE_TEMPLATE/) to submit bugs or regressions.
- **Features & Improvements:** Open a discussion or PR—see [CONTRIBUTING.md](https://github.com/ducktors/carretto/blob/main/CONTRIBUTING.md) for details.
- **Code style:** Use `pnpm lint`, `pnpm format`, and follow conventional commits.
- **Testing:** `pnpm test` executes the full suite, including coverage reporting.

To get started:

```bash
git clone https://github.com/ducktors/carretto.git
cd carretto
pnpm install
pnpm test
```

---

## License & Credits

- **License:** [MIT](./LICENSE)
- **Author:** Alessandro Magionami - [@alemagio](https://github.com/alemagio)
- **Inspired by:** [dataloader](https://github.com/graphql/dataloader)
- See adapters’ and dependencies' own LICENSE files for details.
