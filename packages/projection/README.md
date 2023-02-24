# @carretto/mongodb

This is the adapter to use `carretto` with `mongodb`.

## Install
```
npm i @carretto/mongodb
```

## Usage

```ts

const loader = new DataloaderMongoDB(db.collection('Users'))

// resolver.ts


export async function(
  source,
  args,
  context,
  info
) {
  await loader.load({ query: args.query, projection: myFunctionToGetProjection(info), skip: args.skip, limit: args.limit })
}

```
