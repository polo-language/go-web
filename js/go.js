function go() {
  'use strict';
  buildBoard();

  function Board(boardSize) {
    var col, row;
    this.imgSrc;
    this.grid = new Array(boardSize);
    for (col = 0; col < 9; ++col) {
      this.grid[col] = new Array(9);
      for (row = 0; row < 9; ++row) {
        this.grid[col][row] = new Intersection();
      }
    }
  }

  function Intersection() {
    this.left;
    this.top;
    this.content;
    this.image;
  }

  function buildBoard() {
    var boardSize = 9;
    var boardDiv;
    var theBoard = new Board(boardSize);
    var topMost, leftMost, stoneDiameter,
        intersection,
        col, row;
    try {
      switch (boardSize) {
        case 9:
          theBoard.imgSrc = 'images/board_9x9_550x550.png';
          topMost = 5;
          leftMost = 5;
          stoneDiameter = 60
          break;
        case 13:
          theBoard.imgSrc = 'images/board_13x13_550x550.png';
          break;
        case 19:
          theBoard.imgSrc = 'images/board_19x19_550x550.png';
          break;
        default:
          throw 'Invalid boardSize passed to makeBoard()';        
      }
      // set intersection coordinates
      for (col = 0; col < 9; ++col) {
        for (row = 0; row < 9; ++row) {
          intersection = theBoard.grid[col][row];
          intersection.top = topMost + stoneDiameter * row;
          intersection.left = leftMost + stoneDiameter * col;
        }
      }
      // set board background image
      boardDiv = document.getElementById('board_img');
      boardDiv.src = theBoard.imgSrc;
    } catch(e) {
      console.error('Unable to load board!');
      console.log(e);
    }
  }
}






