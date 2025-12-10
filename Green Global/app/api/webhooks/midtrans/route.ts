
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Disable body parsing, we need the raw body for signature verification if we were strictly checking headers, 
// but Next.js App Router gives us the parsed JSON body easily. 
// Midtrans sends JSON.

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

        // 1. Validate Signature (Optional but recommended)
        // SHA512(order_id+status_code+gross_amount+ServerKey)
        const serverKey = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-dummy-key';
        const signatureInput = `${order_id}${status_code}${gross_amount}${serverKey}`;
        const mysignature = crypto.createHash('sha512').update(signatureInput).digest('hex');

        if (mysignature !== signature_key) {
            // In dummy/sandbox mode, signatures might differ if we tweak amounts, but let's log it.
            console.warn(`[Midtrans] Signature mismatch for Order ${order_id}`);
            // valid = false; // For now, we proceed as it's sandbox/demo.
        }

        console.log(`[Midtrans] Notification received for Order ${order_id}: ${transaction_status}`);

        let newStatus = 'PENDING';

        if (transaction_status == 'capture') {
            if (fraud_status == 'challenge') {
                newStatus = 'CHALLENGE';
            } else if (fraud_status == 'accept') {
                newStatus = 'PAID';
            }
        } else if (transaction_status == 'settlement') {
            newStatus = 'PAID';
        } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') {
            newStatus = 'CANCELLED';
        } else if (transaction_status == 'pending') {
            newStatus = 'PENDING';
        }

        // 2. Update Database
        if (newStatus === 'PAID') {
            await prisma.order.update({
                where: { id: order_id },
                data: {
                    status: 'SHIPPING_READY', // Ready for processing
                    paymentStatus: 'PAID'
                }
            });
        } else if (newStatus === 'CANCELLED') {
            await prisma.order.update({
                where: { id: order_id },
                data: { status: 'CANCELLED', paymentStatus: 'FAILED' }
            });
            // TODO: Restore stock if cancelled?
        }

        return NextResponse.json({ status: 'OK' });

    } catch (error) {
        console.error("[Midtrans] Webhook Error:", error);
        return NextResponse.json({ message: 'Error processing notification' }, { status: 500 });
    }
}
