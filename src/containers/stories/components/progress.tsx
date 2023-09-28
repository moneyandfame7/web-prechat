import {type CSSProperties, type FC} from 'preact/compat'

type StoryProgressType = 'active' | 'prev' | 'next'
interface StoryProgressProps {
  width: number
  type: StoryProgressType
  progress: number
}

const StoryProgress: FC<StoryProgressProps> = ({width, type, progress}) => {
  function getProgressStyle(type: StoryProgressType): Partial<CSSProperties> {
    switch (type) {
      case 'active':
        return {transform: `scaleX(${progress / 100})`}
      case 'prev':
        return {width: '100%'}
      case 'next':
        return {width: 0}
      default:
        return {width: 0}
    }
  }

  return (
    <div class="story-progress-wrapper" style={{width: `${width * 100}%`}}>
      <div
        class="story-progress"
        style={{
          ...getProgressStyle(type),
        }}
      />
    </div>
  )
}

export {StoryProgress}
