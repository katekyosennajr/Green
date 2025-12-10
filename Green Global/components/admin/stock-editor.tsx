'use client';

import { useState } from 'react';
import { updateStock } from '@/app/actions/stock-actions';
import { Check, X, Edit2, Loader2 } from 'lucide-react';

export function StockEditor({ productId, initialStock }: { productId: string, initialStock: number }) {
    const [isEditing, setIsEditing] = useState(false);
    const [stock, setStock] = useState(initialStock);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        const res = await updateStock(productId, Number(stock));
        setIsLoading(false);
        if (res.success) {
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-20 border rounded px-2 py-1 text-sm"
                    autoFocus
                />
                <button onClick={handleSave} disabled={isLoading} className="text-green-600 hover:bg-green-50 p-1 rounded">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                    <X className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <button onClick={() => setIsEditing(true)} className={`flex items-center gap-2 text-xs px-2 py-1 rounded-full font-bold transition-colors ${stock > 0 ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}>
            {stock} Units
            <Edit2 className="w-3 h-3 opacity-50" />
        </button>
    );
}
