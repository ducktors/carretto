---

<p align="center">
 <img align="center" alt="CRRETTO" src="https://user-images.githubusercontent.com/1620916/216588133-2ebcacd8-0ede-4b01-a863-cffdd0e041c6.png">
</p>

---

![chariot_full_of_barrels_covered_by_a_cloath_pulled_by_a_e402c499-fc99-412b-b57a-024e6377974d](https://user-images.githubusercontent.com/1620916/216587459-568a3504-7998-4979-952c-e75fd03440b9.png)

`Carretto` is a set of utilities to improve and simplify the usage of [dataloader](https://github.com/graphql/dataloader).

[![CI](https://github.com/ducktors/carretto/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ducktors/carretto/actions/workflows/ci.yml) [![Coverage Status](https://coveralls.io/repos/github/ducktors/carretto/badge.svg)](https://coveralls.io/github/ducktors/carretto) [![Maintainability](https://api.codeclimate.com/v1/badges/1099ccb45fa45a4d0507/maintainability)](https://codeclimate.com/github/ducktors/carretto/maintainability)

## Introduction

`Carretto` has the concept of `key` which is an object having the following shape:

```ts
{
  query: unknown
  projection: Record<string, 1>
  skip?: number
  limit?: number
}
```

Fields of the `key`:

- `query`: represents the way to obtain the resource, which means, for database the actual query, for a REST API the url of the resource ecc.
- `projection`: the fields you are interested in the resource.
- `skip`: the number of elements you want to skip.
- `limit`: the maximum amount of elements you want to get.

### Query

`Carretto` assumes every key having the same `query` field will point to the same resource.

Multiple calls to resources identified with keys having the same `query` field will result in a single call.

### Projection

When trying to access resources identified with keys having the same `query` field, the resulted projection will be a merge of the projections of the single keys.

For an example of this behavior see [mongodb](./packages/mongodb/README.md).

### Skip and Limit

`skip` and `limit` are optional since if the are populated `carretto` will assume the result is a list of elements, instead, if these fields are not populated, the result will be considered a single object.

When multiple resources identified by keys having the same `query` have different `skip` and `limit` the calls will result in a single call having:

- `skip` the minimum of the `skip` fields of the single keys
- `limit` the maximum of the `limit` fields of the single keys

**Note**

TODO: this behavior is not ideal and in the following versions will be more customizable.

## Adapters

- [MongoDB](./packages/mongodb/README.md)

## License

Licensed under [MIT](./LICENSE).<br/>
[`dataloader` license](https://github.com/graphql/dataloader/blob/main/LICENSE)
