'use strict';
//Yeoman生成器
var generators = require('yeoman-generator');
//用来显示信息
var yosay = require('yosay');
//用来处理文字样式的，比如文字颜色
var chalk = require('chalk');

module.exports = generators.Base.extend({
  /**
   * 优先级 1
   * initializing - 你的初始化方法（检测当前项目状态，获取配置等）
   * initializing - Your initialization methods (checking current project state, getting configs, etc)
   */
  initializing: function() {
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
  prompting: function() {
    // Yeoman中最为主要的UI交互就是提示框，由Inquirer.js组件提供。使用下列方式调用：
    // 由于咨询用户是一个异步的过程，会卡住命令逻辑的运行，所以需要调用yo的异步方法：var done = this.async();。
    var done = this.async();

    // welcome message
    // 显示提示信息.
    this.log(yosay(
      'Welcome to the striking ' +  chalk.red('WebappRequirejs') + ' generator!'
    ));

    var prompts = [{
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [{
        name: 'Bootstrap',
        value: 'includeBootstrap',
        checked: true
      },{
        name: 'Less',
        value: 'includeLess',
        checked: false
      },{
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

      done();
    }.bind(this));

  },

  /**
   * 优先级 3
   * 保存用户配置项，同时配置工程（创建.editorconfig文件或者其他metadata文件）
   * Saving configurations and configure the project (creating .editorconfig files and other metadata files)
   */
  configuring: {

  },

  /**
   * 优先级 4
   */
  default: {

  },

  /**
   * 优先级 5
   * writing – 用于生成和生成器相关的文件（比如routes,controllers等）
   * Where you write the generator specific files (routes, controllers, etc)
   */
  writing: {
    app: function () {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }

    //tests: function () {
    //  this.template('test-app.js', 'test/test-app.js');
    //},
    //
    //gruntfile: function () {
    //  this.template('Gruntfile.js');
    //},
    //
    //bower: function () {
    //  var bower = {
    //    name: this._.slugify(this.appname),
    //    private: true,
    //    dependencies: {}
    //  };
    //
    //  if (this.includeBootstrap) {
    //    var bs = 'bootstrap';
    //    bower.dependencies[bs] = '~3.3.0';
    //  } else {
    //    bower.dependencies.jquery = '~1.11.1';
    //  }
    //
    //  if (this.includeModernizr) {
    //    bower.dependencies.modernizr = '~2.8.2';
    //  }
    //
    //  this.copy('bowerrc', '.bowerrc');
    //  this.write('bower.json', JSON.stringify(bower, null, 2));
    //},
    //
    //writeIndex: function () {
    //  this.indexFile = this.engine(
    //    this.readFileAsString(join(this.sourceRoot(), 'index.html')),
    //    this
    //  );
    //
    //  // wire Bootstrap plugins
    //  if (this.includeBootstrap && !this.includeSass) {
    //    var bs = 'bower_components/bootstrap/js/';
    //
    //    this.indexFile = this.appendFiles({
    //      html: this.indexFile,
    //      fileType: 'js',
    //      optimizedPath: 'scripts/plugins.js',
    //      sourceFileList: [
    //        bs + 'affix.js',
    //        bs + 'alert.js',
    //        bs + 'dropdown.js',
    //        bs + 'tooltip.js',
    //        bs + 'modal.js',
    //        bs + 'transition.js',
    //        bs + 'button.js',
    //        bs + 'popover.js',
    //        bs + 'carousel.js',
    //        bs + 'scrollspy.js',
    //        bs + 'collapse.js',
    //        bs + 'tab.js'
    //      ],
    //      searchPath: '.'
    //    });
    //  }
    //
    //  this.indexFile = this.appendFiles({
    //    html: this.indexFile,
    //    fileType: 'js',
    //    optimizedPath: 'scripts/main.js',
    //    sourceFileList: ['scripts/main.js'],
    //    searchPath: ['app', '.tmp']
    //  });
    //}

  },

  /**
   * 优先级 6
   * conflicts – 用于处理冲突异常（内部使用）
   * conflicts - Where conflicts are handled (used internally)
   */
  conflicts: {

  },

  /**
   * 优先级 7
   * install – 用于安装相关库 (npm, bower)
   * install - Where installation are run (npm, bower)
   */
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false
    });
  },

  /**
   * 优先级 8
   * end – 最后调用，常用于清理、道别等
   * end - Called last, cleanup, say good bye, etc
   */
  end: function() {
    this.log(yosay(
      'You have generated a webapp basing on RequireJS generator.'
    ));
  },


  // The name `constructor` is important here
  constructor: function () {
    // Calling the super constructor is important so our generator is correctly set up
    generators.Base.apply(this, arguments);
  }
});
