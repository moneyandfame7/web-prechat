import {IS_EMOJI_SUPPORTED} from 'common/environment'
import {EMOJI_REGEX, getEmojiUnified} from 'utilities/emoji'

import type {PreactNode} from 'types/ui'

export function replaceEmojis(nodes: PreactNode[], type: 'jsx' | 'html') {
  if (IS_EMOJI_SUPPORTED) {
    return nodes
  }

  return nodes.reduce((result: PreactNode[], textPart) => {
    if (typeof textPart !== 'string') {
      result.push(textPart)
      return result
    }
    const parts = textPart.split(EMOJI_REGEX)
    const emojis: string[] = textPart.match(EMOJI_REGEX) || []
    result.push(parts[0])

    return emojis.reduce((emojiResult: PreactNode[], emoji) => {
      const unified = getEmojiUnified(emoji)
      const buildedClass = `emoji emoji-image`
      const src = `emoji/${unified}.png`
      /* signal onLoad??? */
      if (type === 'jsx') {
        emojiResult.push(
          <img class={buildedClass} width={34} height={34} src={src} alt={emoji} />
        )
      }

      if (type === 'html') {
        emojiResult.push(
          `<img\
          class="${buildedClass}"\
          src="${src}"\
          alt="${emoji}"\
        />`
        )
      }
      return emojiResult
    }, [] as PreactNode[])
    // console.log({parts, emojis})
  }, [] as PreactNode[])
}
