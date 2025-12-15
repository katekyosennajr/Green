import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Users, ShoppingBag, Settings } from 'lucide-react';
import { LogoutButton } from "../../components/logout-button";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-green-900 text-white flex flex-col fixed h-full">
                <div className="p-6 border-b border-green-800">
                    <span className="font-serif text-2xl font-bold tracking-tight">
                        Global<span className="text-gold-500">Green</span>
                    </span>
                    <span className="block text-xs text-green-400 mt-1 uppercase tracking-widest">Admin Panel</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-medium bg-green-800 rounded-lg text-white">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
                        <Package className="w-5 h-5" />
                        Products
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        Orders
                    </Link>
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        Users
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-green-800">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center font-bold text-green-900">
                            A
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                            <p className="text-xs text-green-400 truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
