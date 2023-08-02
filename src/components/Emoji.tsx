import {type FC, memo} from 'preact/compat'
// import {parseEmoji} from 'utilities/parseEmoji'

interface EmojiProps {
  emoji: string
}
/* робити preload, і перевірити без прелоадінга */

// https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/1/apple.json
// `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@14.0.0/img/apple/64/1f1ec-1f1e7.png
export const Emoji: FC<EmojiProps> = memo((/* {emoji} */) => {
  return <>{/* {parseEmoji(emoji)} */}</>
})
