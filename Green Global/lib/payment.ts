import midtransClient from 'midtrans-client';

// Gunakan variabel environment atau fallback demi keamanan development/demo
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-dummy-key';
const CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-dummy-key';

export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: SERVER_KEY,
    clientKey: CLIENT_KEY
});

export async function createPaymentToken(orderId: string, amount: number, customerDetails: { email: string }) {
    if (SERVER_KEY.includes('dummy')) {
        console.warn("Midtrans Server Key is missing or dummy. Payment token will not be generated.");
        return null;
    }

    try {
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: Math.round(amount), // Midtrans butuh integer untuk IDR, strict typing
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                email: customerDetails.email,
            }
        };

        const transaction = await snap.createTransaction(parameter);
        return transaction.token;
    } catch (error) {
        console.error("Midtrans Transaction Error:", error);
        return null;
    }
}
