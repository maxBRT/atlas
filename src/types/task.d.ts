export interface metadata {
    id: string;
    status: string;
    priority: string;
    parentSpec?: string;
}

export interface Task {
    metadata: metadata;
    content: string;
}
