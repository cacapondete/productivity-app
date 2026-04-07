import * as React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`bg-[#1A1A1A] border-b border-white/10 px-3 py-3 outline-none focus:border-b focus:border-white/80 focus:shadow-[0_1px_0_0_rgba(255,255,255,0.4)] transition-all text-[13px] font-sans text-white placeholder:text-gray-600 rounded-none w-full focus:bg-[#252525] ${className}`}
      {...props}
    />
  );
}
