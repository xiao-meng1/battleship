import * as VIEW from './view.js';

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

// Events are handled here instead of VIEW to avoid a circular module dependency.
const eventHandler = (() => {
  const addPlaceShipEvents = (ship, startPositions) => {
    const userGameboard = document.querySelector('.user.container .gameboard');
    const placeableSquares = [];
    startPositions.forEach((x) => {
      placeableSquares.push(
        userGameboard.querySelector(
          `[data-row-index="${x[0]}"][data-col-index="${x[1]}"]`
        )
      );
    });
    const getGameboardShipSquares = (e) => {
      const shipSquares = [e.target];

      for (let i = 1; i <= ship.length - 1; i += 1) {
        let newShipSquare;

        if (ship.orientation === 'vertical') {
          newShipSquare = userGameboard.querySelector(
            `[data-row-index="${
              Number(e.target.dataset.rowIndex) + i
            }"][data-col-index="${e.target.dataset.colIndex}"]`
          );
        } else if (ship.orientation === 'vertical') {
          newShipSquare = userGameboard.querySelector(
            `[data-row-index="${e.target.dataset.rowIndex}"][data-col-index="${
              Number(e.target.dataset.colIndex) + i
            }"]`
          );
        }

        shipSquares.push(newShipSquare);
      }

      return shipSquares;
    };
    const squareMouseenter = (e) => {
      getGameboardShipSquares(e).forEach((square) =>
        square.classList.add('ship')
      );
    };
    const squareMouseout = (e) => {
      getGameboardShipSquares(e).forEach((square) =>
        square.classList.remove('ship')
      );
    };

    placeableSquares.forEach((square) => {
      square.addEventListener('mouseenter', squareMouseenter);
      square.addEventListener('mouseout', squareMouseout);
    });
  };
  return { addPlaceShipEvents };
})();

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

  VIEW.init();

  // find ship not in humanGameboard.getShips(), take that ship,
  // get available start positions,
  // send ship and available start positions to VIEW for rendering,
  // send ship and available start positions to eventHandler to
  // add click events, click event will restart the cycle.
  // If all ships are placed, then remove grid event listeners,
  // tell VIEW to render computer gameboard, add computer gameboard
  // event listeners which will call playTurn on click.
  const placeUserShip = ((orientation = 'vertical') => {
    const unplacedShip = availableShips.find((ship) => {
      if (Object.keys(humanGameboard.getShip(ship.name)).length === 0) {
        return true;
      }

      return false;
    });
    unplacedShip.orientation = orientation;
    const availableShipStartPositions =
      humanGameboard.getAvailableShipStartPositions(unplacedShip);
    VIEW.updatePlaceShipHeader(unplacedShip.name);
    eventHandler.addPlaceShipEvents(unplacedShip, availableShipStartPositions);
  })();

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
  return { placeComputerShips, addShipToHuman, playTurn };
})();

export { createShip, createGameboard, createPlayer, gameLoop };
