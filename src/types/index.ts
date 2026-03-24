export interface Event {
  id: string
  user_id: string
  title: string
  slug: string
  date: string
  location: string
  description: string
  cover_color: string
  privacy: 'public' | 'invite_only'
  plus_one_rule: 'none' | 'ask' | 'allowed'
  dual_view_enabled: boolean
  theme: 'default' | 'dinner' | 'rooftop' | 'housewarming'
  created_at: string
  deleted_at: string | null
}

export interface Rsvp {
  id: string
  event_id: string
  user_id: string | null
  guest_name: string
  guest_email: string
  status: 'yes' | 'no' | 'maybe'
  maybe_reason: 'schedule_conflict' | 'waiting_plus_one' | 'arriving_late' | 'need_info' | null
  dietary_notes: string | null
  created_at: string
  deleted_at: string | null
}

export interface HostBrief {
  likely_count: number
  maybe_count: number
  unresolved_maybes: Rsvp[]
  actions: string[]
}

export type MaybeReason = 'schedule_conflict' | 'waiting_plus_one' | 'arriving_late' | 'need_info'

export interface CreateEventForm {
  title: string
  date: string
  location: string
  description: string
  cover_color: string
  privacy: 'public' | 'invite_only'
  plus_one_rule: 'none' | 'ask' | 'allowed'
  dual_view_enabled: boolean
  theme: 'default' | 'dinner' | 'rooftop' | 'housewarming'
}

export interface RsvpForm {
  guest_name: string
  guest_email: string
  status: 'yes' | 'no' | 'maybe'
  maybe_reason: MaybeReason | null
  dietary_notes: string
}
