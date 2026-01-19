
import { useState, useEffect, useCallback } from 'react';
import { specsApi, ApiError } from '../lib/api';

interface UseSpecResult {
    data: string | null;
    loading: boolean;
    error: { message: string } | null;
    refetch: () => Promise<void>;
    updateContent: (content: string) => Promise<boolean>;
}

export function useSpec(filename: string | null): UseSpecResult {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);

    const fetchSpec = useCallback(async () => {
        if (!filename) {
            setData(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const specData = await specsApi.get(filename);
            setData(specData);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to fetch spec';
            setError({ message });
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [filename]);

    useEffect(() => {
        fetchSpec();
    }, [fetchSpec]);

    const updateContent = useCallback(async (newContent: string): Promise<boolean> => {
        if (!filename) return false;

        try {
            await specsApi.update(filename, newContent);
            setData(newContent);
            return true;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to update spec';
            setError({ message });
            return false;
        }
    }, [filename]);

    return {
        data,
        loading,
        error,
        refetch: fetchSpec,
        updateContent,
    };
}
