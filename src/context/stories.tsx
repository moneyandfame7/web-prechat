import {createContext} from 'preact'
import {type FC, type PropsWithChildren, useContext} from 'preact/compat'

import type {ApiStory} from 'api/types/stories'

interface IStoriesContext {
  isPaused: boolean
  defaultDuration: number
  storyId: number
  onNext?: VoidFunction
  onPrev?: VoidFunction
  onAllStoriesEnd?: (index: number) => void
  onStoryStart?: (index: number, story: ApiStory) => void
  onStoryEnd?: (index: number, story: ApiStory) => void
  loop?: boolean
  stories: ApiStory[]
  handlePrev: VoidFunction
  handleNext: VoidFunction
}
interface StoriesProviderProps extends PropsWithChildren {
  value: IStoriesContext
}

const StoriesContext = createContext<IStoriesContext | null>(null)

export const StoriesProvider: FC<StoriesProviderProps> = ({value, children}) => {
  return <StoriesContext.Provider value={value}>{children}</StoriesContext.Provider>
}
export function useStories() {
  const context = useContext(StoriesContext)

  if (!context) {
    throw new Error('Cannot use StoriesContext outside the StoriesProvider')
  }

  return context
}
