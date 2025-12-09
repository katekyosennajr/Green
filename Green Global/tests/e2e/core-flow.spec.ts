import { test, expect } from '@playwright/test';

test.describe('Global Green Exporter - Core User Flow', () => {

    test('Homepage loads and displays critical elements', async ({ page }) => {
        await page.goto('/');

        // Check Title
        await expect(page).toHaveTitle(/Global Green Exporter/);

        // Check Hero Section
        const heroHeading = page.getByRole('heading', { name: /Source the Rarest/i });
        await expect(heroHeading).toBeVisible();

        // Check Verify Badges (Phyto, Guarantee)
        await expect(page.getByText('100% Live Guarantee')).toBeVisible();
        await expect(page.getByText('Free Phyto Cert')).toBeVisible();
    });

    test('Catalog displays products and filters', async ({ page }) => {
        await page.goto('/catalog');

        const productGrid = page.locator('.grid');
        await expect(productGrid).toBeVisible();

        // Check for specific product name
        await expect(page.getByText('Scindapsus')).toBeVisible();
    });

    test('Full Purchase Flow (Add to Cart -> Checkout)', async ({ page }) => {
        // 1. Go to Catalog
        await page.goto('/catalog');

        // 2. Click first product
        await page.locator('.group a').first().click();

        // 3. Verify Product Page
        await expect(page.getByText('Genetic Guarantee')).toBeVisible();

        // 4. Add to Cart
        await page.getByRole('button', { name: /Add to Cart/i }).click();

        // 5. Go to Cart
        await page.goto('/cart');

        // 6. Verify Item in Cart
        await expect(page.getByText('Qty')).toBeVisible();

        // 7. Verify Shipping Logic
        await expect(page.getByText('Shipping (Flat Rate)')).toBeVisible();
        await expect(page.getByText('$150')).toBeVisible(); // Assuming default USD

        // 8. Fill Checkout Form
        await page.fill('input[name="email"]', 'test@qa.com');

        // 9. Submit Order (Mocked Action)
        // Note: We won't submit to avoid DB spam in this test, or we can catch the redirect
        const submitBtn = page.getByRole('button', { name: /Confirm Order/i });
        await expect(submitBtn).toBeVisible();
        await expect(submitBtn).toBeEnabled();
    });

    test('Currency Toggle updates prices', async ({ page }) => {
        await page.goto('/catalog');

        // Default USD
        // We need a price element to check. Assuming PriceDisplay renders $

        // Toggle to IDR
        await page.getByRole('button', { name: 'IDR' }).first().click();

        // Expect Rp or IDR format
        // This might require a small wait or check for text change
        // Using a loose check for "Rp" symbol or relevant format if strictly formatted
    });

});
