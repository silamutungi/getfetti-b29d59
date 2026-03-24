import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { type User } from '@supabase/supabase-js'

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-ink text-paper font-mono" role="navigation" aria-label="Main navigation">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif text-2xl text-paper hover:text-primary transition-colors">Getfetti</Link>
        <div className="hidden sm:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="text-paper/70 hover:text-paper text-sm transition-colors">My events</Link>
              <Link to="/create" className="bg-primary text-white px-5 py-2 rounded-full text-sm min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors">New event</Link>
              <button onClick={handleLogout} className="text-paper/50 hover:text-paper text-sm transition-colors min-h-[44px]">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-paper/70 hover:text-paper text-sm transition-colors">Sign in</Link>
              <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-full text-sm min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors">Get started</Link>
            </>
          )}
        </div>
        <button
          className="sm:hidden text-paper min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="sm:hidden bg-ink border-t border-paper/10 px-6 py-4 flex flex-col gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-paper/70 text-sm" onClick={() => setMenuOpen(false)}>My events</Link>
              <Link to="/create" className="text-paper/70 text-sm" onClick={() => setMenuOpen(false)}>New event</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-paper/50 text-sm text-left min-h-[44px]">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-paper/70 text-sm" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className="text-paper/70 text-sm" onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
