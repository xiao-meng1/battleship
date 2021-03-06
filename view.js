const init = () => {
  const userGameboard = createGameboard();
  addGameboard('user', userGameboard);
};

const createGameboard = () => {
  const gameboard = document.createElement('div');

  gameboard.classList = 'gameboard';

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const square = document.createElement('div');
      square.classList.add('square');
      square.dataset.rowIndex = i;
      square.dataset.colIndex = j;
      gameboard.appendChild(square);
    }
  }

  return gameboard;
};

const addGameboard = (playerName, gameboard) => {
  const playerContainer = document.querySelector(`.${playerName}.container`);
  playerContainer.appendChild(gameboard);
};

const updatePlaceShipHeader = (shipName) => {
  const placeShipHeader = document.querySelector('main .computer.container h2');
  placeShipHeader.textContent = `Place your ${shipName}`;
};

const startGame = () => {
  const computerContainer = document.querySelector('main .computer.container');
  const computerGameboard = createGameboard();

  while (computerContainer.firstChild) {
    computerContainer.firstChild.remove();
  }

  addGameboard('computer', computerGameboard);
};

const addAttacktoGameboard = (playerName, coordinate, attackResult) => {
  const attackedSquare = document.querySelector(
    `.${playerName}.container .gameboard ` +
      `.square[data-row-index="${coordinate[0]}"][data-col-index="${coordinate[1]}"]`
  );
  attackedSquare.classList.add(attackResult);
};

const win = (winner) => {
  const middleContainerHeader = document.querySelector(
    'main .middle.container h2'
  );
  if ((winner = 'user')) {
    middleContainerHeader.textContent = 'You win!';
  } else if ((winner = 'computer')) {
    middleContainerHeader.textContent = 'You lose!';
  }
};

export { init, updatePlaceShipHeader, startGame, addAttacktoGameboard, win };
