const loadGruntTasks = require('load-grunt-tasks');
const dartSass = require('sass');

const banner = '/*!\n * @module <%= pkg.name %>\n'
  + ' * @description <%= pkg.description %>\n'
  + ' * @version v<%= pkg.version %>\n'
  + ' * @link <%= pkg.homepage %>\n'
  + ' * @licence MIT License, https://opensource.org/licenses/MIT\n'
  + ' */\n\n';

module.exports = (grunt) => {
  // load all grunt tasks
  loadGruntTasks(grunt);

  // grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    coffee: {
      compileToJs: {
        files: {
          'dist/page-title.js': 'src/page-title.coffee',
        },
      },
    },
    uglify: {
      options: {
        sourceMap: true,
        output: {
          comments: '/^!/',
        },
      },
      minify: {
        files: {
          'dist/page-title.min.js': ['dist/page-title.js'],
        },
      },
    },
    concat: {
      options: {
        stripBanners: true,
        banner,
      },
      addBanner: {
        src: ['dist/page-title.js'],
        dest: 'dist/page-title.js',
      },
    },
    sass: {
      options: {
        implementation: dartSass,
        sourcemap: 'none',
        style: 'expanded',
      },
      compile: {
        files: {
          'docs/style.css': 'docs/style.scss',
        },
      },
    },
    browserSync: {
      bsFiles: {
        src: [
          'docs/*.css',
          'docs/**/*.html',
          'docs/*.js',
          'dist/*.js',
        ],
      },
      options: {
        watchTask: true,
        server: {
          baseDir: 'docs',
          routes: {
            '/dist': 'dist',
          },
        },
        open: false,
        rewriteRules: [{
          match: 'https://cdn.jsdelivr.net/npm/ui-router-page-title@latest/page-title.min.js',
          replace: '/dist/page-title.js',
        }],
      },
    },
    clean: {
      outDir: {
        src: 'dist/',
      },
    },
    copy: {
      files: {
        expand: true,
        src: ['LICENSE', 'README.md', 'CHANGELOG.md'],
        dest: 'dist/',
      },
      pkgJson: {
        options: {
          process: (data) => {
            const pkg = JSON.parse(data);
            pkg.main = 'page-title.min.js';
            delete pkg.scripts;
            delete pkg.devDependencies;
            delete pkg.private;
            return JSON.stringify(pkg, null, 2);
          },
        },
        expand: true,
        src: 'package.json',
        dest: 'dist/',
      },
    },
    watch: {
      coffee: {
        files: ['src/**/*.coffee'],
        tasks: ['coffee'],
      },
      scss: {
        files: ['docs/**/*.scss'],
        tasks: ['sass'],
      },
    },
  });

  // register grunt tasks
  grunt.registerTask('default', ['coffee']);
  grunt.registerTask('serve', ['default', 'browserSync', 'watch']);
  grunt.registerTask('build', ['clean', 'default', 'concat', 'uglify', 'copy']);
};
