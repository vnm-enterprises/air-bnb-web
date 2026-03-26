import { isValidEmail, getPasswordValidationError } from "./validation";

export function validateLoginForm(email: string, password: string): string {
  if (!email) {
    return "Please enter your email address.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!password) {
    return "Please enter your password.";
  }

  return "";
}

export function validateSignupForm(input: {
  name: string;
  email: string;
  password: string;
  agreedTerms: boolean;
}): string {
  if (!input.name) {
    return "Please enter your full name.";
  }

  if (!input.email) {
    return "Please enter your email address.";
  }

  if (!isValidEmail(input.email)) {
    return "Please enter a valid email address.";
  }

  const passwordError = getPasswordValidationError(input.password, input.password);
  if (passwordError && passwordError !== "Passwords do not match.") {
    return passwordError.replace("must contain", "must include");
  }

  if (!input.agreedTerms) {
    return "Please agree to the Terms of Service and Privacy Policy.";
  }

  return "";
}

export function validateProfileName(name: string): string {
  if (!name) {
    return "Name is required";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters long";
  }

  return "";
}

export function validatePasswordChange(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): string {
  if (!input.currentPassword) {
    return "Current password is required";
  }

  return getPasswordValidationError(input.newPassword, input.confirmPassword);
}
