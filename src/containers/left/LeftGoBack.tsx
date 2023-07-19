import {type FC, memo, useCallback} from 'preact/compat'

import {IconButton} from 'components/ui'

import {useLeftColumn} from './context'

import './LeftGoBack.scss'

interface LeftGoBackProps {
  force?: boolean
}
export const LeftGoBack: FC<LeftGoBackProps> = memo(({force = true, ...props}) => {
  const {resetScreen} = useLeftColumn()

  const handleClick = useCallback(() => {
    resetScreen(force)
  }, [force])
  return <IconButton icon="arrowLeft" onClick={handleClick} {...props} />
})
