'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center bg-cream-50">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-bold text-green-900 mb-4">
                Something went wrong!
            </h2>

            <p className="font-sans text-green-700 mb-8 max-w-md">
                We apologize for the inconvenience. An unexpected error has occurred.
                <br />
                <span className="text-sm opacity-70">Error Code: {error.digest || 'Unknown'}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-900 text-white font-bold rounded-lg hover:bg-green-800 transition-colors"
                >
                    <RefreshCcw className="w-4 h-4" />
                    Try Again
                </button>

                <Link
                    href="/"
                    className="flex items-center justify-center px-6 py-3 border border-green-200 text-green-800 font-bold rounded-lg hover:bg-green-50 transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
