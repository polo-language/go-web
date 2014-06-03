// __main__:
function go() {
  'use strict';
  // 'global' consts:
  var theBoard;
  var stoneImages = {white: '', black: ''};
  var playerColor = 'white';

  buildBoard(theBoard, 9);
  //TEST__placeStones(theBoard);

  // Templates:
  function Board(boardSize, imgPath) {
    var t, c, r;
    this.imgSrc = imgPath;
    this.generateTableHtml = function () {
      var t = '<table id="table">';
      for (c = 0; c < boardSize; ++c) {
        t += '<tr>';
        for (r = 0; r < boardSize; ++r) {
          t += '<td id="cell_' + this.getCellNum(c, r) + '" class="cell"></td>';
        }
        t += '</tr>';
      }
      t += '</table>';
      return t;
    };
    this.getCellNum = function (col, row) {
      if (col >= boardSize || row >= boardSize)
        throw new RangeError('Invalid col or row in getCellNum()');
      return col*boardSize + row;
    };
    this.getColRow = function (cellNum) {
      if (cellNum > boardSize - 1)
        throw new RangeError('Invalid cellNum in getColRow()');
      return [cellNum % (boardSize -1), Math.floor(cellNum/boardSize)];
    };
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
    var boardDiv = document.getElementById('board');
    switch (boardSize) {
      case 9:
        theBoard = new Board(boardSize, 'images/board_9x9_550x550.png');
        stoneImages.white = 'images/stone_white_55x55.png';
        stoneImages.black = 'images/stone_black_55x55.png';
        topMost = 5;
        leftMost = 5;
        stoneDiameter = 60;
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
    // set board background HTML data
    boardDiv.style.backgroundImage = 'url("' + theBoard.imgSrc + '")';
    boardDiv.innerHTML = theBoard.generateTableHtml();
    $('.cell').click(function () {
      //TODO: make stone color dynamic:
      $(this).css({'background-image': 'url("' + stoneImages[playerColor] + '")',
                   'background-repeat': 'no-repeat',
                   'background-position': 'center center'});
      togglePlayerColor();
    });
  }

  function togglePlayerColor() {
    if (playerColor === 'white')
      playerColor = 'black';
    else
      playerColor = 'white';
  }
  /*function placeStone(theBoard, col, row, color) {
    var intersection = theBoard.grid[col][row];
      if (color !== 'w' && color !== 'b')
        throw 'Invalid color passed to placeStone()';
      intersection.stone = color;    
  }

  function TEST__placeStones(theBoard) {
    var intersections = [[0,0, 'w'], [4,2, 'w'], [8,3, 'b']];

  }*/
} // END: go()


