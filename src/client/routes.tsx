import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { EditorView } from './pages/EditorView';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/documents/:filename" element={<EditorView type="document" />} />
            <Route path="/specs/:filename" element={<EditorView type="spec" />} />
            <Route path="/tasks/:id" element={<EditorView type="task" />} />
        </Routes>
    );
}

