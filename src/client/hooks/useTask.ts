
import { useState, useEffect, useCallback } from 'react';
import { tasksApi, ApiError } from '../lib/api';
import type { TaskData, TaskMetadata } from '../lib/api';

interface UseTaskResult {
    data: TaskData | null;
    loading: boolean;
    updating: boolean;
    error: { message: string } | null;
    refetch: () => Promise<void>;
    updateContent: (content: string) => Promise<boolean>;
    updateMetadata: (partial: Partial<Omit<TaskMetadata, 'id'>>) => Promise<boolean>;
}

export function useTask(id: string | null): UseTaskResult {
    const [data, setData] = useState<TaskData | null>(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
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
            setUpdating(true);
            const updatedTask: TaskData = {
                metadata: data.metadata,
                content: newContent,
            };
            await tasksApi.update(id, updatedTask);
            setData(updatedTask);
            return true;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to update task';
            setError({ message });
            return false;
        } finally {
            setUpdating(false);
        }
    }, [id, data]);

    const updateMetadata = useCallback(async (partial: Partial<Omit<TaskMetadata, 'id'>>): Promise<boolean> => {
        if (!id || !data) return false;

        try {
            setUpdating(true);
            const updatedTask: TaskData = {
                metadata: { ...data.metadata, ...partial },
                content: data.content,
            };
            await tasksApi.update(id, updatedTask);
            setData(updatedTask);
            return true;
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Failed to update task metadata';
            setError({ message });
            return false;
        } finally {
            setUpdating(false);
        }
    }, [id, data]);

    return {
        data,
        loading,
        updating,
        error,
        refetch: fetchTask,
        updateContent,
        updateMetadata,
    };
}
