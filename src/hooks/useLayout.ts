import {useEffect, useState} from 'preact/hooks'

export const useLayout = () => {
  const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 768px)').matches)
  const [isLaptop, setIsLaptop] = useState(
    window.matchMedia('(min-width: 768.1px) and (max-width: 1280px)').matches
  )

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      setIsMobile(isMobile)
      const isLaptop = window.matchMedia(
        '(min-width: 768.1px) and (max-width: 1280px)'
      ).matches
      setIsMobile(isMobile)
      setIsLaptop(isLaptop)
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {isMobile, isLaptop}
}
