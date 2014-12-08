var GO_CONSTS = {
  stoneImages: {w: 'images/stone_white_55x55.png', b: 'images/stone_black_55x55.png'},
  cursorImages: {
    '9': {w: 'images/cursors/cursor_w_65.png', b: 'images/cursors/cursor_b_65.png'},
    '13': {w: 'images/cursors/cursor_w_44.png', b: 'images/cursors/cursor_b_44.png'},
    '19': {w: 'images/cursors/cursor_w_29.png', b: 'images/cursors/cursor_b_29.png'}
  },
  cursorOffsets: { '9': 22, '13': 17, '19': 10 },
  boardImages: {
    '9': 'images/board_9x9.png',
    '13': 'images/board_13x13.png',
    '19': 'images/board_19x19.png'
  },
  handicaps: {
    '9': [[6, 2], [2, 6], [6, 6], [2, 2], [4, 4]],
    '13': [[9, 3], [3, 9], [9, 9], [3, 3], [6, 6]],
    '19': [[15, 3], [3, 15], [15, 15], [3, 3], [9, 9]]
  },
};

var GO_STRINGS = {
  // TODO: ?
};

function go(boardSize, handicap) {
  'use strict';
  // 'global' consts:
  var intersections = [],
      moves = [],
      playerColor,
      timeoutId;

  var theBoard = buildBoard(parseInt(boardSize));

  function buildBoard(boardSize, handicap) {
    // controls interaction between page and board object
    var boardDiv = document.getElementById('board'),
        board = new Board(boardSize, handicap);
    
    // set board and table HTML and CSS
    boardDiv.style.backgroundImage = 'url("' + board.imgSrc + '")';
    boardDiv.style.backgroundSize = '100% 100%';
    boardDiv.innerHTML = board.tableHtml;
    placeHandicaps(boardSize, handicap);
    board.setPlayerColor('b');
    $('#table').css(board.tableCss);
    $('.cell').click(function () {
      placeStone(this);
    });
    return board;
  }
  
  function Board(boardSize, handicap) {
    var lastCellNum = boardSize * boardSize - 1;

    function getCellNum(col, row) {
      if (col >= boardSize || row >= boardSize) 
        throw new RangeError('Invalid col or row in getCellNum()');
      return col * boardSize + row;
    }
    
    this.getColRow = function (cellNum) {
      if (cellNum > lastCellNum)
        throw new RangeError('Invalid cellNum in getColRow()');
      return [cellNum % boardSize, Math.floor(cellNum / boardSize)];
    };
    
    this.setPlayerColor = function (newColor) {
      playerColor = newColor;
      document.getElementById('board').style.cursor = 
          'url(' + GO_CONSTS.cursorImages[boardSize][playerColor] + ') ' +
          GO_CONSTS.cursorOffsets[boardSize] + ' ' +
          GO_CONSTS.cursorOffsets[boardSize] + ', crosshair';
    };

    this.togglePlayerColor = function () {
      if (playerColor === 'w')
        this.setPlayerColor('b');
      else
        this.setPlayerColor('w');
    };

    this.imgSrc = GO_CONSTS.boardImages[boardSize];

    this.tableCss = (function () {
      switch (boardSize) {
      case 9:
        return {
          'width': '603px',
          'height': '603px',
          'margin': '5px',
        };
      case 13:
        return {
          'width': '605px',
          'height': '605px',
          'margin': '5px',
        };
      case 19:
        return {
          'width': '590px',
          'height': '590px',
          'margin': '10px 0 0 15px',
        };
      }
    }());

    this.tableHtml = (function () {
      var t = '<table id="table">';
      for (var c = 0; c < boardSize; ++c) {
        t += '<tr>';
        for (var r = 0; r < boardSize; ++r) {
          t += '<td id="cell_' + getCellNum(c, r) + '" class="cell"></td>';
        }
        t += '</tr>';
      }
      t += '</table>';
      return t;
    }());
  } // end: Board()

  // TODO:
  // id="cell_' + getCellNum(c, r)
  function placeHandicaps(boardSize, handicap) {
    var handicapCoords;
    switch (boardSize) {
    case 9:
      //handicapCoords = 
      break;
    case 13:
      break;
    case 19:
      break;
    }
  }

  function placeStone(clickedCell) {
    // TODO: set up board locking while waiting for async server response
    var cellNum = clickedCell.id.split('_')[1]; // get number after underscore
    
    if (intersections[cellNum] === 'w' || intersections[cellNum] === 'b')
      return;

    intersections[cellNum] = playerColor;
    moves[moves.length] = Number(cellNum);
    $(clickedCell).css({
        'background-image': 'url("' + GO_CONSTS.stoneImages[playerColor] + '")',
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%',
        'background-position': 'center center'
    });
    // TODO: submitMove(theBoard.getColRow(cellNum));
    theBoard.togglePlayerColor();
  }

  // button click handlers
  // pass (move)
  document.getElementById('pass_button').onclick = function () {
    // TODO: submitMove();
    if (playerColor === 'w')
      flashMessageBox('White Passes');
    else
      flashMessageBox('Black Passes');
    moves[moves.length] = 'pass';
    theBoard.togglePlayerColor();
  };

  function flashMessageBox(message) {
    var messageDiv = document.getElementById('messages');
    window.clearTimeout(timeoutId);
    messageDiv.innerHTML = message;
    messageDiv.style.visibility = 'visible';
    timeoutId = window.setTimeout(function () {
      messageDiv.style.visibility = 'hidden';
    }, 2000);
  }

  // undo move
  document.getElementById('undo_button').onclick = function () {
    var lastMove = moves.pop();
    if (typeof lastMove === 'number') {
      var cellId = 'cell_' + lastMove;
      document.getElementById(cellId).style.backgroundImage = 'none';
      intersections[lastMove] = '';
      if (playerColor === 'w') // undo move of previous color
        flashMessageBox('Undo Black\'s Move');
      else
        flashMessageBox('Undo White\'s Move');
      theBoard.togglePlayerColor();
      // TODO: submitMove();
    }
    else if (lastMove === 'pass') {
      // TODO: submitMove();
      theBoard.togglePlayerColor();
    }
    return; // handles pop from empty array too
  };

  // restart/clear board
  document.getElementById('restart_button').onclick = function () {
    // should initiate some grander restart procedure with settings screen...
    // TODO: restartServer();
    intersections = [];
    moves = [];
    $('.cell').css('backgroundImage', 'none');
    theBoard.setPlayerColor('w');
    flashMessageBox('Game Reset');
    swappers.swapSelectorForBoard(); // in swappers.js
  };

  /*function submitMove(colAndRow) {
    $.ajax({
      type: 'GET',
      url: '/move',
      data: {
        'col': colAndRow[0],
        'row': colAndRow[1],
      },
      success: function(response) {
        // TODO: handle computer move here
        console.log(response);
      },
      error: function() {
        throw 'Unable to connect to go engine.';
      }
    });
  }*/

} // END: go()


