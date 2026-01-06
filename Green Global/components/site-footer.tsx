import Link from 'next/link';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function SiteFooter() {
    return (
        <footer className="bg-cream-50 border-t border-green-100 text-green-900">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo Brand */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-2xl font-bold text-green-900">
                            Global<span className="text-gold-600">Green</span>
                        </h3>
                        <p className="text-sm text-green-700 max-w-xs">
                            Direct from Borneo to the World. We specialize in exporting rare Aroids with full phytosanitary compliance.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://www.instagram.com/riantandrs/" target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-5 h-5 text-green-600 hover:text-green-900 cursor-pointer transition-colors" />
                            </a>
                            <a href="https://www.facebook.com/riant.andriansyah/" target="_blank" rel="noopener noreferrer">
                                <Facebook className="w-5 h-5 text-green-600 hover:text-green-900 cursor-pointer transition-colors" />
                            </a>
                            <a href="https://www.linkedin.com/in/riant-andriansyah2929" target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-5 h-5 text-green-600 hover:text-green-900 cursor-pointer transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Tautan Cepat */}
                    <div>
                        <h4 className="font-serif text-lg mb-4 text-green-900">Shop</h4>
                        <ul className="space-y-2 text-sm text-green-600">
                            <li><Link href="/catalog" className="hover:text-gold-600">All Plants</Link></li>
                            <li><Link href="/catalog?category=Scindapsus" className="hover:text-gold-600">Scindapsus</Link></li>
                            <li><Link href="/catalog?category=Monstera" className="hover:text-gold-600">Monstera</Link></li>
                            <li><Link href="/wholesale" className="hover:text-gold-600">Wholesale / B2B</Link></li>
                        </ul>
                    </div>

                    {/* Bantuan */}
                    <div>
                        <h4 className="font-serif text-lg mb-4 text-green-900">Support</h4>
                        <ul className="space-y-2 text-sm text-green-600">
                            <li><Link href="/shipping" className="hover:text-gold-600">Shipping & Phyto</Link></li>
                            <li><Link href="/track-order" className="hover:text-gold-600">Track My Order</Link></li>
                            <li><Link href="/guarantee" className="hover:text-gold-600">Live Arrival Guarantee</Link></li>
                            <li><Link href="/faq" className="hover:text-gold-600">FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-gold-600">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Kontak / Newsletter */}
                    <div>
                        <h4 className="font-serif text-lg mb-4 text-green-900">Contact</h4>
                        <p className="text-sm text-green-600 mb-2">WhatsApp: +62 812-3456-7890</p>
                        <p className="text-sm text-green-600">Email: export@globalgreen.com</p>
                        <p className="text-xs text-green-500 mt-4">
                            Borneo, Indonesia
                        </p>
                    </div>
                </div>

                <div className="border-t border-green-200 mt-12 pt-8 text-center text-xs text-green-500 flex flex-col md:flex-row justify-between items-center">
                    <p>&copy; {new Date().getFullYear()} Global Green Exporter. All rights reserved.</p>
                    <div className="space-x-4 mt-2 md:mt-0">
                        <Link href="/terms" className="hover:text-green-900">Terms</Link>
                        <Link href="/privacy" className="hover:text-green-900">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
