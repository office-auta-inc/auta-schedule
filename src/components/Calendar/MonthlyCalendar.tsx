import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Event } from '../../hooks/useEvents'
import { getHolidayName } from '../../lib/holidays'

interface Props {
  currentDate: Date
  events: Event[]
  onNavigate: (date: Date) => void
  onDayClick: (date: Date) => void
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function MonthlyCalendar({ currentDate, events, onNavigate, onDayClick }: Props) {
  const today = new Date()
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })

  const days: Date[] = []
  let d = calStart
  while (d <= calEnd) {
    days.push(new Date(d))
    d = addDays(d, 1)
  }

  const getEventsForDay = (date: Date) =>
    events.filter(e => isSameDay(new Date(e.start_time), date))

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => onNavigate(subMonths(currentDate, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"
        >
          ‹
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {format(currentDate, 'yyyy年 M月', { locale: ja })}
        </h2>
        <button
          onClick={() => onNavigate(addMonths(currentDate, 1))}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-500"
        >
          ›
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center py-2 text-xs font-medium ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const isToday = isSameDay(day, today)
          const isCurrentMonth = isSameMonth(day, currentDate)
          const dayOfWeek = day.getDay()
          const holidayName = getHolidayName(day)
          const isHolidayDay = holidayName !== null
          const dayEvents = getEventsForDay(day)

          return (
            <div
              key={idx}
              onClick={() => onDayClick(day)}
              className={`min-h-[90px] p-1 border-b border-r border-gray-50 cursor-pointer hover:bg-indigo-50 transition ${
                !isCurrentMonth ? 'bg-gray-50' : ''
              } ${isHolidayDay ? 'bg-red-50' : ''}`}
            >
              {/* 日付番号 */}
              <div className="flex items-start justify-between mb-0.5">
                <span
                  className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium ${
                    isToday
                      ? 'bg-indigo-500 text-white'
                      : !isCurrentMonth
                      ? 'text-gray-300'
                      : isHolidayDay
                      ? 'text-red-500'
                      : dayOfWeek === 0
                      ? 'text-red-400'
                      : dayOfWeek === 6
                      ? 'text-blue-400'
                      : 'text-gray-700'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>
              {/* 祝日名 */}
              {holidayName && isCurrentMonth && (
                <p className="text-[9px] text-red-400 leading-none mb-0.5 truncate">{holidayName}</p>
              )}
              {/* イベント */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map(ev => (
                  <div
                    key={ev.id}
                    className="text-[10px] px-1 py-0.5 rounded truncate text-white"
                    style={{ backgroundColor: ev.color ?? '#6366f1' }}
                  >
                    {ev.all_day ? '' : format(new Date(ev.start_time), 'HH:mm') + ' '}
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[10px] text-gray-400 pl-1">+{dayEvents.length - 3}件</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
