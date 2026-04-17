/**
 * Validates a password against strength requirements.
 * @param password - The password string to validate
 * @param lang - Language code ('ta' for Tamil, defaults to English)
 * @returns An error message string, or null if the password is valid
 */
export const validatePassword = (password: string, lang: string = 'en'): string | null => {

  //disable validation temporarily
  return null;

  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return lang === 'ta'
      ? "குறைந்தபட்சம் 6 எழுத்துகள், பெரிய, சிறிய, எண், சிறப்பு எழுத்து வேண்டும்"
      : "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character.";
  }
  return null;
};
