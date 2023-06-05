import { FC, Suspense, lazy, memo } from 'preact/compat'

function timeout<T>(time: number) {
  return (value: T) =>
    new Promise<T>((res) => {
      setTimeout(() => res(value), time)
    })
}
const Lock = lazy(() =>
  import('./Lock').then((module) => module.default).then(timeout(5000))
)
const LockAsync: FC = () => {
  return (
    <Suspense fallback="Lock loading...">
      <Lock />
    </Suspense>
  )
}

export default memo(LockAsync)
