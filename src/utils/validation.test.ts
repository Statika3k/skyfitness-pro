import { validatePassword, validateEmail } from './validation';

describe('validatePassword', () => {
  it('должен возвращать ошибку, если пароль короче 6 символов', () => {
    expect(validatePassword('12345')).toBe(
      'Пароль должен содержать не менее 6 символов',
    );
  });

  it('должен возвращать ошибку, если меньше 2 спецсимволов', () => {
    expect(validatePassword('Abc123!')).toBe(
      'Пароль должен содержать не менее 2 спецсимволов',
    );
  });

  it('должен возвращать ошибку, если нет заглавной буквы', () => {
    expect(validatePassword('abc123!!')).toBe(
      'Пароль должен содержать как минимум одну заглавную букву',
    );
  });

  it('должен возвращать null для валидного пароля', () => {
    expect(validatePassword('Abc123!!')).toBeNull();
  });

  it('должен принимать пароль с разными спецсимволами', () => {
    expect(validatePassword('MyP@ss#1')).toBeNull();
  });

  it('должен принимать длинный сложный пароль', () => {
    expect(validatePassword('Str0ng!P@ssw0rd#2024')).toBeNull();
  });
});

describe('validateEmail', () => {
  it('должен возвращать true для валидного email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user+tag@domain.co.uk')).toBe(true);
  });

  it('должен возвращать false для невалидного email', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@domain.com')).toBe(false);
    expect(validateEmail('user.domain.com')).toBe(false);
    expect(validateEmail('user @domain.com')).toBe(false);
  });
});