'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export type ProfileState = {
    success?: boolean;
    message?: string;
}

export async function updateProfile(formData: FormData): Promise<ProfileState> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return { success: false, message: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const postalCode = formData.get('postalCode') as string;
    const country = formData.get('country') as string;

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                phone,
                address,
                city,
                postalCode,
                country
            }
        });

        revalidatePath('/profile');
        return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
        console.error('Update profile error:', error);
        return { success: false, message: 'Failed to update profile' };
    }
}
