/*!
 * Bootstrap's Gruntfile
 * http://getbootstrap.com
 * Copyright 2013-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  grunt.initConfig({
    conf: require( './configuration.json' ),
    clean: [
        './build/'
    ],
    s3: {
      options: {
        accessKeyId: "<%= conf.aws.accessKeyId %>",
        secretAccessKey: "<%= conf.aws.secretAccessKey %>",
        region: "<%= conf.aws.region %>",
        cache: false,
        access: "public-read",
        bucket: "<%= conf.aws.bucket %>"
      },
      build: {
        cwd: "./build/",
        src: "**"
      }
    },
    copy: {
      development_bower_js: {
        files: [
          {
            src: [
                'jquery/dist/jquery.js',
                'bootstrap/dist/js/bootstrap.js'
            ],
            dest: 'build/assets/js/',
            cwd: './bower_components',
            expand:true
          }
        ]
      },
      development_cname: {
        files: [
          {
            src: [
                'CNAME'
            ],
            dest: 'build/',
            cwd: '.',
            expand:true
          }
        ]
      },
      development_images: {
        files: [
          {
            src: [
                '**'
            ],
            dest: 'build/assets/images/',
            cwd: './src/images',
            expand:true
          }
        ]
      },
      development_fonts: {
        files: [
          {
            src: [
                '**'
            ],
            dest: 'build/assets/fonts/',
            cwd: './bower_components/bootstrap/fonts/',
            expand:true
          },
          {
              src: [
                  '**'
              ],
              dest: 'build/assets/fonts/',
              cwd: './src/assets/fonts/',
              expand:true
            }
        ]
      },
      development_index_html: {
        files: [
          {
            src: ['./**/*.html'],
            dest: 'build/',
            cwd: './src',
            expand: true
          }
       ]
      }
    },
	less: {
	  development: {
	    files: {
	      "build/assets/compiled.css": "src/less/main.less"
	    }
	  }
	},
	watch: {
	  less: {
	    files: ['src/less/*.less'],
	    tasks: ['less'],
	    options: { livereload: true }
	  },
	  others: {
		  files: ['src/**/*.html', 'src/assets/**/*'],
          tasks: ['development'],
		  options: { livereload: true }
	  }
	}
  });

  grunt.registerTask("development", ['copy:development_bower_js', 'copy:development_index_html',
                     'copy:development_images', 'copy:development_cname', 'less:development',
                     'copy:development_fonts'
  ]);

  grunt.registerTask("deploy", ['clean', 'development', 's3'
  ]);

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-aws');
}
