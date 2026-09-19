import { expect, test } from '@playwright/test';

test('submits the contact form', async ({ page }) => {
  let submittedPayload: unknown;

  // Arrange
  await page.route('**/api/contactEmail', async (route) => {
    submittedPayload = route.request().postDataJSON();

    await route.fulfill({
      contentType: 'application/json',
      status: 200,
      body: JSON.stringify({ sent: true })
    });
  });

  await page.goto('/home#contact-me');

  // Act
  await page.getByLabel('Name:').fill('Franco Diaz');
  await page.getByLabel('Email:').fill('franco@example.com');
  await page.getByLabel('Message:').fill('Hello from Playwright.');
  await page.getByRole('button', { name: 'Submit' }).click();

  // Assert
  await expect(page.getByText('Thanks! Message sent.')).toBeVisible();
  expect(submittedPayload).toEqual({
    name: 'Franco Diaz',
    email: 'franco@example.com',
    message: 'Hello from Playwright.'
  });
});
