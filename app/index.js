'use strict';
var join = require('path').join;
//Yeoman生成器
var generators = require('yeoman-generator');
//用来显示信息
var yosay = require('yosay');
//用来处理文字样式的，比如文字颜色
var chalk = require('chalk');
var path = require('path');

var WebappRequirejsGenerator = generators.Base.extend({

  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);

    this.option('appPath', {
      desc: 'Name of application directory',
      type: String,
      defaults: 'app',
      banner: 'some banner'
    });

    /**
     * lodash（https://lodash.com/） 一个工具类，类似 underscore，也可以处理模板，貌似api比underscore多，包括数组，对象，函数等常用到的方法
     * handlebars（http://handlebarsjs.com/）模板引擎类
     * mustashe（http://mustache.github.io/） 也是一个模板引擎类
     */
    this.option('template-framework', {
      desc: 'Choose template framework. lodash/handlebars/mustashe',
      type: String,
      defaults: 'lodash'
    });

    // setup the test-framework property, Gruntfile template will need this
    /**
     * 两大主流自动化测试
     * mocha（http://mochajs.org/）
     * jasmine（http://jasmine.github.io/）
     */
    this.option('test-framework', {
      desc: 'Choose test framework. mocha/jasmine',
      type: String,
      defaults: 'mocha'
    });

    this.option('skip-install', {
      desc: 'Skip the bower and node installations',
      defaults: false
    });

    this.argument('app_name', {type: String, required: false});
    this.appname = this.app_name || this.appname;
    this.appname = this._.classify(this.appname);

    this.env.options.appPath = this.options.appPath || 'app';
    this.config.set('appPath', this.env.options.appPath);

    this.testFramework = this.options['test-framework'] || 'mocha';
    this.templateFramework = this.options['template-framework'] || 'lodash';

    this.config.defaults({
      appName: this.appname,
      ui: this.options.ui,
      coffee: this.options.coffee,
      testFramework: this.testFramework,
      templateFramework: this.templateFramework,
      bootstrap: this.bootstrap
    });

    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  },

  /**
   * 优先级 1
   * initializing - 你的初始化方法（检测当前项目状态，获取配置等）
   * initializing - Your initialization methods (checking current project state, getting configs, etc)
   */
  initializing: function () {
    this.pkg = require('../package.json');
  },

  /**
   * 优先级 2 prompting可以是{}，里面列出多个方法，如
   * prompting:{
      askFor: function () {},
      askForGeneratorName: function () {}
     }
   * prompting – 给用户展示选项提示（调用this.prompt()）
   * prompting - Where you prompt users for options (where you'd call this.prompt())
   */
  prompting: {
    askForApp: function () {
      var done = this.async();

      // welcome message
      // 显示提示信息.
      this.log(yosay(
        'Welcome to the striking ' + chalk.red('WebappRequirejs') + ' generator!'
      ));

      var prompts = [{
        name: 'appname',
        message: 'What is the name of your app?',
        default: this.appname
      }, {
        name: 'appdescription',
        message: 'Description:',
        default: 'A webapp app basing on requirejs.'
      }];

      this.prompt(prompts, function (answers) {
        this.appname = answers.appname;
        this.appdescription = answers.appdescription;
        done();
      }.bind(this));
    },

    askForCSSAndJSFile: function () {
      var done = this.async();

      // welcome message
      // 显示提示信息.
      this.log(yosay(
        'Welcome to the striking ' + chalk.red('WebappRequirejs') + ' generator!'
      ));

      var prompts = [{
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: true
        }, {
          name: 'Less',
          value: 'includeLess',
          checked: true
        }, {
          name: 'Use CoffeeScript',
          value: 'coffee',
          checked: this.options.coffee || false
        }, {
          name: 'Modernizr',//专为HTML5和CSS3开发的功能检测类库
          value: 'includeModernizr',
          checked: false
        }]
      }];

      this.prompt(prompts, function (answers) {
        var features = answers.features;

        function hasFeature(feat) {
          return features && features.indexOf(feat) !== -1;
        }

        this.includeLess = hasFeature('includeLess');
        this.includeBootstrap = hasFeature('includeBootstrap');
        this.includeModernizr = hasFeature('includeModernizr');

        if (!this.options.coffee) {
          this.options.coffee = hasFeature('coffee');
          this.config.set('coffee', this.options.coffee);
        }

        done();
      }.bind(this));
    }
  },

  /**
   * 优先级 3
   * 保存用户配置项，同时配置工程（创建.editorconfig文件或者其他metadata文件）
   * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
   */
  configuring: {},

  /**
   * 优先级 4
   */
  default: {},

  /**
   * 优先级 5
   * writing – 用于生成和生成器相关的文件（比如routes,controllers等）
   * Where you write the generator specific files (routes, controllers, etc)
   */
  writing: {
    gruntfile: function () {
      this.template('Gruntfile.js');
    },
    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },
    git: function () {
      this.template('gitignore', '.gitignore');
      this.copy('gitattributes', '.gitattributes');
    },
    bower: function () {
      this.copy('bowerrc', '.bowerrc');
      this.template('_bower.json', 'bower.json');
    },
    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },
    editorConfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },
    mainStylesheet: function () {
      var css = 'main.css';
      this.template(css, 'app/styles/' + css);
    },

    writeIndexWithRequirejs: function () {
      this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
      this.indexFile = this.engine(this.indexFile, this);

      this.indexFile = this.appendScripts(this.indexFile, 'scripts/main.js', [
        'bower_components/requirejs/require.js'
      ], {'data-main': 'scripts/main'});
    },

    setupEnv: function () {
      this.mkdir(this.env.options.appPath);
      this.mkdir(this.env.options.appPath + '/scripts');
      this.mkdir(this.env.options.appPath + '/scripts/vendor/');
      this.mkdir(this.env.options.appPath + '/styles');
      this.mkdir(this.env.options.appPath + '/images');
      //前面文件是源文件，后面的是目标文件
      this.copy('app/404.html', this.env.options.appPath + '/404.html');
      this.copy('app/favicon.ico', this.env.options.appPath + '/favicon.ico');
      this.copy('app/robots.txt', this.env.options.appPath + '/robots.txt');
      this.write(this.env.options.appPath + '/index.html', this.indexFile);
    },

    createRequireJsAppFile: function () {
      this._writeTemplate('requirejs_app', this.env.options.appPath + '/scripts/main');
    },
    composeTest: function () {
      if (['webapp-requirejs:app', 'webapp-requirejs'].indexOf(this.options.namespace) >= 0) {
        this.composeWith(this.testFramework, {
          'skip-install': this.options['skip-install'],
          'ui': this.options.ui,
          'skipMessage': true,
        });
      }
    }
  },

  /**
   * 优先级 6
   * conflicts – 用于处理冲突异常（内部使用）
   * conflicts - Where conflicts are handled (used internally)
   */
  conflicts: {},

  /**
   * 优先级 7
   * install – 用于安装相关库 (npm, bower)
   * install - Where installation are run (npm, bower)
   */
  install: function () {
    if (this.options['skip-install']) {
      return;
    }
    if (['webapp-requirejs:app', 'webapp-requirejs'].indexOf(this.options.namespace) >= 0) {
      this.installDependencies({ skipInstall: this.options['skip-install'] });
    }

  },

  /**
   * 优先级 8
   * end – 最后调用，常用于清理、道别等
   * end - Called last, cleanup, say good bye, etc
   */
  end: function () {
    this.log(yosay(
      'You have generated a webapp basing on RequireJS generator.'
    ));
  },

  /**
   * 内部方法
   */
  setSuffix: function () {
    this.scriptSuffix = '.js';

    if (this.env.options.coffee || this.options.coffee) {
      this.scriptSuffix = '.coffee';
    }
  },

  _writeTemplate: function (source, destination, data) {
    if (typeof source === 'undefined' || typeof destination === 'undefined') {
      return;
    }

    if (typeof this.scriptSuffix === 'undefined') {
      this.setSuffix();
    }

    var ext = this.scriptSuffix;
    this.log(this.template);
    this.template(source + ext, destination + ext, data);
  }
});

module.exports = WebappRequirejsGenerator;
