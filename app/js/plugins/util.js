'use strict';

window.util = (function () {
  return {
    setMaxHeight: function (selector) {
      var maxHeight;
      var elements = document.querySelectorAll(selector);

      if (!elements.length) {
        return;
      }

      // Array.from(elements).forEach(function findMaxHeight(it) {
      //   maxHeight = (maxHeight > it.clientHeight) ? maxHeight : it.clientHeight;
      // });
      maxHeight = Array.from(elements).reduce(function findMaxHeight(prevValue, currentValue) {
        return (prevValue > currentValue) ? prevValue : currentValue;
      }, 0);

      Array.from(elements).forEach(function specifyMaxHeight(it) {
        it.style.height = maxHeight + 'px';
      });
    }
  }
})();
