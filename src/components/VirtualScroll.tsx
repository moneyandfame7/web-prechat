import {type FC, type PropsWithChildren, forwardRef} from 'preact/compat'

import {
  type CustomItemComponent,
  type CustomItemComponentProps,
  type CustomViewportComponent,
  type CustomViewportComponentProps,
  VList,
} from 'virtua'

const VirtualScrollContainer = forwardRef<HTMLDivElement, CustomViewportComponentProps>(
  ({attrs, height, children}, ref) => {
    return (
      <div ref={ref} {...(attrs as any)}>
        <ul style={{position: 'relative', height, margin: 0}}>{children}</ul>
      </div>
    )
  }
)

const VirtualScrollItem = forwardRef<HTMLLIElement, CustomItemComponentProps>(
  ({children, style}, ref) => {
    return (
      <li ref={ref} style={{...style, marginLeft: 30}}>
        {children}
      </li>
    )
  }
)

export const VirtualScroll: FC<PropsWithChildren> = ({children}) => {
  return (
    // <div
    //   style={{
    //     // width: 400,
    //     width: '100%',
    //     height: '100%',
    //     // height: 400,
    //     // border: 'solid 1px darkgray',
    //     // borderRadius: 8,
    //     // background: 'lightgray',
    //     // display: 'flex',
    //     // flexDirection: 'column',
    //     // overflow: 'hidden',
    //   }}
    // >
    //
    /* @ts-expect-error Preact types are confused */
    <VList
      style={{
        flex: 1,
      }}
      components={{
        Root: VirtualScrollContainer as CustomViewportComponent,
        Item: VirtualScrollItem as CustomItemComponent,
      }}
      overscan={10}
    >
      {children}
      {/* {Array.from({
        length: 1000,
      }).map((_, i) => i)} */}
    </VList>
    // </div>
  )
}
