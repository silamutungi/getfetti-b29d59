import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password || !name) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } }
    })
    setLoading(false)
    if (authError) {
      setError('Could not create your account. ' + authError.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-paper font-mono">
      <Navbar />
      <main className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-4xl text-ink mb-2 text-center">Start hosting better</h1>
          <p className="text-ink/60 text-center mb-10">Free to start. No credit card needed.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-ink text-sm mb-2">Your name</label>
              <input
                id="name" type="text" autoComplete="name" required
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="Alex Smith"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-ink text-sm mb-2">Email address</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-ink text-sm mb-2">Password</label>
              <input
                id="password" type="password" autoComplete="new-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="At least 8 characters"
              />
            </div>
            {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white font-mono font-medium py-4 rounded-full min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating your account...' : 'Create free account'}
            </button>
          </form>
          <p className="text-center text-ink/60 mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-dark underline hover:text-primary">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
