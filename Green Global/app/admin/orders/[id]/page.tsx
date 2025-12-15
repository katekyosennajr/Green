import Link from 'next/link';
import { ArrowLeft, MapPin, Mail, Phone, Package, CreditCard, Calendar, Truck, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Include product in items to access name
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: true }
            },
            user: true
        }
    });

    if (!order) {
        return <div className="p-8 text-center">Order not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="ml-auto">
                    <span className={`px-4 py-2 rounded-lg font-bold ${order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {order.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" /> Customer Details
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="font-bold text-gray-700 w-5">Nm:</span>
                            <span className="text-gray-900 font-medium">{order.name || 'Guest'}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span>{order.guestEmail}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-600 whitespace-pre-wrap">{order.shippingAddress || 'No address provided'}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gray-400" /> Payment Information
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Status</span>
                            <span className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Total Amount</span>
                            <span className="font-bold text-xl">${order.totalUsd.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Via {order.paymentMethod || 'Midtrans'}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-gray-400" /> Shipping Details
                    </h3>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Courier</span>
                            <span className="font-bold text-green-800">{order.shippingCourier || 'Not selected'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tracking</span>
                            <span className="font-mono text-xs">{order.trackingNumber || '-'}</span>
                        </div>
                    </div>
                    {order.status === 'SHIPPED' ? (
                        <div className="text-green-600 font-medium text-xs mt-2 border-t pt-2">Order marked sent.</div>
                    ) : (
                        <div className="text-gray-500 text-xs mt-2 border-t pt-2">Action required: Generate Label</div>
                    )}
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-400" /> Order Items ({order.items.length})
                    </h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">SKU/ID</th>
                            <th className="px-6 py-4 text-right">Price</th>
                            <th className="px-6 py-4 text-right">Qty</th>
                            <th className="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    {item.product.name}
                                </td>
                                <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                                    {item.productId.slice(0, 8)}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">
                                    ${item.priceUsd.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">
                                    ${(item.priceUsd * item.quantity).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
