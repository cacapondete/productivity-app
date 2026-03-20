import * as React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'bg-black text-white hover:bg-gray-800 border border-black',
  outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white',
  ghost: 'bg-transparent text-black hover:bg-gray-100',
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const classes = `py-2 px-4 rounded text-sm font-medium transition ${variantClasses[variant]} ${className}`;
  return <button className={classes} {...props} />;
}
