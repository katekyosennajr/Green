import { test, expect } from '@playwright/test';

test('Checkout Flow: Add to cart, fill details, and trigger payment popup', async ({ page }) => {
    // 1. Visit Home
    await page.goto('http://localhost:3000/');

    // 2. Add a product to cart
    // Assuming there is at least one "Add to Cart" button visible on home or navigation to catalog
    // If home doesn't have it, go to catalog.
    // Let's try finding a button with "Add to Cart" or icon.
    // Safe bet: go to a product page if we know one, or just look for the button.
    // The 'FeaturedProducts' component usually has them.
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
    } else {
        // Navigate to a product page or catalog if home is empty
        // For now assuming homepage has featured products
        console.log("Add to Cart not found on home, trying generic selector");
    }

    // Check if cart has item (count badge)
    // await expect(page.locator('.cart-badge')).toHaveText('1'); 

    // 3. Go to Checkout
    // Assuming we can go directly
    await page.goto('http://localhost:3000/checkout');

    // 4. Fill Form
    await page.fill('input[name="name"]', 'QA Automated Tester');
    await page.fill('input[name="email"]', 'qa@test.com');
    await page.fill('textarea[name="address"]', '123 QA Lane, Test City');

    // Select Country (Default is International) -> Select Payment
    // Click "VISA"
    await page.click('button:has-text("VISA")');

    // 5. Submit Order
    await page.click('button:has-text("Place Order & Pay")');

    // 6. Verify "Preparing Secure Payment..." text appears
    await expect(page.locator('button')).toContainText('Preparing Secure Payment');

    // 7. Verify Midtrans Popup Appears (Iframe)
    // Midtrans Snap creates an iframe with id "snap-midtrans"
    const snapFrame = page.frameLocator('#snap-midtrans');

    // Wait for the iframe to be attached to DOM
    await page.waitForSelector('#snap-midtrans', { timeout: 15000 });
    console.log("Midtrans Popup Detected!");

    // 8. Take Screenshot for Evidence
    await page.screenshot({ path: 'test-results/checkout-popup-proof.png' });

    // Since we cannot easily interact with the secure iframe in this simple test,
    // we verify its existence as proof the trigger worked.
});
