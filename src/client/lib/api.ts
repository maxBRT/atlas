export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string | { message: string; issues?: unknown[] };
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

const BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;
        let details: unknown = undefined;

        if (isJson) {
            const errorData = await response.json();
            errorMessage = errorData.error?.message || errorData.error || errorMessage;
            details = errorData;
        } else {
            errorMessage = await response.text() || errorMessage;
        }

        throw new ApiError(errorMessage, response.status, details);
    }

    if (isJson) {
        const data: ApiResponse<T> = await response.json();
        if (!data.success) {
            throw new ApiError(
                typeof data.error === 'string' ? data.error : data.error?.message || 'Unknown error',
                response.status,
                data.error
            );
        }
        return data.data as T;
    }

    return await response.text() as unknown as T;
}

export const api = {
    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        return handleResponse<T>(response);
    },

    async post<T>(endpoint: string, body?: unknown): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        return handleResponse<T>(response);
    },

    async put<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },

    async patch<T>(endpoint: string, body: unknown): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });
        return handleResponse<T>(response);
    },

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });
        return handleResponse<T>(response);
    },
};

// Typed API methods for specific endpoints
export const documentsApi = {
    list: () => api.get<string[]>('/documents'),
    get: (filename: string) => api.get<{ filename: string; content: string }>(`/documents/${filename}`),
    create: (filename: string, content: string) => api.post<void>(`/documents/${filename}`, { content }),
    update: (filename: string, content: string) => api.post<void>(`/documents/${filename}`, { content }),
    delete: (filename: string) => api.delete<void>(`/documents/${filename}`),
    rename: (filename: string, newFilename: string) => api.patch<void>(`/documents/${filename}`, { newFilename }),
};

export const specsApi = {
    list: () => api.get<string[]>('/specs'),
    get: (filename: string) => api.get<string>(`/specs/${filename}`),
    create: (filename: string, content: string) => api.post<void>('/specs', { filename, content }),
    update: (filename: string, content: string) => api.post<void>(`/specs/${filename}`, { content }),
    delete: (filename: string) => api.delete<void>(`/specs/${filename}`),
};

export interface TaskMetadata {
    id: string;
    status: 'todo' | 'in-progress' | 'complete';
    priority: 'low' | 'medium' | 'high';
    parentSpec?: string;
    dependsOn?: string[];
}

export interface TaskData {
    metadata: TaskMetadata;
    content: string;
}

export const tasksApi = {
    list: () => api.get<string[]>('/tasks'),
    get: (id: string) => api.get<TaskData>(`/tasks/${id}`),
    create: (task: Omit<TaskData, 'id'> & { id?: string }) => api.post<TaskData>('/tasks', task),
    update: (id: string, task: Partial<TaskData>) => api.put<TaskData>(`/tasks/${id}`, task),
    delete: (id: string) => api.delete<void>(`/tasks/${id}`),
};
