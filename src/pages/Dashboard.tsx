import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { type Event, type Rsvp } from '../types'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type EventWithRsvps = Event & { rsvps: Rsvp[] }

function HostBriefCard({ event, rsvps }: { event: Event; rsvps: Rsvp[] }) {
  const yesCount = rsvps.filter(r => r.status === 'yes').length
  const maybeCount = rsvps.filter(r => r.status === 'maybe').length
  const unresolvedMaybes = rsvps.filter(r => r.status === 'maybe' && !r.maybe_reason)
  const actions: string[] = []
  if (unresolvedMaybes.length > 0) actions.push(`Follow up with ${unresolvedMaybes.length} vague maybe${unresolvedMaybes.length > 1 ? 's' : ''}`)
  if (rsvps.length === 0) actions.push('Share your invite link to get RSVPs')
  if (maybeCount > 0) actions.push(`${maybeCount} guest${maybeCount > 1 ? 's' : ''} still undecided — check their reasons`)
  if (actions.length === 0) actions.push('Looking good! All guests have responded.')

  return (
    <div className="border border-ink/10 rounded-2xl p-6 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-serif text-xl text-ink">{event.title}</h3>
          <p className="text-ink/50 text-sm mt-1">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })}</p>
        </div>
        <span className="text-2xl">🎉</span>
      </div>
      <div className="flex gap-4 mb-5">
        <div className="text-center">
          <p className="font-serif text-3xl text-primary">{yesCount}</p>
          <p className="text-ink/50 text-xs">Coming</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-3xl text-amber-500">{maybeCount}</p>
          <p className="text-ink/50 text-xs">Maybe</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-3xl text-ink/40">{rsvps.filter(r => r.status === 'no').length}</p>
          <p className="text-ink/50 text-xs">Declined</p>
        </div>
      </div>
      <div className="border-t border-ink/5 pt-4">
        <p className="text-xs text-ink/50 uppercase tracking-wider mb-2 font-mono">Host brief</p>
        <ul className="space-y-1">
          {actions.slice(0, 3).map((a, i) => (
            <li key={i} className="text-sm text-ink/70 flex gap-2"><span className="text-primary">→</span>{a}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          to={`/e/${event.slug}`}
          className="text-sm border border-primary-dark text-primary-dark px-4 py-2 rounded-full min-h-[44px] inline-flex items-center hover:bg-primary/5 transition-colors"
        >
          View event
        </Link>
        <button
          onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/e/${event.slug}`) }}
          className="text-sm bg-primary text-white px-4 py-2 rounded-full min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors"
        >
          Copy link
        </button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [events, setEvents] = useState<EventWithRsvps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: eventsData, error: eventsErr } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
      if (eventsErr) { setError('Could not load your events. Please refresh.'); setLoading(false); return }
      const withRsvps: EventWithRsvps[] = []
      for (const ev of eventsData ?? []) {
        const { data: rsvpData } = await supabase
          .from('rsvps')
          .select('*')
          .eq('event_id', ev.id)
          .is('deleted_at', null)
        withRsvps.push({ ...ev, rsvps: rsvpData ?? [] })
      }
      setEvents(withRsvps)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-paper font-mono">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-4xl text-ink">Your events</h1>
          <Link
            to="/create"
            className="bg-primary text-white font-mono px-6 py-3 rounded-full min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors"
          >
            + New event
          </Link>
        </div>
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading events" />
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-24">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary-dark underline">Try again</button>
          </div>
        )}
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-ink/10 rounded-2xl">
            <p className="font-serif text-2xl text-ink mb-3">No events yet</p>
            <p className="text-ink/50 mb-6">Create your first event and start collecting RSVPs.</p>
            <Link to="/create" className="bg-primary text-white font-mono px-6 py-3 rounded-full min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors">
              Create an event
            </Link>
          </div>
        )}
        {!loading && !error && events.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-6">
            {events.map(ev => (
              <HostBriefCard key={ev.id} event={ev} rsvps={ev.rsvps} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
