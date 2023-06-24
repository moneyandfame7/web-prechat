import { FC, Suspense, lazy, memo } from 'preact/compat'

const MainAsync: FC = (props) => {
  const Main = lazy(() => import('./Main'))

  return (
    <Suspense fallback="Loading main...">
      <Main {...props} />
    </Suspense>
  )
}

export default memo(MainAsync)
