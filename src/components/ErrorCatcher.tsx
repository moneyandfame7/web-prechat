import { VNode } from 'preact'
import { FC } from 'preact/compat'
import { useErrorBoundary } from 'preact/hooks'

interface ErrorCatcherProps {
  children: VNode
}
export const ErrorCatcher: FC<ErrorCatcherProps> = ({ children }) => {
  const [error, resetError] = useErrorBoundary()

  return error ? (
    <div style={{ background: 'red', padding: 15 }}>
      {error.message}
      <button onClick={resetError}>Try to reset error</button>
    </div>
  ) : (
    <>{children}</>
  )
}
