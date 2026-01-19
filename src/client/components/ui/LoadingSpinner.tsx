import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

const sizes = {
    sm: 16,
    md: 24,
    lg: 40,
};

export function LoadingSpinner({ size = 'md', color = 'var(--color-primary)' }: LoadingSpinnerProps) {
    const sizeValue = sizes[size];

    return (
        <svg
            width={sizeValue}
            height={sizeValue}
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: 'spin 1s linear infinite' }}
        >
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                opacity="0.25"
            />
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="31.4 31.4"
                strokeDashoffset="62.8"
                transform="rotate(-90 12 12)"
            />
        </svg>
    );
}

interface LoadingOverlayProps {
    message?: string;
}

const overlayStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-xl)',
    color: 'var(--color-text-secondary)',
};

export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
    return (
        <div style={overlayStyle}>
            <LoadingSpinner size="lg" />
            <span>{message}</span>
        </div>
    );
}
