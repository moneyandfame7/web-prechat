import type {LottieAnimations} from './types'

export function getFallback(name: LottieAnimations): string | undefined {
  if (name.includes('Monkey-')) {
    return 'images/monkey.svg'
  } else if (name === 'Empty-folder') {
    return 'images/empty-folder-skeleton.svg'
  } else if (name.includes('Device')) {
    const device = name.split('Device-')[1]
    return `devices/${device}.svg`
  }
}
