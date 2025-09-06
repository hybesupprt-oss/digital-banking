from playwright.sync_api import sync_playwright

def run(playwright):
    iphone_11 = playwright.devices['iPhone 11']
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        **iphone_11,
    )
    page = context.new_page()

    # Navigate to the home page and take a screenshot
    page.goto("http://localhost:3000")
    page.screenshot(path="jules-scratch/verification/mobile-01-home-page.png")

    # Navigate to the accounts page and take a screenshot
    page.goto("http://localhost:3000/accounts")
    page.wait_for_timeout(2000) # wait for animations
    page.screenshot(path="jules-scratch/verification/mobile-02-accounts-page.png")

    # Navigate to the transfer page and take a screenshot
    page.goto("http://localhost:3000/transfer")
    page.wait_for_timeout(2000) # wait for animations
    page.screenshot(path="jules-scratch/verification/mobile-03-transfer-page.png")

    # Navigate to the bill-pay page and take a screenshot
    page.goto("http://localhost:3000/bill-pay")
    page.wait_for_timeout(2000) # wait for animations
    page.screenshot(path="jules-scratch/verification/mobile-04-bill-pay-page.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
