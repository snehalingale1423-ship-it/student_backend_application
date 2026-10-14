import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1 disabled:opacity-45 disabled:cursor-not-allowed select-none rounded';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-base px-5 py-2.5 gap-2.5 min-h-[46px]'
  };

  // Strictly monochromatic states
  const variantStyles = {
    primary:
      'bg-black text-white hover:bg-[#262626] active:bg-[#404040] border border-black shadow-sm',
    secondary:
      'bg-white text-black border border-[#BDBDBD] hover:bg-[#F5F5F5] active:bg-[#EAEAEA]',
    ghost:
      'bg-transparent text-black hover:bg-[#F5F5F5] active:bg-[#EAEAEA] border border-transparent',
    outline:
      'bg-transparent text-black border border-black hover:bg-[#F5F5F5] active:bg-[#EAEAEA]',
    danger:
      'bg-black text-white hover:bg-[#262626] active:bg-[#404040] border border-black'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
    </button>
  );
};
