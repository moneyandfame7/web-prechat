import { useEffect, useState } from 'preact/hooks'

export const useLayout = () => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches)

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      setIsMobile(isMobile)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return { isMobile }
}
