import { Ship } from './app.js';

describe('Ship factory function tests', () => {
  test('Ship returns an object', () => {
    expect(typeof(Ship())).toBe('object');
  });
  
  test('ship is not sunk if part of its body has hits', () => {
    const ship = Ship(3);
    ship.hit(0);
    ship.hit(1);
    expect(ship.isSunk()).toBe(false);
  });
  
  test('ship is sunk if its entire body has hits', () => {
    const ship = Ship(3);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBe(true);
  });
});