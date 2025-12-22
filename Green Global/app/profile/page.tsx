import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProfileView } from "@/components/profile-view";

const prisma = new PrismaClient();

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            orders: {
                orderBy: { createdAt: 'desc' },
                include: {
                    items: true
                }
            }
        }
    });

    if (!user) {
        redirect("/login");
    }

    // Transform user data to handle potential nulls for client component
    // Using (user as any) because Prisma Client types are locked/stale during dev server run
    const userData = {
        name: user.name,
        email: user.email,
        phone: (user as any).phone,
        address: (user as any).address,
        city: (user as any).city,
        postalCode: (user as any).postalCode,
        country: (user as any).country
    };

    // Transform orders to match ProfileView expectations
    const ordersData = user.orders.map(order => ({
        ...order,
        total: order.currency === 'IDR' && order.paymentTotal > 0 ? order.paymentTotal : order.totalUsd,
        currency: order.currency
    }));

    return (
        <>
            <SiteHeader />
            <main className="min-h-screen bg-cream-50 pt-12 pb-24">
                <div className="container mx-auto px-4">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="font-serif text-4xl font-bold text-green-900 mb-2">My Account</h1>
                        <p className="text-green-600">Manage your orders and personal details</p>
                    </div>

                    <ProfileView user={userData} orders={ordersData} />
                </div>
            </main>
            <SiteFooter />
        </>
    );
}
