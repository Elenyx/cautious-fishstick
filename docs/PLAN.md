# DynastiLife — Implementation Plan

## Purpose
This plan translates `project.md` into a small, actionable implementation roadmap and sprint plan. It focuses on the initial vertical slice: the Dynasty system and the DynastyScreen UI so we can iterate gameplay quickly.

## Contract (what we'll deliver in the first slice)
- Inputs: seed (optional), player profile, initial world rules (era, culture, succession law).
- Outputs: a persisted `state.dynasty` (array of characters with relationships), a working `DynastyScreen` showing the family tree, and UI actions to view a character sheet and generate heirs.
- Error modes: invalid input shapes, persistence failures — surface friendly UI errors and fallback to in-memory state.
- Success criteria: DynastyScreen renders a tree for up to 200 nodes; basic actions (view sheet, generate heir, save/load) work reliably.

## Scopes & Priorities
1. Core (MVP) — high priority
   - Data model for characters & relations.
   - Dynasty generator and heir creation logic.
   - Persistent save/load (AsyncStorage / SQLite later).
   - `DynastyScreen` with pan/zoomable SVG tree and character nodes.
   - Character sheet modal (stats, traits, quick actions stubbed).
2. Near-term (next sprint)
   - Marriage mechanics and succession logic.
   - Basic politics: titles & title ownership mapping.
   - Events integration (hook into events.json to trigger lifecycle events).
3. Nice-to-have
   - Virtualization for >200 nodes, export/import dynasty, advanced UI polish.

## Milestones & Timeline (suggested sprints)
- Sprint 0 (2 days): Repo setup, CI, RN + Expo skeleton, ESLint/Prettier, basic navigation.
- Sprint 1 (1 week): Implement data models, dynasty generator, AsyncStorage save/load, unit tests.
- Sprint 2 (1 week): DynastyScreen + SVG rendering, pan/zoom, character modal.
- Sprint 3 (1 week): Marriage/heir flows, succession rules UI, integrate events.

## Tasks (first vertical slice)
- [ ] Add project scaffolding (Expo + TypeScript) if not present.
- [ ] Create `src/store/GameContext` (or Zustand store) and types.
- [ ] Implement `src/utils/dynasty.js` generator & helpers.
- [ ] Create `src/screens/DynastyScreen.js` and `src/components/DynastyTree.js` (SVG nodes/edges).
- [ ] Implement `src/components/HeirSheet.js` modal UI.
- [ ] Add tests for generator and succession helper functions.
- [ ] Hook up AsyncStorage persistence and a LoadingScreen to restore state.

## Testing & Quality Gates
- Unit tests: generator happy path, edge cases (no heirs, many heirs), succession law tests.
- Smoke: run on Expo client, verify DynastyScreen rendering for 50–200 nodes.
- Lint/Format: ESLint + Prettier pre-commit.

## Assumptions
- Tech: React Native + Expo, TypeScript preferred.
- State: Prefer Zustand for local-first game state; Redux optional if complexity grows.
- Persistence: start with AsyncStorage; migrate to SQLite for larger saves.

## Questions for you
- Do you prefer TypeScript or JavaScript for the project?
- Any preferences between Zustand and Redux?
- Would you like me to scaffold the RN/Expo app now or only create JS logic and components inside the existing repo?

## Next steps (if you approve)
- Create initial project scaffold or add TypeScript + package manifests.
- Implement `src/utils/dynasty.js` and tests, then the basic DynastyScreen UI.
