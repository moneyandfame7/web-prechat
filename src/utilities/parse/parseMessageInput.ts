import {type ApiFormattedText, type ApiMessageEntity, ApiMessageEntityType} from 'api/types'

const ENTITY_TYPE_BY_NAME: Record<string, ApiMessageEntityType> = {
  B: ApiMessageEntityType.Bold,
  STRONG: ApiMessageEntityType.Bold,
  I: ApiMessageEntityType.Italic,
  EM: ApiMessageEntityType.Italic,
  INS: ApiMessageEntityType.Underline,
  U: ApiMessageEntityType.Underline,
  S: ApiMessageEntityType.Strike,
  STRIKE: ApiMessageEntityType.Strike,
  DEL: ApiMessageEntityType.Strike,
  CODE: ApiMessageEntityType.Code,
}

export function parseMessageInput(htmlString: string): ApiFormattedText {
  const parser = new DOMParser()

  const doc = parser.parseFromString(htmlString.replace(/&nbsp;/g, ''), 'text/html')
  const text = doc.body.textContent || ''
  const entities: ApiMessageEntity[] = []
  const traverseNodes = (node: Node, offset: number) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element
      const type = ENTITY_TYPE_BY_NAME[element.tagName]

      if (type) {
        switch (type) {
          case ApiMessageEntityType.TextUrl:
            entities.push({
              type,
              start: offset,
              end: offset + (element.textContent?.length || 0),
              url: element.getAttribute('href') || '',
            })
            break
          default:
            entities.push({
              type,
              start: offset,
              end: offset + (element.textContent?.length || 0),
            })
        }
      }

      let currentOffset = offset
      for (let i = 0; i < element.childNodes.length; i++) {
        currentOffset = traverseNodes(element.childNodes[i], currentOffset)
      }
      return currentOffset
    } else if (node.nodeType === Node.TEXT_NODE) {
      return offset + (node.textContent?.length || 0)
    }
    return offset
  }

  traverseNodes(doc.body, 0)

  return {text, entities}
}

function getEntityFromNode(node: Node, offset: number): {entity?: ApiMessageEntity} {
  const el = node as HTMLElement
  let type: ApiMessageEntityType | undefined

  if (ENTITY_TYPE_BY_NAME[el.tagName]) {
    type = ENTITY_TYPE_BY_NAME[el.tagName]
  } else if (el.tagName === 'A') {
    const anchor = node as HTMLAnchorElement
    if (anchor.dataset.entityType === ApiMessageEntityType.Mention) {
      type = ApiMessageEntityType.Mention
    }
    if (anchor.dataset.entityType === ApiMessageEntityType.Url) {
      type = ApiMessageEntityType.Url
    }
    if (anchor.href.startsWith('mailto:')) {
      type = ApiMessageEntityType.Email
    }
    if (anchor.href.startsWith('tel:')) {
      type = ApiMessageEntityType.Phone
    }
    if (anchor.href !== anchor.textContent) {
      type = ApiMessageEntityType.TextUrl
    }

    type = ApiMessageEntityType.Url
  } else if (el.tagName === 'SPAN') {
    type = el.dataset.entityType as any
  }

  if (!type || !node.textContent) {
    return {
      entity: undefined,
    }
  }
  const start = offset
  const end = el.textContent?.length || 0
  if (type === ApiMessageEntityType.TextUrl) {
    return {
      entity: {
        type,
        start,
        end,
        url: (node as HTMLAnchorElement).href,
      },
    }
  }

  return {
    entity: {
      type,
      start,
      end,
    },
  }
}
