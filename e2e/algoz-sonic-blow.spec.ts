import { expect, test } from '@playwright/test';

test('Algoz limits, Sonic Blow controls, class switch and shared build', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('https://short.latam-tools.com.br/**', route => route.abort());
  await page.addInitScript(() => {
    if (!localStorage.getItem('ro-set')) localStorage.setItem('ro-set', JSON.stringify({
      class: 4013, level: 200, jobLevel: 70, str: 130, agi: 80, dex: 50, weapon: 1250,
      selectedAtkSkill: 'Sonic Blow==10', rotation: ['Sonic Blow==10'],
    }));
    localStorage.setItem('ro-right-accordion-active', '[]');
  });
  await page.goto('/');
  await expect(page.locator('#ro-splash')).toHaveCount(0, { timeout: 40000 });
  const character = page.locator('#character');
  await expect(character).toContainText('Algoz');
  await expect(page.locator('#level')).toContainText('99');
  await expect(page.getByRole('combobox', { name: 'FOR', exact: true })).toContainText('99');
  await page.locator('#jobLevel').click();
  await page.getByRole('searchbox', { name: 'Filtrar opções' }).fill('68');
  await page.getByRole('option', { name: '68', exact: true }).click();
  await expect(page.locator('#jobLevel')).toContainText('68');

  await page.getByRole('button', { name: 'Habilidades', exact: true }).click();
  for (const name of ['Lâminas Aceleradas', 'Espírito do Mercenário']) {
    const row = page.locator('.skill-control-row').filter({ hasText: name });
    await row.getByRole('button', { name: 'Sim', exact: true }).click();
    await expect(row.getByRole('button', { name: 'Sim', exact: true })).toHaveAttribute('aria-pressed', 'true');
  }
  await page.getByRole('button', { name: 'Batalha', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Batalha', exact: true })).toContainText('Lâminas Destruidoras');
  await page.screenshot({ path: '.tmp/algoz-sonic-blow-desktop.png', fullPage: true });

  await character.click();
  await page.getByRole('searchbox', { name: 'Filtrar opções' }).fill('Sicário');
  await page.getByRole('option', { name: 'Sicário', exact: true }).click();
  await page.getByRole('button', { name: 'Manter a build', exact: true }).click();
  await expect(character).toContainText('Sicário');
  await character.click();
  await page.getByRole('searchbox', { name: 'Filtrar opções' }).fill('Algoz');
  await page.getByRole('option', { name: 'Algoz', exact: true }).click();
  await page.getByRole('button', { name: 'Manter a build', exact: true }).click();
  await expect(character).toContainText('Algoz');

  await page.getByRole('button', { name: 'Link', exact: true }).click();
  const shared = page.getByRole('dialog', { name: 'Compartilhar simulação' }).getByRole('textbox');
  await expect(shared).toHaveValue(/\/s\//);
  const url = new URL(await shared.inputValue());
  // Match production's SPA rewrite: the simple dev server treats dots in the
  // compressed /s/ token as a file extension and otherwise responds with 404.
  const shell = await page.request.get('/');
  await page.route('**/s/**', route => route.fulfill({ response: shell }));
  await page.evaluate(() => localStorage.removeItem('ro-set'));
  await page.goto(url.pathname + url.search + url.hash);
  await expect(page.locator('#ro-splash')).toHaveCount(0, { timeout: 40000 });
  await expect(character).toContainText('Algoz');
  await expect(page.locator('#level')).toContainText('99');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ro-set')!).activeSkillMap['Assassin Spirit'])).toBe(1);
  expect(errors).toEqual([]);
});
