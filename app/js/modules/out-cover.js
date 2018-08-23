window.outCover = (function() {
  'use strict';

  var $ = window.jQuery;
  var outCover = document.querySelector('.out-cover');
  var outCoverBody = outCover.querySelector('.out-cover__body');
  var outCoverMobileNavWrapper = outCover.querySelector(
    '.out-cover__mobile-nav-wrapper'
  );
  var outCoverFooter = outCover.querySelector('.out-cover__footer');
  var outCoverToggle = document.querySelector('.out-cover-toggle');
  var scrollWidth = window.util.getScrollbarWidth();
  var scrollPageValue = 0;

  var onOutCoverEscPress = function(event) {
    if (event.keyCode === window.util.KEYCODE_ESC) {
      hideOutCover();
    }
  };

  var showOutCover = function() {
    scrollPageValue = window.pageYOffset;
    document.body.classList.add('no-scroll', 'is-out-cover-opened');
    outCoverToggle.classList.add('out-cover-toggle--fired');
    outCover.classList.add('out-cover--opened');
    document.addEventListener('keydown', onOutCoverEscPress);
  };

  var hideOutCover = function() {
    outCover.classList.remove('out-cover--opened');
    document.body.classList.remove('no-scroll', 'is-out-cover-opened');
    outCoverToggle.classList.remove('out-cover-toggle--fired');
    window.scrollTo(0, scrollPageValue);
    document.removeEventListener('keydown', onOutCoverEscPress);
  };

  outCoverToggle.addEventListener('click', function(event) {
    event.preventDefault();

    if (!this.classList.contains('out-cover-toggle--fired')) {
      showOutCover();
    } else {
      hideOutCover();
    }
  });

  return {
    mainNavWrapper: outCoverMobileNavWrapper,
    show: showOutCover,
    hide: hideOutCover
  };
})();
