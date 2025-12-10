import { test, expect } from '@playwright/test';

test('Simulate Checkout Flow (Dummy Payment)', async ({ page }) => {
    // 1. Go to Catalog
    await page.goto('http://localhost:3000/catalog');

    // 2. Add first product
    await page.locator('.group').first().click(); // Click first product card
    await page.waitForTimeout(1000);
    await page.click('button:has-text("Add to Cart")');

    // 3. Go to Cart
    await page.goto('http://localhost:3000/cart');

    // 4. Fill Details
    await page.fill('input[name="name"]', 'Simulation User');
    await page.fill('input[name="email"]', 'sim-user@example.com');
    await page.fill('textarea[name="address"]', '123 Tropical Lane, Jakarta, Indonesia');

    // 5. Submit
    console.log('Clicking Confirm Order...');
    await page.click('button:has-text("Confirm Order")');

    // 6. Verify Success (Wait for success message)
    // Since we don't have keys, it should go straight to success
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 10000 });

    // 7. Take Screenshot
    await page.screenshot({ path: 'C:/Users/riant/.gemini/antigravity/brain/461f5251-4cbe-4aaa-a1bf-394b712fdea9/payment_simor_proof.png' });
});
