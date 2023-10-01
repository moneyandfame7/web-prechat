import {type FC} from 'preact/compat'

import {TEST_translate} from 'lib/i18n'

import {useLeftColumn} from 'containers/left/context'

import {ColumnWrapper} from 'components/ColumnWrapper'

const MyStories: FC = () => {
  const {resetScreen} = useLeftColumn()
  return (
    <ColumnWrapper onGoBack={resetScreen} title={TEST_translate('MyStories')}>
      Lalala
    </ColumnWrapper>
  )
}

export {MyStories}
