

function go() {
  'use strict';
  try {
    loadBoard("9x9");
  } catch(e) {
    console.error('Unable to load board!');
    console.log(e);
  }
  

}

function loadBoard(boardSize) {
  var board = document.getElementById('board_img');
  switch (boardSize) {
    case "9x9":
    case "13x13":
    case "19x19":
    default:
      board.src('../images/board_9x9_550x550.png');
  }
}