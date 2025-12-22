'use client';

import { createProduct, updateProduct } from '@/app/actions/product-actions';
import { Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ProductData = {
    id: string;
    name: string;
    scientificName: string | null;
    priceUsd: number;
    stock: number;
    category: string | null;
    description: string;
    images: string;
};

export function ProductForm({ initialData }: { initialData?: ProductData }) {
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
            let result;
            if (initialData) {
                result = await updateProduct(initialData.id, formData);
            } else {
                result = await createProduct(formData);
            }

            if (result.success) {
                setIsSuccess(true);
                setMessage(result.message || (initialData ? 'Product updated!' : 'Product created!'));
                router.refresh();
                router.push('/admin/products');
            } else {
                setIsSuccess(false);
                setMessage(result.message || 'Operation failed.');
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
                    <input name="name" defaultValue={initialData?.name} required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. Scindapsus Snake Scale" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Scientific Name</label>
                    <input name="scientificName" defaultValue={initialData?.scientificName || ''} required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="e.g. Scindapsus sp." />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-green-800 mb-1">Price (USD)</label>
                    <input name="price" defaultValue={initialData?.priceUsd} type="number" step="0.01" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="0.00" />
                </div>
                <div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-green-800 mb-1">Stock</label>
                            <input name="stock" defaultValue={initialData?.stock} type="number" required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-green-800 mb-1">Category</label>
                            <select name="category" defaultValue={initialData?.category || 'Scindapsus'} className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none">
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
                <label className="block text-sm font-medium text-green-800 mb-1">
                    {initialData ? 'Update Images' : 'Upload Images'}
                </label>
                <div className="border border-green-200 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-green-50/50 hover:bg-green-50 transition-colors">
                    <input
                        type="file"
                        name="imageFiles"
                        multiple
                        accept="image/*"
                        className="w-full text-sm text-green-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                    />
                    <p className="text-xs text-green-500 mt-2">Select one or more images (JPG, PNG)</p>
                </div>
                {initialData && (
                    <div className="mt-2 flex items-center gap-2">
                        <input type="checkbox" name="replaceImages" id="replaceImages" className="rounded border-green-300 text-green-900 focus:ring-green-900" />
                        <label htmlFor="replaceImages" className="text-sm text-green-700">Replace existing images completely</label>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-green-800 mb-1">Description</label>
                <textarea name="description" defaultValue={initialData?.description} rows={4} required className="w-full border border-green-200 rounded-lg p-2.5 focus:ring-2 focus:ring-gold-500 focus:outline-none" placeholder="Plant description..." />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-green-900 text-white font-bold py-3 rounded-lg hover:bg-gold-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50">
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin w-5 h-5" /> Processing...
                    </>
                ) : (
                    initialData ? 'Update Product' : 'Create Product'
                )}
            </button>
        </form>
    );
}
