import { sum } from './app.js';

test('test sum', () => {
  expect(sum(2, 4)).toBe(6);
});