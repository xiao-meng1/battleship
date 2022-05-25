import { createShip, createGameboard } from './app';

describe('createShip factory function tests', () => {
  test('createShip returns an object', () => {
    expect(typeof createShip()).toBe('object');
  });

  test('ship is not sunk if part of its body has hits', () => {
    const ship = createShip(3);
    ship.hit(0);
    ship.hit(1);
    expect(ship.isSunk()).toBe(false);
  });

  test('ship is sunk if its entire body has hits', () => {
    const ship = createShip(3);
    ship.hit(0);
    ship.hit(1);
    ship.hit(2);
    expect(ship.isSunk()).toBe(true);
  });
});

describe('createGameboard factory function tests', () => {
  test('createGameboard returns an object', () => {
    expect(typeof createGameboard()).toBe('object');
  });

  test('gameboard can place ships', () => {
    const gameboard = createGameboard();
    gameboard.addShip('Carrier', 5, 'vertical', [0, 0]);
    expect(gameboard.getShip('Carrier').coordinates).toStrictEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
    ]);
  });

  test('gameboard can recieve attacks and hit ship', () => {
    const gameboard = createGameboard();
    gameboard.addShip('Carrier', 5, 'vertical', [0, 0]);
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.getShip('Carrier').getShipBody()[0]).toBe('hit');
  });

  test('gameboard can check if all ships have sunk', () => {
    const gameboard = createGameboard();
    gameboard.addShip('Carrier', 2, 'vertical', [0, 0]);
    gameboard.addShip('Destroyer', 2, 'horizontal', [7, 0]);
    gameboard.receiveAttack([0, 0]);
    gameboard.receiveAttack([1, 0]);
    gameboard.receiveAttack([2, 0]);
    gameboard.receiveAttack([3, 0]);
    gameboard.receiveAttack([4, 0]);
    gameboard.receiveAttack([7, 0]);
    gameboard.receiveAttack([7, 1]);
    expect(gameboard.areAllShipsSunk()).toBe(true);
  });
});

describe('createPlayer factory function tests', () => {
  test.skip('createPlayer returns an object', () => {
    expect(typeof createPlayer()).toBe('object');
  });

  test.skip('player can attack enemy gameboard', () => {
    const humanPlayer = createPlayer('human');
    const computerGameboard = createGameboard();

    computerGameboard.addShip('Carrier', 2, 'vertical', [0, 0]);
    humanPlayer.attack(computerGameboard, [0, 0]);
    expect(computerGameboard.getHitShots()).toStrictEqual([[0, 0]]);
  });

  test.skip('player of type computer can attack a random unattacked element', () => {
    const computerPlayer = createPlayer('computer');
    const humanGameboard = createGameboard();

    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        if (i !== 0 && j !== 0) {
          computerPlayer.attack(humanGameboard, [i, j]);
        }
      }
    }

    expect(
      humanGameboard.getHitShots.find((x) => x[0] === 0 && x[1] === 0)
    ).toBe(false);
    computerPlayer.attack(
      humanGameboard,
      computerPlayer.getRandomUnattackedElement(humanGameboard)
    );
    expect(
      humanGameboard.getHitShots.find((x) => x[0] === 0 && x[1] === 0)
    ).toBe(true);
  });
});
