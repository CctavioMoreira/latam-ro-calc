/** kRO 285/65 client descriptions, inspected 2026-10-12.
 * https://www.divine-pride.net/database/skill/<id> (kROM section).
 * These are not jRO ratios. Cast timings and unpublished trait coefficients are
 * deliberately left unknown rather than copied from an unrelated skill.
 */
export const PREVIEW_285_SOURCE = 'https://docs.google.com/document/d/1WutiU7_5ftOinIMHk5R-CETl4sIX3t-7tsKjNX5ISvs/edit';
export const PREVIEW_285_REFERENCE = [
  { id: 6608, name: 'Servant Weapon-Cleave', maxLevel: 5, description: 'Consumes one servant weapon. Deals 3 melee physical hits, or 4 stronger hits under Vigor. Can critically hit with half the critical damage bonus.' },
  { id: 6609, name: 'Shield Slam', maxLevel: 5, description: 'Requires a shield. Charges into a target and deals area melee physical damage, changing to ranged under Holy Shield. Scales with Shield Mastery.' },
  { id: 6610, name: 'Overdrive Protocol', maxLevel: 4, description: 'Deals 2 ranged physical hits in a 9x9 area, or 4 while ABR-Dual Cannon is summoned. ABR-Infinity enables critical hits with half the critical damage bonus. Scales with ABR Mastery.' },
  { id: 6611, name: 'Rampant Vine', maxLevel: 5, description: 'Consumes one Plant Bottle. Deals 2 ranged physical hits to one target, or 5 while Creeper is summoned. Can critically hit with half the critical damage bonus. Scales with Bionics Mastery.' },
  { id: 6612, name: 'Venom Ignition', maxLevel: 5, description: 'Disables critical hits on basic attacks and skills. Grants +70/90/110/130/150 HIT and +40/55/70/85/100% non-critical physical damage for 60/120/180/240/300 seconds. Costs 90/80/70/60/50 AP.' },
  { id: 6613, name: 'Phantom Dagger', maxLevel: 5, description: 'Requires a dagger or one-handed sword. Deals 3 melee physical hits, with a 15/30/45/60/75% chance of a fourth hit. The simulator uses the expected hit count.' },
  { id: 6614, name: 'Wraith Dash', maxLevel: 3, description: 'Deals Ghost magic damage in a 9x9 area around the caster and moves forward 7 cells. The client does not state base-level or trait scaling.' },
  { id: 6615, name: 'Elemental Integration', maxLevel: 5, description: 'Costs 20 AP. For 240 seconds, basic physical attacks have a 25% chance to trigger 3 magic hits. Levels select Fire/Water/Wind/Earth/Poison. A matching higher elemental adds 700% per hit.' },
  { id: 6616, name: 'Burning Flame', maxLevel: 5, description: 'Elemental Integration Fire proc: 3 magic hits in a 7x7 area. Ardor increases the ratio by 700% per hit.' },
  { id: 6617, name: 'Frozen Hail', maxLevel: 5, description: 'Elemental Integration Water proc: 3 magic hits in a 7x7 area. Diluvium increases the ratio by 700% per hit.' },
  { id: 6618, name: 'Storm Rise', maxLevel: 5, description: 'Elemental Integration Wind proc: 3 magic hits in a 7x7 area. Procella increases the ratio by 700% per hit.' },
  { id: 6619, name: 'Terra Burst', maxLevel: 5, description: 'Elemental Integration Earth proc: 3 magic hits in a 7x7 area. Terremotus increases the ratio by 700% per hit.' },
  { id: 6620, name: 'Venom Bombard', maxLevel: 5, description: 'Elemental Integration Poison proc: 3 magic hits in a 7x7 area. Serpens increases the ratio by 700% per hit.' },
  { id: 6621, name: 'Punitio', maxLevel: 5, description: 'Charges into a target and deals 4 physical hits. Melee with a book, ranged with a mace. Can critically hit with half the critical damage bonus. Scales with Mace & Book Mastery.' },
  { id: 6622, name: 'Lex Expiatrix', maxLevel: 5, description: 'Deals 3 Holy magic hits to one target, changing to Neutral under Ancilla. Competentia increases the ratio. Scales with Fidus Animus.' },
  { id: 6623, name: 'Sky-Shattering Strike', maxLevel: 5, description: 'Requires a faith chapter. First Faith Power: 3 melee hits with criticals and half the critical damage bonus. Judge: 4 hits. Third Exor Flame: 2 hits and 3% HP absorption per level, capped at 50000. Applies the judgement brand for 5 seconds. Healing and automatic brand application are not simulated.' },
  { id: 6624, name: 'Fragment Bolt', maxLevel: 5, description: 'Consumes 3 arrows. Deals 2 ranged physical hits in a 7x7 area. Can critically hit with half the critical damage bonus.' },
  { id: 6625, name: 'Primed Trap', maxLevel: 1, description: 'Consumes 50 Special Alloy Traps. Enables the four Primed Trap attacks for 180 seconds. These attacks cannot be used while riding a Warg.' },
  { id: 6626, name: 'Primed Solid Trap', maxLevel: 5, description: 'Requires Primed Trap, without Warg riding. Deals Earth melee physical damage in an area. Scales with Advanced Trap.' },
  { id: 6627, name: 'Primed Deep Blind Trap', maxLevel: 5, description: 'Requires Primed Trap, without Warg riding. Deals Dark melee physical damage in an area. Scales with Advanced Trap.' },
  { id: 6628, name: 'Primed Swift Trap', maxLevel: 5, description: 'Requires Primed Trap, without Warg riding. Deals Wind melee physical damage in an area. Scales with Advanced Trap.' },
  { id: 6629, name: 'Primed Flame Trap', maxLevel: 5, description: 'Requires Primed Trap, without Warg riding. Deals Fire melee physical damage in an area. Scales with Advanced Trap.' },
  { id: 6630, name: 'Fugue Des Fleches', maxLevel: 5, description: 'Requires an instrument, whip or bow and consumes 8 arrows. Deals 8 ranged physical hits in an area. Mystic Symphony increases the ratio. Stage Manner enables additional CON scaling.' },
  { id: 6631, name: 'Mirage - Cluster', maxLevel: 1, description: 'Costs 30 AP. Summons three mirage clones for 20 seconds. Existing clones are replaced. This control records the summoned state; clone attacks and movement are not simulated.' },
  { id: 6632, name: 'Surge', maxLevel: 5, description: 'Requires three summoned mirage clones and costs 50 AP. Grants +10% non-critical physical damage and critical damage, and +30% melee and ranged physical damage per level. Lasts 60 seconds per level. Also increases Shadow Torrent ratio. This is not a HIT bonus.' },
  { id: 6633, name: 'Shadow Torrent', maxLevel: 10, description: 'Deals 4 melee physical hits in an area. Can critically hit with half the critical damage bonus. Scales with learned Shadow Dance and has a stronger ratio under Surge. No base-level, POW or CON scaling is stated.' },
  { id: 6634, name: 'Tactical Repositioning', maxLevel: 1, description: 'Requires Intensive Aim. Consumes one aiming count to move to a selected cell; fails if the path is obstructed. Movement and aiming-count consumption are not simulated.' },
  { id: 6635, name: 'Seven-Star Heavenly Kick', maxLevel: 5, description: 'Requires Celestial Unity and costs 10 AP. Deals melee physical damage and gains a satellite for 10 seconds. At seven satellites it uses the enhanced ratio. Set the satellite count manually; rotations do not advance it automatically.' },
  { id: 6636, name: 'Seven-Star Heavenly Kick (Enhanced)', maxLevel: 5, description: 'Enhanced damage packet of Seven-Star Heavenly Kick at seven satellites.' },
  { id: 6637, name: 'Yellow Dragon Talisman', maxLevel: 5, description: 'Requires the North blessing or All Four Beasts. Costs 10 AP and one Soul Talisman. Deals 3 Neutral magic hits, or the Mild Wind element. All Four Beasts increases the ratio. Scales with Talisman Mastery.' },
  { id: 6638, name: 'Wind Cutter Turbo', maxLevel: 10, description: 'Deals 5 ranged physical hits in a 7x7 area. Scales with Self Study Tactics. Breaking Limit increases its damage; that unpublished multiplier is not included.' },
  { id: 6639, name: 'High Magnum Break', maxLevel: 10, description: 'Deals melee physical damage in a 9x9 area around the caster. Can critically hit with half the critical damage bonus. Scales with Self Study Tactics. The unpublished Breaking Limit multiplier is not included.' },
  { id: 6640, name: 'Resonance of Gwiseol - Cheolho', maxLevel: 1, description: 'Lasts 180 seconds. Increases Chulho Sonic Claw damage by 50%, Howling of Chulho by 30%, Hogogong Strike by 60% and Chulho Battering by 50%.' },
  { id: 6641, name: 'Spirit Tongue Resonance - Hyeonrok', maxLevel: 1, description: 'Lasts 180 seconds. Increases Hyunrok Breeze damage by 50%, Hyunrok Cannon by 30% and Hyunrok Spirit Power by 60%.' },
  { id: 6642, name: 'Plume Pierce', maxLevel: 5, unavailableClass: 'Alitea', description: 'Requires Raptor form. Deals 4 ranged physical hits in a 9x9 area. Apex Phase enables critical hits with half the critical damage bonus. Requires the Alitea class, which is not yet supported by the calculator.' },
  { id: 6643, name: 'Nature Rage', maxLevel: 5, unavailableClass: 'Alitea', description: 'Deals 5 Neutral magic hits. Ice/Wind/Earth Truth changes its element to Water/Wind/Earth. Does not trigger Glacial Nova, Overcharge or Ground Bloom follow-ups. Requires the Alitea class, which is not yet supported by the calculator.' },
] as const;

export type Preview285Name = typeof PREVIEW_285_REFERENCE[number]['name'];
export const PREVIEW_285_DESCRIPTIONS: Record<number, string> = Object.fromEntries(
  PREVIEW_285_REFERENCE.map(skill => [skill.id, `${skill.name} (Prévia)\nMax level: ${skill.maxLevel}\n${skill.description}\nPreview kRO 285/65. Unpublished trait coefficients are not included. Cast timings are unknown; rotation DPS is unavailable.`]),
);
