import { Link } from 'react-router-dom'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-lg backdrop-blur">
            🛍️
          </div>
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-indigo-100">{subtitle}</p>}
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-2xl">{children}</div>
        {import.meta.env.VITE_UI_PREVIEW === 'true' && (
          <p className="mt-4 rounded-lg bg-white/15 px-4 py-3 text-center text-sm text-white">
            UI preview only: online registration and login need a hosted backend.
          </p>
        )}
        <p className="mt-6 text-center text-sm text-indigo-100">
          <Link to="/" className="font-medium text-white underline-offset-4 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}