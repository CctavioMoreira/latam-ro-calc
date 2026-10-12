import { PREVIEW_275_REFERENCE } from './preview-275-reference';

/** English effect summaries for both announcements in PREVIEW_275_SOURCE.
 * Kept outside the deferred LATAM prose so previews work before it loads. */
const descriptions: Record<typeof PREVIEW_275_REFERENCE[number]['name'], string> = {
  'Imperial Cross': 'Requires Attack Stance. Strikes one enemy with 3 melee physical hits. Grand Judgement increases damage. Scales with Spear & Sword Mastery, base level and POW.',
  'Radiant Spear': 'Requires a one-handed spear and Attack Stance. Deals ranged physical damage in an area. Grand Judgement increases damage. Scales with Spear & Sword Mastery, base level and POW. Uses your critical chance, with half the critical damage modifier.',
  'Rush Strike': 'Requires a two-handed axe, without Madogear. Charges into an enemy and deals melee physical damage in an area. Scales with base level and POW.',
  'Powerful Swing': 'Requires a two-handed axe, without Madogear. Delivers 5 melee physical hits in an area. Axe Stomp increases damage. Scales with base level and POW.',
  'Energy Cannonade': 'Requires Madogear. Fires 7 ranged physical hits in an area, bypassing physical defense. Scales with base level and POW.',
  'Mystery Powder': 'Deals melee physical damage in an area and grants a 60-second buff that enables Dust Explosion. Scales with base level and POW. Enable the Mystery Powder preview control to simulate that buff.',
  'Dust Explosion': 'Requires the Mystery Powder buff. Deals 5 melee physical hits in an area. Research Report increases damage. Scales with base level and POW.',
  'Cross Slash': 'Deals 3 melee physical hits in an area and grants successful blocking for 10 seconds. Shadow Exceed increases damage. Scales with base level and POW. Uses half your critical chance and half the critical damage modifier.',
  'Hit and Sliding': 'Attacks an enemy and retreats by 1 to 5 cells. Deals melee physical damage, or ranged physical damage with a bow. Grants Chasing for 60 seconds. Scales with base level and POW. Enable the Chasing preview control to simulate its bonuses.',
  'Chasing Break': 'Charges into an enemy and delivers 5 melee physical hits in an area. Chasing increases damage and the hit count to 7. Scales with base level and POW.',
  'Chasing Shot': 'Requires a bow. Charges into an enemy and delivers 2 ranged physical hits in an area. Chasing increases damage and the hit count to 3. Scales with base level and CON. Uses half your critical chance and half the critical damage modifier.',
  'Rhythmical Wave': 'Requires an instrument or whip. Deals area magic damage using the equipped arrow element and consumes 1 arrow. Mystic Symphony increases damage. Scales with Stage Manner, base level and SPL.',
  'Four Colors Charm': 'Requires 10 summoned spirits of one element and costs 20 AP. Grants a 300-second charm: Fire adds 8500% to Red Flame Cannon; Water adds 7000% to Cold Blooded Cannon; Wind adds 8500% to Thundering Cannon; Earth adds 5500% to Golden Dragon Cannon. Different elemental charms can coexist. Enable each charm separately in the simulator.',
  'Wild Shot': 'Requires a rifle or revolver and consumes 5 bullets. Deals 7 ranged physical hits in an area. Hidden Card increases damage according to the weapon. Scales with base level and CON. Uses your critical chance, with half the critical damage modifier.',
  'Midnight Fallen': 'Requires a shotgun, gatling gun or grenade launcher and consumes 5 bullets. Deals 3 ranged physical hits in a targeted area, bypassing physical defense. Hidden Card increases damage according to the weapon. Scales with base level and CON.',
  'Dragonic Pierce': 'Requires a two-handed spear. Delivers 5 ranged physical hits to one enemy. Dragonic Aura increases damage. Scales with base level and POW. Uses your critical chance, with half the critical damage modifier.',
  'Imperial Pressure': 'Deals Neutral magic damage in an area, changing to Holy while Guard Stance is active. Scales with Spear & Sword Mastery, base level and SPL.',
  'Abyss Flame': 'Deals Fire magic damage in two areas simultaneously: 5 hits around the target and 3 around the caster. Scales with Magic Sword Mastery, base level and SPL. The simulator exposes the two areas as separate rotation entries.',
  'Energy Conversion': 'Exchanges AP for SP. Levels 1 to 5 cost 22/19/16/13/10 AP and restore 40/120/240/400/600 SP respectively. Resource changes during a rotation are not simulated.',
  'Psychic Stream': 'Costs 5 AP. Dashes into an enemy and deals Neutral magic damage in an area. Cannot be used while Energy Coat is active. Scales with base level and SPL.',
  'Divinus Flos': 'Deals Holy magic damage within a 7 × 7 area around the target, changing to Neutral under Ancilla. Scales with Fidus Animus, base level and SPL.',
  'Blazing Flame Blast': 'Requires the Fury state. Deals ranged physical damage to one enemy. Massive Flame Blaster increases damage. Scales with base level and POW. Uses your critical chance, with half the critical damage modifier.',
  'Wild Walk': 'Costs 5 AP. The hawk deals 3 ranged physical hits and grants Flee and movement speed for 6/9/12/15/18 seconds. Flee increases by 100/150/200/250/300. Usable while riding a Warg. Scales with Steel Crow, Nature Friendly, base level and CON. Uses your critical chance, with half the critical damage modifier. Enable the Wild Walk preview control to apply Flee; movement is not simulated.',
  'Sky Sun': 'Requires Celestial Unity. Deals melee physical damage around the caster. Scales with Sky Mastery, base level and POW. Uses your critical chance, with half the critical damage modifier.',
  'Sky Moon': 'Requires Celestial Unity. Delivers 3 melee physical hits in an area around the target. Scales with Sky Mastery, base level and POW.',
  'Star Light Kick': 'Requires Celestial Unity. Dashes into an enemy and delivers 7 melee physical hits in an area. Scales with Sky Mastery, base level and POW.',
  'Overcoming Crisis': 'Costs 50 AP and lasts 300 seconds. Fully heals HP on activation and grants +15000 Max HP, +3 P.Atk and +3 S.Matk per skill level. The simulator applies the stat bonuses; the activation heal is not simulated.',
  'Chulho Battering': 'Delivers 5 ranged physical hits in an area. Scales with Mystical Creature Mastery, base level and POW. Uses your critical chance, with half the critical damage modifier.',
  'Hyunrok Spirit Power': 'Delivers 7 magic hits in an area. The default element is Neutral; Colors of Hyunrok can change it. Scales with Mystical Creature Mastery, base level and SPL.',
};

export const PREVIEW_275_DESCRIPTIONS: Record<number, string> = Object.fromEntries(
  PREVIEW_275_REFERENCE.map(skill => [skill.id, `${skill.name} (Prévia)\nMax level: ${skill.maxLevel}\n${descriptions[skill.name]}\nPreview kRO 275/60. Unannounced coefficients and timings are provisional and may change.`]),
);
