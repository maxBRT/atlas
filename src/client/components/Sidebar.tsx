
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { specsApi, tasksApi } from '../lib/api'; // Import these for manual fetching
import { DocumentsList } from './DocumentsList';
import { useDocuments } from '../hooks/useDocuments'; // Use the reverted useDocuments
import '../styles/Sidebar.css';

interface SidebarSectionProps {
    header: React.ReactNode;
    isCollapsed: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}

function SidebarSection({ header, isCollapsed, onToggle, children }: SidebarSectionProps) {
    return (
        <div className="sidebar-section">
            <div className="sidebar-section-header" onClick={onToggle}>
                {header}
            </div>
            {!isCollapsed && children}
        </div>
    );
}

function ChevronIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 4.5L6 7.5L9 4.5" />
        </svg>
    );
}

interface SidebarItemProps {
    to: string;
    children: React.ReactNode;
    isActive?: boolean;
}

function SidebarItem({ to, children, isActive }: SidebarItemProps) {
    return (
        <Link to={to} className={`sidebar-item ${isActive ? 'active' : ''}`}>
            {children}
        </Link>
    );
}

function PlusIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 2v10M2 7h10" />
        </svg>
    );
}

export function Sidebar() {
    const location = useLocation();
    const { sidebarCollapsed, collapsedSections, toggleSection } = useApp();
    const { documents } = useDocuments(); // Use the reverted useDocuments hook

    const [specs, setSpecs] = useState<string[]>([]);
    const [tasks, setTasks] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [specsData, tasksData] = await Promise.all([
                    specsApi.list(),
                    tasksApi.list(),
                ]);
                setSpecs(specsData);
                setTasks(tasksData);
            } catch (error) {
                console.error('Failed to fetch sidebar data:', error);
                // Handle error state if necessary
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    if (sidebarCollapsed) {
        return <aside className="sidebar collapsed" />;
    }

    const documentsHeader = (
        <>
            <div className="sidebar-section-title">
                <span className="sidebar-chevron" style={{ transform: collapsedSections.documents ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                    <ChevronIcon />
                </span>
                <span>Documents</span>
            </div>
            <div className="sidebar-section-controls">
                <span className="count-badge">{documents.length}</span>
                <button
                    onClick={(e) => { e.stopPropagation(); setCreateModalOpen(true); }}
                    className="add-item-button"
                    aria-label="Add document"
                >
                    <PlusIcon />
                </button>
            </div>
        </>
    );

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <span className="sidebar-logo">Atlas</span>
            </div>
            <nav className="sidebar-content">
                <SidebarSection
                    header={documentsHeader}
                    isCollapsed={collapsedSections.documents}
                    onToggle={() => toggleSection('documents')}
                >
                    <DocumentsList
                        createModalOpen={createModalOpen}
                        setCreateModalOpen={setCreateModalOpen}
                    />
                </SidebarSection>

                <SidebarSection
                    header={
                        <>
                            <div className="sidebar-section-title">
                                <span className="sidebar-chevron" style={{ transform: collapsedSections.specs ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                                    <ChevronIcon />
                                </span>
                                <span>Specs</span>
                            </div>
                            {specs.length > 0 && <span className="count-badge">{specs.length}</span>}
                        </>
                    }
                    isCollapsed={collapsedSections.specs}
                    onToggle={() => toggleSection('specs')}
                >
                    <div className="sidebar-list">
                        {loading ? ( // Use the loading state from manual fetch
                            <span className="sidebar-empty-item">Loading...</span>
                        ) : specs.length === 0 ? (
                            <span className="sidebar-empty-item">No specs</span>
                        ) : (
                            specs.map(spec => (
                                <SidebarItem
                                    key={spec}
                                    to={`/specs/${spec}`}
                                    isActive={location.pathname === `/specs/${spec}`}
                                >
                                    {spec}
                                </SidebarItem>
                            ))
                        )}
                    </div>
                </SidebarSection>

                <SidebarSection
                    header={
                        <>
                            <div className="sidebar-section-title">
                                <span className="sidebar-chevron" style={{ transform: collapsedSections.tasks ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
                                    <ChevronIcon />
                                </span>
                                <span>Tasks</span>
                            </div>
                            {tasks.length > 0 && <span className="count-badge">{tasks.length}</span>}
                        </>
                    }
                    isCollapsed={collapsedSections.tasks}
                    onToggle={() => toggleSection('tasks')}
                >
                    <div className="sidebar-list">
                        {loading ? ( // Use the loading state from manual fetch
                            <span className="sidebar-empty-item">Loading...</span>
                        ) : tasks.length === 0 ? (
                            <span className="sidebar-empty-item">No tasks</span>
                        ) : (
                            tasks.map(taskFile => {
                                const taskId = taskFile.replace('.md', '');
                                return (
                                    <SidebarItem
                                        key={taskId}
                                        to={`/tasks/${taskId}`}
                                        isActive={location.pathname === `/tasks/${taskId}`}
                                    >
                                        {taskId}
                                    </SidebarItem>
                                );
                            })
                        )}
                    </div>
                </SidebarSection>
            </nav>
        </aside>
    );
}
