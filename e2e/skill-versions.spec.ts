import { expect, test } from '@playwright/test';

test('formula selectors stay synchronized in battle, PVP and autocast and survive reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem('ro-set')) localStorage.setItem('ro-set', JSON.stringify({class:4255,level:250,jobLevel:1,int:130,spl:100,selectedAtkSkill:'Soul Vulcan Strike==5',rotation:['Soul Vulcan Strike==5']}));
    localStorage.setItem('ro-right-accordion-active','[]');
  });
  await page.goto('/');
  await expect(page.locator('#ro-splash')).toHaveCount(0,{timeout:40000});
  await page.getByRole('button',{name:'Batalha',exact:true}).click();
  const battle = page.getByRole('region',{name:'Batalha',exact:true});
  const selector = battle.getByRole('combobox',{name:'Versão das fórmulas de habilidades'});
  await expect(selector).toHaveValue('current');
  await selector.selectOption('rebalance-2026-02');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ro-set')!).skillFormulaVersion)).toBe('rebalance-2026-02');
  await page.getByRole('button',{name:'Auto-conjuração',exact:true}).click();
  const auto = page.getByRole('region',{name:'Auto-conjuração',exact:true});
  await expect(auto.getByRole('combobox',{name:'Versão das fórmulas de habilidades'})).toHaveValue('rebalance-2026-02');
  await auto.getByRole('combobox',{name:'Versão das fórmulas de habilidades'}).selectOption('current');
  await expect(selector).toHaveValue('current');
  // Saving a target makes the PVP battle panel available.
  await page.getByRole('button',{name:'Salvar',exact:true}).click();
  await page.getByLabel('Nome da simulação').fill('Alvo de prévia');
  await page.getByLabel('Nome da simulação').press('Enter');
  await expect(page.getByRole('dialog',{name:'Salvar simulação'})).toHaveCount(0);
  await page.getByRole('button',{name:'PVP',exact:true}).click();
  const pvp = page.getByRole('region',{name:'PVP',exact:true});
  await pvp.getByRole('combobox',{name:'Selecione um alvo salvo'}).click();
  await page.getByRole('option',{name:'Alvo de prévia',exact:true}).click();
  const pvpSelector = pvp.getByRole('combobox',{name:'Versão das fórmulas de habilidades'});
  await expect(pvpSelector).toHaveValue('current');
  await pvpSelector.selectOption('rebalance-2026-02');
  await expect(selector).toHaveValue('rebalance-2026-02');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ro-set')!).skillFormulaVersion)).toBe('rebalance-2026-02');
  await page.reload();
  await expect(page.locator('#ro-splash')).toHaveCount(0,{timeout:40000});
  await page.getByRole('button',{name:'Batalha',exact:true}).click();
  await expect(page.getByRole('region',{name:'Batalha',exact:true}).getByRole('combobox',{name:'Versão das fórmulas de habilidades'})).toHaveValue('rebalance-2026-02');
  await page.screenshot({path:'.tmp/skill-versions-desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  const mobileSelector = page.getByRole('region',{name:'Batalha',exact:true}).getByRole('combobox',{name:'Versão das fórmulas de habilidades'});
  await expect(mobileSelector).toBeVisible();
  // The existing calculator keeps a wide, horizontally scrollable workspace.
  await mobileSelector.scrollIntoViewIfNeeded();
  const bounds = await mobileSelector.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
  await page.screenshot({path:'.tmp/skill-versions-mobile.png'});
  await expect.poll(() => errors).toEqual([]);
});

