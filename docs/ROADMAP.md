# DynastiLife — Roadmap (Comprehensive)

This roadmap is ordered from highest priority to lower, and maps the work we discussed into milestones, deliverables, and action items. It also includes next steps, art (portrait) integration guidance, and an acceptance checklist so we can measure progress.

## Quick overview
Top priority: build a solid Dynasty core (data model, generator, persistence) and a usable DynastyScreen with a readable family tree and character sheets. From there, add marriage/succession, events, titles & politics, and polish.

---

## High-level milestones (in order)

1. Core Data & Persistence (MVP)
   - Deliverables: TypeScript data models, `src/utils/dynasty.ts` (generator, createChild, marry, ancestors/descendants), Zustand store with AsyncStorage save/load, unit tests for core logic.
   - Goal: deterministic-ish generator, reliable save/load snapshots.
   - Est: 3–5 days (including tests)

2. DynastyScreen + Visual Tree (interactive)
   - Deliverables: `DynastyTree` component using `react-native-svg`, pan/zoom gestures, compact node UI, tap -> open HeirSheet modal.
   - Goal: Users can view family tree up to ~200 nodes, pan/zoom, and open character sheets.
   - Est: 5–8 days (layout + touch UX)

3. Character Sheet & Actions
   - Deliverables: `HeirSheet` modal, actionable stubs (Arrange Marriage, Educate, Grant Title), in-app validations (resource gating stubbed).
   - Goal: Show stats, traits, titles; allow initiating actions.
   - Est: 3–5 days

4. Succession & Marriage Mechanics
   - Deliverables: `calculateSuccession` API, marriage flow, claims, legitimacy and inheritance laws (male-preference primogeniture, absolute primogeniture, elective), unit tests.
   - Goal: Titles move across characters per laws; marriage updates alliances/claims.
   - Est: 7–10 days (complex rules and tests)

5. Events System & Campaigns
   - Deliverables: event triggers, event JSON packs, campaign wiring, UI for event choices, weighted outcomes.
   - Goal: Integrate `events.json` content pack and make it drive character events (births, deaths, intrigue).
   - Est: 7–12 days

6. Titles, Land, & Politics
   - Deliverables: `state.titles`, map UI integration (MapScreen), diplomacy APIs, alliances via marriage, vassal relations.
   - Goal: Visualize title ownership, handle title transfers and political actions.
   - Est: 10–15 days

7. Polishing, Performance & Large Save Support
   - Deliverables: layout caching, collapse/virtualization for huge families, SQLite support for large saves, autosave tuning.
   - Goal: Smooth UX for big dynasties and stable long-term saves.
   - Est: 7–14 days

8. Content Packs, Tools, and Mod Support (Lower priority)
   - Deliverables: era/culture packs, import/export dynasty, mod-friendly JSON formats, content editor tools.
   - Est: ongoing

---

## Immediate next tasks (what I'll do next)
Choose one; I can start immediately after you confirm which you prefer:
- Build the visual family tree (DynastyTree with react-native-svg + gestures). This surfaces layout and interaction issues early.
- Implement `calculateSuccession` with unit tests for 3 laws (male-preference primogeniture, absolute primogeniture, elective). This provides deterministic title transfer and is important for later politics.

I previously suggested visual tree as the next task — I'm happy to start there unless you prefer solidifying succession rules first.

---

## Portraits / Art: where to upload and how to integrate

Options (ordered by recommended use-case):

1. If portrait files are small (<100 MB total) and you want them versioned with the repo
   - Add them directly to the repository under `assets/portraits/` with subfolders `/female` and `/male`.
   - Pros: simple, works offline, easy to `require()` in React Native for bundling.
   - Cons: increases repo size; use Git LFS if total size is large (see below).

2. If portraits are large or you prefer not to bloat the git repo
   - Use Git LFS (preferred if you want them in the repo but they are large). Files tracked with LFS remain easy to reference in code but aren't stored in Git history.
   - Alternative: Host on a cloud storage/CDN (S3, Cloudflare R2, Google Cloud Storage, Dropbox, Google Drive with share links) and store remote URLs in a manifest. This is great if you want dynamic updates without pushing code.

