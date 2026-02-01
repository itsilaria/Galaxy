'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black p-6 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-white">Oops! Qualcosa è andato storto.</h2>
                    <p className="mb-6 text-gray-400">La galassia ha avuto un piccolo sussulto spazio-temporale.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-full bg-white px-6 py-3 font-semibold text-black transition-transform hover:scale-105 active:scale-95"
                    >
                        Riavvia la Galassia
                    </button>
                    {process.env.NODE_ENV === 'development' && (
                        <pre className="mt-8 max-w-full overflow-auto rounded bg-red-900/20 p-4 text-left text-xs text-red-400">
                            {this.state.error?.toString()}
                        </pre>
                    )}
                </div>
            );
        }

        return this.children;
    }
}

export default ErrorBoundary;
