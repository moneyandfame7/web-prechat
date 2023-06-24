import type { ComponentChildren } from 'preact'
import { type FC, useEffect } from 'preact/compat'
import { useSignal } from '@preact/signals'

import { Spinner } from './Spinner'
import { MountTransition } from './MountTransition'

import './PageLoader.scss'

enum PageScreens {
  Loading = 'Loading',
  Children = 'Children'
}
interface PageLoaderProps {
  on: boolean
  children: ComponentChildren
}
export const PageLoader: FC<PageLoaderProps> = ({ children, on }) => {
  const activeKey = useSignal<PageScreens>(PageScreens.Loading)

  const renderContent = () => {
    switch (activeKey.value) {
      case PageScreens.Children:
        return (
          <div style={{ height: '100%' }} key={PageScreens.Children}>
            {children}
          </div>
        )
      case PageScreens.Loading:
        return (
          <div class="PageLoader" key={PageScreens.Loading}>
            <Spinner size="large" />
          </div>
        )
    }
  }

  useEffect(() => {
    if (on) {
      activeKey.value = PageScreens.Loading
    } else {
      activeKey.value = PageScreens.Children
    }
  }, [on])
  return (
    <MountTransition
      classNames="scrollable"
      name="fade"
      shouldCleanup
      initial={false}
      activeKey={activeKey.value}
    >
      {renderContent()}
    </MountTransition>
  )
}
