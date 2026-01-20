import React from 'react';
import { Select } from './ui/Select';
import type { TaskMetadata } from '../lib/api';

interface TaskMetadataBarProps {
    metadata: TaskMetadata;
    updating: boolean;
    onStatusChange: (status: TaskMetadata['status']) => void;
    onPriorityChange: (priority: TaskMetadata['priority']) => void;
}

const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'complete', label: 'Complete' },
];

const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
};

const selectWrapperStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-xs)',
};

const selectLabelStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
};

const savingTextStyle: React.CSSProperties = {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    fontStyle: 'italic',
};

export function TaskMetadataBar({
    metadata,
    updating,
    onStatusChange,
    onPriorityChange,
}: TaskMetadataBarProps) {
    return (
        <div style={containerStyle}>
            <div style={selectWrapperStyle}>
                <span style={selectLabelStyle}>Status:</span>
                <Select
                    options={statusOptions}
                    value={metadata.status}
                    disabled={updating}
                    onChange={(e) => onStatusChange(e.target.value as TaskMetadata['status'])}
                    style={{ minWidth: '120px' }}
                />
            </div>
            <div style={selectWrapperStyle}>
                <span style={selectLabelStyle}>Priority:</span>
                <Select
                    options={priorityOptions}
                    value={metadata.priority}
                    disabled={updating}
                    onChange={(e) => onPriorityChange(e.target.value as TaskMetadata['priority'])}
                    style={{ minWidth: '100px' }}
                />
            </div>
            {updating && <span style={savingTextStyle}>Saving...</span>}
        </div>
    );
}
