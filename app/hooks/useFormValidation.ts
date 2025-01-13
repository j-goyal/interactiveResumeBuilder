import { useState, useCallback } from 'react'

type ValidationRules = {
  [key: string]: (value: string) => string | null
}

export const useFormValidation = (initialState: { [key: string]: string }, rules: ValidationRules) => {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({})

  const validate = useCallback((name: string, value: string) => {
    if (rules.hasOwnProperty(name)) {
      const error = rules[name](value)
      setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
      return error === null
    }
    return true
  }, [rules])

  const handleChange = useCallback((name: string, value: string) => {
    setValues(prevValues => ({ ...prevValues, [name]: value }))
    validate(name, value)
  }, [validate])

  const validateAll = useCallback(() => {
    const newErrors: { [key: string]: string | null } = {}
    let isValid = true

    Object.keys(rules).forEach(key => {
      const error = rules[key](values[key])
      newErrors[key] = error
      if (error !== null) {
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [rules, values])

  return { values, errors, handleChange, validateAll }
}

// Validation rules
export const validationRules = {
  name: (value: string) => value.trim() ? null : 'Name is required',
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address',
  phone: (value: string) => /^\+?[\d\s-()]{10,}$/.test(value) ? null : 'Invalid phone number',
  github: (value: string) => value === '' || /^https:\/\/github\.com\/[\w-]+\/?$/.test(value) ? null : 'Invalid GitHub URL',
  linkedin: (value: string) => value === '' || /^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/?$/.test(value) ? null : 'Invalid LinkedIn URL',
}

