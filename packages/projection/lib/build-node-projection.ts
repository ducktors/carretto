import { FieldNode, InlineFragmentNode, Kind } from 'graphql'
import { Projection } from './projection'

const SUPPORTED_TYPE = [Kind.FIELD, Kind.INLINE_FRAGMENT]

export function buildNodeProjection(currentNode: FieldNode | InlineFragmentNode): Projection {
  if (!SUPPORTED_TYPE.includes(currentNode.kind)) {
    return {}
  }

  if (currentNode.kind === Kind.FIELD && !currentNode.selectionSet) {
    return { [currentNode.name.value]: 1 }
  }

  return currentNode.selectionSet!.selections.reduce((projection, node) => {
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
