import {type FC, memo} from 'preact/compat'

import {useLazyComponent} from 'hooks/useLazy'

import type {CalendarModalProps} from './CalendarModal'

const CalendarModalAsync: FC<CalendarModalProps> = (props) => {
  const CalendarModal = useLazyComponent('CalendarModal', !props.isOpen)
  // const Component = useLazyComponent('Notification', !props.isOpen)

  return CalendarModal ? <CalendarModal {...props} /> : null
  // return NewContactModal ? <NewContactModal {...props} /> : null
}

export default memo(CalendarModalAsync)
