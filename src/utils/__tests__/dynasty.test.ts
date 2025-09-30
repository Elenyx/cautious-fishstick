import { generateFounders } from '../dynasty';

test('generateFounders returns at least one founder and includes children', () => {
  const res = generateFounders(undefined, { count: 2 });
  const keys = Object.keys(res.characters);
  expect(keys.length).toBeGreaterThan(0);
  expect(res.rootIds.length).toBe(2);
});
