import type {PreactNode} from 'types/ui'

const BREAKES_REGEXP = /\n/g
export function replaceBreakes(text: PreactNode[], type: 'jsx' | 'html'): PreactNode[] {
  return text.reduce<PreactNode[]>((result, part) => {
    if (typeof part !== 'string') {
      result.push(part)
      return result
    }

    const parts = part.split(BREAKES_REGEXP)

    parts.forEach((textPart, i) => {
      result.push(textPart)
      if (i < parts.length - 1) {
        result.push(type === 'jsx' ? <br key={`${textPart}-${i}`} /> : '<br />')
      }
    })

    return result
    return result
  }, [])
}
// if (type === 'jsx') {
//   return text.split('\n').map((line, index) => (
//     <Fragment key={index}>
//       {line}
//       {index !== text.length - 1 && <br />}
//     </Fragment>
//   ))
// } else if (type === 'html') {
//   return text.replace(/\n/g, '<br/>')
// }
