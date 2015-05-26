window.<%= _.camelize(appname) %> =
  init: ->
    'use strict'
    console.log 'Hello from Webapp Requirejs!'

$ ->
  'use strict'
  <%= _.camelize(appname) %>.init();
