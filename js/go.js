// __main__:
function go() {
  'use strict';
  // 'global' consts:
  var theBoard,
      intersections = [],
      moves = [],
      stoneImages = {w: '', b: ''},
      playerColor = 'w';

  buildBoard(theBoard, 9);

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
      placeStone(this);
    });
  }

  function placeStone(that) {
    var cellNum = that.id.split('_')[1]; // get number after underscore
    if (intersections[cellNum] === 'w' || intersections[cellNum] === 'b')
      return;
    intersections[cellNum] = playerColor;
    moves[moves.length] = Number(cellNum);
    console.log(moves);
    $(that).css({'background-image': 'url("' + stoneImages[playerColor] + '")',
                   'background-repeat': 'no-repeat',
                   'background-position': 'center center'});
    // TODO: submitMoveToServer();
    togglePlayerColor();
  }

  function togglePlayerColor() {
    if (playerColor === 'w')
      playerColor = 'b';
    else
      playerColor = 'w';
  }

  // button click handlers
  document.getElementById('pass_button').onclick = function () {
    // TODO: submitMoveToServer();
    moves[moves.length] = 'pass';
    togglePlayerColor();
  };

  document.getElementById('undo_button').onclick = function () {
    var lastMove = moves.pop();
    if (typeof lastMove === 'number') {
      var cellId = 'cell_' + lastMove;
      document.getElementById(cellId).style.backgroundImage = 'none';
      intersections[lastMove] = '';
      togglePlayerColor();
      // TODO: submitMoveToServer();
    }
    else if (lastMove === 'pass') {
      // TODO: submitMoveToServer();
      togglePlayerColor();
    }
    return; // handles pop from empty array too
  };

  document.getElementById('restart_button').onclick = function () {
    // should generate some grander restart procedure with eventual settings screen...
    // TODO: restartServer();
    intersections = [];
    moves = [];
    $('.cell').css('backgroundImage', 'none');
  };

} // END: go()


