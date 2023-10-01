import type {ComponentType} from 'preact'
import type {FC} from 'preact/compat'
import {useEffect} from 'preact/hooks'

import type {SignalGlobalState} from 'types/state'

import {getGlobalState} from './signal'

export type MapState<OwnProps, StateProps> = (
  state: SignalGlobalState,
  ownProps: OwnProps
) => StateProps

/**
 * Взято з просторів чатжпт :)
 */
export function connect<OwnProps, StateProps>(
  mapStateToProps: MapState<OwnProps, StateProps>
) {
  return function (WrappedComponent: ComponentType<OwnProps & StateProps>) {
    // Компонент-обгортка для з'єднання з Redux
    const ConnectWrapper: FC<OwnProps /* & DispatchProps */> = (props) => {
      useEffect(() => {
        // Приклад використання useEffect для підписки на зміни сторінки Redux
        // Підписатися на сторінку Redux або розмістити логіку, яка повинна виконуватися при зміні сторінки
        // cleanup якщо потрібно
        return () => {
          // Відписати від сторінки Redux або виконати необхідні дії перед видаленням компонента
        }
      }, [])
      const global = getGlobalState()
      const mappedProps = mapStateToProps(global, props)
      return (
        <WrappedComponent
          {...props}
          {...mappedProps}
          // {...mapDispatchToProps(props.store.dispatch, props)}
        />
      )
    }

    // Повертаємо компонент-обгортку
    return ConnectWrapper
  }
}
