export const REGISTRATION_FORM_FIELDS = [
  [
    { label: 'First Name', name: 'firstName', required: true, type: 'text' },
    { label: 'Last Name', name: 'lastName', required: true, type: 'text' }
  ],
  { label: 'E-Mail', name: 'email', required: true, type: 'email' },
  [
    { label: 'Password', name: 'password', required: true, type: 'password' },
    {
      label: 'Confirm Password',
      name: 'confirmPassword',
      required: true,
      type: 'password'
    }
  ]
];

export const LOGIN_FORM_FIELDS = [
  { label: 'E-Mail', name: 'email', required: true, type: 'email' },
  { label: 'Password', name: 'password', required: true, type: 'password' }
];
