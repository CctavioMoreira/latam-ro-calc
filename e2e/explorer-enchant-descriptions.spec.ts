import { expect, test } from '@playwright/test';

for (const active of [false, true]) {
  test(`Q-Abismo shows its refine-adjusted bonuses ${active ? 'on a matching target' : 'with an inactive explanation on other targets'}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(target => {
      localStorage.setItem('ro-right-accordion-active', '[]');
      localStorage.setItem('monster', String(target));
      localStorage.setItem('ro-set', JSON.stringify({ class: 4256, level: 200, jobLevel: 1,
        garment: 480956, garmentRefine: 10, garmentEnchant1: 315760 }));
    }, active ? 20612 : 1038);
    await page.goto('/');
    await expect(page.locator('#ro-splash')).toHaveCount(0, { timeout: 40000 });
    await page.getByRole('button', { name: 'Descrições dos Itens', exact: true }).click();
    const panel = page.getByRole('region', { name: 'Descrições dos Itens', exact: true });
    await panel.getByRole('option', { name: 'Q-Abismo', exact: true }).click();
    const bonuses = panel.locator('.item-description-bonuses');
    const rows = bonuses.locator('li').filter({ hasText: 'monstros específicos' });
    await expect(rows).toHaveCount(3);
    for (const row of await rows.all()) {
      await expect(row.locator('.item_bonus_value')).toHaveText('+25%');
      if (active) await expect(row.locator('small')).toHaveCount(0);
      else {
        await expect(row.locator('small')).toHaveText('Inativo para o alvo selecionado. Aplica-se aos monstros listados na descrição.');
        const clipped = await row.locator('small').evaluate(note => {
          const parent = note.parentElement!.parentElement!;
          return note.getBoundingClientRect().bottom > parent.getBoundingClientRect().bottom + 1;
        });
        expect(clipped).toBe(false);
      }
    }
    await expect(bonuses.locator('li').filter({ hasText: 'Sombrio' }).locator('.item_bonus_value')).toHaveText('+30%');
    await expect(bonuses.locator('li').filter({ hasText: 'Maldito' }).locator('.item_bonus_value')).toHaveText('+30%');
    expect(errors).toEqual([]);
  });
}
