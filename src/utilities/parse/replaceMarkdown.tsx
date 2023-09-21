import type {PreactNode} from 'types/ui'

const MARKDOWN_REGEX = /(\*\*|__).+?\1/g

export function replaceMarkdown(text: PreactNode[], type: 'jsx' | 'html'): PreactNode[] {
  return text.reduce<PreactNode[]>((result, part) => {
    if (typeof part !== 'string') {
      result.push(part)
      return result
    }

    const parts = part.split(MARKDOWN_REGEX)
    const entities: string[] = part.match(MARKDOWN_REGEX) || []
    result.push(parts[0])

    return entities.reduce((entityResult: PreactNode[], entity, i) => {
      if (type === 'jsx') {
        entityResult.push(
          entity.startsWith('**') ? (
            <b>{entity.replace(/\*\*/g, '')}</b>
          ) : (
            <i>{entity.replace(/__/g, '')}</i>
          )
        )
      } else {
        entityResult.push(
          entity.startsWith('**')
            ? `<b>${entity.replace(/\*\*/g, '')}</b>`
            : `<i>${entity.replace(/__/g, '')}</i>`
        )
      }

      const index = i * 2 + 2
      if (parts[index]) {
        entityResult.push(parts[index])
      }

      return entityResult
    }, result)
  }, [])
}
