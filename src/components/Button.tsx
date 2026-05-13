import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'dashed';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  as: Component = 'button',
  ...props
}) => {
  return (
    <Component className={`button-component btn-${variant} btn-${size} ${className}`} {...props}>
      {children}
    </Component>
  );
};
