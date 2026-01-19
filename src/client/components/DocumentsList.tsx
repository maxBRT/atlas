
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDocuments } from '../hooks/useDocuments';
import { Modal, ConfirmModal, Input, Button } from './ui';

interface DocumentsListProps {
    onDocumentCreate?: (filename: string) => void;
    createModalOpen: boolean;
    setCreateModalOpen: (isOpen: boolean) => void;
}

const listStyle: React.CSSProperties = {
    padding: '0 var(--space-sm)',
};

const listItemContainerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
};

const listItemStyle: React.CSSProperties = {
    display: 'block',
    flex: 1,
    padding: 'var(--space-sm) var(--space-md)',
    paddingLeft: 'calc(var(--space-md) + 20px)',
    paddingRight: 'var(--space-lg)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};

const activeItemStyle: React.CSSProperties = {
    ...listItemStyle,
    backgroundColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
};

const emptyStyle: React.CSSProperties = {
    padding: 'var(--space-sm) var(--space-md)',
    paddingLeft: 'calc(var(--space-md) + 20px)',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--font-size-sm)',
    fontStyle: 'italic',
};

const kebabButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: 'var(--space-sm)',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-muted)',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity var(--transition-fast)',
};

const menuStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 100,
    minWidth: '120px',
    overflow: 'hidden',
};

const menuItemStyle: React.CSSProperties = {
    display: 'block',
    width: '100%',
    padding: 'var(--space-sm) var(--space-md)',
    background: 'none',
    border: 'none',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--font-size-sm)',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast)',
};

const menuItemDangerStyle: React.CSSProperties = {
    ...menuItemStyle,
    color: 'var(--color-danger)',
};

function KebabIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="8" cy="13" r="1.5" />
        </svg>
    );
}

interface DocumentItemProps {
    filename: string;
    isActive: boolean;
    onRename: (filename: string) => void;
    onDelete: (filename: string) => void;
}

