'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
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
                setError('Invalid email or password');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-200/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="max-w-md w-full space-y-8 z-10 relative">
                <div className="text-center">
                    <Link href="/" className="inline-block mb-6">
                        <span className="font-serif text-3xl font-bold text-green-900 tracking-tight">
                            Global<span className="text-gold-600">Green</span>
                        </span>
                    </Link>
                    <h2 className="font-serif text-3xl font-bold text-green-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-green-600">
                        Sign in to access your dashboard
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg py-8 px-8 shadow-xl rounded-2xl border border-white/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-green-900">
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
                                    className="appearance-none block w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-white/50"
                                    placeholder="admin@globalgreen.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-green-900">
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
                                    className="appearance-none block w-full px-4 py-3 border border-green-200 rounded-xl shadow-sm placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-white/50"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-green-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-800 focus:ring-gold-500 border-green-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-green-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-gold-600 hover:text-gold-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5 text-green-300" /> : <Lock className="h-5 w-5 text-green-500 group-hover:text-green-400" />}
                                </span>
                                {isLoading ? 'Signing in...' : 'Sign in'}
                                {!isLoading && <ArrowRight className="absolute right-4 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-2 text-center text-xs text-green-500">
                    &copy; {new Date().getFullYear()} Global Green Exporter. Secure System.
                </p>
            </div>
        </div>
    );
}
