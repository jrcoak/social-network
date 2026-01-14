// New England states
export const NEW_ENGLAND_STATES = [
  { value: 'MA', label: 'Massachusetts' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'ME', label: 'Maine' },
  { value: 'VT', label: 'Vermont' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'CT', label: 'Connecticut' },
] as const;

export type StateCode = typeof NEW_ENGLAND_STATES[number]['value'];
