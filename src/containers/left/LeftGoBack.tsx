import { type FC, memo } from 'preact/compat'

import { useLeftMainColumn } from 'containers/left/main/context'

import { IconButton } from 'components/ui'

import './LeftGoBack.scss'

export const LeftGoBack: FC = memo((props) => {
  const { resetScreen } = useLeftMainColumn()

  return <IconButton icon="arrowLeft" onClick={resetScreen} {...props} />
})
