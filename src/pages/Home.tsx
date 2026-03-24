import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '📋',
    title: 'Host Brief',
    body: 'A calm, prioritized view of your event. See who is coming, who is unresolved, and the three things that actually need your attention.'
  },
  {
    icon: '🤔',
    title: 'Better Maybe',
    body: 'Guests choosing Maybe pick a real reason: schedule conflict, waiting on a plus-one, arriving late, or needs more info. No more vague non-answers.'
  },
  {
    icon: '✨',
    title: 'Dual View',
    body: 'One event, two modes. Send the Vibe View to close friends and the Simple View to family or coworkers. Same event, right tone for everyone.'
  },
  {
    icon: '🎨',
    title: 'Smart Themes',
    body: 'Dinner parties get dietary prompts. Rooftop events get a weather backup field. Housewarmings get a registry link. The invite knows what it is.'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-paper font-mono">
      <Navbar />
      <main>
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">The invite app that actually helps you host</p>
          <h1 className="font-serif text-5xl sm:text-7xl text-ink leading-tight mb-6">
            Beautiful invites.<br />Clearer RSVPs.
          </h1>
          <p className="text-ink/70 text-lg max-w-xl mx-auto mb-10">
            For birthdays, dinners, and friend-group gatherings. Make the invite look great and actually know what is happening.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-primary text-white font-mono font-medium px-8 py-4 rounded-full min-h-[44px] inline-flex items-center justify-center hover:bg-primary-dark transition-colors text-base"
            >
              Create your first event
            </Link>
            <Link
              to="/login"
              className="border-2 border-primary-dark text-primary-dark font-mono font-medium px-8 py-4 rounded-full min-h-[44px] inline-flex items-center justify-center hover:bg-primary/5 transition-colors text-base"
            >
              Sign in
            </Link>
          </div>
        </section>

        <section className="bg-ink py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-4xl text-paper text-center mb-14">Everything a host actually needs</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f) => (
                <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="font-serif text-xl text-paper mb-3">{f.title}</h3>
                  <p className="text-white/60 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-24 text-center">
          <h2 className="font-serif text-4xl text-ink mb-6">Hosting should feel good, not stressful</h2>
          <p className="text-ink/60 text-lg mb-10 leading-relaxed">
            Most invite tools give you a dashboard. Getfetti gives you clarity. Know who is coming, understand every Maybe, and share the right invite with the right crowd.
          </p>
          <Link
            to="/signup"
            className="bg-primary text-white font-mono font-medium px-8 py-4 rounded-full min-h-[44px] inline-flex items-center justify-center hover:bg-primary-dark transition-colors text-base"
          >
            Start hosting for free
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
