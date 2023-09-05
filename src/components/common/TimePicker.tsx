import {type FC, memo, useCallback, useEffect, useState} from 'preact/compat'

import {InputText} from 'components/ui'

import './TimePicker.scss'

function formatInputTime(value: string | number) {
  return String(value).padStart(2, '0')
}

interface TimePickerProps {
  date: Date
  onChange: (time: Date) => void
}
export const TimePicker: FC<TimePickerProps> = memo(({onChange, date}) => {
  useEffect(() => {
    setHour(formatInputTime(date.getHours()))
    setMinute(formatInputTime(date.getMinutes()))
  }, [date])

  const [hour, setHour] = useState<string>(() => formatInputTime(date.getHours()))
  const [minute, setMinute] = useState<string>(() => formatInputTime(date.getMinutes()))
  const handleChangeHours = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.replace(/[^\d]+/g, '')
      if (!value.length) {
        setHour('00')
        e.currentTarget.value = '00'

        return
      }

      const hours = Math.max(0, Math.min(Number(value), 23))

      const time = new Date(date.getTime())
      time.setHours(hours)

      onChange(time)

      const hoursStr = formatInputTime(hours)
      setHour(hoursStr)
      e.currentTarget.value = hoursStr
    },
    [date]
  )

  const handleChangeMinutes = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value.replace(/[^\d]+/g, '')
      if (!value.length) {
        setMinute('00')
        e.currentTarget.value = '00'
        return
      }

      const minutes = Math.max(0, Math.min(Number(value), 59))

      const time = new Date(date.getTime())
      time.setMinutes(minutes)
      onChange?.(time)

      const minutesStr = formatInputTime(minutes)
      setMinute(minutesStr)
      e.currentTarget.value = minutesStr
    },
    [date]
  )

  return (
    <div class="time-picker">
      <InputText inputMode="decimal" type="text" onInput={handleChangeHours} value={hour} />
      <span class="time-picker__divider">:</span>
      <InputText
        inputMode="decimal"
        type="text"
        onInput={handleChangeMinutes}
        value={minute}
      />
      {/* <b>12h: </b>Вибрано час: {formatTime(hour, minute, true)}
      <br />
      <b>24hh: </b>Вибрано час: {formatTime(hour, minute, false)}
      <br />
      {formatDate(date, true, true)} */}
    </div>
  )
})
