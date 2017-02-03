var _ = require('lodash/core');
var Clouds = require('./clouds.js');

module.exports.loadPage = function(page, history) {
  // Find and activate the correct slide using CSS
  _.forEach(document.querySelectorAll('.ts-slide'), function(slide) {
    if (slide.id == page) slide.classList.add('ts-slide-active');
    else slide.classList.remove('ts-slide-active');
  });

  // Update the links so that only the current page has the active class
  _.forEach(document.querySelectorAll('.ts-nav a'), function(link) {
    if (link.textContent.toLowerCase() == page) link.classList.add('ts-nav-active');
    else link.classList.remove('ts-nav-active');
  });

  // Clear hash to trigger reflow of :target selectors
  window.location.hash = '';

  // Push a new history state on Javascript enabled browsers by default
  if (history || history === undefined)
    window.history.pushState({ 'page': page }, "", page);

  // Resume WebGL animation when switching back to home
  if (page == 'home') Clouds.animate();
}
