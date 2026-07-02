import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import '../index.css'

import ErrorBoundary from '@/components/ErrorBoundary';
import { initializeDatabase } from '@/lib/seedData';
import { validateEnv } from '@/lib/env';

// Validate environment variables on startup
validateEnv();

// Initialize the database with high-fidelity demo data
initializeDatabase();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <RouterProvider router={router} />
        </ErrorBoundary>
    </React.StrictMode>,
)
