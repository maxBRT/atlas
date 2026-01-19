import React, { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
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

const inputStyle: React.CSSProperties = {
    padding: 'var(--space-sm) var(--space-md)',
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-md)',
    transition: 'border-color var(--transition-fast)',
    outline: 'none',
};

const inputErrorStyle: React.CSSProperties = {
    ...inputStyle,
    borderColor: 'var(--color-danger)',
};

const errorTextStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-danger)',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, style, ...props }, ref) => {
        return (
            <div style={containerStyle}>
                {label && <label style={labelStyle}>{label}</label>}
                <input
                    ref={ref}
                    style={{ ...(error ? inputErrorStyle : inputStyle), ...style }}
                    {...props}
                />
                {error && <span style={errorTextStyle}>{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical',
    fontFamily: 'var(--font-family-mono)',
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, style, ...props }, ref) => {
        return (
            <div style={containerStyle}>
                {label && <label style={labelStyle}>{label}</label>}
                <textarea
                    ref={ref}
                    style={{ ...(error ? { ...textareaStyle, borderColor: 'var(--color-danger)' } : textareaStyle), ...style }}
                    {...props}
                />
                {error && <span style={errorTextStyle}>{error}</span>}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
