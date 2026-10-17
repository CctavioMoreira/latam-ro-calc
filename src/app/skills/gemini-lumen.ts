import { ElementType } from '../constants/element-type.const';
import type { AtkSkillModel } from '../jobs/_character-base.abstract';

// Client ATQ/ATQM table; independent rolls and weapon property for the physical light:
// https://browiki.org/wiki/Gemini_Lumen
// Keep the parent skill name/id so equipment bonuses under 2054 affect both lights.
export const geminiLight = (magical: boolean): AtkSkillModel => ({
  name: 'Duple Light',
  label: magical ? 'Gemini Lumen (luz mágica)' : 'Gemini Lumen (luz física)',
  value: 'Duple Light==10', acd: 0, fct: 0, vct: 0, cd: 0,
  isMatk: magical, isMelee: false, totalHit: 1,
  ...(magical ? { element: ElementType.Neutral } : {}),
  formula: ({ skillLevel }) => magical ? 400 + 40 * skillLevel : 150 + 15 * skillLevel,
});
