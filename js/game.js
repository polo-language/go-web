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
  tableCss: {
    '9': { 'width': '603px', 'height': '603px', 'margin': '5px' },
    '13': { 'width': '605px', 'height': '605px', 'margin': '5px' },
    '19': { 'width': '590px', 'height': '590px', 'margin': '10px 0 0 15px' }
  },
};

function go(boardSize, handicap) {
  'use strict';
  // 'global' consts:
  var intersections = [],
      moves = [],
      playerColor,
      timeoutId;

  var boardDiv = document.getElementById('board');
  
  // set board and table HTML and CSS
  boardDiv.style.backgroundImage = 'url("' + GO_CONSTS.boardImages[boardSize] + '")';
  boardDiv.style.backgroundSize = '100% 100%';
  boardDiv.innerHTML = (function () {
    var t = '<table id="table">';
    for (var r = 0; r < boardSize; ++r) {
      t += '<tr>';
      for (var c = 0; c < boardSize; ++c) {
        t += '<td id="cell_' + getCellNum(c, r) + '" class="cell"></td>';
      }
      t += '</tr>';
    }
    t += '</table>';
    return t;
  }());
  setPlayerColor('b');
  placeHandicaps(boardSize, handicap);
  $('#table').css(GO_CONSTS.tableCss[boardSize]);
  $('.cell').click(function () {
    placeStone(this);
  });

  function placeHandicaps(boardSize, handicap) {
    for (var i = 0; i < parseInt(handicap); ++i) {
      var cellId = 'cell_' + getCellNum(GO_CONSTS.handicaps[boardSize][i][0],
                                        GO_CONSTS.handicaps[boardSize][i][1]);
      setPlayerColor('b');
      placeStone(document.getElementById(cellId));
    }
    setPlayerColor('w');
  }

  function placeStone(clickedCell) {
    var cellNum = clickedCell.id.split('_')[1]; // get number after underscore
    
    if (intersections[cellNum] === 'w' || intersections[cellNum] === 'b')
      return;

    intersections[cellNum] = playerColor;
    moves[moves.length] = Number(cellNum);
    clickedCell.style.backgroundImage = 'url("' + GO_CONSTS.stoneImages[playerColor] + '")';
    togglePlayerColor();
  }

  function getCellNum(col, row) {
    if (col >= boardSize || row >= boardSize) 
      throw new RangeError('Invalid col or row in getCellNum()');
    return col + boardSize * row;
  }

  function setPlayerColor(newColor) {
    playerColor = newColor;
    document.getElementById('board').style.cursor = 
        'url(' + GO_CONSTS.cursorImages[boardSize][playerColor] + ') ' +
        GO_CONSTS.cursorOffsets[boardSize] + ' ' +
        GO_CONSTS.cursorOffsets[boardSize] + ', crosshair';
  }

  function togglePlayerColor() {
    if (playerColor === 'w')
      setPlayerColor('b');
    else
      setPlayerColor('w');
  }

  //////////////////////////////////////////////////////////////
  // button click handlers

  function flashMessageBox(message) {
    var messageDiv = document.getElementById('messages');
    window.clearTimeout(timeoutId);
    messageDiv.innerHTML = message;
    messageDiv.style.visibility = 'visible';
    timeoutId = window.setTimeout(function () {
      messageDiv.style.visibility = 'hidden';
    }, 2000);
  }

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
      togglePlayerColor();
    }
    else if (lastMove === 'pass') {
      togglePlayerColor();
    }
    return; // handles pop from empty array too
  };

  // restart/clear board
  document.getElementById('restart_button').onclick = function () {
    intersections = [];
    moves = [];
    $('.cell').css('backgroundImage', 'none');
    setPlayerColor('w');
    flashMessageBox('Game Reset');
    swappers.swapSelectorForBoard(); // in swappers.js
  };

  /* Not used:
  function getColRow(cellNum) {
    //var lastCellNum = boardSize * boardSize - 1;
    if (cellNum > lastCellNum)
      throw new RangeError('Invalid cellNum in getColRow()');
    return [cellNum % boardSize, Math.floor(cellNum / boardSize)];
  };*/

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
