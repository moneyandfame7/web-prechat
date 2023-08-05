import {type FC, Suspense, lazy, memo} from 'preact/compat'

import {ScreenLoader} from 'components/ScreenLoader'
const Search = lazy(() => import('./Search'))

const SearchAsync: FC = (props) => {
  return (
    <Suspense fallback={<ScreenLoader />}>
      <Search {...props} />
    </Suspense>
  )
}

export default memo(SearchAsync)
