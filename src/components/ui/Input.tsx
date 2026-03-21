import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`border border-black px-3 py-2 outline-none focus:border-black focus:ring-0 transition text-[11px] font-sans leading-relaxed rounded-none ${className}`}
      {...props}
    />
  );
}
