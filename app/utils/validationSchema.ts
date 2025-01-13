import * as Yup from 'yup';

export const resumeValidationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string()
    .matches(
      /^(?:\+91|91|0)?\d{10}$/, 
      'Invalid phone number (Indian phone numbers should have 10 digits and may start with +91, 91, or 0)'
    )
    .required('Phone is required'),
  github: Yup.string().url('Invalid GitHub URL'),
  linkedin: Yup.string().url('Invalid LinkedIn URL'),
});
