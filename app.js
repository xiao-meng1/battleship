const Ship = (length) => {
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

  return { hit, isSunk };
};

export { Ship }