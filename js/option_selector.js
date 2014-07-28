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
  var heroDivTop = $('.hero_img');
  heroDivTop.animate({'left': 0}, 60000);
}

function submitSelection() {
	var handicapEl = document.getElementById('handicap_listbox');
	var handicap = handicapEl.options[handicapEl.selectedIndex].value;
	var boardSize = $('input[name=board_size]:checked').val();
	var quit = false;
	if (handicap === undefined) {
		$('#handicap_selector_label').css('color', 'red');
		quit = true;
	} else {
		$('#handicap_selector_label').css('color', 'white');
	}
	if (boardSize === undefined) {
		$('#board_selector_label').css('color', 'red');
		quit = true;
	} else {
		$('#board_selector_label').css('color', 'white');
	}

	if (quit === true)
		return;
	else
		loadBoardPage();
}

function loadBoardPage() {
	alert('Dummy box!');
}
