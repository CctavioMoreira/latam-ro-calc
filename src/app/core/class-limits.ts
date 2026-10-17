import type { CharacterBase } from '../jobs/_character-base.abstract';
import type { MainModel } from '../models/main.model';
import { MAIN_STAT_KEYS, TRAIT_KEYS } from '../constants/trait-keys';

/** Shared by the browser restore/class-switch path and MCP build resolution. */
export function normalizeClassLimits(model: MainModel, character: CharacterBase): void {
  const { minMaxLevel: [min, max], maxJob } = character.minMaxLevelCap;
  if (!Number.isFinite(model.level) || model.level < min || model.level > max) {
    model.level = Math.min(max, Math.max(min, 200));
  }
  if (!Number.isFinite(model.jobLevel) || model.jobLevel < 1 || model.jobLevel > maxJob) model.jobLevel = 1;
  // Preserve the existing replay/share allowance for third/fourth jobs; Algoz's
  // six allocated stats have a real 99 ceiling, distinct from equipment/job bonuses.
  if (character.maxBaseStat < 130) {
    for (const key of MAIN_STAT_KEYS) model[key] = Math.max(1, Math.min(character.maxBaseStat, model[key] || 1));
    for (const key of TRAIT_KEYS) model[key] = 0;
  }
}
