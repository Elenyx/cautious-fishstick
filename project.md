# DynastiLife – “Live your life, rule your dynasty.”

## Game Description

“DynastiLife is a hybrid life simulator and dynasty builder. Start as a commoner or noble, make personal choices, marry strategically, and secure your legacy. Will your bloodline thrive for centuries or vanish into obscurity? Every decision matters—from your daily life to the fate of kingdoms.”

## Core Features

1. Sandbox Mode: Create your own world rules (era, culture, religion, lifespan, inheritance laws).
2. Campaign Mode: Historical or fantasy scenarios (e.g., “Rise of a House,” “Fall of Empires”).
3. Dynasty System: Marry, have heirs, manage succession laws.
4. Politics & Intrigue: Alliances, betrayals, assassinations.
5. Economy & Titles: Gain land, wealth, and influence.
6. Events: Mix personal life events with political crises.

## Project Structure

/src
  /navigation
    - RootNavigator.js
  /screens
    - LoadingScreen.js        # In-app loader (after splash)—use for heavy transitions
    - HomeScreen.js           # Choose Sandbox / Campaign
    - SandboxScreen.js        # Free-play mode; rules configurable; random events
    - CampaignScreen.js       # Story chapters with goals; branching
    - DynastyScreen.js        # View family tree, heirs, succession
    - PoliticsScreen.js       # Alliances, vassals, intrigue
    - MapScreen.js            # Simple map view (regions, titles)
  /components
    - EventCard.js            # Shows a life event with text + small visuals
    - ChoiceButton.js         # Reusable button for event choices
    - DynastyTree.js          # Visual family tree
    - MapRegion.js            # Clickable map regions
  /store
    - GameContext.js          # Expanded: dynasty, titles, alliances
  /data
    - events.json             # Life + political events
    - campaigns.json          # Historical/fantasy scenarios
    - cultures.json           # Names, traditions
    - titles.json             # Duchies, kingdoms
  /utils
    - random.js               # RNG helpers (seedable later), weighted choices
    - dynasty.js              # Generate heirs, family tree logic
    - politics.js             # Alliances, intrigue calculations

## Key Additions

### Dynasty System:

Store family tree in state.dynasty (array of characters with IDs, relationships).
Generate heirs when you marry/have kids.


### Politics:

state.titles for land ownership.
Alliances via marriage or diplomacy.

## Recommended Stack:

React Native (UI & logic)
Expo (easy testing & deployment)
AsyncStorage or SQLite (for saving game progress)
Redux or Zustand (for state management)
React Navigation (for screens like Sandbox, Campaign, Settings)

# DynastyScreen — UX Design Summary

Goal: Give players a fast, legible overview of their bloodline and instant access to heir details and actions.

## Layout:

- Header Bar: Dynasty name, realm crest, prestige, succession law pill (tap → law info).
- Tree Canvas: Pan/zoomable graph of generations (top → old; bottom → young).
- Toolbar: Focus (You / Heir / Founder), Filter (Alive / All), Zoom +/-.
- Heir Sheet (Modal): Stats (health, intrigue, stewardship…), titles & claims, traits, relationships, quick actions (Arrange Marriage, Educate, Disinherit*, Grant Title*, Plot*).
* gated by laws/resources.

Performance: Use react-native-svg for nodes/edges, and simple pan/zoom transforms on the <Svg> layer. Virtualization is usually not necessary for ≤ 200 nodes.

# 🔧 Implementation Tips

Traits: keep a small set at first (Brave, Just, Deceitful, Genius) each giving ± to Opinion, War, Intrigue.
Stats: Diplomacy, Martial, Stewardship, Intrigue, Learning (CK-like), but you can compress into 3 if you prefer.

## Performance:

- Keep tree layout O(N) with a single pass; avoid re-layout on every small change.
- For very big families, paginate by generation, or collapse non‑direct branches.

Content Packs: separate events by era/culture—e.g., events_medieval.json, events_modern.json—and pick based on Sandbox rules.