import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import { User, Shield, ShieldCheck } from 'lucide-react';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-green-900">User Management</h1>
                    <p className="text-green-600">Manage registered users and administrators.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-green-100 shadow-sm">
                    <span className="text-sm font-bold text-green-900">Total Users: </span>
                    <span className="text-gold-600 font-mono">{users.length}</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-green-50 text-green-900 font-bold text-sm uppercase tracking-wider">
                        <tr>
                            <th className="p-4 border-b border-green-100">Name</th>
                            <th className="p-4 border-b border-green-100">Email</th>
                            <th className="p-4 border-b border-green-100">Role</th>
                            <th className="p-4 border-b border-green-100">Joined Date</th>
                            <th className="p-4 border-b border-green-100">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-green-50">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-green-50/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-green-900">{user.name || 'No Name'}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-green-700">
                                    {user.email}
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'ADMIN'
                                        ? 'bg-gold-100 text-gold-800 border border-gold-200'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {user.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-green-600">
                                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </td>
                                <td className="p-4">
                                    <Link href={`/admin/users/${user.id}`} className="text-xs text-green-600 hover:text-green-800 font-bold hover:underline">
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && (
                    <div className="p-8 text-center text-green-600">No users found.</div>
                )}
            </div>
        </div>
    );
}
