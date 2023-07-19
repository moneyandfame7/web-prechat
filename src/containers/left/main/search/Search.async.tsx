import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {timeout} from 'utilities/timeout'
import {ScreenLoader} from 'components/ScreenLoader'

const SearchAsync: FC = (props) => {
  const Search = lazy(() =>
    import('./Search').then((module) => module.default).then(timeout(0))
  )

  return (
    <Suspense fallback={<ScreenLoader />}>
      <Search {...props} />
    </Suspense>
  )
}

export default memo(SearchAsync)
