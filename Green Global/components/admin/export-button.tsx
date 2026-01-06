'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
    action: () => Promise<{ success: boolean; csv?: string; filename?: string; message?: string }>;
    label: string;
}

export function ExportButton({ action, label }: ExportButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleExport = async () => {
        setIsLoading(true);
        try {
            const result = await action();

            if (result.success && result.csv) {
                // Trigger download
                const blob = new Blob([result.csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.filename || 'export.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                toast.success('Export successful');
            } else {
                toast.error(result.message || 'Export failed');
            }
        } catch (error) {
            console.error(error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-50 transition-colors disabled:opacity-50"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {label}
        </button>
    );
}
