import { GraphQLResolveInfo, SelectionNode, Kind } from 'graphql'

import { Projection } from "./projection"

export function buildProjection(info: GraphQLResolveInfo): Projection {
  return info.fieldNodes.reduce((projection, node) => ({ ...projection, ...buildNodeProjection(node) }), {})
}

function buildNodeProjection(currentNode: SelectionNode): Projection | undefined {
  if (currentNode.kind === Kind.FIELD || currentNode.kind === Kind.INLINE_FRAGMENT ) {
    if (!currentNode.selectionSet && currentNode.kind === Kind.FIELD) {
      return { [currentNode.name.value]: 1 }
    }
    return currentNode.selectionSet?.selections.reduce((projection, node) => {
      if (node.kind === Kind.FIELD) {
        if (!node.selectionSet?.selections || node.selectionSet?.selections.length === 0) {
          return { ...projection, [node.name.value]: 1 }
        }
        return { ...projection, [node.name.value]: buildNodeProjection(node) }
      }
      if (node.kind === Kind.INLINE_FRAGMENT) {
        return { ...projection, ...buildNodeProjection(node) }
      }
      return {}
    }, {})
  }
}
