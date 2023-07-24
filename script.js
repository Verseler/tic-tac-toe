const GameBoard = (() => {
  //primarly used for checking if there is a winning combination
  const board = ["", "", "", "", "", "", "", "", ""];
  const boardCells = document.querySelectorAll("[data-cell]");

  const setBoard = (markClass) => {
    //update the board base on board cell that has a markClass
    for (let i = 0; i < boardCells.length; i++) {
      if (boardCells[i].classList.contains(markClass)) {
        board[i] = markClass;
      }
    }
  };

  const clearBoard = (playerXMarkCLas, playerOMarkCLass) => {
    for (let i = 0; i < boardCells.length; i++) {
      //clear boardUI
      if (boardCells[i].classList.contains(playerXMarkCLas)) {
        boardCells[i].classList.remove(playerXMarkCLas);
      }
      if (boardCells[i].classList.contains(playerOMarkCLass)) {
        boardCells[i].classList.remove(playerOMarkCLass);
      }
      //clear boardArray
      board[i] = "";
    }
  };

  return { board, boardCells, setBoard, clearBoard };
})();

const Players = (mark) => {
  let markPreviewClass = `${mark}-mark-prev`;
  let markClass = `${mark}-mark`;
  let score = 0;

  const addScore = () => {
    score++;
  };

  const getScore = () => {
    return score;
  };

  return { markClass, markPreviewClass, addScore, getScore };
};

//create Player object instances
const playerX = Players("x");
const playerO = Players("o");
let xTurn = true, isXFirstTurnNextRound = false, turnCount = 1, drawScore = 0;

function addDrawScore() {drawScore++;}
function getDrawScore() {return drawScore;}
function setNextTurnMark(xTurn) {
  let nextTurnPlayerMarkImg = xTurn ? 'icon-o-bg.svg' : 'icon-x-bg.svg';
  document.getElementById('turn-icon').src = `/assets/${nextTurnPlayerMarkImg}`;
}

function startRound() {
  GameBoard.boardCells.forEach((cell) => {
    cell.addEventListener("click", makeMark, { once: true });
    cell.addEventListener("mouseover", showPreviewMark);
    cell.addEventListener("mouseout", hidePreviewMark);
  });
}

function makeMark(e) {
  const cell = e.target;
  //when clicked and there is still a player markPreviewClass, remove it.
  if (
    cell.classList.contains(playerX.markPreviewClass) ||
    cell.classList.contains(playerO.markPreviewClass)
  ) {
    hidePreviewMark(e);
  }
  //set the playerMarkClass whoever player this turn is playing
  let playerMarkClass = xTurn ? playerX.markClass : playerO.markClass;
  cell.classList.add(playerMarkClass);
  GameBoard.setBoard(playerMarkClass);

  //set next turn player mark
  setNextTurnMark(xTurn);

  //if player win end this round and update points
  if (isPlayerWin(playerMarkClass) === true) {
    //add score to the winning player
    if (playerMarkClass === playerX.markClass) {
      playerX.addScore();
    } else {
      playerO.addScore();
    }
    displayWinningMessage(playerMarkClass);
  } else if (turnCount === 9) {
    addDrawScore();
    displayWinningMessage("TIE");
  }
  turnCount++;
  xTurn = !xTurn; //change turn
}

//when mouseover the cell or cell is hovered show current player markPreview image
function showPreviewMark(e) {
  const cell = e.target;
  if (
    !cell.classList.contains(playerX.markClass) &&
    !cell.classList.contains(playerO.markClass)
  ) {
    if (xTurn) {
      cell.classList.add(playerX.markPreviewClass);
    } else {
      cell.classList.add(playerO.markPreviewClass);
    }
  }
}

//when mouse cursor is out the cell hide the current player markPreview image
function hidePreviewMark(e) {
  const cell = e.target;
  if (xTurn) {
    cell.classList.remove(playerX.markPreviewClass);
  } else {
    cell.classList.remove(playerO.markPreviewClass);
  }
}

//show winning message
const displayWinningMessage = (markClass) => {
  //display latest score
  document.getElementById('x-score').innerText = playerX.getScore();
  document.getElementById('tie-score').innerText = getDrawScore();
  document.getElementById('o-score').innerText = playerO.getScore();

  //display winning message
  const winningMessageContainer = document.getElementById(
    "winning-message-wrapper"
  );
  winningMessageContainer.style.display = "flex";

  let resultWinningSign = 
  (markClass === 'x-mark') ? 
  `<img src='assets/icon-x.svg' class="winning-message__winner-container_img">` :
  (markClass === 'o-mark') ?
  `<img src='assets/icon-o.svg' class="winning-message__winner-container_img">` :
  `<span class="winning-message__winner-container_text">TIE</span>`;

  document.getElementById("result").innerHTML = resultWinningSign;
};

//check if current player win
const isPlayerWin = (playerMarkClass) => {
  const winningCombination = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let isWin = false;

  //check if player moves is a winning combination
  winningCombination.forEach((combinations) => {
    if (
      combinations.every(
        (combination) => GameBoard.board[combination] === playerMarkClass
      )
    ) {
      isWin = true;
    }
  });
  return isWin;
};

//next round button eventlistener
const nextRoundBtn = document.getElementById("next-round-btn");
nextRoundBtn.addEventListener("click", () => {
  document.getElementById("winning-message-wrapper").style.display = "none";
  GameBoard.clearBoard(playerX.markClass, playerO.markClass); 
  //reset turn and counts
  xTurn = (isXFirstTurnNextRound) ? true : false;
  isXFirstTurnNextRound = !isXFirstTurnNextRound;
  turnCount = 1;
  setNextTurnMark(isXFirstTurnNextRound);
  startRound();
});

//restartGame

const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

window.onload = () => {
  startRound();
};
