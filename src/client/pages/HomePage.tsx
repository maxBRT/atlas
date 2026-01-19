import React from 'react';

const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 'var(--space-lg)',
    textAlign: 'center',
    padding: 'var(--space-xl)',
};

const titleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-3xl)',
    fontWeight: 'var(--font-weight-bold)' as unknown as number,
    color: 'var(--color-text-primary)',
    margin: 0,
};

const subtitleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-lg)',
    color: 'var(--color-text-secondary)',
    maxWidth: '500px',
    margin: 0,
};

const cardContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--space-md)',
    width: '100%',
    maxWidth: '600px',
    marginTop: 'var(--space-lg)',
};

const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    textAlign: 'left',
};

const cardTitleStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)' as unknown as number,
    color: 'var(--color-text-primary)',
    marginBottom: 'var(--space-xs)',
};

const cardDescStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
};

export function HomePage() {
    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>Atlas Planning</h1>
            <div style={cardContainerStyle}>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Documents</h3>
                    <p style={cardDescStyle}>Root-level markdown files like application.md and context.md</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Specs</h3>
                    <p style={cardDescStyle}>Feature specifications that describe functionality</p>
                </div>
                <div style={cardStyle}>
                    <h3 style={cardTitleStyle}>Tasks</h3>
                    <p style={cardDescStyle}>Development tasks and tickets for implementation</p>
                </div>
            </div>
        </div>
    );
}
