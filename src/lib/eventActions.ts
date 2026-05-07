import { supabase } from './supabase'

export async function createEvent(data: {
  calendarId: string
  title: string
  startTime: Date
  endTime?: Date
  allDay?: boolean
  color?: string
  description?: string
}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: result, error } = await supabase
    .from('events')
    .insert([{
      calendar_id: data.calendarId,
      title: data.title,
      start_time: data.startTime.toISOString(),
      end_time: data.endTime?.toISOString() ?? null,
      all_day: data.allDay ?? false,
      color: data.color ?? '#6366f1',
      description: data.description ?? '',
      created_by: user.id,
    }])
    .select()

  if (error) throw error
  return result?.[0]
}

export async function updateEvent(id: string, updates: Partial<{
  title: string
  start_time: string
  end_time: string
  all_day: boolean
  color: string
  description: string
}>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data?.[0]
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) throw error
}
