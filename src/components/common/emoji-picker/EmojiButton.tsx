import {type FC, type TargetedEvent, useCallback, useMemo} from 'preact/compat'

import {IS_EMOJI_SUPPORTED} from 'common/environment'
import {type EmojiItem, type EmojiSkin} from 'utilities/emoji'

interface EmojiButtonProps {
  skins: EmojiItem[]
  currentSkin: EmojiSkin
  onClick: (emojiId: string) => void
}

function getEmojiSkin(skins: EmojiItem[], currentSkin: EmojiSkin) {
  const computedSkin = skins.length > 1 ? skins[currentSkin] : skins[0]

  const emoji = computedSkin

  return emoji
}
export const EmojiButton: FC<EmojiButtonProps> = ({skins, currentSkin, onClick}) => {
  const withCurrentSkin = useMemo(() => {
    return getEmojiSkin(skins, currentSkin)
  }, [currentSkin])

  const handleClick = useCallback((e: TargetedEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault()

    onClick(withCurrentSkin.native)
  }, [])

  const src = `emoji/${withCurrentSkin.unified}.png`

  return (
    <>
      <span
        data-emoji-native={withCurrentSkin.native}
        class="emoji-item"
        onMouseDown={handleClick}
        title={`${withCurrentSkin.native}`}
      >
        {IS_EMOJI_SUPPORTED ? (
          withCurrentSkin.native
        ) : (
          <img
            width={34}
            height={34}
            alt={withCurrentSkin.native}
            src={src}
            // loading="lazy"
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
    </>
  )
}
