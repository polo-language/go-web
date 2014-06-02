// global consts:
var whiteStoneImg;
var blackStoneImg;

// __main__:
function go() {
  'use strict';
  var theBoard;

  buildBoard(theBoard, 9);
  //TEST__placeStones(theBoard);

  // Templates:
  function Board(boardSize) {
    var col, row;
    this.imgSrc;
    this.grid = new Array(boardSize);
    for (col = 0; col < boardSize; ++col) {
      this.grid[col] = new Array(boardSize);
      for (row = 0; row < boardSize; ++row) {
        this.grid[col][row] = new Intersection();
      }
    }
  }

  function Intersection() {
    this.left;
    this.top;
    this.stone;
    this.image;
  }

  // Methods:
  function buildBoard(theBoard, boardSize) {
    var topMost, leftMost, stoneDiameter,
        intersection,
        col, row;
    //var boardHtml = '';
    var boardDiv = document.getElementById('board');
    switch (boardSize) {
      case 9:
        theBoard = new Board(boardSize);
        theBoard.imgSrc = 'images/board_9x9_550x550.png';
        whiteStoneImg = 'images/stone_white_60x60.png';
        blackStoneImg = 'images/stone_black_60x60.png';
        topMost = 5;
        leftMost = 5;
        stoneDiameter = 60
        //boardDiv.style.padding = "5px";
        break;
      case 13:
        theBoard = new Board(boardSize);
        theBoard.imgSrc = 'images/board_13x13_550x550.png';
        break;
      case 19:
        theBoard = new Board(boardSize);
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
        //boardHtml += '<div class="cell"></div>';
      }
    }
    // set board background image
    boardDiv.style.backgroundImage = 'url("' + theBoard.imgSrc + '")';
  }

  function placeStone(theBoard, col, row, color) {
    var intersection = theBoard.grid[col][row];
      if (color !== 'w' && color !== 'b')
        throw 'Invalid color passed to placeStone()';
      intersection.stone = color;    
  }

  function TEST__placeStones(theBoard) {
    var intersections = [[0,0, 'w'], [4,2, 'w'], [8,3, 'b']];

  }
} // END: go()


