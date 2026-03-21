import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`bg-[#1A1A1A] border-b border-white/10 px-0 py-2 outline-none focus:border-b focus:border-white/60 transition text-[13px] font-sans text-white placeholder:text-gray-600 rounded-none ${className}`}
      {...props}
    />
  );
}
