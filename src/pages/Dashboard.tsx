import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useEvents, useTodayEvents } from '../hooks/useEvents'
import { supabase } from '../lib/supabase'
import MonthlyCalendar from '../components/Calendar/MonthlyCalendar'
import TodayPanel from '../components/Calendar/TodayPanel'
import Header from '../components/Layout/Header'
import Sidebar from '../components/Layout/Sidebar'
import CreateEventModal from '../components/Events/CreateEventModal'

export default function Dashboard() {
  const { user } = useAuth()
  const [calendarId, setCalendarId] = useState<string | undefined>()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [createModalDate, setCreateModalDate] = useState<Date | null>(null)

  const { events, refetch } = useEvents(calendarId)
  const { todayEvents } = useTodayEvents(calendarId)

  // デフォルトカレンダーを取得または作成
  useEffect(() => {
    if (!user) return
    const init = async () => {
      const { data } = await supabase
        .from('calendars')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (data) {
        setCalendarId(data.id)
      } else {
        const { data: created } = await supabase
          .from('calendars')
          .insert([{ user_id: user.id, name: 'マイカレンダー', color: '#6366f1' }])
          .select()
          .single()
        if (created) setCalendarId(created.id)
      }
    }
    init()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* 左：今日の予定パネル */}
        <TodayPanel events={todayEvents} />

        {/* 中央：サイドバー + カレンダー */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 p-4 overflow-auto">
            <MonthlyCalendar
              currentDate={currentDate}
              events={events}
              onNavigate={setCurrentDate}
              onDayClick={(date) => setCreateModalDate(date)}
            />
          </main>
        </div>
      </div>

      {createModalDate && calendarId && (
        <CreateEventModal
          date={createModalDate}
          calendarId={calendarId}
          allEvents={events}
          onClose={() => setCreateModalDate(null)}
          onCreated={() => { refetch(); setCreateModalDate(null) }}
        />
      )}
    </div>
  )
}
