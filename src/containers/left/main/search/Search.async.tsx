import {type FC, Suspense, lazy, memo} from 'preact/compat'

const Search = lazy(() => import('./Search'))

const SearchAsync: FC = (props) => {
  return (
    <Suspense fallback={null}>
      <Search {...props} />
    </Suspense>
  )
}

export default memo(SearchAsync)
