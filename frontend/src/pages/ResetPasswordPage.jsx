import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import { confirmPasswordValidation, passwordValidationRules } from '../utils/validation'
import { resetPassword } from '../api/auth'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPassword = watch('newPassword')
  const identifier = location.state?.identifier || sessionStorage.getItem('resetIdentifier') || ''
  const otp = location.state?.otp || ''

  useEffect(() => {
    if (!identifier || !otp) {
      toast.error('Password reset session is missing. Please start over.')
      navigate('/forgot-password')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (data) => {
    try {
      const res = await resetPassword({ identifier, otp, newPassword: data.newPassword })
      toast.success(res.message || 'Password reset successfully')
      sessionStorage.removeItem('resetIdentifier')
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Create a brand-new password for your account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          name="newPassword"
          label="New Password"
          register={register}
          error={errors.newPassword}
          placeholder="Create a strong password"
          autoComplete="new-password"
          validation={passwordValidationRules}
        />

        <PasswordInput
          name="confirmNewPassword"
          label="Confirm New Password"
          register={register}
          error={errors.confirmNewPassword}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          validation={confirmPasswordValidation(() => newPassword)}
        />

        <p className="text-xs leading-5 text-slate-500">
          Password must be at least 8 characters and include an uppercase letter, a lowercase letter,
          a number and a special character.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Resetting password...' : 'Reset Password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remembered your password?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Back to login
        </Link>
      </p>
    </AuthLayout>
  )
}