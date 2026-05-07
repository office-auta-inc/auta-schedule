import { useState } from 'react'
import { format, isSameDay } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Event } from '../../hooks/useEvents'
import { createEvent } from '../../lib/eventActions'
import DateTimePicker from './DateTimePicker'

interface Props {
  date: Date
  calendarId: string
  allEvents: Event[]
  onClose: () => void
  onCreated: () => void
}

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

export default function CreateEventModal({ date, calendarId, allEvents, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState<Date>(() => {
    const d = new Date(date)
    d.setHours(new Date().getHours() + 1, 0, 0, 0)
    return d
  })
  const [endTime, setEndTime] = useState<Date>(() => {
    const d = new Date(date)
    d.setHours(new Date().getHours() + 2, 0, 0, 0)
    return d
  })
  const [allDay, setAllDay] = useState(false)
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const existingEvents = allEvents
    .filter(e => isSameDay(new Date(e.start_time), date))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) { setError('タイトルを入力してください'); return }
    setLoading(true)
    try {
      await createEvent({
        calendarId,
        title,
        startTime,
        endTime: allDay ? undefined : endTime,
        allDay,
        color,
        description,
      })
      onCreated()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl flex overflow-hidden w-full max-w-4xl max-h-[90vh]">

        {/* 左：既存予定 */}
        <div className="w-52 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-xs font-semibold text-gray-500">
              {format(date, 'M月d日（EEE）', { locale: ja })}の予定
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {existingEvents.length === 0 ? (
              <p className="text-xs text-gray-400 text-center mt-6">予定なし</p>
            ) : (
              existingEvents.map(ev => (
                <div key={ev.id} className="flex items-start gap-2">
                  <span
                    className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: ev.color ?? '#6366f1' }}
                  />
                  <div>
                    <p className="text-xs text-gray-400">
                      {ev.all_day ? '終日' : format(new Date(ev.start_time), 'HH:mm')}
                    </p>
                    <p className="text-sm text-gray-700 leading-snug">{ev.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 中央：フォーム */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">予定を作成</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">タイトル <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="予定のタイトル"
              />
            </div>

            {/* 終日 */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allDay"
                checked={allDay}
                onChange={e => setAllDay(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="allDay" className="text-sm text-gray-700">終日</label>
            </div>

            {/* 開始・終了 */}
            {!allDay && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-12 text-gray-400 text-xs">開始</span>
                  <span className="bg-indigo-50 px-3 py-1 rounded-lg text-indigo-700 font-medium">
                    {format(startTime, 'M/d HH:mm')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-12 text-gray-400 text-xs">終了</span>
                  <span className="bg-indigo-50 px-3 py-1 rounded-lg text-indigo-700 font-medium">
                    {format(endTime, 'M/d HH:mm')}
                  </span>
                </div>
              </div>
            )}

            {/* 色 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">色</label>
              <div className="flex gap-2">
                {COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full transition ${color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                rows={3}
                placeholder="メモ（任意）"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition">
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition disabled:opacity-50 font-medium"
            >
              {loading ? '作成中...' : '作成'}
            </button>
          </div>
        </form>

        {/* 右：日時ピッカー */}
        {!allDay && (
          <DateTimePicker
            startTime={startTime}
            endTime={endTime}
            onChangeStart={setStartTime}
            onChangeEnd={setEndTime}
          />
        )}
      </div>
    </div>
  )
}