3. If you want player-specific or downloadable packs
   - Host on a CDN or blob store and implement an in-app downloader/caching layer. Useful for large art packs or DLC.

Recommended workflow for a React Native / Expo project
- If total portrait size <= 50–100 MB: add directly to `assets/portraits/{male,female}` and commit.
- If total > ~100 MB or many versions: enable Git LFS and track `assets/portraits/*`.
- If you plan to update art frequently without code changes: host on a cloud storage (S3) and use a manifest JSON in the repo that maps logical IDs → URL.

Naming & manifest (recommended)
- File layout inside repo (example):
  - `assets/portraits/female/female_001.png`
  - `assets/portraits/male/male_001.png`
- Filenames should be lowercase, zero-padded, and include an index and optional trait tags: `female_01_noble.png`, `male_02_peasant.png`.
- Add a manifest file `assets/portraits/manifest.json` with a small schema:

  {
    "portraits": [
      { "id": "female_001", "gender": "female", "tags": ["noble","young"], "file": "female/female_001.png" },
      { "id": "male_001", "gender": "male", "tags": ["peasant","old"], "file": "male/male_001.png" }
    ]
  }

- The app can import this manifest and map a character portrait key to a require() or remote URL depending on hosting strategy.

How to reference in code (bundle-local)
- Example TypeScript helper (pseudo):
  const manifest = require('../assets/portraits/manifest.json');
  function getPortraitSource(id: string) {
    const entry = manifest.portraits.find(p => p.id === id);
    if (!entry) return null;
    return require(`../assets/portraits/${entry.file}`); // RN bundling requires static string at compile-time; see notes below.
  }

Important bundling note
- React Native's `require()` for assets must be given a static string literal at build time to include assets in the bundle. Dynamic require paths won't work for static bundling. Two approaches:
  1. Use a generated module (`assets/portraits/portraitIndex.ts`) at build time that exports a map of id -> require('./female/female_001.png') (preferred).
  2. Load images from remote URLs in runtime (works with dynamic strings) and cache them locally.

Generating a portrait index (recommended)
- Create a small script that reads `assets/portraits/*` and writes `assets/portraits/portraitIndex.ts` with content like:

  export default {
    "female_001": require('./female/female_001.png'),
    "male_001": require('./male/male_001.png'),
    // ...
  };

- This makes runtime lookup trivial: `import portraits from '../assets/portraits/portraitIndex'; const src = portraits[portraitId];`

Git LFS quick setup (Windows PowerShell)

```powershell
# install git-lfs if not present (one-time)
choco install git-lfs -y # if you use Chocolatey
# or download from https://git-lfs.github.com/

# in repo root
git lfs install
git lfs track "assets/portraits/*"
git add .gitattributes
git add assets/portraits/*
git commit -m "Add portraits via LFS"
```

If you don't use Git LFS, commit directly (small sets) or upload to cloud storage and keep only the manifest in repo.

---

## Acceptance criteria (MVP)
- DynastyScreen renders a readable family tree for up to 200 nodes with pan/zoom.
- Character sheet opens and shows stats/traits/titles.
- Save/load persists dynasty state and recovers on restart.
- Portraits load for characters either from bundled assets or remote URLs and display in character sheet.

---

## Risks & mitigations
- Large repository size due to art: use Git LFS or external hosting.
- Performance with many nodes: add caching, incremental layout, and branch collapsing.
- Complex succession laws: add a test suite and expose pluggable rule sets.

---

## Roadmap checkpoints and estimated schedule (example)
- Week 0: Repo scaffolding & core data (done).
- Week 1: DynastyScreen (visual tree) + HeirSheet modal.
- Week 2: Succession mechanics, marriage flows, unit tests.
- Week 3: Events integration, titles & politics wiring.
- Week 4+: Polish, performance tuning, content packs.

---

## Next action for me (if you confirm)
- I will implement the visual `DynastyTree` with pan/zoom and a generated `portraitIndex.ts` builder script to integrate your portraits.

If you'd rather have me implement succession rules first, tell me and I'll start there instead.
