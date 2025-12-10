import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
    return (
        <div className="bg-cream-50 min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl font-bold text-green-900 mb-4">Frequently Asked Questions</h1>
                    <p className="text-green-700">Common questions about importing rare plants from Indonesia.</p>
                </div>

                <div className="space-y-6">
                    {/* Q1 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-50">
                        <h3 className="font-serif text-xl font-bold text-green-900 mb-3 flex gap-3 items-start">
                            <HelpCircle className="w-6 h-6 text-gold-500 shrink-0 mt-1" />
                            How do I care for the plants after arrival?
                        </h3>
                        <p className="text-green-700 pl-9">
                            Rehydrate the roots in room-temperature water for 6-12 hours.
                            Then, pot in a chunky aroid mix (orchid bark, perlite, pumice, charcoal) or sphagnum moss.
                            Keep in high humidity (70%+) and quarantine from other plants for 2 weeks. Do not fertilize for the first month.
                        </p>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-50">
                        <h3 className="font-serif text-xl font-bold text-green-900 mb-3 flex gap-3 items-start">
                            <HelpCircle className="w-6 h-6 text-gold-500 shrink-0 mt-1" />
                            What payment methods do you adjust?
                        </h3>
                        <p className="text-green-700 pl-9">
                            We advise using PayPal (Friends & Family or Goods & Services + fee) for international transactions as it offers buyer protection.
                            We also accept Wise (formerly TransferWise) and direct Bank Transfer (SWIFT) for wholesale orders.
                        </p>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-50">
                        <h3 className="font-serif text-xl font-bold text-green-900 mb-3 flex gap-3 items-start">
                            <HelpCircle className="w-6 h-6 text-gold-500 shrink-0 mt-1" />
                            Can you declare a lower value on customs?
                        </h3>
                        <p className="text-green-700 pl-9">
                            We strive to comply with all international trade laws.
                            However, we can discuss invoice adjustments for specific country requirements if legally permissible.
                            Please contact us before ordering.
                        </p>
                    </div>

                    {/* Q4 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-50">
                        <h3 className="font-serif text-xl font-bold text-green-900 mb-3 flex gap-3 items-start">
                            <HelpCircle className="w-6 h-6 text-gold-500 shrink-0 mt-1" />
                            Are the photos the exact plant I will receive?
                        </h3>
                        <p className="text-green-700 pl-9">
                            For "Best Selected" items, you will receive a plant of similar size, variegation, and quality to the photo.
                            For "Exact Plant" listings (marked in the catalog), you get the specific plant pictured.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center text-green-800">
                    <p>Still have questions?</p>
                    <Link href="/contact" className="text-gold-600 font-bold hover:underline">
                        Contact our Support Team
                    </Link>
                </div>
            </div>
        </div>
    );
}
