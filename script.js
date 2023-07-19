/* gameboard module */
let GameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const boardBoxes = document.getElementsByClassName("gameboard__box");

  return {
    getBoard : () => {return board},

    getBoardBoxes : () => {return boardBoxes},

    //update the Gameboard displayed in the web
    setDisplay : () => {
        for (let i = 0; i < boardBoxes.length; i++) {
        boardBoxes[i].innerHTML = board[i];
        }
    },

    //clear board
    clearDisplay : () => {
        for (let i = 0; i < boardBoxes.length; i++) {
            boardBoxes[i].innerHTML = "";
        }
    },

    //update gamboardArray based on the player move
    setBoard : (movePosition, symbol) => {
        board[movePosition] = symbol;
        //after the move update the displayed gameboard
        GameBoard.setDisplay(); 
    },

    //verify if player move is valid in gameboard
    moveIsValid : (movePosition) => {
        return board[movePosition] === "" ? true : false;
    }
  };
})();



/* players object using factory function */
let Players = (symbol) => {
  let playerSymbol = symbol;

  const makeMove = (move) => {
    GameBoard.setBoard(move, playerSymbol); //update current player move
    isWin(); //check if current player win the game
  };

  //verify if win
  const isWin = () => {
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
        alert(`${playerSymbol} Win the game`);
      }
    });
  };

  return { makeMove };
};




function gameStart() {
  GameBoard.clearDisplay();
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
          player1.makeMove(move);
        } else {
          player2.makeMove(move);
        }
        round++;
      }
    });
  }
}


window.onload = () => {
    gameStart();
}
