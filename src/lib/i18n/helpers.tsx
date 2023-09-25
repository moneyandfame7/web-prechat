// const BOLD_REGEX = /\*\*(.*?)\*\*/g
// const ITALIC_REGEX = /__(.*?)__/g
// export const parseStringToJSX = (input: string) => {
//   return input.split(BOLD_REGEX).map((part, index) => {
//     if (index % 2 === 0) {
//       return part.split(ITALIC_REGEX).map((part, index) => {
//         if (index % 2 === 0) {
//           return part
//         }
//         return <i key={index}>{part}</i>
//       })
//     }
import type {ApiLangCode} from 'api/types'

//     return <b key={index}>{part}</b>
//   })
// }

const regexp = /{{(\w+)}}/g
export function interpolate(string: string, params: Record<string, string | number>) {
  return string.replace(regexp, (original, paramKey) => {
    if (paramKey in params) {
      return String(params[paramKey])
    }

    return original
  })
}

export function createPluralize(locale: ApiLangCode) {
  const rules = new Intl.PluralRules(locale)

  return (count: number) => rules.select(count)
}
