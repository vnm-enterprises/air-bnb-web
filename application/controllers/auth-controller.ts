import { getPasswordValidationError, isValidEmail } from "./validation";

export function validateForgotPasswordEmail(email: string): string {
  if (!email) {
    return "Please enter your email address.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  return "";
}

export function validateResetPassword(password: string, confirmPassword: string): string {
  return getPasswordValidationError(password, confirmPassword);
}
