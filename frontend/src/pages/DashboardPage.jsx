import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getDashboard } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage({ preview = false }) {
  const { user, token, initializing, logout } = useAuth()
  const [dashboardContent, setDashboardContent] = useState('')
  const content = preview ? 'Dashboard UI preview' : dashboardContent

  useEffect(() => {
    if (preview) {
      return
    }

    getDashboard()
      .then((res) => setDashboardContent(res.message))
      .catch(() => {
        // auth state handled by interceptor
      })
  }, [preview])

  if (!preview && initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-slate-500">Loading your session...</div>
      </div>
    )
  }

  if (!preview && !token) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 flex-col bg-slate-900 p-6 text-slate-200 md:flex">
        <div className="mb-8 flex items-center gap-2 text-lg font-bold text-white">
          <span>🛍️</span> ShopAuth
        </div>
        <nav className="flex flex-col gap-1 space-y-1 text-sm font-medium">
          <Link to="/" className="rounded-lg bg-slate-800 px-3 py-2 text-white">
            Dashboard
          </Link>
          <Link to="/change-password" className="rounded-lg px-3 py-2 hover:bg-slate-800">
            Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="mt-auto rounded-lg bg-red-500/10 px-3 py-2 text-left text-red-400 hover:bg-red-500/20"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8 flex items-center justify-between md:hidden">
          <span className="font-bold text-slate-900">🛍️ ShopAuth</span>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white"
          >
            Logout
          </button>
        </header>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                {user?.fullName
                  ?.split(' ')
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'US'}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Welcome, {user?.fullName || (preview ? 'Demo User' : '')}!
                </h1>
                <p className="text-sm text-slate-500">{content}</p>
              </div>
            </div>

            <div className="grid gap-4 rounded-xl border border-slate-200 p-6 sm:grid-cols-2">
              <InfoItem label="Full Name" value={user?.fullName || (preview ? 'Demo User' : '')} />
              <InfoItem label="Email" value={user?.email || (preview ? 'demo@example.com' : '')} />
              <InfoItem label="Mobile" value={user?.mobile || (preview ? '—' : '')} />
              <InfoItem label="User ID" value={user?.id || (preview ? '—' : '')} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/change-password"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Change Password
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  )
}