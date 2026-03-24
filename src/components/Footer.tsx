import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper font-mono py-12 mt-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-serif text-xl text-paper">Getfetti</Link>
        <p className="text-paper/40 text-sm">Beautiful invites. Clearer RSVPs.</p>
        <nav aria-label="Footer navigation" className="flex gap-6 text-sm text-paper/50">
          <Link to="/privacy" className="hover:text-paper transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-paper transition-colors">Terms</Link>
          <a href="mailto:hello@getfetti.com" className="hover:text-paper transition-colors">Contact</a>
        </nav>
      </div>
      <p className="text-center text-paper/20 text-xs mt-8 font-mono">&copy; {new Date().getFullYear()} Getfetti. All rights reserved.</p>
    </footer>
  )
}
