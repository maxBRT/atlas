import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
    loading?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
    base: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-sm)',
        fontWeight: 'var(--font-weight-medium)' as unknown as number,
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-fast)',
        cursor: 'pointer',
        border: 'none',
        whiteSpace: 'nowrap',
    },
    primary: {
        backgroundColor: 'var(--color-primary)',
        color: 'white',
    },
    secondary: {
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        border: '1px solid var(--color-border)',
    },
    danger: {
        backgroundColor: 'var(--color-danger)',
        color: 'white',
    },
    ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-primary)',
    },
    sm: {
        padding: 'var(--space-xs) var(--space-sm)',
        fontSize: 'var(--font-size-sm)',
    },
    md: {
        padding: 'var(--space-sm) var(--space-md)',
        fontSize: 'var(--font-size-md)',
    },
    lg: {
        padding: 'var(--space-md) var(--space-lg)',
        fontSize: 'var(--font-size-lg)',
    },
    disabled: {
        opacity: 0.5,
        cursor: 'not-allowed',
    },
};

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    loading = false,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    const combinedStyle: React.CSSProperties = {
        ...styles.base,
        ...styles[variant],
        ...styles[size],
        ...(isDisabled ? styles.disabled : {}),
        ...style,
    };

    return (
        <button
            style={combinedStyle}
            disabled={isDisabled}
            {...props}
        >
            {loading && <LoadingDots />}
            {children}
        </button>
    );
}

function LoadingDots() {
    return (
        <span style={{ display: 'flex', gap: '2px' }}>
            <span style={{ animation: 'pulse 1s infinite', animationDelay: '0ms' }}>.</span>
            <span style={{ animation: 'pulse 1s infinite', animationDelay: '200ms' }}>.</span>
            <span style={{ animation: 'pulse 1s infinite', animationDelay: '400ms' }}>.</span>
        </span>
    );
}
