// __main__:
function go() {
  'use strict';
  // 'global' consts:
  var theBoard;
  var stoneImages = {w: '', b: ''};
  var playerColor = 'w';

  buildBoard(theBoard, 9);

  // Templates:
  function Board(boardSize, imgPath) {
    var t, c, r;
    this.imgSrc = imgPath;
    this.intersections = [];

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

  // Methods:
  function buildBoard(theBoard, boardSize) {
    var tableCss;
    var boardDiv = document.getElementById('board');
    switch (boardSize) {
      case 9:
        theBoard = new Board(boardSize, 'images/board_9x9_550x550.png');
        stoneImages.w = 'images/stone_white_55x55.png';
        stoneImages.b = 'images/stone_black_55x55.png';
        tableCss = {'width': '530px',
                    'height': '530px',
                    'margin': '10px'};
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
    // set board and table HTML and CSS
    boardDiv.style.backgroundImage = 'url("' + theBoard.imgSrc + '")';
    boardDiv.innerHTML = theBoard.generateTableHtml();
    $('#table').css(tableCss);
    $('.cell').click(function () {
      placeStone(theBoard, this);
    });
  }

  function togglePlayerColor() {
    if (playerColor === 'w')
      playerColor = 'b';
    else
      playerColor = 'w';
  }

  function placeStone(theBoard, that) {
    var cellNum = that.id.split('_')[1]; // get number after underscore
    if (theBoard.intersections[cellNum] === 'w' || theBoard.intersections[cellNum] === 'b')
      return;
    theBoard.intersections[cellNum] = playerColor;
    $(that).css({'background-image': 'url("' + stoneImages[playerColor] + '")',
                   'background-repeat': 'no-repeat',
                   'background-position': 'center center'});
    togglePlayerColor();
  }
} // END: go()


