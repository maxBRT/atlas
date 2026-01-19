import React, { type ReactNode } from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    children?: ReactNode;
}

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-xl)',
    textAlign: 'center',
};

const iconStyle: React.CSSProperties = {
    color: 'var(--color-danger)',
};

const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-semibold)' as unknown as number,
    color: 'var(--color-text-primary)',
    margin: 0,
};

const messageStyle: React.CSSProperties = {
    color: 'var(--color-text-secondary)',
    maxWidth: '400px',
};

export function ErrorMessage({ title = 'Error', message, onRetry, children }: ErrorMessageProps) {
    return (
        <div style={containerStyle}>
            <div style={iconStyle}>
                <ErrorIcon />
            </div>
            <h3 style={titleStyle}>{title}</h3>
            <p style={messageStyle}>{message}</p>
            {children}
            {onRetry && (
                <Button variant="secondary" onClick={onRetry}>
                    Try Again
                </Button>
            )}
        </div>
    );
}

function ErrorIcon() {
    return (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
    );
}

interface InlineErrorProps {
    message: string;
}

const inlineStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    padding: 'var(--space-sm) var(--space-md)',
    backgroundColor: 'var(--color-danger-light)',
    border: '1px solid var(--color-danger)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-danger)',
    fontSize: 'var(--font-size-sm)',
};

export function InlineError({ message }: InlineErrorProps) {
    return (
        <div style={inlineStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
            {message}
        </div>
    );
}
