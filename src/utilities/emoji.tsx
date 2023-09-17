import {IS_APPLE, USE_APPLE_EMOJI} from 'common/environment'

export interface IEmojiCategory {
  id: string
  emojis: string[]
}
export interface EmojiItem {
  unified: string
  native: string
  x: number
  y: number
}
export type EmojiSkin = 0 | 1 | 2 | 3 | 4 | 5
export interface EmojiData {
  categories: IEmojiCategory[]
  emojis: Record<
    string,
    {
      id: string
      name: string
      keywords: string[]
      skins: Array<EmojiItem>
      version: number
    }
  >
}

function toCodePoints(emoji: string) {
  const points = []
  let char = 0
  let previous = 0
  let i = 0
  while (i < emoji.length) {
    char = emoji.charCodeAt(i++)
    if (previous) {
      points.push((0x10000 + ((previous - 0xd800) << 10) + (char - 0xdc00)).toString(16))
      previous = 0
    } else if (char > 0xd800 && char <= 0xdbff) {
      previous = char
    } else {
      points.push(char.toString(16))
    }
  }

  if (points.length && points[0].length === 2) {
    points[0] = '00' + points[0]
  }

  return points
}

export const testParseEmoji = (emoji: string) => {
  if (IS_APPLE && USE_APPLE_EMOJI) {
    return emoji
  }
  const emojiString = toCodePoints(emoji).join('-')

  /**
   * @todo переробити, що повертати тут компонент Image чи щось таке ( всередині image робити transition ( використати useTransitionClassname))
   */
  const src = `emoji/${emojiString}.png`
  return (
    <img
      style={{
        userSelect: 'none',
        pointerEvents: 'none',
      }}
      // preload=""
      // loading="lazy"
      data-path={src}
      src={src}
      alt={emojiString}
      width={34}
      height={34}
    />
  )
}
// {
//   "byId": {
//     "26": {
//       "id": 26,
//       "title": "News",
//       "channels": false,
//       "pinnedChatIds": [],
//       "includedChatIds": [
//         "-1134948258",
//         "-1192373108",
//         "-1217535165",
//         "-1314050553",
//         "-1319040000",
//         "-1431180517",
//         "-1469021333",
//         "-1632966055",
//         "-1803414415",
//         "-1336951742"
//       ],
//       "excludedChatIds": [
//         "-1457892982"
//       ]
//     },
//     "90": {
//       "id": 90,
//       "title": "Unread",
//       "contacts": true,
//       "nonContacts": true,
//       "groups": true,
//       "bots": true,
//       "excludeRead": true,
//       "channels": true,
//       "pinnedChatIds": [],
//       "includedChatIds": [],
//       "excludedChatIds": []
//     },
//     "98": {
//       "id": 98,
//       "title": "my",
//       "channels": false,
//       "pinnedChatIds": [],
//       "includedChatIds": [
//         "333613058",
//         "1331092759"
//       ],
//       "excludedChatIds": []
//     },
//     "99": {
//       "id": 99,
//       "title": "contacts",
//       "contacts": true,
//       "channels": false,
//       "pinnedChatIds": [],
//       "includedChatIds": [],
//       "excludedChatIds": []
//     }
//   },
//   "invites": {},
//   "orderedIds": [
//     0,
//     90,
//     26,
//     98,
//     99
//   ],
//   "recommended": [
//     {
//       "id": 1,
//       "title": "Personal",
//       "contacts": true,
//       "nonContacts": true,
//       "channels": false,
//       "pinnedChatIds": [],
//       "includedChatIds": [],
//       "excludedChatIds": [],
//       "description": "Only messages from personal chats."
//     }
//   ]
// }
