import {IS_APPLE} from 'common/config'
function parseEmojiToString(emoji: string) {
  const codePoints = [...emoji].map(char => char.codePointAt(0)!)
  // https://stackoverflow.com/questions/62858054/how-get-real-char-code-from-an-emoji-in-javascript?rq=3
  // Map code points to unicode escapes
  return codePoints.map(code => `${code.toString(16)}`).join('-')
}
export function parseEmoji(emoji: string) {
  if (IS_APPLE) {
    return emoji
  }
  // loadSprite()
  // Convert to code points array
  const emojiString = parseEmojiToString(emoji)
  // console.log('Apple emoji not supported. Use images instead.')
  // https://github.com/iamcal/emoji-data/tree/master/img-apple-64
  /* https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/${emojiString}.png
   */
  return (
    <img
      style={{
        userSelect: 'none',
        pointerEvents: 'none',
      }}
      src={`emoji/${emojiString}.png`}
      alt={emojiString}
      width={34}
      height={34}
    />
  )
}
