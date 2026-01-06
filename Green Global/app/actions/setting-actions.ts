'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Define the shape of our settings for type safety in the UI
export interface AppSettings {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    currencyRate: string; // Stored as string, parsed as number
    phytoCost: string;
    shippingPolicy: string;
}

const DEFAULT_SETTINGS: AppSettings = {
    siteName: 'Green Global Exporter',
    siteDescription: 'Premium Rare Plants from Borneo to the World.',
    contactEmail: 'support@greenglobal.com',
    contactPhone: '+62 812-3456-7890',
    currencyRate: '16000',
    phytoCost: '35',
    shippingPolicy: 'We allow up to 12 plants per box. Processing time is 1-2 weeks for Phytosanitary certificate.'
};

export async function getSettings(): Promise<AppSettings> {
    try {
        const contents = await prisma.content.findMany({
            where: {
                key: {
                    in: Object.keys(DEFAULT_SETTINGS)
                }
            }
        });

        // Convert array of {key, value} to object
        const settings: Partial<AppSettings> = {};
        contents.forEach(item => {
            if (item.value) {
                // @ts-ignore - dynamic assignment
                settings[item.key] = item.value;
            }
        });

        // Merge with defaults to ensure all keys exist
        return { ...DEFAULT_SETTINGS, ...settings };
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return DEFAULT_SETTINGS;
    }
}

export async function updateSettings(formData: FormData) {
    const data: Partial<AppSettings> = {
        siteName: formData.get('siteName') as string,
        siteDescription: formData.get('siteDescription') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactPhone: formData.get('contactPhone') as string,
        currencyRate: formData.get('currencyRate') as string,
        phytoCost: formData.get('phytoCost') as string,
        shippingPolicy: formData.get('shippingPolicy') as string,
    };

    try {
        // Upsert each key
        const updates = Object.entries(data).map(([key, value]) => {
            return prisma.content.upsert({
                where: { key: key },
                update: { value: value || '' },
                create: { key: key, value: value || '' }
            });
        });

        await prisma.$transaction(updates);

        revalidatePath('/admin/settings');
        revalidatePath('/'); // Revalidate home in case settings are used there

        return { success: true, message: 'Settings saved successfully' };
    } catch (error) {
        console.error("Failed to update settings:", error);
        return { success: false, message: 'Failed to save settings' };
    }
}
