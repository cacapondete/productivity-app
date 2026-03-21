import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-black text-white border border-black text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-gray-900 rounded-none',
  outline: 'bg-transparent text-black border border-black text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-black hover:text-white rounded-none',
  ghost: 'bg-transparent text-black border border-black text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-gray-50 rounded-none',
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const classes = `py-2 px-4 transition ${variantClasses[variant]} ${className}`;
  return <button className={classes} {...props} />;
}
