import React from 'react';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  options: Array<{
    value: string | number;
    label: string;
  }>;
  error?: string;
  placeholder?: string;
  value: string | number;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', placeholder, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{label}</label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-3 py-2
            bg-[var(--background)]
            text-[var(--text-primary)]
            border border-[var(--card-border)]
            rounded-md
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-teal-500
            focus:border-transparent
            disabled:opacity-50
            disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
