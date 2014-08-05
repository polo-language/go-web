// TESTING:
function runGo() {
  go(9, 0);
}

function go(boardSize, handicap) {
  'use strict';
  // 'global' consts:
  var intersections = [],
      moves = [],
      stoneImages = {w: 'images/stone_white_55x55.png', b: 'images/stone_black_55x55.png'},
      //cursorImages = {w: 'images/cursor_w.png', b: 'images/cursor_b.png'},
      playerColor = 'w',
      boardLocked = false,
      timeoutId;

  var theBoard = buildBoard(parseInt(boardSize));
  
  // Templates:
  function Board(boardSize, imgPath) {
    var lastCellNum = boardSize * boardSize - 1;

    function getCellNum(col, row) {
      if (col >= boardSize || row >= boardSize)
        throw new RangeError('Invalid col or row in getCellNum()');
      return col*boardSize + row;
    };
    
    this.getColRow = function (cellNum) {
      if (cellNum > lastCellNum)
        throw new RangeError('Invalid cellNum in getColRow()');
      return [cellNum % boardSize, Math.floor(cellNum/boardSize)];
    };

    this.imgSrc = function () {
      switch (boardSize) {
        case 9:
          return 'images/board_9x9.png';
        case 13:
          return 'images/board_13x13.png';
        case 19:
          return 'images/board_19x19.png';
        default: // Only need on first switch
          throw 'Invalid board size.';
      }
    }( );

    this.tableCss = function () {
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
    }( );

    this.tableHtml = function () {
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
    }( );

    this.cursorImages = function () {
      switch (boardSize) {
        case 9:
          return {w: 'images/cursors/cursor_w_65.png', b: 'images/cursors/cursor_b_65.png'};
        case 13:
          return {w: 'images/cursors/cursor_w_44.png', b: 'images/cursors/cursor_b_44.png'};
        case 19:
          return {w: 'images/cursors/cursor_w_29.png', b: 'images/cursors/cursor_b_29.png'};
      }
    }( );

    this.togglePlayerColor = function () {
      if (playerColor === 'w')
        this.setPlayerColor('b');
      else
        this.setPlayerColor('w');
    };

    this.setPlayerColor = function (newColor) {
      var offset;
      switch (boardSize) {
        case 9:
          offset = 22;
          break;
        case 13:
          offset = 17;
          break;
        case 19:
          offset = 10;
          break;          
      }
      return function (newColor) {
        playerColor = newColor;
        document.getElementById('board').style.cursor = 'url(' + this.cursorImages[playerColor] + ') ' + offset + ' ' + offset + ', crosshair';
      };
    }( );
  } // end: Board()

  // Methods:
  function buildBoard(boardSize) {
    // controls interaction between page and board object
    var boardDiv = document.getElementById('board'),
        board = new Board(boardSize),
        tableCss;
    
    // set board and table HTML and CSS
    boardDiv.style.backgroundImage = 'url("' + board.imgSrc + '")';
    boardDiv.style.backgroundSize = '100% 100%';
    boardDiv.innerHTML = board.tableHtml;
    board.setPlayerColor('w');
    $('#table').css(board.tableCss);
    $('.cell').click(function () {
      placeStone(this);
    });
    return board;
  }

  function placeStone(that) {
    var cellNum = that.id.split('_')[1]; // get number after underscore
    // check if booardLocked === true || ...
    if (intersections[cellNum] === 'w' || intersections[cellNum] === 'b')
      return;
    //boardLocked = true;
    intersections[cellNum] = playerColor;
    moves[moves.length] = Number(cellNum);
    $(that).css({'background-image': 'url("' + stoneImages[playerColor] + '")',
                 'background-repeat': 'no-repeat',
                 'background-size': '100% 100%',
                 'background-position': 'center center'});
    // TODO:
    /*try {
      //submitMove(theBoard.getColRow(cellNum));
    }
    finally {
      boardLocked = false;
    }*/
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

  // undo (move)
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
    // should initiate some grander restart procedure with eventual settings screen...
    // TODO: restartServer();
    intersections = [];
    moves = [];
    $('.cell').css('backgroundImage', 'none');
    theBoard.setPlayerColor('w');
    flashMessageBox('Game Reset');
    swapSelectorForBoard(); // in swappers.js
  };

  function submitMove(colAndRow) {
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
  }

} // END: go()


