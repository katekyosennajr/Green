import { test, expect } from '@playwright/test';

test('Simulate Checkout Flow (Dummy Payment)', async ({ page }) => {
    // 1. Masuk ke Katalog
    await page.goto('http://localhost:3000/catalog');

    // 2. Tambah produk pertama
    await page.locator('.group').first().click(); // Klik kartu produk pertama
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Add to Cart")');

    // 3. Masuk ke Keranjang
    await page.goto('http://localhost:3000/cart');

    // 4. Isi Detail Form
    await page.fill('input[name="name"]', 'Simulation User');
    await page.fill('input[name="email"]', 'sim-user@example.com');
    await page.fill('textarea[name="address"]', '123 Tropical Lane, Jakarta, Indonesia');

    // 5. Submit Order
    console.log('Clicking Confirm Order...');
    await page.click('button:has-text("Confirm Order")');

    // 6. Verifikasi Sukses (Tunggu pesan sukses)
    // Karena tanpa key, ini akan langsung sukses
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 10000 });

    // 7. Ambil Screenshot
    await page.screenshot({ path: 'C:/Users/riant/.gemini/antigravity/brain/461f5251-4cbe-4aaa-a1bf-394b712fdea9/payment_simor_proof.png' });
});
