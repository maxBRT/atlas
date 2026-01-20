
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '../components/Editor';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Button } from '../components/ui/Button';
import { TaskMetadataBar } from '../components/TaskMetadataBar';
import { useDocument, useSpec, useTask } from '../hooks';
import type { TaskData, TaskMetadata } from '../lib/api';
import '../styles/EditorView.css';

type EditorViewProps = {
    type: 'document' | 'spec' | 'task';
};

export function EditorView({ type }: EditorViewProps) {
    const params = useParams<{ filename: string; id: string }>();
    const id = type === 'task' ? params.id : params.filename;

    const docQuery = useDocument(type === 'document' ? (id ?? null) : null);
    const specQuery = useSpec(type === 'spec' ? (id ?? null) : null);
    const taskQuery = useTask(type === 'task' ? (id ?? null) : null);

    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loading = docQuery.loading || specQuery.loading || taskQuery.loading;
    const error = docQuery.error || specQuery.error || taskQuery.error;

    useEffect(() => {
        let newContent = '';
        if (type === 'task' && taskQuery.data) {
            newContent = taskQuery.data.content;
        } else if (type === 'document' && docQuery.data) {
            newContent = typeof docQuery.data === 'string' ? docQuery.data : docQuery.data.content;
        } else if (type === 'spec' && specQuery.data) {
            newContent = typeof specQuery.data === 'string' ? specQuery.data : '';
        }
        if (newContent) {
            setContent(newContent);
            setIsDirty(false);
        }
    }, [type, taskQuery.data, docQuery.data, specQuery.data]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isDirty]);

    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setIsDirty(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        let success = false;
        if (type === 'task') {
            success = await taskQuery.updateContent(content);
        } else if (type === 'document') {
            success = await docQuery.updateContent(content);
        } else if (type === 'spec') {
            success = await specQuery.updateContent(content);
        }
        if (success) {
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const isTask = type === 'task';
    const taskData = isTask ? taskQuery.data : null;
    const displayName = isTask ? taskData?.metadata?.id : id;

    const handleStatusChange = async (status: TaskMetadata['status']) => {
        await taskQuery.updateMetadata({ status });
    };

    const handlePriorityChange = async (priority: TaskMetadata['priority']) => {
        await taskQuery.updateMetadata({ priority });
    };

    const updating = taskQuery.updating;

    return (
        <div className="editor-view">
            <header className="editor-view-header">
                <div className="filename">{displayName}</div>
                {isTask && taskData?.metadata && (
                    <TaskMetadataBar
                        metadata={taskData.metadata}
                        updating={updating}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                    />
                )}
                <div className="actions">
                    <Button
                        variant={isEditing ? 'primary' : 'secondary'}
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Preview' : 'Edit'}
                    </Button>
                    <Button onClick={handleSave} disabled={!isDirty || isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </header>
            <main className="editor-view-main">
                {isEditing ? (
                    <Editor content={content} onChange={handleContentChange} />
                ) : (
                    <MarkdownPreview content={content} />
                )}
            </main>
        </div>
    );
}
