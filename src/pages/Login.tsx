import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in both fields.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError('Those credentials did not work. Please try again.')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-paper font-mono">
      <Navbar />
      <main className="flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          <h1 className="font-serif text-4xl text-ink mb-2 text-center">Welcome back</h1>
          <p className="text-ink/60 text-center mb-10">Sign in to manage your events.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
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
                id="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-ink/20 rounded-xl px-4 py-3 bg-white text-ink font-mono focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                placeholder="Your password"
              />
            </div>
            {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white font-mono font-medium py-4 rounded-full min-h-[44px] hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-ink/60 mt-6 text-sm">
            No account yet?{' '}
            <Link to="/signup" className="text-primary-dark underline hover:text-primary">Create one free</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
