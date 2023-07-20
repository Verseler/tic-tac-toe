let round = 1;

//scores
const scores = {
  X: 0,
  O: 0,
  TIE: 0,
};

/* gameboard module */
let GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const boardBoxes = document.getElementsByClassName("gameboard__box");
  const symbol = {
    X: "icon-x",
    O: "icon-o",
    "x-gray": "icon-x-bg",
    "o-gray": "icon-o-bg",
  };

  return {
    getSymbol: () => {
      return symbol;
    },

    getBoard: () => {
      return board;
    },

    getBoardBoxes: () => {
      return boardBoxes;
    },

    setNextTurnIcon: (key) => {
      //set next turn label
      const turnIcon = document.getElementById("turn-icon");
      turnIcon.src = `assets/${symbol[key]}.svg`;
    },

    //update the Gameboard displayed in the web
    setDisplay: () => {
      for (let i = 0; i < boardBoxes.length; i++) {
        let key = board[i];
        if (board[i] === "") {
          continue;
        } else {
          boardBoxes[i].innerHTML = `<img src="assets/${symbol[key]}.svg" />`;
        }
      }
    },

    //clear board
    clearDisplay: () => {
      round = 1;
      GameBoard.setNextTurnIcon('X');
      for (let i = 0; i < boardBoxes.length; i++) {
        boardBoxes[i].style.backgroundColor = "#1E3640"; //clear winning combination background color
        boardBoxes[i].innerHTML = ""; //clear gameboard display in web
        board[i] = ""; //clear board array
      }
    },

    restartGame: () => {  
      Object.keys(scores).forEach((item) => {
        scores[item] = 0;
      });
      displayScores();
      GameBoard.clearDisplay();
      //!!!!!!add also, clear scores
    },

    //update gamboardArray based on the player move
    setBoard: (movePosition, symbol) => {
      board[movePosition] = symbol;
      //after the move update the displayed gameboard
      GameBoard.setDisplay();
    },

    //verify if player move is valid in gameboard
    moveIsValid: (movePosition) => {
      return board[movePosition] === "" ? true : false;
    },
  };
})();

/* players object using factory function */
let Players = (symbol) => {
  let playerSymbol = symbol;

  const makeMove = (move) => {
    GameBoard.setBoard(move, playerSymbol); //update current player move
  };

  //update the scores of player x, o ,and tie
  const updateScores = (name) => {
    scores[name] = scores[name] + 1;

    //set scores in the web
    displayScores();
    displayWinningMessage(name);
  };

  //verify if win
  const isWin = (round) => {
    let board = GameBoard.getBoard();
    let playerWin = false;
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

    //check if player moves is a winning combination
    winningCombination.forEach((combinations) => {
      if (
        combinations.every((combination) => board[combination] === playerSymbol)
      ) {
        playerWin = true;
        changeBoxBackground(combinations);
        updateScores(playerSymbol);
      }
    });
    //if round is 9 end the game as a TIE
    if (round === 9 && playerWin === false) {
      updateScores("TIE");
    }
  };

  //change the background of box if it is a winning combination
  const changeBoxBackground = (combinations) => {
    let boardBoxes = GameBoard.getBoardBoxes();

    combinations.forEach((index) => {
      boardBoxes[index].style.backgroundColor = "#3b5968";
    });
  };

  return { makeMove, isWin };
};

//popup a winning message after the  end game
const displayWinningMessage = (name) => {
  const symbol = GameBoard.getSymbol();
  const winningMessageContainer = document.getElementById(
    "winning-message-wrapper"
  );
  winningMessageContainer.style.display = "flex";

  const result = document.getElementById("result");
  if (name === "TIE") {
    result.innerHTML = `<span class="winning-message__winner-container_text">TIE</span>`;
  } else {
    result.innerHTML = `<img src="assets/${symbol[name]}.svg" >`;
  }
};

function displayScores() {
  document.getElementById("x-score").innerText = scores["X"];
    document.getElementById("o-score").innerText = scores["O"];
    document.getElementById("tie-score").innerText = scores["TIE"];
}

function gameStart() {
  const player1 = Players("X");
  const player2 = Players("O");
  let boardBoxes = GameBoard.getBoardBoxes();
  let move;

  for (let i = 0; i < boardBoxes.length; i++) {
    boardBoxes[i].addEventListener("click", () => {
      move = boardBoxes[i].getAttribute("data-position");
      //verify first if move is valid before making a move
      if (GameBoard.moveIsValid(move)) {
        if (round % 2 === 0) {
          GameBoard.setNextTurnIcon("x-gray");
          player2.makeMove(move);
          player2.isWin(round);
        } else {
          GameBoard.setNextTurnIcon("o-gray");
          player1.makeMove(move);
          player1.isWin(round);
        }
        round++;
      }
    });
  }
}

//when restart button is press restart the game
const restBtn = document.getElementById("restart-btn");
restBtn.addEventListener("click", () => {
  GameBoard.restartGame();
});

const nextRoundBtn = document.getElementById("next-round-btn");
nextRoundBtn.addEventListener("click", () => {
  const winningMessageContainer = document.getElementById(
    "winning-message-wrapper"
  );
  winningMessageContainer.style.display = "none";
  GameBoard.clearDisplay();
});

window.onload = () => {
  gameStart();
};
