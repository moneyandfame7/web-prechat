import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {EmojiPickerProps} from './EmojiPicker'

const EmojiPickerAsync: FC<EmojiPickerProps> = (props) => {
  const EmojiPicker = useLazyComponent('EmojiPicker', !props.isOpen)

  return EmojiPicker ? <EmojiPicker {...props} /> : null
}

export default memo(EmojiPickerAsync)
