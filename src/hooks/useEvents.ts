import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Event {
  id: string
  calendar_id: string
  title: string
  description?: string
  start_time: string
  end_time?: string
  all_day: boolean
  color?: string
  created_by: string
  created_at: string
}

export function useEvents(calendarId?: string) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    if (!calendarId) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('calendar_id', calendarId)
      .order('start_time', { ascending: true })

    if (!error && data) setEvents(data)
    setLoading(false)
  }, [calendarId])

  useEffect(() => {
    fetchEvents()

    if (!calendarId) return

    const subscription = supabase
      .channel(`events:${calendarId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `calendar_id=eq.${calendarId}`,
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setEvents(prev => [...prev, payload.new as Event].sort(
            (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
          ))
        } else if (payload.eventType === 'UPDATE') {
          setEvents(prev => prev.map(e => e.id === payload.new.id ? payload.new as Event : e))
        } else if (payload.eventType === 'DELETE') {
          setEvents(prev => prev.filter(e => e.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [calendarId, fetchEvents])

  return { events, loading, refetch: fetchEvents }
}

export function useTodayEvents(calendarId?: string) {
  const { events, loading, refetch } = useEvents(calendarId)
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  const todayEvents = events.filter(e => {
    const start = new Date(e.start_time).toISOString().split('T')[0]
    return start === todayStr
  })

  return { todayEvents, loading, refetch }
}
