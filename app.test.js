import { createShip, createGameboard, createPlayer } from './app';

describe('createShip factory function tests', () => {
  test('createShip returns an object', () => {
    expect(typeof createShip('ship', 3, 'vertical', [0, 0])).toBe('object');
  });

  test('ship is not sunk if part of its body has hits', () => {
    const ship = createShip('ship', 3, 'vertical', [0, 0]);
    ship.hit(0);
    ship.hit(1);
    expect(ship.isSunk()).toBe(false);
  });

  test('ship is sunk if its entire body has hits', () => {
    const ship = createShip('ship', 3, 'vertical', [0, 0]);
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
    expect(gameboard.getShip('Carrier').getCoordinates()).toStrictEqual([
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

  test('gameboard can report missed shots', () => {
    const gameboard = createGameboard();
    gameboard.receiveAttack([0, 0]);
    expect(gameboard.getMissedShots()).toStrictEqual([[0, 0]]);
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

  test('gameboard can report available ship start positions', () => {
    const gameboard = createGameboard();
    const unplacedShip = {
      name: 'Carrier',
      length: 5,
      orientation: 'horizontal',
    };
    gameboard.addShip('Carrier', 2, 'vertical', [0, 0]);
    const expectedAvailableShipStartPositions = [];
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 6; j += 1) {
        if (!((i === 0 && j === 0) || (i === 1 && j === 0))) {
          expectedAvailableShipStartPositions.push([i, j]);
        }
      }
    }
    expect(
      gameboard.getAvailableShipStartPositions(unplacedShip)
    ).toStrictEqual(expectedAvailableShipStartPositions);
  });
});

describe('createPlayer factory function tests', () => {
  test('createPlayer returns an object', () => {
    expect(typeof createPlayer()).toBe('object');
  });

  test('player can attack enemy gameboard', () => {
    const humanPlayer = createPlayer('human');
    const computerGameboard = createGameboard();

    computerGameboard.addShip('Carrier', 2, 'vertical', [0, 0]);
    humanPlayer.attack(computerGameboard, [0, 0]);
    expect(computerGameboard.getHitShots()).toStrictEqual([[0, 0]]);
  });

  test('player of type computer can attack a random unattacked element', () => {
    const computerPlayer = createPlayer('computer');
    const humanGameboard = createGameboard();

    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        if (!(i === 0 && j === 0)) {
          computerPlayer.attack(humanGameboard, [i, j]);
        }
      }
    }

    expect(
      humanGameboard.getMissedShots().find((x) => x[0] === 0 && x[1] === 0)
    ).toBe(undefined);
    computerPlayer.attack(
      humanGameboard,
      humanGameboard.getRandomUnattackedElement()
    );
    expect(
      humanGameboard.getMissedShots().find((x) => x[0] === 0 && x[1] === 0)
    ).toStrictEqual([0, 0]);
  });
});
