import { FC, useState } from 'preact/compat'

import './app.css'

export const App: FC = () => {
  const [state, setState] = useState(0)

  return (
    <>
      <button
        onMouseDown={(e) => {
          e.preventDefault()
          setState((prev) => prev + 1)
        }}
      >
        Just click on me
      </button>
      <h1>Hello world! for {state}</h1>
      <h2>Environment variable: {import.meta.env.VITE_TEST_KEY}</h2>
    </>
  )
}
