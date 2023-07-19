/* gameboard module */
let GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const boardBoxes = document.getElementsByClassName("gameboard__box");
  const symbol = {
    X: "assets/icon-x.svg",
    O: "assets/icon-o.svg",
    "x-gray": "assets/icon-x-gray.svg",
    "o-gray": "assets/icon-o-gray.svg",
  };

  //when restart button is press restart the game
  const restBtn = document.getElementById('restart-btn');
  restBtn.addEventListener(('click'), () => {
    console.log(1);
    GameBoard.restartGame();
  });

  return {
    getBoard: () => {
      return board;
    },

    getBoardBoxes: () => {
      return boardBoxes;
    },

    setNextTurnIcon: (iconName) => {
      const turnIcon = document.getElementById("turn-icon");
      turnIcon.src = symbol[iconName];
    },

    //update the Gameboard displayed in the web
    setDisplay: () => {
      for (let i = 0; i < boardBoxes.length; i++) {
        let key = board[i];
        if (board[i] === "") {
          continue;
        } else {
          boardBoxes[i].innerHTML = `<img src="${symbol[key]}" />`;
        }
      }
    },

    //clear board
    clearDisplay: () => {
      for (let i = 0; i < boardBoxes.length; i++) {
        boardBoxes[i].innerHTML = ""; //clear gameboard display in web
        board[i] = ""; //clear board array
      }
    },

    restartGame: () => {
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

  //verify if win
  const isWin = (round) => {
    let board = GameBoard.getBoard();
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
        changeBoxBackground(combinations);
        alert(`${playerSymbol} Win the game`);
      }
    });

    //if round is 9 end the game as a TIE
    if (round === 9) {
      alert(` TIE `);
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

function gameStart() {
  const player1 = Players("X");
  const player2 = Players("O");
  let boardBoxes = GameBoard.getBoardBoxes();
  let move,
    round = 1;

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

window.onload = () => {
  gameStart();
};
