import {type FC, Suspense, lazy, memo} from 'preact/compat'

const MainAsync: FC = props => {
  const Main = lazy(() => import('./Main'))

  return (
    <Suspense fallback="">
      <Main {...props} />
    </Suspense>
  )
}

export default memo(MainAsync)
