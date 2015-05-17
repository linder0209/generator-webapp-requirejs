'use strict';
//该文件待修改
var path = require('path');
var assert = require('assert');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var _ = require('underscore');

describe('webapp-requirejs:app', function () {
  // not testing the actual run of generators yet
  it('the generator can be required without throwing', function () {
    this.app = require('../app');
  });

  describe('run test', function () {

    var expectedContent = [
      ['bower.json', /"name": "tmp"/],
      ['package.json', /"name": "tmp"/]
    ];
    var expected = [
      '.editorconfig',
      '.gitignore',
      '.gitattributes',
      'package.json',
      'bower.json',
      'Gruntfile.js',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html'
    ];

    var options = {
      'skip-install-message': true,
      'skip-install': true,
      'skip-welcome-message': true,
      'skip-message': true
    };

    var runGen;

    beforeEach(function () {
      runGen = helpers
        .run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, '.tmp'))
        .withGenerators([[helpers.createDummyGenerator(), 'mocha:app']]);
    });

    it('creates expected files', function (done) {
      runGen.withOptions(options).on('end', function () {

        assert.file([].concat(
          expected,
          'app/styles/main.css',
          'app/scripts/main.js'
        ));
        assert.noFile([
          'app/less/main.less'
        ]);

        assert.fileContent(expectedContent);
        assert.noFileContent([
          ['Gruntfile.js', /modernizr/],
          ['app/index.html', /modernizr/],
          ['bower.json', /modernizr/],
          ['package.json', /modernizr/],
          ['Gruntfile.js', /bootstrap/],
          ['app/index.html', /bootstrap/],
          ['bower.json', /bootstrap/],
          ['Gruntfile.js', /less/],
          ['app/index.html', /Less/],
          ['package.json', /grunt-contrib-less/]
        ]);
        done();
      });
    });

    it('creates expected modernizr components', function (done) {
      runGen.withOptions(options).withPrompt({features: ['includeModernizr']})
        .on('end', function () {

          assert.fileContent([
            ['Gruntfile.js', /modernizr/],
            ['app/index.html', /modernizr/],
            ['bower.json', /modernizr/],
            ['package.json', /modernizr/],
          ]);

          done();
        });
    });

    it('creates expected bootstrap components', function (done) {
      runGen.withOptions(options).withPrompt({features: ['includeBootstrap']})
        .on('end', function () {

          assert.fileContent([
            ['Gruntfile.js', /bootstrap/],
            ['app/index.html', /bootstrap/],
            ['bower.json', /bootstrap/]
          ]);

          done();
        });
    });

    it('creates expected Less components', function (done) {
      runGen.withOptions(options).withPrompt({features: ['includeLess']})
        .on('end', function () {

          assert.fileContent([
            ['Gruntfile.js', /less/],
            ['app/index.html', /Less/],
            ['package.json', /grunt-contrib-less/]
          ]);

          done();
        });
    });
  });
});
