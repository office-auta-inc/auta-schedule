import { useState } from 'react'
import { format, getDaysInMonth } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Props {
  startTime: Date
  endTime: Date
  onChangeStart: (d: Date) => void
  onChangeEnd: (d: Date) => void
}

type ActiveField = 'start' | 'end'

function TimeInput({
  label,
  value,
  onChange,
  active,
  onClick,
}: {
  label: string
  value: Date
  onChange: (d: Date) => void
  active: boolean
  onClick: () => void
}) {
  const hh = format(value, 'HH')
  const mm = format(value, 'mm')

  const adjustHour = (delta: number) => {
    const d = new Date(value)
    d.setHours((d.getHours() + delta + 24) % 24)
    onChange(d)
  }

  const adjustMin = (delta: number) => {
    const d = new Date(value)
    d.setMinutes((d.getMinutes() + delta + 60) % 60)
    onChange(d)
  }

  const handleHourInput = (v: string) => {
    const n = parseInt(v)
    if (!isNaN(n) && n >= 0 && n <= 23) {
      const d = new Date(value)
      d.setHours(n)
      onChange(d)
    }
  }

  const handleMinInput = (v: string) => {
    const n = parseInt(v)
    if (!isNaN(n) && n >= 0 && n <= 59) {
      const d = new Date(value)
      d.setMinutes(n)
      onChange(d)
    }
  }

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-3 cursor-pointer border-2 transition ${
        active ? 'border-indigo-400 bg-indigo-50' : 'border-transparent bg-gray-50 hover:bg-gray-100'
      }`}
    >
      <p className="text-xs font-medium text-gray-500 mb-2">{label}</p>
      <p className="text-xs text-gray-400 mb-2">{format(value, 'M月d日（EEE）', { locale: ja })}</p>
      <div className="flex items-center gap-1">
        {/* 時 */}
        <div className="flex flex-col items-center">
          <button type="button" onClick={e => { e.stopPropagation(); adjustHour(1) }} className="text-gray-400 hover:text-indigo-500 text-xs leading-none py-0.5">▲</button>
          <input
            type="text"
            value={hh}
            onChange={e => handleHourInput(e.target.value)}
            onClick={e => e.stopPropagation()}
            className="w-9 text-center text-lg font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded"
            maxLength={2}
          />
          <button type="button" onClick={e => { e.stopPropagation(); adjustHour(-1) }} className="text-gray-400 hover:text-indigo-500 text-xs leading-none py-0.5">▼</button>
        </div>
        <span className="text-lg font-bold text-gray-500 mb-px">:</span>
        {/* 分 */}
        <div className="flex flex-col items-center">
          <button type="button" onClick={e => { e.stopPropagation(); adjustMin(15) }} className="text-gray-400 hover:text-indigo-500 text-xs leading-none py-0.5">▲</button>
          <input
            type="text"
            value={mm}
            onChange={e => handleMinInput(e.target.value)}
            onClick={e => e.stopPropagation()}
            className="w-9 text-center text-lg font-bold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded"
            maxLength={2}
          />
          <button type="button" onClick={e => { e.stopPropagation(); adjustMin(-15) }} className="text-gray-400 hover:text-indigo-500 text-xs leading-none py-0.5">▼</button>
        </div>
      </div>
    </div>
  )
}

export default function DateTimePicker({ startTime, endTime, onChangeStart, onChangeEnd }: Props) {
  const [active, setActive] = useState<ActiveField>('start')

  const activeDate = active === 'start' ? startTime : endTime
  const setActiveDate = active === 'start' ? onChangeStart : onChangeEnd

  const year = activeDate.getFullYear()
  const month = activeDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = getDaysInMonth(activeDate)

  const selectDay = (day: number) => {
    const d = new Date(activeDate)
    d.setDate(day)
    setActiveDate(d)
  }

  const prevMonth = () => {
    const d = new Date(activeDate)
    d.setMonth(d.getMonth() - 1)
    setActiveDate(d)
  }

  const nextMonth = () => {
    const d = new Date(activeDate)
    d.setMonth(d.getMonth() + 1)
    setActiveDate(d)
  }

  const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="w-64 border-l border-gray-100 flex flex-col flex-shrink-0 bg-white">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500">日時を選択</p>
      </div>

      <div className="p-3 space-y-2">
        <TimeInput
          label="開始"
          value={startTime}
          onChange={onChangeStart}
          active={active === 'start'}
          onClick={() => setActive('start')}
        />
        <TimeInput
          label="終了"
          value={endTime}
          onChange={onChangeEnd}
          active={active === 'end'}
          onClick={() => setActive('end')}
        />
      </div>

      {/* ミニカレンダー */}
      <div className="px-3 pb-3">
        <div className="flex items-center justify-between mb-2">
          <button type="button" onClick={prevMonth} className="text-gray-400 hover:text-gray-600 px-1">‹</button>
          <span className="text-xs font-medium text-gray-700">
            {format(activeDate, 'yyyy年M月', { locale: ja })}
          </span>
          <button type="button" onClick={nextMonth} className="text-gray-400 hover:text-gray-600 px-1">›</button>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`text-center text-[10px] font-medium py-0.5 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>{w}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const isSelected = activeDate.getDate() === day
            const isToday = new Date().getDate() === day &&
              new Date().getMonth() === month &&
              new Date().getFullYear() === year

            return (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                className={`text-[11px] w-full aspect-square flex items-center justify-center rounded-full transition ${
                  isSelected
                    ? 'bg-indigo-500 text-white'
                    : isToday
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
