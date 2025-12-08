import { PrismaClient } from '@prisma/client';
import { createProduct, deleteProduct } from '@/app/actions/product-actions';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function AdminProductsPage({
    searchParams
}: {
    searchParams: { new?: string }
}) {
    const isCreating = searchParams.new === 'true';
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                {!isCreating && (
                    <Link href="/admin/products?new=true" className="bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-800 transition-colors">
                        <Plus className="w-4 h-4" /> Add Product
                    </Link>
                )}
            </div>

            {isCreating ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                    <div className="mb-6 flex items-center gap-2">
                        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <h2 className="font-bold text-xl text-gray-900">Add New Plant</h2>
                    </div>

                    <form action={createProduct} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Commercial Name</label>
                                <input name="name" required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="e.g. Scindapsus Snake Scale" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Scientific Name</label>
                                <input name="scientificName" required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="e.g. Scindapsus sp." />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                                <input name="price" type="number" step="0.01" required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                <input name="stock" type="number" required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="0" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (Comma separated)</label>
                            <input name="images" required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="https://..., https://..." />
                            <p className="text-xs text-gray-500 mt-1">Use external URLs for this V1 demo.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" rows={4} required className="w-full border border-gray-300 rounded-lg p-2.5" placeholder="Plant description..." />
                        </div>

                        <button type="submit" className="w-full bg-green-900 text-white font-bold py-3 rounded-lg hover:bg-gold-600 transition-colors">
                            Create Product
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-gray-900 block">{product.name}</span>
                                        <span className="text-xs text-gray-500 italic">{product.scientificName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">${product.priceUsd.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stock} Units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={deleteProduct.bind(null, product.id)} className="inline-block">
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No products found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
