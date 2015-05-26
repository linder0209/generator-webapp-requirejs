/*global <%= _.camelize(appname) %>, $*/
window.<%= _.camelize(appname) %> = {
  init: function () {
    'use strict';
    console.log('Hello from Webapp Requirejs!');
  }
};

$(document).ready(function () {
  'use strict';
  <%= _.camelize(appname) %>.init();
});
