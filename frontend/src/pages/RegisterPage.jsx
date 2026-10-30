import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import { confirmPasswordValidation, passwordValidationRules } from '../utils/validation'
import { register as apiRegister } from '../api/auth'

export default function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    try {
      const res = await apiRegister({
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        confirmPassword: data.confirmPassword,
      })
      toast.success(res.message || 'Registration successful')
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const inputClass = (hasError) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
    }`

  return (
    <AuthLayout title="Create your account" subtitle="Join us and start shopping today">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            placeholder="e.g. John Doe"
            className={inputClass(errors.fullName)}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 3, message: 'Full name must be at least 3 characters' },
              maxLength: { value: 100, message: 'Full name must not exceed 100 characters' },
            })}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass(errors.email)}
            {...register('email', {
              required: 'Email address is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
            })}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="mobile" className="mb-1.5 block text-sm font-medium text-slate-700">
            Mobile Number
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={10}
            placeholder="10-digit mobile number"
            className={inputClass(errors.mobile)}
            {...register('mobile', {
              required: 'Mobile number is required',
              pattern: { value: /^\d{10}$/, message: 'Mobile number must contain exactly 10 digits' },
            })}
          />
          {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>}
        </div>

        <PasswordInput
          name="password"
          label="Password"
          register={register}
          error={errors.password}
          placeholder="Create a strong password"
          autoComplete="new-password"
          validation={passwordValidationRules}
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          register={register}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          validation={confirmPasswordValidation(() => password)}
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
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}