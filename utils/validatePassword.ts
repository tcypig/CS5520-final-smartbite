export function getPasswordStrength(password: string): "Weak" | "Medium" | "Strong" {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const hasLength = password.length >= 8;
  
    if (hasUpper && hasLower && hasDigit && hasSpecial && hasLength) return "Strong";
    if ((hasUpper || hasLower) && hasDigit && password.length >= 6) return "Medium";
    return "Weak";
  }