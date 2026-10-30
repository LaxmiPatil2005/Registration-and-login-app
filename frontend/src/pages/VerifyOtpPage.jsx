import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AuthLayout from '../components/AuthLayout'
import { verifyOtp } from '../api/auth'

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [identifier] = useState(
    location.state?.identifier || sessionStorage.getItem('resetIdentifier') || '',
  )
  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!identifier) {
      toast.error('No account identifier found. Please start over.')
      navigate('/forgot-password')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await verifyOtp({ identifier, otp })
      toast.success(res.message || 'OTP verified')
      sessionStorage.setItem('resetIdentifier', identifier)
      navigate('/reset-password', { state: { identifier, otp } })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout title="Enter OTP" subtitle="Enter the 6-digit code we sent to your registered email">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-slate-700">
            One-Time Password
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center text-lg tracking-[0.5em] text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || otp.length !== 6}
          className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
    </AuthLayout>
  )
}