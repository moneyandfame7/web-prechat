import type {FC} from 'preact/compat'
import {Suspense, lazy, memo} from 'preact/compat'

// function timeout<T>(time: number) {
//   return (value: T) =>
//     new Promise<T>((res) => {
//       setTimeout(() => res(value), time)
//     })
// }
// const Lock = lazy(() =>
//   import('./Lock').then((module) => module.default).then(timeout(5000))
// )
const LockAsync: FC = (props) => {
  const Lock = lazy(() => import('./Lock'))

  return (
    <Suspense fallback="Lock loading...">
      <Lock {...props} />
    </Suspense>
  )
}

export default memo(LockAsync)
