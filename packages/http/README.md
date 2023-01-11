# @carretto/http

This is the adapter to use `carretto` with resources over `http`.

## Install
```
npm i @carretto/http
```

## Usage

```ts

const loader = new DataloaderHttp()

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
