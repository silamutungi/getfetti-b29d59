import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { type Event, type Rsvp, type RsvpForm, type MaybeReason } from '../types'
import Footer from '../components/Footer'

const MAYBE_REASONS: { value: MaybeReason; label: string; emoji: string }[] = [
  { value: 'schedule_conflict', label: 'Schedule conflict', emoji: '📅' },
  { value: 'waiting_plus_one', label: 'Waiting on my plus-one', emoji: '👫' },
  { value: 'arriving_late', label: 'I will arrive late', emoji: '🕐' },
  { value: 'need_info', label: 'I need more info', emoji: '❓' },
]

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<Event | null>(null)
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<RsvpForm>({ guest_name: '', guest_email: '', status: 'yes', maybe_reason: null, dietary_notes: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!slug) return
      const { data, error: err } = await supabase
        .from('events').select('*').eq('slug', slug).is('deleted_at', null).single()
      if (err || !data) { setError('This event was not found or is no longer available.'); setLoading(false); return }
      setEvent(data)
      const { data: rsvpData } = await supabase.from('rsvps').select('*').eq('event_id', data.id).is('deleted_at', null)
      setRsvps(rsvpData ?? [])
      setLoading(false)
    }
    load()
  }, [slug])

  const handleRsvp = async () => {
    setFormError('')
    if (!form.guest_name.trim() || !form.guest_email.trim()) { setFormError('Please enter your name and email.'); return }
    if (!form.guest_email.includes('@')) { setFormError('Please enter a valid email address.'); return }
    if (form.status === 'maybe' && !form.maybe_reason) { setFormError('Please select a reason for your maybe.'); return }
    if (!event) return
    setSubmitting(true)
    const { error: insertErr } = await supabase.from('rsvps').insert({
      event_id: event.id,
      user_id: null,
      guest_name: form.guest_name.trim().slice(0, 100),
      guest_email: form.guest_email.trim().slice(0, 200),
      status: form.status,
      maybe_reason: form.status === 'maybe' ? form.maybe_reason : null,
      dietary_notes: form.dietary_notes.trim().slice(0, 500) || null,
    })
    setSubmitting(false)
    if (insertErr) { setFormError('Could not submit your RSVP. Please try again.'); return }
    setSubmitted(true)
  }

  if (loading) return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status" aria-label="Loading event" />
    </div>
  )

  if (error || !event) return (
    <div className="min-h-screen bg-paper flex items-center justify-center font-mono">
      <div className="text-center">
        <p className="font-serif text-3xl text-ink mb-3">Event not found</p>
        <p className="text-ink/50 mb-6">{error}</p>
        <a href="/" className="text-primary-dark underline">Go home</a>
      </div>
    </div>
  )

  const yesCount = rsvps.filter(r => r.status === 'yes').length

  return (
    <div className="min-h-screen bg-paper font-mono">
      <div className="w-full h-2" style={{ backgroundColor: event.cover_color }} />
      <main className="max-w-xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="font-serif text-5xl text-ink mb-3">{event.title}</h1>
          <p className="text-ink/60 mb-1">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-ink/60 mb-4">{event.location}</p>
          {event.description && <p className="text-ink/80 leading-relaxed">{event.description}</p>}
          {yesCount > 0 && <p className="text-primary font-medium mt-4">{yesCount} {yesCount === 1 ? 'person' : 'people'} going</p>}
        </header>
        {submitted ? (
          <div className="text-center border-2 border-primary/20 rounded-2xl p-10">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-serif text-3xl text-ink mb-2">You are on the list!</h2>
            <p className="text-ink/60">Your RSVP has been saved. See you there.</p>
          </div>
        ) : (
          <section aria-label="RSVP form" className="border border-ink/10 rounded-2xl p-7 bg-white">
            <h2 className="font-serif text-2xl text-ink mb-6">Will you be there?</h2>
            <div className="space-y-5">
              <div>
                <label htmlFor="gname" className="block text-ink text-sm mb-2">Your name</label>
                <input id="gname" type="text" maxLength={100} value={form.guest_name} onChange={e => setForm(p => ({ ...p, guest_name: e.target.value }))}
                  className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-paper text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="gemail" className="block text-ink text-sm mb-2">Email address</label>
                <input id="gemail" type="email" maxLength={200} value={form.guest_email} onChange={e => setForm(p => ({ ...p, guest_email: e.target.value }))}
                  className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-paper text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                  placeholder="you@example.com" />
              </div>
              <div>
                <p className="text-ink text-sm mb-3">Your response</p>
                <div className="flex gap-3">
                  {(['yes', 'no', 'maybe'] as const).map(s => (
                    <button key={s} type="button" onClick={() => setForm(p => ({ ...p, status: s, maybe_reason: null }))}
                      className={`flex-1 py-3 rounded-xl border-2 font-mono text-sm min-h-[44px] transition-all capitalize ${
                        form.status === s ? 'border-primary bg-primary/5 text-primary' : 'border-ink/10 text-ink/60 hover:border-ink/30'
                      }`}>
                      {s === 'yes' ? 'Going' : s === 'no' ? 'Decline' : 'Maybe'}
                    </button>
                  ))}
                </div>
              </div>
              {form.status === 'maybe' && (
                <div>
                  <p className="text-ink text-sm mb-3">What is holding you back?</p>
                  <div className="space-y-2">
                    {MAYBE_REASONS.map(r => (
                      <button key={r.value} type="button" onClick={() => setForm(p => ({ ...p, maybe_reason: r.value }))}
                        className={`w-full text-left px-4 py-3 rounded-xl border-2 font-mono text-sm min-h-[44px] transition-all flex gap-3 items-center ${
                          form.maybe_reason === r.value ? 'border-amber-400 bg-amber-50' : 'border-ink/10 hover:border-ink/30'
                        }`}>
                        <span>{r.emoji}</span>{r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {event.theme === 'dinner' && (
                <div>
                  <label htmlFor="dietary" className="block text-ink text-sm mb-2">Dietary notes</label>
                  <input id="dietary" type="text" maxLength={500} value={form.dietary_notes} onChange={e => setForm(p => ({ ...p, dietary_notes: e.target.value }))}
                    className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-paper text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                    placeholder="Vegetarian, allergies, etc." />
                </div>
              )}
              {formError && <p role="alert" className="text-red-600 text-sm">{formError}</p>}
              <button onClick={handleRsvp} disabled={submitting}
                className="w-full bg-primary text-white font-mono font-medium py-4 rounded-full min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Send RSVP'}
              </button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
