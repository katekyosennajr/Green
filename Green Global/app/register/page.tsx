'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, User, Mail } from 'lucide-react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth-actions';

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const result = await registerUser(formData);

        if (result.success) {
            setMessage({ type: 'success', text: result.message || 'Registration successful!' });
            // Optional: Redirect after delay
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } else {
            setMessage({ type: 'error', text: result.message || 'Registration failed.' });
        }
        setIsLoading(false);
    }

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
                        Create Account
                    </h2>
                    <p className="mt-2 text-sm text-green-600">
                        Join us for easier checkout and exclusive updates
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-lg py-8 px-8 shadow-xl rounded-2xl border border-white/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {message && (
                            <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                <div className={`w-1 h-4 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-green-900">
                                Full Name
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none block w-full px-4 py-3 pl-10 border border-green-200 rounded-xl shadow-sm placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-white/50"
                                    placeholder="John Doe"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-400">
                                    <User className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-green-900">
                                Email Address
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-4 py-3 pl-10 border border-green-200 rounded-xl shadow-sm placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-white/50"
                                    placeholder="you@example.com"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-400">
                                    <Mail className="h-4 w-4" />
                                </div>
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
                                    autoComplete="new-password"
                                    required
                                    minLength={6}
                                    className="appearance-none block w-full px-4 py-3 pl-10 border border-green-200 rounded-xl shadow-sm placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all bg-white/50"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-green-400">
                                    <Lock className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-green-900 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5 text-green-300" /> : <ArrowRight className="h-5 w-5 text-green-500 group-hover:text-green-400" />}
                                </span>
                                {isLoading ? 'Creating Account...' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-green-600">
                            Already have an account?{' '}
                            <Link href="/login" className="font-bold text-green-900 hover:text-gold-600 transition-colors">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-2 text-center text-xs text-green-500">
                    &copy; {new Date().getFullYear()} Global Green Exporter.
                </p>
            </div>
        </div>
    );
}
