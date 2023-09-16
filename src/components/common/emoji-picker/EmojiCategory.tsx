import {type FC, useRef} from 'preact/compat'

import {type ObserveFn, useOnIntersect} from 'hooks/useIntersectionObserver'

import {IS_SAFARI} from 'common/config'
import type {EmojiData, IEmojiCategory} from 'utilities/emoji'
import {remToPx} from 'utilities/remToPx'

import {SingleTransition} from 'components/transitions'

interface EmojiCategoryProps {
  emojiData: EmojiData
  idx: number
  shouldRender: boolean
  category: IEmojiCategory
  intersectionObserve?: ObserveFn
  onSelectEmoji: (emoji: string) => void
}

const ITEMS_PER_ROW = 8
const EMOJI_BUTTON_PX = remToPx(2.625)

function getContainerHeight(category: IEmojiCategory) {
  return (
    Math.ceil(category.emojis.length / ITEMS_PER_ROW) * EMOJI_BUTTON_PX +
    24 + // title
    remToPx(0.3 + 0.3) // padding-block
  )
}
export const EmojiCategory: FC<EmojiCategoryProps> = ({
  idx,
  shouldRender,
  category,
  intersectionObserve,
  emojiData,
  onSelectEmoji,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  // const {ref, inView} = useInView({
  //   onChange(inView, entry) {
  //     console.log(inView, entry)
  //   },
  // })
  useOnIntersect(ref, intersectionObserve)
  // console.log(idx, category.id)

  return (
    <div
      ref={ref}
      class="emoji-category"
      id={`emoji-category-${idx}`}
      style={{
        minHeight: getContainerHeight(category),
      }}
    >
      <h6 class="emoji-category__title">{category.id}</h6>
      {/* <div
        style={{
          minHeight: (category.emojis.length / 8) * 34,
        }}
      > */}
      <SingleTransition
        className="emoji-category__content"
        in={shouldRender}
        styles={{
          minHeight: Math.ceil(category.emojis.length / 8) * EMOJI_BUTTON_PX,
        }}
        unmount
        name="fade"
        timeout={IS_SAFARI ? 300 : 200}
      >
        {category.emojis.map((e) => {
          const emoji = emojiData?.emojis?.[e]?.skins?.[0]?.native
          return (
            <span
              onMouseDown={() => {
                onSelectEmoji(e)
              }}
              class="emoji-item"
              key={e}
            >
              {emoji}
            </span>
          )
        })}
      </SingleTransition>
      {/* </div> */}
    </div>
  )
}
