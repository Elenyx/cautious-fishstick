# DynastiLife — Architecture & Data Design

## Overview
This doc maps the UX & features from `project.md` into concrete modules, data shapes, and tech decisions. It aims to be a living reference for implementation choices for the Dynasty feature and associated systems.

## High-level stack
- Frontend: React Native (Expo), TypeScript.
- State: Zustand (local-first, simple API) with a thin Context wrapper for easy consumption by components.
- Persistence: AsyncStorage initially; SQLite for later large-saves.
- Rendering: react-native-svg for family tree nodes/edges, react-native-gesture-handler for pan/zoom.
- Testing: Jest + React Native Testing Library for components, unit tests for utils.

## Project layout (recommended)
/src
  /components
    DynastyTree.tsx   # svg rendering, nodes, edges
    EventCard.tsx
    ChoiceButton.tsx
    HeirSheet.tsx     # modal
  /screens
    DynastyScreen.tsx
    LoadingScreen.tsx
    HomeScreen.tsx
  /store
    gameStore.ts      # Zustand store: dynasty, titles, player
  /utils
    dynasty.ts        # core domain logic (generator, succession)
    random.ts
    politics.ts
  /data
    events.json
    campaigns.json

## Data shapes
- Character (TypeScript interface)
  - id: string (uuid)
  - givenName: string
  - familyName: string
  - birthYear?: number
  - deathYear?: number | null
  - gender: 'male' | 'female' | 'other'
  - parentIds: string[]
  - spouseIds: string[]
  - childIds: string[]
  - stats: { diplomacy: number; martial: number; stewardship: number; intrigue: number; learning: number }
  - traits: string[]
  - titles: string[]  // title IDs
  - alive: boolean
  - portrait?: string (uri)

- Title
  - id: string
  - name: string
  - tier: 'county'|'duchy'|'kingdom'|'empire'
  - ownerId?: string

- GameState (subset)
  - dynasty: Record<string, Character> // keyed by id
  - rootCharacterId: string
  - playerId: string
  - titles: Record<string, Title>
  - persistenceMeta: { lastSaved: number }

## Core module APIs (dynasty.ts)
- generateFounders(seed?, options) -> { characters: Character[], rootId }
- createChild(parentIds: string[], options) -> Character
- marry(spouseAId, spouseBId) -> void
- calculateSuccession(titleId, law) -> string[] (ordered heir ids)
- getAncestors(characterId, depth) -> Character[]
- getDescendants(characterId, depth) -> Character[]

## UI design notes (DynastyTree)
- Render nodes as compact cards (name, years, small crest).
- Connect via straight/curved edges; group by generation levels.
- Use a layout pass once per major change; cache layout results.
- Pan/zoom: wrap <Svg> with a transform container using gesture-handler.
- Node interactions: tap = open HeirSheet; long-press = quick actions menu.

## Persistence & Serialization
- Save keys: `dynastylife:save:v1` storing serialized `GameState`.
- Saving strategy: debounce saves (500–1000ms) and save full snapshot; consider differential saves later.

## Performance & Edge Cases
- Keep layout O(N). Avoid re-layout for minor metadata changes (e.g., trait changes) — only re-layout when family topology changes.
- Edge cases: adoption, polygamy, unknown parents — allow parentIds to be empty or multiple.
- Large families: collapse distant/irrelevant branches, provide generation paging.

## Security & Data Integrity
- Use UUIDs for IDs. Validate shapes on load; if corrupted, show recovery UI and fall back to an autosave.

## Development & CI
- Husky pre-commit formatting, eslint rules (React Native recommended rules), unit tests required for core utils.

## Notes on Extensions (Politics / Events)
- Events: JSON-driven event packs; events reference character IDs via selectors (e.g., random adult male of house X).
- Titles & Politics: titles stored in `state.titles`. Marriage or diplomacy can transfer claim/ownership.

## Next steps for architecture
- Decide: TypeScript vs JavaScript.
- Pick state library (Zustand recommended). I can scaffold the chosen stack and implement `dynasty.ts` with tests next.
