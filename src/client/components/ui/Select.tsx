import React, { type SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: SelectOption[];
}

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
};

const labelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)' as unknown as number,
    color: 'var(--color-text-secondary)',
};

const selectStyle: React.CSSProperties = {
    padding: 'var(--space-sm) var(--space-md)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-md)',
    transition: 'border-color var(--transition-fast)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right var(--space-sm) center',
    paddingRight: 'calc(var(--space-md) + 16px)',
};

const selectErrorStyle: React.CSSProperties = {
    ...selectStyle,
    borderColor: 'var(--color-danger)',
};

const selectDisabledStyle: React.CSSProperties = {
    ...selectStyle,
    opacity: 0.5,
    cursor: 'not-allowed',
};

const errorTextStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-danger)',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, disabled, style, ...props }, ref) => {
        let computedStyle = error ? selectErrorStyle : selectStyle;
        if (disabled) {
            computedStyle = selectDisabledStyle;
        }

        return (
            <div style={containerStyle}>
                {label && <label style={labelStyle}>{label}</label>}
                <select
                    ref={ref}
                    disabled={disabled}
                    style={{ ...computedStyle, ...style }}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <span style={errorTextStyle}>{error}</span>}
            </div>
        );
    }
);

Select.displayName = 'Select';
