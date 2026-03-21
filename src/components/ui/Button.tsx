import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors',
  outline: 'bg-transparent border border-white text-white uppercase tracking-widest hover:bg-white/10 transition-colors',
  ghost: 'bg-transparent text-white uppercase tracking-widest hover:text-gray-300 transition-colors',
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const classes = `px-6 py-2 text-[12px] rounded-none transition ${variantClasses[variant]} ${className}`;
  return <button className={classes} {...props} />;
}
