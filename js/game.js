// TESTING:
function runGo() {
  go(9, 0);
}

function go(boardSize, handicap) {
  'use strict';
  // 'global' consts:
  var intersections = [],
      moves = [],
      stoneImages = {w: '', b: ''},
      playerColor = 'w',
      boardLocked = false;

  var theBoard = buildBoard(parseInt(boardSize));
  // TODO: move these above since not set individually per board
  stoneImages.w = 'images/stone_white_55x55.png';
  stoneImages.b = 'images/stone_black_55x55.png';
        

  // Templates:
  function Board(boardSize, imgPath) {
    this.imgSrc = imgPath;
    var lastCellNum = boardSize * boardSize - 1;

    this.generateTableHtml = function () {
      var t = '<table id="table">';
      for (var c = 0; c < boardSize; ++c) {
        t += '<tr>';
        for (var r = 0; r < boardSize; ++r) {
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
      if (cellNum > lastCellNum)
        throw new RangeError('Invalid cellNum in getColRow()');
      return [cellNum % boardSize, Math.floor(cellNum/boardSize)];
    };
  }

  // Methods:
  function buildBoard(boardSize) {
    var boardDiv = document.getElementById('board'),
        board,
        tableCss;
    
    switch (boardSize) {
      case 9:
        board = new Board(boardSize, 'images/board_9x9_550x550.png');
        tableCss = {
          'width': '603px',
          'height': '603px',
          'margin': '5px',
        };
        break;
      case 13:
        board = new Board(boardSize, 'images/board_13x13.png');
        tableCss = {
          'width': '605px',
          'height': '605px',
          'margin': '5px',
        };
        break;
      case 19:
        board = new Board(boardSize, 'images/board_19x19.png');
        tableCss = {
          'width': '590px',
          'height': '590px',
          'margin': '10px 0 0 15px',
        };
        break;
      default:
        throw 'Invalid board size.';        
    }
    // set board and table HTML and CSS
    boardDiv.style.backgroundImage = 'url("' + board.imgSrc + '")';
    boardDiv.style.backgroundSize = '100% 100%';
    boardDiv.innerHTML = board.generateTableHtml();
    setPlayerColor('w');
    $('#table').css(tableCss);
    $('.cell').click(function () {
      placeStone(this);
    });
    return;
  }

  function placeStone(that) {
    var cellNum = that.id.split('_')[1]; // get number after underscore
    // check if booardLocked === true || ...
    if (intersections[cellNum] === 'w' || intersections[cellNum] === 'b')
      return;
    //boardLocked = true;
    intersections[cellNum] = playerColor;
    moves[moves.length] = Number(cellNum);
    //console.log(moves); // debug
    //console.log(theBoard.getColRow(cellNum));
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
    togglePlayerColor();
  }

  function togglePlayerColor() {
    if (playerColor === 'w')
      setPlayerColor('b');
    else
      setPlayerColor('w');
  }

  function setPlayerColor(newColor) {
    playerColor = newColor;
    document.getElementById('board').style.cursor = 'url(images/cursor_' + playerColor + '.png) 10 10, crosshair';
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
    togglePlayerColor();
  };

  function flashMessageBox(message) {
    var messageDiv = document.getElementById('messages');
    messageDiv.innerHTML = message;
    messageDiv.style.visibility = 'visible';
    window.setTimeout(function () {
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
      togglePlayerColor();
      // TODO: submitMove();
    }
    else if (lastMove === 'pass') {
      // TODO: submitMove();
      togglePlayerColor();
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
    setPlayerColor('w');
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


