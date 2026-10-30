export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/

export const passwordValidationRules = {
  required: 'New password is required',
  pattern: {
    value: PASSWORD_PATTERN,
    message:
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character',
  },
}

export const confirmPasswordValidation = (getPassword) => ({
  required: 'Password confirmation is required',
  validate: (value) => value === getPassword() || 'Passwords do not match',
})

export const identifierValidation = {
  required: 'Email or mobile number is required',
  validate: (value) =>
    /^(\d{10}|\S+@\S+\.\S+)$/.test(value.trim()) ||
    'Enter a valid email address or a 10-digit mobile number',
}