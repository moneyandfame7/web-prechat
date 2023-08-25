const BOLD_REGEX = /\*\*(.*?)\*\*/g
const ITALIC_REGEX = /__(.*?)__/g
export const parseStringToJSX = (input: string) => {
  return input.split(BOLD_REGEX).map((part, index) => {
    if (index % 2 === 0) {
      return part.split(ITALIC_REGEX).map((part, index) => {
        if (index % 2 === 0) {
          return part
        }
        return <i key={index}>{part}</i>
      })
    }

    return <b key={index}>{part}</b>
  })
}
