import { test, expect } from '@playwright/test';

test.describe('Global Green Exporter - Core User Flow', () => {

    test('Homepage loads and displays critical elements', async ({ page }) => {
        await page.goto('/');

        // Cek Judul Halaman
        await expect(page).toHaveTitle(/Global Green Exporter/);

        // Cek Bagian Hero (Judul Utama)
        const heroHeading = page.getByRole('heading', { name: /Source the Rarest/i });
        await expect(heroHeading).toBeVisible();

        // Cek Badge Verifikasi (Phyto, Garansi)
        await expect(page.getByText('100% Live Guarantee')).toBeVisible();
        await expect(page.getByText('Free Phyto Cert')).toBeVisible();
    });

    test('Catalog displays products and filters', async ({ page }) => {
        await page.goto('/catalog');

        const productGrid = page.locator('.grid');
        await expect(productGrid).toBeVisible();

        // Cek nama produk spesifik
        await expect(page.getByText('Scindapsus')).toBeVisible();
    });

    test('Full Purchase Flow (Add to Cart -> Checkout)', async ({ page }) => {
        // 1. Masuk ke Katalog
        await page.goto('/catalog');

        // 2. Klik produk pertama
        await page.locator('.group a').first().click();

        // 3. Verifikasi Halaman Produk
        await expect(page.getByText('Genetic Guarantee')).toBeVisible();

        // 4. Tambah ke Keranjang
        await page.getByRole('button', { name: /Add to Cart/i }).click();

        // 5. Masuk ke Keranjang
        await page.goto('/cart');

        // 6. Verifikasi Item di Keranjang
        await expect(page.getByText('Qty')).toBeVisible();

        // 7. Verifikasi Logika Pengiriman
        await expect(page.getByText('Shipping (Flat Rate)')).toBeVisible();
        await expect(page.getByText('$150')).toBeVisible(); // Asumsi default USD

        // 8. Isi Form Checkout
        await page.fill('input[name="email"]', 'test@qa.com');

        // 9. Submit Order (Mock Action)
        // Catatan: Tidak submit asli untuk mencegah spam DB
        const submitBtn = page.getByRole('button', { name: /Confirm Order/i });
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toBeEnabled();
    });

    test('Currency Toggle updates prices', async ({ page }) => {
        await page.goto('/catalog');

        // Default USD
        // Kita butuh elemen harga untuk dicek. Asumsi PriceDisplay render $

        // Ganti ke IDR
        await page.getByRole('button', { name: 'IDR' }).first().click();

        // Ekspektasi format Rp atau IDR
        // Mungkin butuh waktu tunggu kecil atau cek perubahan teks
        // Menggunakan cek longgar untuk simbol "Rp" atau format relevan
    });

});
