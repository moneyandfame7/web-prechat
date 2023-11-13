import {type FC} from 'preact/compat'

import './Dots.scss'

interface OwnProps {
  text: string
  className?: string
}
const Dots: FC<OwnProps> = ({text, className}) => {
  return <p class={`animated-ellipsis${className || ''}`}>{text}</p>
}

export {Dots}
