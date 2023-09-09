import type {ComponentChildren, VNode} from 'preact'
import {type FC, memo, useEffect, useRef, useState} from 'preact/compat'

import clsx from 'clsx'

import {IconButton} from './ui'

import './ColumnWrapper.scss'

interface ColumnWrapperProps {
  title?: string
  onGoBack: VoidFunction
  children: ComponentChildren
  headerContent?: VNode
}
const ColumnWrapper: FC<ColumnWrapperProps> = memo(
  ({title, children, onGoBack, headerContent}) => {
    const contentColumnRef = useRef<HTMLDivElement>(null)
    const [isScrolled, setIsScrolled] = useState(false)

    const headerClass = clsx('column-header', {
      scrolled: isScrolled,
    })

    useEffect(() => {
      const handleScroll = () => {
        if (!contentColumnRef.current) {
          return
        }
        const isScrolled = contentColumnRef.current.scrollTop > 0

        setIsScrolled(isScrolled)
      }

      contentColumnRef.current?.addEventListener('scroll', handleScroll)

      return () => contentColumnRef.current?.removeEventListener('scroll', handleScroll)
    }, [])

    return (
      <>
        <div class={headerClass}>
          <IconButton icon="arrowLeft" onClick={onGoBack} />
          {title && <p class="column-header__title">{title}</p>}
          {headerContent}

          {/* {actions && <div class="column-header__actions">{actions}</div>} */}
        </div>

        <div class="column-content scrollable scrollable-y" ref={contentColumnRef}>
          {children}
        </div>
      </>
    )
  }
)

export {ColumnWrapper}
