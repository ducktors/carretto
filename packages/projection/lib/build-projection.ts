import { GraphQLResolveInfo } from 'graphql'

import { Projection } from "./projection"
import { buildNodeProjection } from './build-node-projection'

export function buildProjection(info: GraphQLResolveInfo): Projection {
  return info.fieldNodes.reduce((projection, node) => ({ ...projection, ...buildNodeProjection(node) }), {})
}
