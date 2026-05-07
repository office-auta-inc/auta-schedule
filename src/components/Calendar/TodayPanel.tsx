import type { Event } from '../../hooks/useEvents'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface Props {
  events: Event[]
}

export default function TodayPanel({ events }: Props) {
  const today = new Date()

  return (
    <aside className="w-52 bg-white border-r border-gray-100 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">今日の予定</p>
        <p className="text-sm font-medium text-gray-700 mt-0.5">
          {format(today, 'M月d日（EEE）', { locale: ja })}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {events.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-4">予定はありません</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="flex items-start gap-2">
              <span
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: event.color ?? '#6366f1' }}
              />
              <div>
                <p className="text-xs text-gray-400">
                  {event.all_day ? '終日' : format(new Date(event.start_time), 'HH:mm')}
                </p>
                <p className="text-sm text-gray-700 font-medium leading-snug">{event.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
