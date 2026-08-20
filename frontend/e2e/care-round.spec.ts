import { expect, test, type Page } from '@playwright/test';

test('UC-030 through UC-032 care round stays on the plant after logging and completes through a concise flow', async ({ page }) => {
  const state = { active: null as Round | null, events: [] as Array<Record<string, unknown>> };
  await mockApi(page, state);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await page.getByRole('link', { name: 'Start care round' }).click();
  await expect(page.getByRole('heading', { name: 'Start a care round' })).toBeVisible();
  await page.getByRole('button', { name: 'Start round' }).click();
  await expect(page.getByRole('heading', { name: 'Window Hoya' })).toBeVisible();

  await page.getByLabel('Fertilizer included').check();
  await page.getByRole('button', { name: 'Record care' }).click();
  await expect(page.getByRole('status')).toContainText('This plant remains current');
  await expect(page.getByRole('heading', { name: 'Window Hoya' })).toBeVisible();
  expect(state.events).toHaveLength(1);

  await page.getByRole('button', { name: 'Complete round' }).click();
  await expect(page.getByRole('dialog')).toContainText('Remaining plants will receive no invented events');
  await page.getByRole('dialog').getByRole('button', { name: 'Complete round' }).click();
  await expect(page.getByRole('heading', { name: 'Care summary' })).toBeVisible();
  await expect(page.getByText('Window Hoya')).toBeVisible();
  await page.getByRole('link', { name: 'Continue to Home' }).click();
  await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible();
  await page.context().close();
});

interface Member { position: number; plantId: number; nickname: string; speciesName: string; available: boolean }
interface Round { id: number; status: 'active' | 'completed'; locationId: number; locationName: string; currentIndex: number; members: Member[]; summary: Member[] }
async function mockApi(page: Page, state: { active: Round | null; events: Array<Record<string, unknown>> }) {
  const species = [{ id: 1, name: 'Hoya carnosa', archived: false }]; const locations = [{ id: 1, name: 'Living room' }]; const plants = [{ id: 1, nickname: 'Window Hoya', acquisitionDate: '2024-04-05', notes: null, status: 'active', species: species[0], location: locations[0], latestCareTimestamp: null }];
  await page.route('**/api/care-rounds/options', (route) => route.fulfill({ json: [{ locationId: 1, name: 'Living room', plantCount: 1 }] }));
  await page.route('**/api/care-rounds/active', (route) => route.fulfill({ json: state.active }));
  await page.route('**/api/care-rounds', async (route) => { state.active = { id: 1, status: 'active', locationId: 1, locationName: 'Living room', currentIndex: 0, members: [{ position: 0, plantId: 1, nickname: 'Window Hoya', speciesName: 'Hoya carnosa', available: true }], summary: [] }; await route.fulfill({ status: 201, json: state.active }); });
  await page.route('**/api/care-rounds/1/plants/1/care-events', async (route) => { state.events.push(await route.request().postDataJSON() as Record<string, unknown>); if (state.active) state.active.summary = [state.active.members[0]]; await route.fulfill({ status: 201, json: { id: 1 } }); });
  await page.route('**/api/care-rounds/1/complete', async (route) => { const completed = { ...state.active!, status: 'completed' as const }; state.active = null; await route.fulfill({ json: completed }); });
  await page.route('**/api/plants', (route) => route.fulfill({ json: plants })); await page.route('**/api/species', (route) => route.fulfill({ json: species })); await page.route('**/api/locations', (route) => route.fulfill({ json: locations }));
}
