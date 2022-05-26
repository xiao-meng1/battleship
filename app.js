import * as VIEW from './view';

const createShip = (name, length, orientation, startPosition) => {
  const shipBody = new Array(length).fill(null);
  const [rowIndex, colIndex] = startPosition;
  const coordinates = [];

  if (orientation === 'horizontal') {
    for (let i = 0; i < length; i += 1) {
      coordinates.push([rowIndex, i + colIndex]);
    }
  } else if (orientation === 'vertical') {
    for (let i = 0; i < length; i += 1) {
      coordinates.push([i + rowIndex, colIndex]);
    }
  }

  const hit = (index) => {
    if (index >= 0 || index <= length - 1) {
      shipBody[index] = 'hit';
    }
  };
  const isSunk = () => {
    if (shipBody.every((x) => x === 'hit')) {
      return true;
    }

    return false;
  };
  const getShipBody = () => [...shipBody];
  const getCoordinates = () => [...coordinates];

  return { name, hit, isSunk, getShipBody, getCoordinates };
};

const createGameboard = () => {
  const ships = [];
  const missedShots = [];
  const hitShots = [];
  const totalSquares = [];

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      totalSquares.push([i, j]);
    }
  }

  const addShip = (name, length, orientation, startPosition) => {
    const newShip = createShip(name, length, orientation, startPosition);
    ships.push(newShip);
  };

  const getShip = (shipName) => {
    const ship = ships.find((x) => x.name === shipName);

    return { ...ship };
  };

  const receiveAttack = (attackCoordinate) => {
    let hit = false;
    let hitShip;
    let hitIndex;

    ships.forEach((ship) => {
      if (!hitShip) {
        hitIndex = ship.getCoordinates().findIndex((coordinate) => {
          if (
            coordinate[0] === attackCoordinate[0] &&
            coordinate[1] === attackCoordinate[1]
          ) {
            hit = true;
            hitShip = ship;

            return true;
          }

          return false;
        });
      }
    });

    if (hit) {
      hitShip.hit(hitIndex);
      hitShots.push(attackCoordinate);
    } else {
      missedShots.push(attackCoordinate);
    }
  };

  const areAllShipsSunk = () => {
    const allShipsSunk = ships.every((ship) => {
      if (ship.getShipBody().every((x) => x === 'hit')) {
        return true;
      }

      return false;
    });

    return allShipsSunk;
  };

  const getMissedShots = () => [...missedShots];

  const getHitShots = () => [...hitShots];

  const getTotalSquares = () => [...totalSquares];

  const getRandomUnattackedElement = () => {
    const firedShots = hitShots.concat(missedShots);
    const unattackedSquares = totalSquares.filter((square) => {
      if (firedShots.find((x) => x[0] === square[0] && x[1] === square[1])) {
        return false;
      }

      return true;
    });
    const index = Math.floor(Math.random() * unattackedSquares.length);

    return unattackedSquares[index];
  };

  const getAvailableShipStartPositions = (unplacedShip) => {
    const emptySquares = totalSquares.filter((square) => {
      if (
        ships.some((ship) =>
          ship
            .getCoordinates()
            .some((x) => x[0] === square[0] && x[1] === square[1])
        )
      ) {
        return false;
      }

      return true;
    });
    const availableShipStartPositions = emptySquares.filter((emptySquare) => {
      const testShip = createShip(
        unplacedShip.name,
        unplacedShip.length,
        unplacedShip.orientation,
        emptySquare
      );

      if (
        testShip
          .getCoordinates()
          .every((x) =>
            emptySquares.find(
              (square) => square[0] === x[0] && square[1] === x[1]
            )
          )
      ) {
        return true;
      }

      return false;
    });

    return availableShipStartPositions;
  };

  return {
    addShip,
    getShip,
    receiveAttack,
    areAllShipsSunk,
    getMissedShots,
    getHitShots,
    getTotalSquares,
    getRandomUnattackedElement,
    getAvailableShipStartPositions,
  };
};

const createPlayer = (name) => {
  const attack = (gameboard, coordinate) => {
    gameboard.receiveAttack(coordinate);
  };

  return { name, attack };
};

const gameLoop = (() => {
  const humanPlayer = createPlayer('human');
  const computerPlayer = createPlayer('computer');
  const humanGameboard = createGameboard();
  const computerGameboard = createGameboard();
  const availableShips = [
    { name: 'Carrier', length: 5 },
    { name: 'Battleship', length: 4 },
    { name: 'Cruiser', length: 3 },
    { name: 'Submarine', length: 3 },
    { name: 'Destroyer', length: 2 },
  ];
  const placeComputerShips = (() => {
    for (let i = 0; i < availableShips.length; i += 1) {
      const ship = availableShips[i];
      ship.orientation =
        Math.floor(Math.random() * 2) === 0 ? 'vertical' : 'horizontal';
      const availableShipStartPositions =
        computerGameboard.getAvailableShipStartPositions(ship);
      ship.startPosition =
        availableShipStartPositions[
          Math.floor(Math.random() * availableShipStartPositions.length)
        ];
      computerGameboard.addShip(
        ship.name,
        ship.length,
        ship.orientation,
        ship.startPosition
      );
    }
  })();

  availableShips.forEach((ship) => {
    console.log(computerGameboard.getShip(ship.name).getCoordinates());
  });

  const addShipToHuman = (shipInformation) => {
    humanGameboard.addShip(...shipInformation);
  };
  const playTurn = (coordinate) => {
    humanPlayer.attack(computerGameboard, coordinate);
    if (computerGameboard.areAllShipsSunk()) {
      VIEW.win('human');
      return;
    }
    computerPlayer.attack(
      humanGameboard,
      humanGameboard.getRandomUnattackedElement()
    );
    if (humanGameboard.areAllShipsSunk()) {
      VIEW.win('computer');
    }
  };
  return { addShipToHuman, playTurn };
})();

export { createShip, createGameboard, createPlayer, gameLoop };
