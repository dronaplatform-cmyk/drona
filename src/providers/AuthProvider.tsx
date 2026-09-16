// src/providers/AuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

// This must be a client component to use React Context
export default function AuthProvider({ children }: { children: ReactNode }) {
    return (
        // The SessionProvider wraps your entire application or layout
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}