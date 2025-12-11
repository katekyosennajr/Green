'use client';

import { createProduct } from '@/app/actions/product-actions';
import { Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProductForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage('');
        setIsSuccess(false);

        const formData = new FormData(event.currentTarget);

        try {
            console.log("Submitting form...");
            const result = await createProduct(formData);
            console.log("Result:", result);

            if (result.success) {
                setIsSuccess(true);
                setMessage(result.message || 'Product created!');

                // Allow user to see success message briefly or redirect immediately?
                // Redirect immediately as per standard flow
                router.refresh();
                router.push('/admin/products');
            } else {
                setIsSuccess(false);
                setMessage(result.message || 'Failed to create product.');
            }
        } catch (error) {
            console.error("Submission error:", error);
            setMessage('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    <AlertCircle className="w-5 h-5" />
                    <p>{message}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Commercial Name</label>
                    <input name="name" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. Scindapsus Snake Scale" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Scientific Name</label>
                    <input name="scientificName" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. Scindapsus sp." />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Price (USD)</label>
                    <input name="price" type="number" step="0.01" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="0.00" />
                </div>
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-green-800 mb-1">Stock</label>
                            <input name="stock" type="number" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-800 mb-1">Category</label>
                            <select name="category" className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none">
                                <option value="Scindapsus">Scindapsus</option>
                                <option value="Monstera">Monstera</option>
                                <option value="Variegated">Variegated</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-green-800 mb-1">Image URLs (Comma separated)</label>
                <input name="images" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="https://..., https://..." />
                <p className="text-xs text-green-500 mt-1">Use external URLs for this V1 demo.</p>
            </div>

            <div>
                <label className="block text-sm font-medium text-green-800 mb-1">Description</label>
                <textarea name="description" rows={4} required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Plant description..." />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-green-900 text-white font-bold py-3 rounded-lg hover:bg-gold-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                ) : (
                    'Create Product'
                )}
            </button>
        </form>
    );
}
