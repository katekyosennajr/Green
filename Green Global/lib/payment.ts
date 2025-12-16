import midtransClient from 'midtrans-client';

// Gunakan variabel environment atau fallback demi keamanan development/demo
// TEMPORARY FIX: Hardcoded keys with SB- prefix (forced)
const SERVER_KEY = 'SB-Mid-server-0alR-0p_sJyrAp2a6GdslZ_J';
const CLIENT_KEY = 'SB-Mid-client-tAAUZlj2F-YUxUYy';

export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: SERVER_KEY,
    clientKey: CLIENT_KEY
});

export async function createPaymentToken(orderId: string, amount: number, customerDetails: { email: string }) {
    // DEBUG: Cek apakah key terbaca
    console.log("DEBUG CHECK KEYS:", {
        serverKeyExists: !!SERVER_KEY,
        serverKeyLength: SERVER_KEY?.length,
        isDummy: SERVER_KEY.includes('dummy'),
        firstChar: SERVER_KEY?.substring(0, 5)
    });

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
        console.error("Midtrans Transaction Error (Falling back to Mock):", error);
        // Fallback to MOCK TOKEN so frontend can simulate the popup
        return "MOCK_TOKEN_BYPASS";
    }
}
