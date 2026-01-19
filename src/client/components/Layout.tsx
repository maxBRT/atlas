import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { useApp } from '../contexts/AppContext';
import '../styles/Layout.css';

function MenuIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5H17M3 10H17M3 15H17" />
        </svg>
    );
}

export function Layout({ children }: LayoutProps) {
    const { toggleSidebar } = useApp();

    return (
        <div className="layout-container">
            <Sidebar />
            <main className="layout-main">
                <header className="layout-header">
                    <button
                        className="sidebar-toggle-button"
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <MenuIcon />
                    </button>
                </header>
                <div className="layout-content">
                    {children}
                </div>
            </main>
        </div>
    );
}