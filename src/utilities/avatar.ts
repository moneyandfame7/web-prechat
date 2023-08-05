import {API_AVATAR_VARIANTS} from './../common/config'

import {getRandom} from './number/getRandom'

export function getRandomAvatarVariant() {
  return API_AVATAR_VARIANTS[getRandom(0, API_AVATAR_VARIANTS.length - 1)]
}
