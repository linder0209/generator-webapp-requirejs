#/*global require*/
'use strict'

require.config
  baseUrl: './scripts'
  shim: {<% if (includeBootstrap) { %>
    bootstrap:
      deps: ['jquery'],
      exports: 'jquery'<% } %><% if (templateFramework === 'handlebars') { %>
    handlebars:
      exports: 'Handlebars'<% } %>
  }
  paths:
    jquery: '../bower_components/jquery/dist/jquery'
    lodash: '../bower_components/lodash/dist/lodash'<% if (includeBootstrap) { %>
    bootstrap: '../bower_components/bootstrap/dist/js/bootstrap'<% } %><% if (templateFramework === 'handlebars') { %>
    handlebars: '../bower_components/handlebars/handlebars'<% } %>

require [
  'jquery',<% if (templateFramework === 'lodash') { %>
  'lodash',<% } else if (templateFramework === 'mustache'){ %>
  'mustache',<% } else { %>
  'handlebars',<% } %><% if ('includeBootstrap') { %>
  'bootstrap'<% } %>
], ($) ->

