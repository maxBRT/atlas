
import { useState, useEffect, useCallback } from 'react';
import { tasksApi, ApiError, TaskData } from '../lib/api';

interface UseTaskResult {
    data: TaskData | null;
    loading: boolean;
    error: { message: string } | null;
    refetch: () => Promise<void>;
    updateContent: (content: string) => Promise<boolean>;
}

export function useTask(id: string | null): UseTaskResult {
    const [data, setData] = useState<TaskData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ message: string } | null>(null);

    const fetchTask = useCallback(async () => {
        if (!id) {
            setData(null);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const taskData = await tasksApi.get(id);
            setData(taskData);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to fetch task';
            setError({ message });
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

    const updateContent = useCallback(async (newContent: string): Promise<boolean> => {
        if (!id || !data) return false;

        try {
            const updatedTask = { ...data, content: newContent };
            await tasksApi.update(id, updatedTask);
            setData(updatedTask);
            return true;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to update task';
            setError({ message });
            return false;
        }
    }, [id, data]);

    return {
        data,
        loading,
        error,
        refetch: fetchTask,
        updateContent,
    };
}
