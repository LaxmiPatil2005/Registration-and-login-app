import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import { confirmPasswordValidation, passwordValidationRules } from '../utils/validation'
import { changePassword } from '../api/auth'

export default function ChangePasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const newPassword = watch('newPassword')

  const onSubmit = async (data) => {
    try {
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success(res.message || 'Password changed successfully')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <AuthLayout title="Change Password" subtitle="Keep your account secure">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <PasswordInput
          name="currentPassword"
          label="Current Password"
          register={register}
          error={errors.currentPassword}
          placeholder="Enter your current password"
          autoComplete="current-password"
          validation={{ required: 'Current password is required' }}
        />

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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Updating password...' : 'Update Password'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/" className="font-medium text-indigo-600 hover:underline">
          Back to dashboard
        </Link>
      </p>
    </AuthLayout>
  )
}