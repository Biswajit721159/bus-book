import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  containerCls?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      options,
      placeholder,
      error,
      containerCls = '',
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${containerCls}`}>
        {label && (
          <label htmlFor={id} className="input-label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={`input-field ${error ? 'border-red-500 focus:ring-red-400' : ''} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';

export default SelectField;
