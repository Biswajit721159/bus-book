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
          <label
            htmlFor={id}
            className={`block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 ${labelClassName}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`w-full py-2 px-3 text-xs font-medium text-slate-900 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl placeholder:text-slate-400 placeholder:font-normal transition-all duration-200 focus:outline-none focus:ring-2 ${
              icon ? 'pl-9' : 'pl-3'
            } ${rightElement ? 'pr-9' : 'pr-3'} ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10 bg-rose-50/20'
                : 'border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-blue-500/10'
            } ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1 animate-fade-in">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
