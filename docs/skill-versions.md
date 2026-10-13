# Skill formula versions and 275/60 previews

The **Fórmulas** selector in Batalha, PVP and Auto-conjuração controls one build setting. **Atual (LATAM)** is the default, including old saved builds and unknown version values. **Rebalance 4th · fev/2026** selects the February article ratios, hit counts and cast timings. The setting travels with named saves and shared builds. Comparing two builds resolves each build's version independently.

The legacy class definitions remain the source for the current version. The rebalance catalog uses copies and adds attacks absent from the current catalog only in the rebalance version. Preview attacks are available in both versions and are explicitly labelled **Prévia**; all new buff/condition controls start disabled.

## February rebalance coverage

All 18 article groups in Sigma's dropdown are represented (20 classes because two articles cover pairs). Expanded classes call their February article the “3rd version.” The numeric timing reference is in `src/app/skills/rebalance-2026-reference.ts`; formulas and conditional states are in `rebalance-2026.ts`.

| Classes | Article |
| --- | --- |
| Arch Mage | [4th version](https://sigmathefallen.blogspot.com/2026/02/arch-mage-4th-version.html) |
| Dragon Knight | [4th version](https://sigmathefallen.blogspot.com/2026/02/dragon-knight-4th-version.html) |
| Windhawk | [4th version](https://sigmathefallen.blogspot.com/2026/02/windhawk-4th-version.html) |
| Shadow Cross | [4th version](https://sigmathefallen.blogspot.com/2026/02/shadow-cross-4th-version.html) |
| Abyss Chaser | [4th version](https://sigmathefallen.blogspot.com/2026/02/abyss-chaser-4th-version.html) |
| Inquisitor | [4th version](https://sigmathefallen.blogspot.com/2026/02/inquisitor-4th-version.html) |
| Imperial Guard | [4th version](https://sigmathefallen.blogspot.com/2026/02/imperial-guard-4th-version.html) |
| Troubadour, Trouvere | [4th version](https://sigmathefallen.blogspot.com/2026/02/troubadour-trouvere-4th-version.html) |
| Cardinal | [4th version](https://sigmathefallen.blogspot.com/2026/02/cardinal-4th-version.html) |
| Biolo | [4th version](https://sigmathefallen.blogspot.com/2026/02/biolo-4th-version.html) |
| Elemental Master | [4th version](https://sigmathefallen.blogspot.com/2026/02/elemental-master-4th-version.html) |
| Meister | [4th version](https://sigmathefallen.blogspot.com/2026/02/meister-4th-version.html) |
| Night Watch | [3rd version](https://sigmathefallen.blogspot.com/2026/02/night-watch-3rd-version.html) |
| Soul Ascetic | [3rd version](https://sigmathefallen.blogspot.com/2026/02/soul-ascetic-3rd-version.html) |
| Shinkiro, Shiranui | [3rd version](https://sigmathefallen.blogspot.com/2026/02/shinkiro-shiranui-3rd-version.html) |
| Sky Emperor | [3rd version](https://sigmathefallen.blogspot.com/2026/02/sky-emperor-3rd-version.html) |
| Spirit Handler | [3rd version](https://sigmathefallen.blogspot.com/2026/02/spirit-handler-3rd-version.html) |
| Hyper Novice | [3rd version](https://sigmathefallen.blogspot.com/2026/02/hyper-novice-3rd-version.html) |

Displayed hit splits and repeated full-ratio damage packets are distinct. Multipart attacks with unequal repetition (All Bloom, Astral Strike and Mission Bombard) apply defense to each part before repeating its packets. Hyper Novice's initial, sustained and explosion entries remain independently selectable.

Sonic Brand's alternative Reverberation and Metallic Sound ratios are included. Frenzy Shot's probabilistic third hit and Storm Slash's Giant Growth double-damage chance use expected values for the simulator's damage/DPS estimate.

## Preview mapping

Both skill announcements in the [275/60 thread](https://www.divine-pride.net/forum/index.php?/topic/7814-kro-27560-level-expansion-and-new-skills/) are included: 29 unique skills, comprising 26 attacks and 3 support skills. Abyss Flame exposes separate target-centered and user-centered attack entries so their hit counts can be simulated independently.

All 29 preview skills have English effect descriptions in pickers and skill details, independent of the deferred LATAM descriptions. Preview buff controls also use English summaries and preserve an empty icon space.

| Class | Skill IDs and attack names |
| --- | --- |
| Dragon Knight | 6502 Dragonic Pierce |
| Imperial Guard | 6503 Radiant Spear; 6504 Imperial Cross; 6505 Imperial Pressure |
| Meister | 6506 Rush Strike; 6507 Powerful Swing; 6508 Energy Cannonade |
| Biolo | 6509 Mystery Powder; 6510 Dust Explosion |
| Shadow Cross | 6511 Cross Slash |
| Abyss Chaser | 6512 Hit and Sliding; 6513 Chasing Break; 6514 Chasing Shot; 6515 Abyss Flame |
| Elemental Master | 6517 Psychic Stream |
| Cardinal | 6518 Divinus Flos |
| Inquisitor | 6519 Blazing Flame Blast |
| Windhawk | 6520 Wild Walk |
| Troubadour, Trouvere | 6521 Rhythmical Wave |
| Night Watch | 5500 Wild Shot; 5501 Midnight Fallen |
| Sky Emperor | 5502 Sky Sun; 5503 Sky Moon; 5504 Star Light Kick |
| Spirit Handler | 5506 Chulho Battering; 5507 Hyunrok Spirit Power |

The Meister Powerful Swing and Shadow Cross Cross Slash have separate internal names from the older skills with the same English names, preserving item bonus and skill ID identities.

### Support and accompanying buffs

| Class | Preview control | Simulated effect |
| --- | --- | --- |
| Arch Mage | 6516 Energy Conversion | Level-specific SP recovery and AP cost shown in the picker; no persistent stat bonus |
| Hyper Novice | 5505 Overcoming Crisis | Flat MaxHP, P.Atk and S.Matk by level |
| Shinkiro, Shiranui | 5499 Four Colors Charm | Four independent elemental controls; additive ratio for each corresponding cannon |
| Biolo | Mystery Powder | Enables Dust Explosion |
| Abyss Chaser | Chasing | Extra ratios for Unlucky Rush and Chain Reaction Shot's secondary damage; enhanced Chasing Break/Shot ratios and hit counts |
| Windhawk | Wild Walk | Level-specific Flee bonus |
| Shadow Cross | Successful blocking | Records the 10-second state; no extra numerical bonus |
| Inquisitor | Massive Flame Blaster | Enhanced Blazing Flame Blast ratio |
| Cardinal | Ancilla | Neutral Divinus Flos element |
| Elemental Master | Energy Coat | Blocks Psychic Stream while enabled |
| Shinkiro, Shiranui | Hidden Weapon area, Nightmare target mark | Selects conditional rebalance damage |
| Hyper Novice | Target below 50% HP | Selects conditional Mega Sonic Blow damage |

Existing stance, Axe Stomp, Research Report, Shadow Exceed, Mystic Symphony, Dragonic Aura, Hidden Card, celestial and elemental controls are reused. Weapon restrictions are checked by the normal damage pipeline. Buff durations, movement, instantaneous healing, AP expenditure and regeneration are descriptive; the simulator does not advance resource pools or automatically activate buffs after a rotation entry.

### Preview data limits

The announcement supplies base ratios, hit counts, stated passive dependencies, buff effects and restrictions. It mentions scaling with traits and base level without publishing every coefficient or cast delay. Those missing coefficients and timings use the [rAthena renewal skill database](https://github.com/rathena/rathena/blob/master/db/re/skill_db.yml) and [skill implementations](https://github.com/rathena/rathena/tree/master/src/map/skills), inspected on 2026-10-11. They are provisional and have not been validated against LATAM recordings. Later rAthena base-ratio balance changes do not replace the requested announcement ratios.

The calculator's existing supported character levels and job stat tables are unchanged. These previews do not add level-275 character progression or a combat/resource state machine.

## 285/65 previews

The [285/65 reference document](https://docs.google.com/document/d/1WutiU7_5ftOinIMHk5R-CETl4sIX3t-7tsKjNX5ISvs/edit) was checked against the [Gravity developer announcement of 2026-06-30](https://ro.game.onstove.com/news/NewsDevnoteDetail/?category=1&page=1&search=&seq=17&srhval=) and the kROM client descriptions on Divine Pride, inspected 2026-10-12. `preview-285-reference.ts` accounts for every ID from 6608 to 6643: 30 primary skills, five Elemental Integration proc identities and the enhanced kick packet. The 28 primary skills belonging to supported classes are available in both formula versions, with English names and the **Prévia** marker. The existing 275/60 previews remain available.

| Class | New primary skills |
| --- | --- |
| Dragon Knight | 6608 Servant Weapon-Cleave |
| Imperial Guard | 6609 Shield Slam |
| Meister | 6610 Overdrive Protocol |
| Biolo | 6611 Rampant Vine |
| Shadow Cross | 6612 Venom Ignition |
| Abyss Chaser | 6613 Phantom Dagger |
| Arch Mage | 6614 Wraith Dash |
| Elemental Master | 6615 Elemental Integration; procs 6616–6620 |
| Cardinal | 6621 Punitio; 6622 Lex Expiatrix |
| Inquisitor | 6623 Sky-Shattering Strike |
| Windhawk | 6624 Fragment Bolt; 6625 Primed Trap; attacks 6626–6629 |
| Troubadour, Trouvere | 6630 Fugue Des Fleches |
| Shinkiro, Shiranui | 6631 Mirage - Cluster; 6632 Surge; 6633 Shadow Torrent |
| Night Watch | 6634 Tactical Repositioning |
| Sky Emperor | 6635 Seven-Star Heavenly Kick; enhanced packet 6636 via seven satellites |
| Soul Ascetic | 6637 Yellow Dragon Talisman |
| Hyper Novice | 6638 Wind Cutter Turbo; 6639 High Magnum Break |
| Spirit Handler | 6640 Resonance of Gwiseol - Cheolho; 6641 Spirit Tongue Resonance - Hyeonrok |
| Alitea (unsupported) | 6642 Plume Pierce; 6643 Nature Rage — catalog identities/descriptions only |

The client description for an individual skill is at `https://www.divine-pride.net/database/skill/<id>`; use its **kROM** text, not the different jRO description. Overdrive Protocol corrects the client's English typo “Protocal” without changing ID 6610. Wraith Dash deals **Ghost**, rather than the Fire element stated in the supplied translation.

Surge boosts non-critical physical damage, critical damage and melee/ranged damage; it does not grant HIT. Venom Ignition adds HIT and non-critical physical damage while disabling both basic and skill criticals. Its override also takes precedence over forced criticals. Non-critical physical bonuses have their own traced stage, so they do not accidentally increase the critical outcome. Resonances affect the named skill IDs. Existing summon, stance, faith, blessing and elemental controls are reused, with accompanying ABR-Infinity, Creeper and mastery controls where needed. All new controls default to off for old builds.

Elemental Integration resolves the element from its active level and proc strength from its learned level (falling back to active level when learning is unset). It triggers from basic physical attacks with 25% chance and gains the matching higher elemental's bonus. Phantom Dagger uses an expected count of 3.15–3.75 full-ratio hits. Seven-Star Heavenly Kick uses a manually selected satellite count, initially zero; seven selects the enhanced ratio.

**Limits:** 285/65 trait coefficients and cast timings are unpublished in these sources and are not borrowed from unrelated skills. Known base-level scaling and published mastery terms are included; the missing POW/CON/SPL terms and Breaking Limit's new-skill multipliers are not. These are partial preview damage estimates, not LATAM-validated formulas. Individual damage remains available, but DPS, combo timing, time to kill and rotation optimization are unavailable when a rotation contains unknown timings. Movement, clone attacks, duration/resource consumption, healing and automatic state transitions remain descriptive. Alitea needs a separate class implementation before its two catalog entries can be simulated. Character progression still uses the supported LATAM level/job/stat tables.

## Verification

`src/app/skills/preview-285.spec.ts` verifies complete identity coverage, every attack level, independent ratios, conditional hits, buffs, proc identity/element/level, save round trips, real physical damage and unknown-timing behavior. `e2e/skill-versions.spec.ts` verifies Surge selection, preview descriptions, persistence and the unavailable-DPS message.

`src/app/skills/skill-versions.spec.ts` checks every article's classes and attack levels, independent formula examples, legacy isolation, preview identities, support bonuses, shared-build restoration, real damage and autocast resolution. `e2e/skill-versions.spec.ts` checks synchronization across all three panels, reload persistence and a saved preview buff through the UI.
