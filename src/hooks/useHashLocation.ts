import { navigate, useLocationProperty } from 'wouter-preact/use-location'

type NavigateFunction = (to: string) => void

const hashLocation = () => window.location.hash.replace(/^#/, '') || '/'

const hashNavigate = (to: string) => {
  if (to.length > 5) {
    return navigate('#' + to, { replace: true })
  }
  throw new Error('Invalid hash')
}
export const useHashLocation = (): [string, NavigateFunction] => {
  const location = useLocationProperty(hashLocation)
  return [location, hashNavigate]
}
