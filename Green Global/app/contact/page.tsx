import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with Global Green Exporter.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-green-900 mb-6">Contact Us</h1>
            <p className="text-green-800">For inquiries, please email us at <strong>export@globalgreen.com</strong> or WhatsApp +62 812-3456-7890.</p>
        </div>
    );
}
