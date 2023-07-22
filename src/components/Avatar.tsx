import type {FC} from 'preact/compat'

import './Avatar.scss'
interface AvatarProps {
  url: string
}
export const Avatar: FC<AvatarProps> = ({url}) => {
  return <img class="Avatar" src={url} alt="Avatar" />
}
