import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { type CreateEventForm } from '../types'
import Navbar from '../components/Navbar'

const COLORS = ['#e8455a','#7c3aed','#0ea5e9','#10b981','#f59e0b','#ec4899']
const THEMES = [
  { value: 'default', label: 'General party', emoji: '🎉' },
  { value: 'dinner', label: 'Dinner party', emoji: '🍽️' },
  { value: 'rooftop', label: 'Rooftop / outdoor', emoji: '🌤️' },
  { value: 'housewarming', label: 'Housewarming', emoji: '🏡' },
]

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).slice(2, 7)
}

export default function CreateEvent() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CreateEventForm>({
    title: '', date: '', location: '', description: '',
    cover_color: '#e8455a', privacy: 'public', plus_one_rule: 'ask',
    dual_view_enabled: false, theme: 'default'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k: keyof CreateEventForm, v: CreateEventForm[typeof k]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.title.trim() || !form.date || !form.location.trim()) {
      setError('Please fill in the event title, date, and location.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('You must be signed in to create an event.'); setLoading(false); return }
    const slug = slugify(form.title)
    const { error: insertErr } = await supabase.from('events').insert({
      user_id: user.id,
      title: form.title.trim().slice(0, 120),
      slug,
      date: form.date,
      location: form.location.trim().slice(0, 200),
      description: form.description.trim().slice(0, 2000),
      cover_color: form.cover_color,
      privacy: form.privacy,
      plus_one_rule: form.plus_one_rule,
      dual_view_enabled: form.dual_view_enabled,
      theme: form.theme,
    })
    setLoading(false)
    if (insertErr) { setError('Could not save your event. Please try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-paper font-mono">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl text-ink mb-2">Create an event</h1>
        <p className="text-ink/50 mb-10">Fill in the details. You can edit everything after publishing.</p>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label htmlFor="title" className="block text-ink text-sm mb-2">Event title <span aria-hidden>*</span></label>
            <input id="title" type="text" required maxLength={120} value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
              placeholder="Maya's 30th" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="date" className="block text-ink text-sm mb-2">Date and time <span aria-hidden>*</span></label>
              <input id="date" type="datetime-local" required value={form.date} onChange={e => set('date', e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]" />
            </div>
            <div>
              <label htmlFor="location" className="block text-ink text-sm mb-2">Location <span aria-hidden>*</span></label>
              <input id="location" type="text" required maxLength={200} value={form.location} onChange={e => set('location', e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="123 Main St" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-ink text-sm mb-2">Description</label>
            <textarea id="description" rows={4} maxLength={2000} value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Tell guests what to expect..." />
          </div>
          <div>
            <p className="text-ink text-sm mb-3">Cover color</p>
            <div className="flex gap-3">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => set('cover_color', c)}
                  className={`w-10 h-10 rounded-full border-4 transition-all min-h-[44px] min-w-[44px] ${form.cover_color === c ? 'border-ink scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} aria-label={`Select color ${c}`} />
              ))}
            </div>
          </div>
          <div>
            <p className="text-ink text-sm mb-3">Event theme</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {THEMES.map(t => (
                <button key={t.value} type="button" onClick={() => set('theme', t.value as CreateEventForm['theme'])}
                  className={`border-2 rounded-xl p-3 text-center transition-all min-h-[44px] ${form.theme === t.value ? 'border-primary bg-primary/5' : 'border-ink/10 hover:border-ink/30'}`}>
                  <div className="text-2xl">{t.emoji}</div>
                  <div className="text-xs text-ink mt-1">{t.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="privacy" className="block text-ink text-sm mb-2">Privacy</label>
              <select id="privacy" value={form.privacy} onChange={e => set('privacy', e.target.value as CreateEventForm['privacy'])}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]">
                <option value="public">Public link</option>
                <option value="invite_only">Invite only</option>
              </select>
            </div>
            <div>
              <label htmlFor="plus_one" className="block text-ink text-sm mb-2">Plus-ones</label>
              <select id="plus_one" value={form.plus_one_rule} onChange={e => set('plus_one_rule', e.target.value as CreateEventForm['plus_one_rule'])}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]">
                <option value="none">Not allowed</option>
                <option value="ask">Ask the host</option>
                <option value="allowed">Allowed</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" role="switch" aria-checked={form.dual_view_enabled}
              onClick={() => set('dual_view_enabled', !form.dual_view_enabled)}
              className={`relative w-12 h-6 rounded-full transition-colors min-h-[44px] flex items-center ${form.dual_view_enabled ? 'bg-primary' : 'bg-ink/20'}`}>
              <span className={`absolute w-5 h-5 bg-white rounded-full shadow transition-transform ${form.dual_view_enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-ink text-sm">Enable Dual View (Vibe + Simple modes)</span>
          </div>
          {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-mono font-medium py-4 rounded-full min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50">
            {loading ? 'Creating event...' : 'Publish event'}
          </button>
        </form>
      </main>
    </div>
  )
}
