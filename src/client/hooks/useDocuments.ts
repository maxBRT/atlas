
import { useState, useEffect, useCallback } from 'react';
import { documentsApi, ApiError } from '../lib/api';

interface UseDocumentsResult {
    documents: string[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createDocument: (filename: string, content?: string) => Promise<boolean>;
    deleteDocument: (filename: string) => Promise<boolean>;
    renameDocument: (filename: string, newFilename: string) => Promise<boolean>;
}

interface UseDocumentResult {
    data: { content: string } | null;
    loading: boolean;
    error: { message: string } | null;
    refetch: () => Promise<void>;
    updateContent: (content: string) => Promise<boolean>;
}

export function useDocuments(): UseDocumentsResult {
    const [documents, setDocuments] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await documentsApi.list();
            setDocuments(data.sort());
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to fetch documents';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const createDocument = useCallback(async (filename: string, content: string = ''): Promise<boolean> => {
        try {
            await documentsApi.create(filename, content);
            await fetchDocuments();
            return true;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to create document';
            // This is a bit of a hack, but we need to pass the error message back to the component
            if (err instanceof Error) {
                throw err;
            }
            return false;
        }
    }, [fetchDocuments]);

    const deleteDocument = useCallback(async (filename: string): Promise<boolean> => {
        try {
            await documentsApi.delete(filename);
            await fetchDocuments();
            return true;
        } catch (err) {
            return false;
        }
    }, [fetchDocuments]);

    const renameDocument = useCallback(async (filename: string, newFilename: string): Promise<boolean> => {
        try {
            await documentsApi.rename(filename, newFilename);
            await fetchDocuments();
            return true;
        } catch (err) {
            if (err instanceof Error) {
                throw err;
            }
            return false;
        }
    }, [fetchDocuments]);

    return {
        documents,
        loading,
        error,
        refetch: fetchDocuments,
        createDocument,
        deleteDocument,
        renameDocument,
    };
}

export function useDocument(filename: string | null): UseDocumentResult {
    const [data, setData] = useState<{ content: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);

    const fetchDocument = useCallback(async () => {
        if (!filename) {
            setData(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const docData = await documentsApi.get(filename);
            setData(docData);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to fetch document';
            setError({ message });
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [filename]);

    useEffect(() => {
        fetchDocument();
    }, [fetchDocument]);

    const updateContent = useCallback(async (newContent: string): Promise<boolean> => {
        if (!filename) return false;

        try {
            await documentsApi.update(filename, newContent);
            setData({ content: newContent });
            return true;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to update document';
            setError({ message });
            return false;
        }
    }, [filename]);

    return {
        data,
        loading,
        error,
        refetch: fetchDocument,
        updateContent,
    };
}
