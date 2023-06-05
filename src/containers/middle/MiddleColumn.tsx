import { FC } from 'preact/compat'

import { useHashLocation } from '@hooks'

export const MiddleColumn: FC = () => {
  const [hash] = useHashLocation()

  const isValidId = hash.length > 5
  return isValidId ? <h1>ID: {hash}</h1> : <>INVALID EBANIY</>
}
