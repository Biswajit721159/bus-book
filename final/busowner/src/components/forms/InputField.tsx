import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  containerCls?: string;
  labelClassName?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      icon,
      rightElement,
      error,
      containerCls = '',
      className = '',
      id,
      labelClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerCls}`}>
        {label && (
          <label htmlFor={id} className={`input-label ${labelClassName}`}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`input-field ${icon ? 'pl-10' : ''} ${rightElement ? 'pr-10' : ''} ${
              error ? 'border-red-500 focus:ring-red-400' : ''
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
