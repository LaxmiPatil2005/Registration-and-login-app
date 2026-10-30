import client from './client'

export const register = (payload) => client.post('/auth/register', payload)
export const login = (payload) => client.post('/auth/login', payload)
export const logout = () => client.post('/auth/logout')
export const forgotPassword = (payload) => client.post('/auth/forgot-password', payload)
export const verifyOtp = (payload) => client.post('/auth/verify-otp', payload)
export const resetPassword = (payload) => client.post('/auth/reset-password', payload)
export const changePassword = (payload) => client.put('/auth/change-password', payload)

export const getMe = () => client.get('/user/me')

export const getDashboard = () => client.get('/user/dashboard')