# DynastiLife — Project Scaffold

This workspace contains a minimal Expo + TypeScript scaffold and initial game modules (Zustand store + `dynasty` utils).

Prerequisites
- Node.js (16+ recommended)
- Yarn or npm
- Expo CLI (optional; `npx expo` works)

Install & run (Windows PowerShell)

```powershell
# from project root (d:\Project\Application\DynastiLife)
npm install
npx expo start
```

Run tests

```powershell
npm test
```

What I scaffolded
- `package.json`, `tsconfig.json`, `app.json`
- `src/App.tsx` — entry
- `src/store/gameStore.ts` — Zustand store skeleton + AsyncStorage hooks
- `src/utils/dynasty.ts` — TypeScript dynasty utilities (generator, createChild, marry, ancestors/descendants)
- `src/screens/DynastyScreen.tsx` — minimal screen to exercise the store
- `src/components/DynastyTree.tsx` — placeholder visual component
- `src/utils/__tests__/dynasty.test.ts` — simple unit test for generator

Next steps
- Run `npm install` to pull dependencies, then `npx expo start` to open the app in Expo Go or a simulator.
- I can then wire a small visual family tree using `react-native-svg` and add persistence autosaves.
