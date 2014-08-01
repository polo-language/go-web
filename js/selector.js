$(document).ready(function () {
  animateSelector();
});

function animateSelector() {
  var wrapper = $('#wrapper');
  var startLeft = wrapper.offset().left + wrapper.width() + 10;
  //var selectorPanel = document.getElementById('selector_panel');
  //selectorPanel.setAttribute(...);
  var selectorPanel = $('#selector_panel');
  selectorPanel.css({
    'left': startLeft,
    'visibility': 'visible',
  });
  selectorPanel.animate({'left': 0}, 1000,  scrollImages());
}

function scrollImages() {
  $('.hero_img').animate({'left': 0}, 70000);
}

function submitSelection() {
  var boardSize = $('input[name=board_size]:checked').val();
  var handicapEl = document.getElementById('handicap_listbox');
  var handicap = handicapEl.options[handicapEl.selectedIndex].value;

  go(boardSize, handicap); // in game.js
  swapBoardForSelector(); // in swappers.js
}

$(document).ready(function () {
  $('#submit_button').hover(
    function () {
      $(this).css('background-image', 'url(images/stone_white_55x55_hover.png)');
    },
    function () {
      $(this).css('background-image', 'url(images/stone_white_55x55.png)');
    }
  );
});
