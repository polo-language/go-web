function swapBoardForSelector() {
  $('#selector').animate({'top': '1000px'}, 1500);
  $('#game').animate({'top': '0px'}, 1500);
}

function swapSelectorForBoard() {
  $('#game').animate({'top': '1000px'}, 1500);
  $('#selector').animate({'top': '0px'}, 1500);
}
