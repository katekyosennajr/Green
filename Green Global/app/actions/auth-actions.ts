'use server';

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export type RegisterState = {
    success?: boolean;
    message?: string;
    errors?: {
        name?: string;
        email?: string;
        password?: string;
    };
}

export async function registerUser(formData: FormData): Promise<RegisterState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation
    if (!name || name.length < 2) {
        return { success: false, message: 'Invalid input', errors: { name: 'Name must be at least 2 characters' } };
    }
    if (!email || !email.includes('@')) {
        return { success: false, message: 'Invalid input', errors: { email: 'Invalid email address' } };
    }
    if (!password || password.length < 6) {
        return { success: false, message: 'Invalid input', errors: { password: 'Password must be at least 6 characters' } };
    }

    try {
        // Check existing user
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { success: false, message: 'User already exists', errors: { email: 'Email is already registered' } };
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER', // Default role
            }
        });

        return { success: true, message: 'Registration successful! Please login.' };

    } catch (error) {
        console.error('Registration Error:', error);
        return { success: false, message: 'Failed to create account. Please try again later.' };
    }
}
