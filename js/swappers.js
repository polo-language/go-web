'use strict';
var swappers = {
  swapBoardForSelector: function () {
    $('#selector').animate({'top': '1000px'}, 1500);
    $('#game').animate({'top': '0px'}, 1500);
  },
  swapSelectorForBoard: function () {
    $('#game').animate({'top': '1000px'}, 1500);
    $('#selector').animate({'top': '0px'}, 1500);
  }
};
