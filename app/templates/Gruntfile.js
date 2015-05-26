// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9000;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'
// templateFramework: '<%= templateFramework %>'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  // 统计显示各任务执行的时间
  // https://github.com/sindresorhus/time-grunt
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  // 自动加载grunt tasks
  // https://github.com/sindresorhus/load-grunt-tasks
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: '<%= env.options.appPath %>',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },<% if (options.coffee) { %>
      coffee: {
        files: ['<%%= config.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },<% } %>
      livereload: {
        options: {
          livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
        },
        files: [
          '<%%= config.app %>/*.html',
          '{.tmp,<%%= config.app %>}/styles/{,*/}*.css',
          '{.tmp,<%%= config.app %>}/scripts/{,*/}*.js',
          '<%%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%%= config.app %>/scripts/templates/*.{ejs,mustache,hbs}',
          'test/spec/**/*.js'
        ]
      }<% if (templateFramework === 'mustache') { %>,
      mustache: {
        files: [
          '<%%= config.app %>/scripts/templates/*.mustache'
        ],
        tasks: ['mustache']
      }<% } else if (templateFramework === 'handlebars') { %>,
      handlebars: {
        files: [
          '<%%= config.app %>/scripts/templates/*.hbs'
        ],
        tasks: ['handlebars']
      }<% } else { %>,
      jst: {
        files: [
          '<%%= config.app %>/scripts/templates/*.ejs'
        ],
        tasks: ['jst']
      }<% } %>,
      test: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
        tasks: ['test:true']
      },
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      }
    },

    connect: {
      options: {
        port: grunt.option('port') || SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, config.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              mountFolder(connect, 'test'),
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, config.dist)
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      },
      test: {
        path: 'http://localhost:<%%= connect.test.options.port %>'
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: ['.tmp', '<%%= config.dist %>/*'],
      server: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),//利用插件jshint-stylish输出分析结果
        reporterOutput: 'jshint.log'//设置分析结果输出到指定文件，如果不设置，则输出到控制台
      },
      all: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },<% if (testFramework === 'mocha') { %>

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://localhost:<%%= connect.test.options.port %>/index.html']
        }
      }
    },<% } else if (testFramework === 'jasmine') { %>

    // Jasmine testing framework configuration options
  jasmine: {
    all:{
      src : '<%= config.app %>/scripts/{,*/}*.js',
        options: {
        keepRunner: true,
          specs : 'test/spec/**/*.js',
          vendor : [
          '<%%= config.app %>/bower_components/jquery/dist/jquery.js',
          '<%%= config.app %>/bower_components/lodash/dist/lodash.js',
          '<%%= config.app %>/bower_components/backbone/backbone.js',
          '.tmp/scripts/templates.js'
        ]
      }
    }
  },<% } %><% if (options.coffee) { %>

    coffee: {
      dist: {
        files: [{
          // rather than compiling multiple files here you should
          // require them into your main .coffee file
          expand: true,
          cwd: '<%%= config.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },<% } %><% if (includeLess) { %>

    // 把less 转换为 css 任务
    less: {
      publish: {
        options: {
          paths: ['<%= config.app %>/']
        },
        files: [{
          expand: true,
          cwd: 'less/',
          src: '{,*/}*.less',
          dest: 'styles/'
        }]
      }
    },<% } %>

    /**
    * 目前引入requirejs 会报以下错误
    * Running "useminPrepare:html" (useminPrepare) task
    * Fatal error: require.js blocks are no more supported.
    * 解决方法，参考http://zhaiduo.com/?cat=8
    * I update Gruntfile.js with requirejs.dis.options,Insert the following options:
      ,
      include: '../bower_components/requirejs/require',
      mainConfigFile: config.app + '/scripts/main.js',
      out: config.dist + '/scripts/app.min.js'

      Then update index.html in app category from

      <!-- build:js scripts/main.js -->
      <script data-main="scripts/main" src="bower_components/requirejs/require.js"></script>
      <!-- endbuild -->
      </code>
      to

      <!-- REMOVE THIS AFTER `grunt build` -->
      <script data-main="scripts/config" src="bower_components/requirejs/require.js"></script>

      <!-- UNCOMMENT THIS AFTER `grunt build` -->
      <!-- <script src="scripts/app.min.js"></script> -->

      The problem should be resolved.

      And after build app to dist category, don't forget to change index.html, use app.min.js to replace requirejs/require.js.
    */
    requirejs: {
      dist: {
        // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
        options: {<% if (options.coffee) { %>
          // `name` and `out` is set by grunt-usemin
          baseUrl: '.tmp/scripts',<% } else { %>
          baseUrl: '<%%= config.app %>/scripts',<% } %>
          optimize: 'none',
          paths: {
            'templates': '../../.tmp/scripts/templates',
            'jquery': '../../<%%= config.app %>/bower_components/jquery/dist/jquery',
            'lodash': '../../<%%= config.app %>/bower_components/lodash/dist/lodash'
          },
          // TODO: Figure out how to make sourcemaps work with grunt-usemin
          // https://github.com/yeoman/grunt-usemin/issues/30
          //generateSourceMaps: true,
          // required to support SourceMaps
          // http://requirejs.org/docs/errors.html#sourcemapcomments
          preserveLicenseComments: false,
          useStrict: true<% if (templateFramework !== 'handlebars') { %>,
         wrap: true<% } %>
         //uglify2: {} // https://github.com/mishoo/UglifyJS2
        }
      }
    },
    // Add vendor prefixed styles
    // 该任务用来分析css并为css3加上各浏览器前缀
    autoprefixer: {
      options: {
        //cascade: true,// 设置层叠显示分格
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']// 指定浏览器版本，该设置表示浏览器最新版本，详见 https://github.com/ai/autoprefixer#browsers
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%%= config.app %>/index.html',
      options: {
        dest: '<%%= config.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%%= config.dist %>/{,*/}*.html'],
      css: ['<%%= config.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%%= config.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>/images'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          '<%%= config.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%%= config.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },

    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
          collapseWhitespace: true,// 合并多余的空格
          collapseBooleanAttributes: true,// Collapse boolean attributes. <input disabled="disabled"> => <input disabled>
          removeCommentsFromCDATA: true,//删除script 和style中的注解
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/scripts/scripts.js': [
    //         '<%%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp,gif}',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%%= config.dist %>/.htaccess'
        }<% if (includeBootstrap) { %>, {
          expand: true,
          dot: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%%= config.dist %>'
        }<% } %>]
      }
    },
    bower: {
      all: {
        rjsConfig: '<%%= config.app %>/scripts/main.js'
      }
    },<% if (templateFramework === 'mustache') { %>
    mustache: {
      files: {
        src: '<%%= config.app %>/scripts/templates/',
          dest: '.tmp/scripts/templates.js',
          options: {
          prefix: 'define(function() { this.JST = ',
          postfix: '; return this.JST;});'
        }
      }
    }<% } else if (templateFramework === 'handlebars') { %>
    handlebars: {
      compile: {
        options: {
          namespace: 'JST',
          amd: true
        },
        files: {
          '.tmp/scripts/templates.js': ['<%%= config.app %>/scripts/templates/*.hbs']
        }
      }
    }<% } else { %>
    /**
    * This plugin uses the [Lo-Dash library](https://lodash.com/) to generate JavaScript template functions.
    */
    jst: {
      options: {
        amd: true
      },
      compile: {
        files: {
          '.tmp/scripts/templates.js': ['<%%= config.app %>/scripts/templates/*.ejs']
        }
      }
    }<% } %>,

    rev: {
      dist: {
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '<%%= config.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= config.dist %>/styles/fonts/{,*/}*.*'
          ]
        }
      }
    }
  });

  grunt.registerTask('createDefaultTemplate', function () {
    grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve' + (target ? ':' + target : '')]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open:server', 'connect:dist:keepalive']);
    }

    if (target === 'test') {
      return grunt.task.run([
        'clean:server',<% if (options.coffee) { %>
        'coffee',<% } %>
        'createDefaultTemplate',<% if (templateFramework === 'mustache' ) { %>
        'mustache',<% } else if (templateFramework === 'handlebars') { %>
        'handlebars',<% } else { %>
        'jst',<% } %>
        'connect:test',
        'open:test',
        'watch'
     ]);
    }

    grunt.task.run([
      'clean:server',<% if (options.coffee) { %>
      'coffee:dist',<% } %>
      'createDefaultTemplate',<% if (templateFramework === 'mustache') { %>
      'mustache',<% } else if (templateFramework === 'handlebars') { %>
      'handlebars',<% } else { %>
      'jst',<% } %>
      'connect:livereload',
      'open:server',
      'watch'
    ]);
  });

  grunt.registerTask('test', function (isConnected) {
    isConnected = Boolean(isConnected);
    var testTasks = [
      'clean:server',<% if (options.coffee) { %>
      'coffee',<% } %>
      'createDefaultTemplate',<% if (templateFramework === 'mustache' ) { %>
      'mustache',<% } else if (templateFramework === 'handlebars') { %>
      'handlebars',<% } else { %>
      'jst',<% } %><% if(testFramework === 'mocha') { %>
      'connect:test',
      'mocha',<% } else { %>
      'jasmine'<% } %>
    ];

    if(!isConnected) {
      return grunt.task.run(testTasks);
    } else {
      // already connected so not going to connect again, remove the connect:test task
      testTasks.splice(testTasks.indexOf('connect:test'), 1);
      return grunt.task.run(testTasks);
    }
  });

  grunt.registerTask('build', [
    'clean:dist',<% if (options.coffee) { %>
    'coffee',<% } %>
    'createDefaultTemplate',<% if (templateFramework === 'mustache' ) { %>
    'mustache',<% } else if (templateFramework === 'handlebars') { %>
    'handlebars',<% } else { %>
    'jst',<% } %>
    'useminPrepare',
    'requirejs',
    'imagemin',
    'htmlmin',
    'concat',
    'cssmin',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};