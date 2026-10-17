import { expect, test } from '@playwright/test';

for (const level of [0, 5]) {
  test(`Invocação do Abismo level ${level} is shown independently of Fenda`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(activeLevel => {
      localStorage.setItem('monster', '21067');
      localStorage.setItem('ro-right-accordion-active', '[]');
      localStorage.setItem('ro-set', JSON.stringify({
        class: 4260, level: 240, jobLevel: 1, int: 120, dex: 100, spl: 60, weapon: 1602,
        activeSkillMap: { 'From the Abyss': activeLevel }, passiveSkillMap: { 'Abyss Square': 0 },
      }));
    }, level);
    await page.goto('/');
    await expect(page.locator('#ro-splash')).toHaveCount(0, { timeout: 40000 });
    await page.getByRole('button', { name: 'Auto-conjuração', exact: true }).click();
    const section = page.getByRole('region', { name: 'Auto-conjuração', exact: true });
    const orb = section.locator('.auto-source-row').filter({ has: page.locator('.rot-name', { hasText: /^Invocação do Abismo$/ }) });
    await expect(orb).toBeVisible();
    if (level === 0) {
      await expect(orb).toContainText('Ative Invocação do Abismo');
      await expect(orb).toHaveClass(/auto-source-row--blocked/);
    } else {
      await expect(orb).not.toHaveClass(/auto-source-row--blocked/);
      await expect(orb).toContainText('15,0%');
      await expect(orb.locator('.auto-damage-branch')).not.toHaveText('0');
      await expect(orb.locator('.rot-level')).toHaveText('Nv. 5');
    }
    await expect(section.locator('.auto-source-row--blocked').filter({ hasText: 'Fenda do Abismo' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