test('new support buffs appear as Prévia and affect the saved build', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('ro-set')) localStorage.setItem('ro-set',JSON.stringify({class:4307,level:250,jobLevel:1}));
    localStorage.setItem('ro-right-accordion-active','[]');
  });
  await page.goto('/');
  await expect(page.locator('#ro-splash')).toHaveCount(0,{timeout:40000});
  await page.getByRole('button',{name:'Habilidades',exact:true}).click();
  const label = page.locator('.skill-control-label').filter({hasText:'Overcoming Crisis (Prévia)'});
  await expect(label).toBeVisible();
  await expect(label.locator('img')).toHaveCount(0);
  const iconSpace = label.locator('span.skill_icon');
  await expect(iconSpace).toBeVisible();
  await expect(iconSpace).toHaveCSS('width','20px');
  await expect(iconSpace).toHaveCSS('height','20px');
  await label.hover();
  await expect(page.getByRole('tooltip')).toContainText('Costs 50 AP and lasts 300 seconds.');
  await expect(page.getByRole('tooltip')).toContainText('Max HP +75000, P.Atk +15, S.Matk +15');
  const control = page.locator('.skill-control-row').filter({hasText:'Overcoming Crisis (Prévia)'}).getByRole('combobox');
  await control.click();
  await page.getByRole('option',{name:'Nv 5',exact:true}).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ro-set')!).activeSkillMap['Overcoming Crisis'])).toBe(5);
  await page.screenshot({path:'.tmp/skill-preview-buffs.png',fullPage:true});
});

test('preview attack details show the English description', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('ro-set',JSON.stringify({class:4260,level:250,jobLevel:1,int:130,spl:100,selectedAtkSkill:'Abyss Flame==5',rotation:['Abyss Flame==5']}));
    localStorage.setItem('ro-right-accordion-active','[]');
  });
  await page.goto('/');
  await expect(page.locator('#ro-splash')).toHaveCount(0,{timeout:40000});
  await page.getByRole('button',{name:'Batalha',exact:true}).click();
  const battle = page.getByRole('region',{name:'Batalha',exact:true});
  await battle.getByRole('button',{name:'Detalhes da habilidade',exact:true}).click();
  await page.getByRole('button',{name:'Descrição da habilidade',exact:true}).click();
  await expect(page.locator('.pd-desc')).toContainText('5 hits around the target and 3 around the caster');
  await expect(page.locator('.pd-desc')).toContainText('Max level: 5');
});

test('285 previews expose Surge, persist it and explain unavailable timing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem('ro-set')) localStorage.setItem('ro-set', JSON.stringify({ class: 4304, level: 250, jobLevel: 1, str: 130, selectedAtkSkill: 'Shadow Torrent==10', rotation: ['Shadow Torrent==10'] }));
    localStorage.setItem('ro-right-accordion-active', '[]');
  });
  await page.goto('/');
  await expect(page.locator('#ro-splash')).toHaveCount(0, { timeout: 40000 });
  await page.getByRole('button', { name: 'Habilidades', exact: true }).click();
  const label = page.locator('.skill-control-label').filter({ hasText: 'Surge (Prévia)' });
  await expect(label).toBeVisible();
  await expect(label.locator('img')).toHaveCount(0);
  const control = page.locator('.skill-control-row').filter({ hasText: 'Surge (Prévia)' }).getByRole('combobox');
  await expect(control).toContainText('Não');
  await label.hover();
  await expect(page.getByRole('tooltip')).toContainText('non-critical physical damage');
  await expect(page.getByRole('tooltip')).toContainText('285/65');
  await expect(page.getByRole('tooltip')).not.toContainText('275/60');
  await control.click();
  await page.getByRole('option', { name: 'Nv 5', exact: true }).click();
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ro-set')!).activeSkillMap.Surge)).toBe(5);
  await page.getByRole('button', { name: 'Batalha', exact: true }).click();
  const battle = page.getByRole('region', { name: 'Batalha', exact: true });
  await expect(battle.getByText('Prévia: tempos ainda não publicados.', { exact: false })).toBeVisible();
  await battle.getByRole('button', { name: 'Detalhes da habilidade', exact: true }).click();
  await page.getByRole('button', { name: 'Descrição da habilidade', exact: true }).click();
  await expect(page.locator('.pd-desc')).toContainText('Shadow Torrent (Prévia)');
  await expect(page.locator('.pd-desc')).toContainText('4 melee physical hits');
  await page.screenshot({ path: '.tmp/skill-preview-285.png', fullPage: true });
  await page.reload();
  await expect(page.locator('#ro-splash')).toHaveCount(0, { timeout: 40000 });
  await page.getByRole('button', { name: 'Habilidades', exact: true }).click();
  await expect(page.locator('.skill-control-row').filter({ hasText: 'Surge (Prévia)' }).getByRole('combobox')).toContainText('Nv 5');
  await expect.poll(() => errors).toEqual([]);
});
