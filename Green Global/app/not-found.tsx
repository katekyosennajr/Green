import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Page Not Found',
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-cream-50">
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-green-900 mb-4">404</h2>
            <p className="font-sans text-xl text-green-700 mb-8">This page could not be found.</p>
            <Link
                href="/"
                className="px-8 py-3 bg-green-900 text-white font-bold rounded-full hover:bg-gold-500 transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