function DocumentItem({ filename, isActive, onRename, onDelete }: DocumentItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const style = isActive
        ? activeItemStyle
        : isHovered
            ? { ...listItemStyle, backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-primary)' }
            : listItemStyle;

    return (
        <div
            style={listItemContainerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setMenuOpen(false); }}
        >
            <Link to={`/documents/${filename}`} style={style}>
                {filename}
            </Link>
            <button
                style={{ ...kebabButtonStyle, opacity: isHovered || menuOpen ? 1 : 0 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(!menuOpen); }}
                aria-label="Document actions"
            >
                <KebabIcon />
            </button>
            {menuOpen && (
                <div ref={menuRef} style={menuStyle}>
                    <button
                        style={menuItemStyle}
                        onClick={() => { setMenuOpen(false); onRename(filename); }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Rename
                    </button>
                    <button
                        style={menuItemDangerStyle}
                        onClick={() => { setMenuOpen(false); onDelete(filename); }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function validateFilename(filename: string): string | null {
    if (!filename) return 'Filename is required';
    if (!filename.endsWith('.md')) return 'Filename must end with .md';
    if (!/^[a-zA-Z0-9_-]+\.md$/.test(filename)) {
        return 'Filename can only contain letters, numbers, hyphens, and underscores';
    }
    return null;
}

export function DocumentsList({ onDocumentCreate, createModalOpen, setCreateModalOpen }: DocumentsListProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { documents, loading, error, createDocument, deleteDocument, renameDocument } = useDocuments();

    const [newFilename, setNewFilename] = useState('');
    const [createError, setCreateError] = useState<string | null>(null);
    const [createLoading, setCreateLoading] = useState(false);

    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState<string | null>(null);
    const [renameFilename, setRenameFilename] = useState('');
    const [renameError, setRenameError] = useState<string | null>(null);
    const [renameLoading, setRenameLoading] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleCreate = async () => {
        const validationError = validateFilename(newFilename);
        if (validationError) {
            setCreateError(validationError);
            return;
        }
        if (documents.includes(newFilename)) {
            setCreateError('A document with this name already exists');
            return;
        }

        setCreateLoading(true);
        setCreateError(null);

        try {
            const success = await createDocument(newFilename, `# ${newFilename.replace('.md', '')}\n\n`);
            if (success) {
                setCreateModalOpen(false);
                setNewFilename('');
                onDocumentCreate?.(newFilename);
                navigate(`/documents/${newFilename}`);
            } else {
                setCreateError('Failed to create document');
            }
        } catch(e: any) {
            setCreateError(e.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleRename = async () => {
        if (!renameTarget) return;

        const validationError = validateFilename(renameFilename);
        if (validationError) {
            setRenameError(validationError);
            return;
        }
        if (renameFilename !== renameTarget && documents.includes(renameFilename)) {
            setRenameError('A document with this name already exists');
            return;
        }

        setRenameLoading(true);
        setRenameError(null);

        try {
            const success = await renameDocument(renameTarget, renameFilename);
            if (success) {
                if (location.pathname === `/documents/${renameTarget}`) {
                    navigate(`/documents/${renameFilename}`);
                }
                setRenameModalOpen(false);
                setRenameTarget(null);
                setRenameFilename('');
            } else {
                setRenameError('Failed to rename document');
            }
        } catch(e: any) {
            setRenameError(e.message);
        } finally {
            setRenameLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleteLoading(true);
        const success = await deleteDocument(deleteTarget);
        setDeleteLoading(false);

        if (success) {
            if (location.pathname === `/documents/${deleteTarget}`) {
                navigate('/');
            }
            setDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const openRenameModal = (filename: string) => {
        setRenameTarget(filename);
        setRenameFilename(filename);
        setRenameError(null);
        setRenameModalOpen(true);
    };

    const openDeleteModal = (filename: string) => {
        setDeleteTarget(filename);
        setDeleteModalOpen(true);
    };

    if (loading) {
        return <div style={listStyle}><span style={emptyStyle}>Loading...</span></div>;
    }

    if (error) {
        return <div style={listStyle}><span style={{ ...emptyStyle, color: 'var(--color-danger)' }}>{error}</span></div>;
    }

    return (
        <>
            <div style={listStyle}>
                {documents.length === 0 ? (
                    <div style={emptyStyle}>
                        <span>No documents yet</span>
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                fontSize: 'inherit',
                                padding: 0,
                                marginLeft: 'var(--space-xs)',
                                textDecoration: 'underline',
                            }}
                        >
                            Create one
                        </button>
                    </div>
                ) : (
                    documents.map(doc => (
                        <DocumentItem
                            key={doc}
                            filename={doc}
                            isActive={location.pathname === `/documents/${doc}`}
                            onRename={openRenameModal}
                            onDelete={openDeleteModal}
                        />
                    ))
                )}
            </div>

            {/* Create Document Modal */}
            <Modal
                isOpen={createModalOpen}
                onClose={() => { setCreateModalOpen(false); setNewFilename(''); setCreateError(null); }}
                title="New Document"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => { setCreateModalOpen(false); setNewFilename(''); setCreateError(null); }}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} loading={createLoading}>
                            Create
                        </Button>
                    </>
                }
            >
                <Input
                    label="Filename"
                    placeholder="my-document.md"
                    value={newFilename}
                    onChange={e => { setNewFilename(e.target.value); setCreateError(null); }}
                    error={createError || undefined}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                />
            </Modal>

            {/* Rename Document Modal */}
            <Modal
                isOpen={renameModalOpen}
                onClose={() => { setRenameModalOpen(false); setRenameTarget(null); setRenameError(null); }}
                title="Rename Document"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => { setRenameModalOpen(false); setRenameTarget(null); setRenameError(null); }}>
                            Cancel
                        </Button>
                        <Button onClick={handleRename} loading={renameLoading}>
                            Rename
                        </Button>
                    </>
                }
            >
                <Input
                    label="New filename"
                    value={renameFilename}
                    onChange={e => { setRenameFilename(e.target.value); setRenameError(null); }}
                    error={renameError || undefined}
                    autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleRename(); }}
                />
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => { setDeleteModalOpen(false); setDeleteTarget(null); }}
                onConfirm={handleDelete}
                title="Delete Document"
                message={`Are you sure you want to delete "${deleteTarget}"? This action cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={deleteLoading}
            />
        </>
    );
}
