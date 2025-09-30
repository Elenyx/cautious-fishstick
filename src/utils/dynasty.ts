import { v4 as uuidv4 } from 'uuid';

export type Gender = 'male' | 'female' | 'other';

export type Stats = {
  diplomacy: number;
  martial: number;
  stewardship: number;
  intrigue: number;
  learning: number;
};

export type Character = {
  id: string;
  givenName: string;
  familyName?: string;
  birthYear?: number;
  deathYear?: number | null;
  gender: Gender;
  parentIds: string[];
  spouseIds: string[];
  childIds: string[];
  stats: Stats;
  traits: string[];
  titles: string[];
  alive: boolean;
};

export type GenerateOptions = {
  count?: number; // number of founders
  startingYear?: number;
};

function rndInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomStats(): Stats {
  return {
    diplomacy: rndInt(1, 10),
    martial: rndInt(1, 10),
    stewardship: rndInt(1, 10),
    intrigue: rndInt(1, 10),
    learning: rndInt(1, 10)
  };
}

export function generateFounders(seed?: number, options: GenerateOptions = {}) {
  const count = options.count || 4;
  const startingYear = options.startingYear || 1000;
  const characters: Character[] = [];

  for (let i = 0; i < count; i++) {
    const id = uuidv4();
    characters.push({
      id,
      givenName: `Founder${i + 1}`,
      familyName: 'House ' + String.fromCharCode(65 + i),
      birthYear: startingYear - rndInt(20, 40),
      gender: i % 2 === 0 ? 'male' : 'female',
      parentIds: [],
      spouseIds: [],
      childIds: [],
      stats: randomStats(),
      traits: [],
      titles: [],
      alive: true
    });
  }

  // simple initial marriages: pair founders
  for (let i = 0; i + 1 < characters.length; i += 2) {
    const a = characters[i];
    const b = characters[i + 1];
    a.spouseIds.push(b.id);
    b.spouseIds.push(a.id);
    // generate 1-3 children
    const childrenCount = rndInt(1, 3);
    for (let c = 0; c < childrenCount; c++) {
      const childId = uuidv4();
      const child = {
        id: childId,
        givenName: `Child${i}-${c}`,
        familyName: a.familyName,
        birthYear: (a.birthYear || startingYear) + rndInt(18, 30),
        gender: Math.random() > 0.5 ? 'male' : 'female',
        parentIds: [a.id, b.id],
        spouseIds: [],
        childIds: [],
        stats: randomStats(),
        traits: [],
        titles: [],
        alive: true
      } as Character;
      a.childIds.push(childId);
      b.childIds.push(childId);
      characters.push(child);
    }
  }

  const map: Record<string, Character> = {};
  for (const c of characters) map[c.id] = c;

  return { characters: map, rootIds: characters.slice(0, count).map((c) => c.id) };
}

export function createChild(parentIds: string[], overrides?: Partial<Character>): Character {
  const id = uuidv4();
  const parentFamily = overrides?.familyName || (parentIds.length ? `House` : 'House');
  const child: Character = {
    id,
    givenName: overrides?.givenName || 'Newborn',
    familyName: parentFamily,
    birthYear: overrides?.birthYear,
    gender: overrides?.gender || (Math.random() > 0.5 ? 'male' : 'female'),
    parentIds: parentIds.slice(),
    spouseIds: [],
    childIds: [],
    stats: overrides?.stats || randomStats(),
    traits: overrides?.traits || [],
    titles: overrides?.titles || [],
    alive: true,
    deathYear: null
  };
  return child;
}

export function marry(a: Character, b: Character) {
  if (!a.spouseIds.includes(b.id)) a.spouseIds.push(b.id);
  if (!b.spouseIds.includes(a.id)) b.spouseIds.push(a.id);
}

export function getAncestors(all: Record<string, Character>, id: string, depth = Infinity): Character[] {
  const result: Character[] = [];
  const visited = new Set<string>();

  function walk(currentId: string, level: number) {
    if (!all[currentId]) return;
    if (level > depth) return;
    const node = all[currentId];
    for (const pid of node.parentIds) {
      if (visited.has(pid)) continue;
      visited.add(pid);
      const parent = all[pid];
      if (parent) {
        result.push(parent);
        walk(pid, level + 1);
      }
    }
  }

  walk(id, 1);
  return result;
}

export function getDescendants(all: Record<string, Character>, id: string, depth = Infinity): Character[] {
  const result: Character[] = [];
  const visited = new Set<string>();

  function walk(currentId: string, level: number) {
    if (!all[currentId]) return;
    if (level > depth) return;
    const node = all[currentId];
    for (const cid of node.childIds) {
      if (visited.has(cid)) continue;
      visited.add(cid);
      const child = all[cid];
      if (child) {
        result.push(child);
        walk(cid, level + 1);
      }
    }
  }

  walk(id, 1);
  return result;
}
