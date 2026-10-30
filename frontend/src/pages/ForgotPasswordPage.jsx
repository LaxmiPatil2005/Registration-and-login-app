import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { forgotPassword } from '../api/auth'
import { identifierValidation } from '../utils/validation'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await forgotPassword({ identifier: data.identifier.trim() })
      toast.success(res.message || 'OTP sent to your registered email')
      sessionStorage.setItem('resetIdentifier', data.identifier.trim())
      navigate('/verify-otp', { state: { identifier: data.identifier.trim() } })
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="We'll send a one-time password to your registered email">
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
            {...register('identifier', identifierValidation)}
          />
          {errors.identifier && <p className="mt-1 text-xs text-red-500">{errors.identifier.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </AuthLayout>
  )
}