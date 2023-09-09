import {type FC, memo, useCallback} from 'preact/compat'

import {IconButton} from 'components/ui'

import {useLeftColumn} from './context'

import './LeftGoBack.scss'

interface LeftGoBackProps {
  force?: boolean
}
export const LeftGoBack: FC<LeftGoBackProps> = memo(({force = true, ...props}) => {
  const {resetScreen} = useLeftColumn()

  const handleClick = () => {
    resetScreen(force)
  }
  return (
    <IconButton
      ripple={false}
      className="left-go-back"
      icon="arrowLeft"
      onClick={handleClick}
      {...props}
    />
  )
})
