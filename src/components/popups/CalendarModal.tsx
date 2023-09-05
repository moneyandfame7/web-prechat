import {
  type FC,
  cloneElement,
  memo,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'preact/compat'

import clsx from 'clsx'
import {useRef} from 'react'
import {CSSTransition, TransitionGroup} from 'react-transition-group'

import {
  type DateCellItem,
  WEEKDAYS_LANG,
  daysOfTheWeek,
  getCurrentMothDays,
  getDaysAmountInAMonth,
  getNextMonthDays,
  getPreviousMonthDays,
  isCellInRange,
  isInRange,
  isTheSameMonth,
  isToday,
  months,
} from 'utilities/date/calendar'
import {getNow} from 'utilities/date/now'

import {TimePicker} from 'components/common/TimePicker'
import {IconButton} from 'components/ui'

import {Modal} from './modal'
import {ModalContent, ModalHeader, ModalTitle} from './modal/Modal'

import './CalendarModal.scss'

/**
 * @todo
 * refactor styles - []
 * add navigation by arrow - if up - -7 day, if left - -1d, if right - +1d, if down - +7d
 * slide transition
 * check preact css transition, and css transition switch, etc
 */
export interface CalendarModalProps {
  /* Calendar props */
  min?: Date
  max?: Date
  initial?: Date
  withTime?: boolean
  onlyPast?: boolean
  onlyFuture?: boolean
  onSubmit: (date: Date) => void

  /* Modal props */
  isOpen: boolean
  onClose: VoidFunction
}
const CalendarModal: FC<CalendarModalProps> = ({
  min,
  max,
  initial,
  withTime,
  isOpen,
  onSubmit,
  onClose,
  onlyFuture,
  onlyPast,
}) => {
  const now = useMemo(getNow, [])
  const initialDate = useMemo(() => initial || new Date(), [initial])

  const [selectedDate, setSelectedDate] = useState(() => initialDate)
  const [panelYear, setPanelYear] = useState(() => selectedDate.getFullYear())
  const [panelMonth, setPanelMonth] = useState(() => selectedDate.getMonth())

  const [year, month, day] = useMemo(() => {
    const currentYear = selectedDate.getFullYear()
    const currentDay = selectedDate.getDate()
    const currentMonth = selectedDate.getMonth()

    return [currentYear, currentMonth, currentDay]
  }, [selectedDate])
  const isNext = useRef(false)
  const dateCells = useMemo(() => {
    const daysInAMonth = getDaysAmountInAMonth(panelYear, panelMonth)

    const currentMonthDays = getCurrentMothDays(panelYear, panelMonth, daysInAMonth)
    const prevMonthDays = getPreviousMonthDays(panelYear, panelMonth)
    const nextMonthDays = getNextMonthDays(panelYear, panelMonth)

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays]
  }, [panelYear, panelMonth])

  const onDateSelect = useCallback((item: DateCellItem) => {
    const onSelectNow = getNow()

    const newSelectedDate = new Date(
      item.year,
      item.month,
      item.date,
      onSelectNow.getHours(),
      onSelectNow.getMinutes(),
      onSelectNow.getSeconds()
    )
    onSubmit(newSelectedDate)
    setPanelMonth(item.month)
    setPanelYear(item.year)

    setSelectedDate(newSelectedDate)
  }, [])

  const handleSelectNextMonth = () => {
    isNext.current = true

    if (panelMonth === 11) {
      setPanelMonth(0)
      setPanelYear(panelYear + 1)
    } else {
      setPanelMonth(panelMonth + 1)
    }
  }
  const handleSelectPrevMonth = () => {
    isNext.current = false

    if (panelMonth === 0) {
      setPanelMonth(11)
      setPanelYear(panelYear - 1)
    } else {
      setPanelMonth(panelMonth - 1)
    }
  }

  const canSelectPrevMonth = onlyFuture
    ? isInRange(new Date(panelYear, panelMonth - 1, initialDate.getDate()), initialDate)
    : isInRange(new Date(panelYear, panelMonth), min, max)
  const canSelectNextMonth = onlyPast
    ? isInRange(new Date(panelYear, panelMonth + 1 /* , day */), undefined, initialDate)
    : max
    ? !isTheSameMonth(new Date(panelYear, panelMonth), max)
    : true

  useLayoutEffect(() => {
    if (!initial) {
      return
    }

    setPanelMonth(initial.getMonth())
    setPanelYear(initial.getFullYear())
  }, [initial])
  return (
    <Modal
      className="calendar-modal"
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc
      shouldCloseOnBackdrop
    >
      <ModalHeader hasCloseButton>
        <ModalTitle>
          {months[panelMonth]} {panelYear}
        </ModalTitle>

        <div className="CalendarPanel__buttons-left">
          {/* <button onClick={handleSelectPrevMonth} disabled={!canSelectPrevMonth}>
            Prev Month
          </button> */}
          <IconButton
            isDisabled={!canSelectPrevMonth}
            icon="previous"
            color="primary"
            onClick={handleSelectPrevMonth}
          />
        </div>
        <div className="CalendarPanel__buttons-right">
          {/* <button onClick={handleSelectNextMonth} disabled={!canSelectNextMonth}>
            Next Month
          </button> */}
          {/* <IconButton icon="next" /> */}
          <IconButton
            isDisabled={!canSelectNextMonth}
            icon="next"
            color="primary"
            onClick={handleSelectNextMonth}
          />
        </div>
      </ModalHeader>
      <ModalContent>
        <div className="CalendarPanel">
          <div class="calendar-weekdays">
            {daysOfTheWeek.map((weekDay) => (
              <div key={weekDay} className="weekday">
                {weekDay}
              </div>
            ))}
          </div>
          <TransitionGroup
            className="container"
            childFactory={(child) => {
              return cloneElement(child, {
                classNames: isNext.current ? 'right-to-left' : 'left-to-right',
                timeout: 500,
              })
            }}
          >
            <CSSTransition
              mountOnEnter
              // unmountOnExit
              alwaysMounted={false}
              duration={500}
              classNames="right-to-left"
              key={`${panelYear}-${panelMonth}`}

              // nodeRef={nodeRef}
            >
              <div className="CalendarPanel__content step">
                {dateCells.map((cell) => {
                  const isSelectedDate =
                    cell.year === year && cell.month === month && cell.date === day
                  const isTodayDate = isToday(cell, now)
                  const isNotCurrent = cell.type !== 'current'

                  const inRange = isCellInRange({
                    onlyFuture,
                    onlyPast,
                    cell,
                    min,
                    max,
                    initial: initialDate,
                  })
                  return (
                    <div
                      className={clsx(
                        'CalendarPanelItem',
                        isSelectedDate && 'CalendarPanelItem--selected',
                        isTodayDate && 'CalendarPanelItem--today',
                        isNotCurrent && 'CalendarPanelItem--not-current',
                        !inRange && 'CalendarPanelItem--not-in-range',
                        {}
                      )}
                      key={`${cell.date}-${cell.month}-${cell.year}`}
                      onClick={() => inRange && onDateSelect(cell)}
                    >
                      <div className="CalendarPanelItem__date">{cell.date}</div>
                    </div>
                  )
                })}
              </div>
            </CSSTransition>
          </TransitionGroup>

          <TimePicker
            onChange={(t) => {
              setSelectedDate(t)
            }}
            date={selectedDate}
          />
        </div>
      </ModalContent>
    </Modal>
  )
}

export default memo(CalendarModal)
