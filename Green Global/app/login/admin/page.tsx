'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid credentials');
            } else {
                // Verify if the user is actually an ADMIN
                const response = await fetch('/api/auth/session');
                const session = await response.json();

                if (session?.user?.role === 'ADMIN') {
                    window.location.href = '/admin';
                } else {
                    setError('Access Denied: You do not have admin privileges.');
                    // Optional: Sign out immediately if they are not admin
                    // await signOut({ redirect: false }); 
                }
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="max-w-md w-full space-y-8 z-10 relative">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-6">
                        <span className="font-serif text-3xl font-bold text-white tracking-tight">
                            Global<span className="text-gold-500">Green</span>
                        </span>
                    </Link>
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-900 p-3 rounded-full border border-green-800">
                            <ShieldCheck className="w-8 h-8 text-gold-500" />
                        </div>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-white">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-sm text-green-400">
                        Authorized personnel only
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg py-8 px-8 shadow-2xl rounded-2xl border border-white/10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-green-100">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-green-800 rounded-xl shadow-sm placeholder-green-700/50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-green-900/50 text-white"
                                    placeholder="admin@globalgreen.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-green-100">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-4 py-3 border border-green-800 rounded-xl shadow-sm placeholder-green-700/50 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-green-900/50 text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-green-950 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5 text-green-900" /> : <Lock className="h-5 w-5 text-green-900" />}
                                </span>
                                {isLoading ? 'Verifying...' : 'Access Dashboard'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="text-center">
                    <Link href="/login" className="text-xs text-green-600 hover:text-green-400 transition-colors">
                        Not an admin? Go to Customer Login
                    </Link>
                </div>

                <p className="mt-2 text-center text-xs text-green-600">
                    &copy; {new Date().getFullYear()} Global Green Exporter. Secure Admin System.
                </p>
            </div>
        </div>
    );
}
