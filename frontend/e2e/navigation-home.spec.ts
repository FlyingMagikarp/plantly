import { expect, test, type Page } from '@playwright/test';

const species = [{ id: 1, name: 'Hoya carnosa', archived: false }];
const locations = [{ id: 1, name: 'Living room' }];
const plants = [
  { id: 1, nickname: 'Window Hoya', acquisitionDate: '2024-04-05', notes: null, status: 'active', species: species[0], location: locations[0] },
  { id: 2, nickname: 'Unassigned Fern', acquisitionDate: '2024-04-05', notes: null, status: 'active', species: { ...species[0], name: 'Silver Fern' }, location: null },
];

test.beforeEach(async ({ page }) => mockApi(page));

test.describe('UC-033 and UC-034 responsive application experience', () => {
  test('desktop keeps the shared sidebar visible and Home cards grouped with complete information', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const sidebar = page.locator('aside').filter({ has: page.getByRole('navigation', { name: 'Primary navigation' }) }).first();
    await expect(sidebar).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'No location' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Living room' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Window Hoya/ })).toContainText('Hoya carnosa');
    await expect(page.getByRole('link', { name: /Unassigned Fern/ })).toContainText('Silver Fern');

    await page.getByRole('link', { name: 'Species' }).click();
    await expect(sidebar).toBeVisible();
    await expect(page.getByRole('link', { name: 'Species' })).toHaveAttribute('aria-current', 'page');
  });

  test('mobile uses the compact header and overlays the same navigation without losing Home content', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await expect(page.locator('aside').filter({ has: page.getByText('Care first, logging second.') })).toBeHidden();
    await expect(page.getByRole('link', { name: /Window Hoya/ })).toBeVisible();
    await page.getByRole('button', { name: 'Menu' }).click();
    const drawer = page.getByRole('complementary', { name: 'Mobile navigation' });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole('link')).toHaveCount(5);
    for (const destination of ['Home', 'My Plants', 'Species', 'Locations']) await expect(drawer.getByRole('link', { name: destination })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(page.getByRole('link', { name: /Window Hoya/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
  });

  test('the retired plants-by-location route is not served', async ({ page }) => {
    await page.goto('/plants/by-location');
    await expect(page.getByRole('heading', { name: 'Plant detail could not be loaded' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Plants by location' })).toHaveCount(0);
  });
});

async function mockApi(page: Page) {
  await page.route('**/api/plants', (route) => route.fulfill({ json: plants }));
  await page.route('**/api/species', (route) => route.fulfill({ json: species }));
  await page.route('**/api/locations', (route) => route.fulfill({ json: locations }));
}
