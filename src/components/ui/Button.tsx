import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-100 active:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all',
  outline: 'bg-transparent border border-white text-white uppercase tracking-widest hover:bg-white/10 active:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all',
  ghost: 'bg-transparent text-white uppercase tracking-widest hover:text-gray-300 active:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all',
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const classes = `px-6 py-3 text-[12px] rounded-none transition min-h-[44px] flex items-center justify-center ${variantClasses[variant]} ${className}`;
  return <button className={classes} {...props} />;
}
