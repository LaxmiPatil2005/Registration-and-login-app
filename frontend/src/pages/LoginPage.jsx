import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (token) navigate(from, { replace: true })
  }, [token, navigate, from])

  const onSubmit = async (data) => {
    try {
      const result = await login(data.identifier, data.password)
      toast.success(result.message || 'Login successful')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue shopping with us">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email or Mobile Number
          </label>
          <input
            id="identifier"
            type="text"
            autoComplete="username"
            placeholder="you@example.com or 9876543210"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
              errors.identifier
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            {...register('identifier', {
              required: 'Email or mobile number is required',
              validate: (value) =>
                /^(\d{10}|\S+@\S+\.\S+)$/.test(value.trim()) ||
                'Enter a valid email address or a 10-digit mobile number',
            })}
          />
          {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
              errors.password
                ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:underline">
          Create one
        </Link>
      </p>
      {import.meta.env.VITE_UI_PREVIEW === 'true' && (
        <p className="mt-3 text-center text-sm text-slate-500">
          Want to see the dashboard?{' '}
          <Link to="/dashboard-preview" className="font-medium text-indigo-600 hover:underline">
            Preview it
          </Link>
        </p>
      )}
    </AuthLayout>
  )
}