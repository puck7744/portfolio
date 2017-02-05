var _ = require('lodash/core');
var Util = require('./util.js');
var Clouds = require('./clouds.js');

function init() {
  window.scrollTo(0,10); // Attempt to hide the address bar in mobile browsers

  // Enable Javascript navigation
  var links = document.querySelectorAll('.ts-nav a');
  _.forEach(links, function(link) {
    link.addEventListener('click', function(e) {
      // Prevent browser behavior and make the correct slide visible
      e.preventDefault();
      e.stopPropagation();
      Util.loadPage(link.textContent.toLowerCase());
    });
  });

  // Enable history API hook
  window.addEventListener('popstate', function(e) {
    Util.loadPage(e.state.page, false);
  });

  // Prepare home page animation
  Clouds.init();
  Clouds.animate();
}

init();
