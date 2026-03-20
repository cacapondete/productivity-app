import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`border border-gray-400 px-3 py-2 rounded outline-none focus:border-black transition ${className}`}
      {...props}
    />
  );
}
