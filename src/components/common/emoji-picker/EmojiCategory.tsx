import {type FC, useRef} from 'preact/compat'

import {type ObserveFn, useOnIntersect} from 'hooks/useIntersectionObserver'

import {IS_EMOJI_SUPPORTED, IS_SAFARI} from 'common/environment'
import {
  type EmojiData,
  type EmojiItem,
  type EmojiSkin,
  type IEmojiCategory,
} from 'utilities/emoji'
import {remToPx} from 'utilities/remToPx'

import {SingleTransition} from 'components/transitions'

interface EmojiCategoryProps {
  skinEmoji: EmojiSkin
  emojiData: EmojiData
  idx: number
  shouldRender: boolean
  category: IEmojiCategory
  intersectionObserve?: ObserveFn
  onSelectEmoji: (emoji: EmojiItem) => void
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
  onSelectEmoji,
  emojiData,
  skinEmoji,
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
          // avoid hardcode 8 - count in row, but in different display can be another
          minHeight: Math.ceil(category.emojis.length / 8) * EMOJI_BUTTON_PX,
        }}
        unmount
        name="fade"
        timeout={IS_SAFARI ? 300 : 200}
      >
        {category.emojis.map((e) => {
          const emoji = emojiData.emojis[e]
          const skins = emoji.skins
          const withCurrentSkin = skins.length > 1 ? skins[skinEmoji] : skins[0]
          const src = `emoji/${withCurrentSkin.unified}.png`
          return (
            <span onClick={() => onSelectEmoji(withCurrentSkin)} class="emoji-item" key={e}>
              {IS_EMOJI_SUPPORTED ? (
                withCurrentSkin.native
              ) : (
                <img
                  width={34}
                  height={34}
                  alt={withCurrentSkin.native}
                  src={src}
                  loading="lazy"
                  // onLoad={
                  //   !isLoaded
                  //     ? (e) => {
                  //         setIsLoaded(true)
                  //       }
                  //     : undefined
                  // }
                />
              )}
            </span>
          )
        })}
      </SingleTransition>
      {/* </div> */}
    </div>
  )
}
