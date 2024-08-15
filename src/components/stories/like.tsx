import {type FC} from 'preact/compat'

import clsx from 'clsx'

import styles from './like.module.scss'

interface StoryLikeProps {
  isLiked: boolean
  onToggle: VoidFunction
}
const StoryLike: FC<StoryLikeProps> = ({isLiked, onToggle}) => {
  const buildedClass = clsx(styles.storyLike, {
    [styles.isLiked]: isLiked,
  })
  return <div onClick={onToggle} class={buildedClass} />
}

export {StoryLike}
