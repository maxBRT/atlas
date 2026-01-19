
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '../components/Editor';
import { MarkdownPreview } from '../components/MarkdownPreview';
import { Button } from '../components/ui/Button';
import { useDocument, useSpec, useTask } from '../hooks';
import '../styles/EditorView.css';

type EditorViewProps = {
    type: 'document' | 'spec' | 'task';
};

function useDataQuery(type: EditorViewProps['type'], id: string | null) {
    const docQuery = useDocument(type === 'document' ? id : null);
    const specQuery = useSpec(type === 'spec' ? id : null);
    const taskQuery = useTask(type === 'task' ? id : null);

    switch (type) {
        case 'document':
            return docQuery;
        case 'spec':
            return specQuery;
        case 'task':
            return taskQuery;
    }
}

export function EditorView({ type }: EditorViewProps) {
    const params = useParams<{ filename: string; id: string }>();
    const id = type === 'task' ? params.id : params.filename;

    const query = useDataQuery(type, id ?? null);

    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (query.data) {
            const newContent = typeof query.data === 'object' && query.data.content ? query.data.content : query.data;
            setContent(newContent || '');
            setIsDirty(false);
        }
    }, [query.data]);

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
        // @ts-ignore
        const success = await query.updateContent(content);
        if (success) {
            setIsDirty(false);
        }
        setIsSaving(false);
    };

    if (query.loading) {
        return <div>Loading...</div>;
    }

    if (query.error) {
        return <div>Error: {query.error.message}</div>;
    }
    
    const displayName = type === 'task' ? (query.data as any)?.id : id;

    return (
        <div className="editor-view">
            <header className="editor-view-header">
                <div className="filename">{displayName}</div>
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
