import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';
import './styles/index.css';

export function App() {
    return (
        <BrowserRouter>
            <AppProvider>
                <Layout>
                    <AppRoutes />
                </Layout>
            </AppProvider>
        </BrowserRouter>
    );
}
