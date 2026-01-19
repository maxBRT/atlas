import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ItemType = 'document' | 'spec' | 'task' | null;

interface SelectedItem {
    type: ItemType;
    id: string | null;
}

interface AppContextValue {
    // Sidebar state
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Selected item state
    selectedItem: SelectedItem;
    selectItem: (type: ItemType, id: string | null) => void;
    clearSelection: () => void;

    // Section collapse states
    collapsedSections: {
        documents: boolean;
        specs: boolean;
        tasks: boolean;
    };
    toggleSection: (section: 'documents' | 'specs' | 'tasks') => void;
}

const AppContext = createContext<AppContextValue | null>(null);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SelectedItem>({
        type: null,
        id: null,
    });
    const [collapsedSections, setCollapsedSections] = useState({
        documents: false,
        specs: false,
        tasks: false,
    });

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prev => !prev);
    }, []);

    const selectItem = useCallback((type: ItemType, id: string | null) => {
        setSelectedItem({ type, id });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedItem({ type: null, id: null });
    }, []);

    const toggleSection = useCallback((section: 'documents' | 'specs' | 'tasks') => {
        setCollapsedSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    }, []);

    const value: AppContextValue = {
        sidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        selectedItem,
        selectItem,
        clearSelection,
        collapsedSections,
        toggleSection,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(): AppContextValue {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
