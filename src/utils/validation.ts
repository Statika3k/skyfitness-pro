export const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Пароль должен содержать не менее 6 символов';
  }
  
  const specialChars = (password.match(/[^a-zA-Z0-9]/g) || []).length;
  if (specialChars < 2) {
    return 'Пароль должен содержать не менее 2 спецсимволов';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Пароль должен содержать как минимум одну заглавную букву';
  }
  
  return null;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};