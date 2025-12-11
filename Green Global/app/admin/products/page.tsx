import { PrismaClient } from '@prisma/client';
import { createProduct, deleteProduct } from '@/app/actions/product-actions';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { StockEditor } from '@/components/admin/stock-editor';
import { ProductForm } from '@/components/admin/product-form';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AdminProductsPage(props: Props) {
    const searchParams = await props.searchParams;
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
                <div className="bg-white p-8 rounded-xl shadow-sm border border-green-100 max-w-2xl">
                    <div className="mb-6 flex items-center gap-2">
                        <Link href="/admin/products" className="p-2 hover:bg-green-50 rounded-full">
                            <ArrowLeft className="w-5 h-5 text-green-600" />
                        </Link>
                        <h2 className="font-bold text-xl text-green-900">Add New Plant</h2>
                    </div>

                    <ProductForm />
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-green-50 text-green-800 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-green-50">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-green-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-green-900 block">{product.name}</span>
                                        <span className="text-xs text-green-600 italic">{product.scientificName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-green-900 font-medium">${product.priceUsd.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <StockEditor productId={product.id} initialStock={product.stock} />
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
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <p className="mb-2">No products found.</p>
                            <Link href="/admin/products?new=true" className="text-green-600 hover:underline text-sm">
                                Create your first product
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

