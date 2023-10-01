import {useEffect, useState} from 'preact/hooks'

import {getGlobalState} from 'state/signal'

// export const useLayout = () => {
//   const [isMobile, setIsMobile] = useState(window.matchMedia('(max-width: 480px)').matches)
//   const [isTablet, setIsTablet] = useState(
//     window.matchMedia('(min-width: 480.1px) and (max-width: 768px)').matches
//   )
//   const [isLaptop, setIsLaptop] = useState(
//     window.matchMedia('(min-width: 768.1px) and (max-width: 1280px)').matches
//   )

//   // const []

//   useEffect(() => {
//     const handleResize = () => {
//       const isMobile = window.matchMedia('(max-width: 480px)').matches
//       setIsMobile(isMobile)
//       const isTablet = window.matchMedia('(min-width: 480.1px) and (max-width: 768px)').matches
//       const isLaptop = window.matchMedia(
//         '(min-width: 768.1px) and (max-width: 1280px)'
//       ).matches

//       setIsMobile(isMobile)
//       setIsLaptop(isLaptop)
//       setIsTablet(isTablet)
//     }

//     handleResize()

//     window.addEventListener('resize', handleResize)

//     return () => {
//       window.removeEventListener('resize', handleResize)
//     }
//   }, [])

//   return {isMobile, isLaptop, isTablet}
// }

export const useLayout = () => {
  const global = getGlobalState()
  const getWindowMatches = () => ({
    isMobile: window.matchMedia('(max-width: 480px)').matches,
    isTablet: window.matchMedia('(min-width: 480.1px) and (max-width: 768px)').matches,
    isLaptop: window.matchMedia('(min-width: 768.1px) and (max-width: 1280px)').matches,
    isSmall: window.matchMedia('(max-width: 768px)').matches,
    isAnimationOff: !global.settings.general.animationsEnabled,
  })

  const [layout, setLayout] = useState(getWindowMatches)

  useEffect(() => {
    const handleResize = () => {
      setLayout(getWindowMatches())
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return layout
}
// У цьому варіанті функція getWindowMatches створює об'єкт зі значеннями для isMobile, isTablet та isLaptop. Функція useLayout використовує useState для збереження стану та useEffect для слідкування за змінами розміру вікна та оновлення значень layout.
