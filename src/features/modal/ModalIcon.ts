const ModalIcon = {
  information: "information",
  warning: "warning",
  danger: "danger",
} as const;

// Create a type from the object values
type ModalIcon = (typeof ModalIcon)[keyof typeof ModalIcon];

export { ModalIcon };