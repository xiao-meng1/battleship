const createShip = (length) => {
  const shipBody = new Array(length).fill(null);
  const hit = (index) => {
    if (index >= 0 || index <= length - 1) {
      shipBody[index] = 'hit';
    }
  };
  const isSunk = () => {
    if (shipBody.every((x) => x === 'hit')) {
      return true;
    } else {
      return false;
    }
  };
  const getShipBody = () => {
    return [...shipBody];
  }

  return { hit, isSunk, getShipBody };
};

const createGameboard = () => {
  const ships = [];
  const missedShots = [];

  const addShip = (name, length, orientation, startPosition) => {
    const newShip = createShip(length);
    let [rowIndex, colIndex] = startPosition;

    newShip.name = name;
    newShip.coordinates = [];

    if (orientation === 'horizontal') {
      for (let i = 0; i < length; i++) {
        newShip.coordinates.push([rowIndex, i + colIndex]);
      }
    } else if (orientation === 'vertical') {
      for (let i = 0; i < length; i++) {
        newShip.coordinates.push([i + rowIndex, colIndex]);
      }
    }

    ships.push(newShip);
  };

  const getShip = (shipName) => {
    const ship = ships.find((ship) => ship.name === shipName);

    return {...ship};
  };

  const receiveAttack = (attackCoordinate) => {
    let hit = false;
    let hitShip;
    let hitIndex;
    
    for (const ship of ships) {
      hitIndex = ship.coordinates.findIndex((coordinate) => {
        if (coordinate[0] === attackCoordinate[0] &&
          coordinate[1] === attackCoordinate[1]) {
            hit = true;
            hitShip = ship;

            return true;
        }
      });

      if (hitShip) {
        break;
      }
    }

    if (hit) {
      hitShip.hit(hitIndex);
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

  return { addShip, getShip, receiveAttack, areAllShipsSunk };
};

export { createShip, createGameboard }