import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import CreateEvent from './pages/CreateEvent'
import EventPage from './pages/EventPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/e/:slug" element={<EventPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <main className="min-h-screen bg-paper flex items-center justify-center font-mono">
            <div className="text-center">
              <h1 className="font-serif text-5xl text-ink mb-4">404</h1>
              <p className="text-ink/60 mb-6">This page does not exist.</p>
              <a href="/" className="bg-primary text-white font-mono px-6 py-3 rounded-full min-h-[44px] inline-flex items-center hover:bg-primary-dark transition-colors">Go home</a>
            </div>
          </main>
        }
      />
    </Routes>
  )
}
