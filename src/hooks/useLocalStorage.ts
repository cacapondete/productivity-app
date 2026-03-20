import * as React from 'react';

export const LOCAL_STORAGE_KEYS = {
  GOOGLE_TOKEN: 'google_token',
};

export function getGoogleToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCAL_STORAGE_KEYS.GOOGLE_TOKEN);
}

export function setGoogleToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEYS.GOOGLE_TOKEN, token);
}

export function clearGoogleToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_STORAGE_KEYS.GOOGLE_TOKEN);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error('Error accessing localStorage', error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error setting localStorage', error);
    }
  };

  return [storedValue, setValue] as const;
}
