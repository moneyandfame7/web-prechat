import type {VNode} from 'preact'

import {ReactComponent as MonkeyFallback} from 'assets/monkey.svg'
import {ReactComponent as EmptyFolderFallback} from 'assets/skeletons/empty-folder.svg'

import type {LottieAnimations} from './types'

export function getFallback(name: LottieAnimations): VNode | undefined {
  if (name.includes('Monkey-')) {
    return <MonkeyFallback />
  } else if (name === 'Empty-folder') {
    return <EmptyFolderFallback />
  }
}
