/*!
 * Gruntfile for SP2013 Markdown Editor
 * Habanero Consulting Group
 * Licensed under MIT
 */

module.exports = function (grunt) {
	'use strict';

	/**
	 * Load required Grunt tasks.
	 */
	require('load-grunt-tasks')(grunt);

	/**
	 * Task configuration
	 */
	var taskConfig = {
		dirs: {
			// build: 'build',
			build: 'D:\\Documents\\TFS\\Habanero.StarterKit\\Main\\Source\\SPArtifacts\\Style Library\\Scripts\\SK\\vendor',
			source: 'source',
			tmp: '.grunt',
			vendor: '<%= dirs.source %>/vendor'
		},

		files: {
			main: 'sp2013-markdown-editor.js'
		},

		pkg: grunt.file.readJSON('package.json'),

		clean: {
			build: '<%= dirs.build %>/*',
			temp: '<%= dirs.tmp %>'
		},

		cssmin: {
			build: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.source %>',
						src: [
							'**/*.css'
						],
						dest: '<%= dirs.tmp %>/',
						ext: '.css'
					}
				]
			}
		},

		css2js: {
			build: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.tmp %>',
						src: [
							'**/*.css'
						],
						dest: '<%= dirs.tmp %>/',
						ext: '-css.js'
					}
				]
			}
		},

		jscs: {
			source: [
				'<%= dirs.source %>/*.js'
			],
			options: {
				config: './.jscsrc'
			}
		},

		jshint: {
			source: [
				'<%= dirs.source %>/*.js'
			],
			gruntfile: [
				'Gruntfile.js'
			],
			options: {
				ignores: ['/**/*.min.js'],
				curly: true,
				immed: true,
				newcap: false,
				noarg: true,
				debug: true,
				sub: true,
				boss: true,
				eqnull: true,
				multistr: true,
				scripturl: true,
				smarttabs: true,
				'-W099': true,
				loopfunc: true
			}
		},

		uglify: {
			build: {
				files: [
					{
						expand: true,
						cwd: '<%= dirs.tmp %>',
						src: [
							'**/*.js'
						],
						dest: '<%= dirs.tmp %>/',
						ext: '.js'
					},
					{
						expand: true,
						cwd: '<%= dirs.source %>',
						src: [
							'**/*.js'
						],
						dest: '<%= dirs.tmp %>/',
						ext: '.js'
					}
				],
				options: {
					preserveComments: require('uglify-save-license')
				}
			}
		},

		concat: {
			source: {
				files: {
					'<%= dirs.build %>/sp2013-markdown-editor.min.js': [
						'<%= dirs.tmp %>/*.js',
						'<%= dirs.tmp %>/vendor/**/*.js'
					]
				},
				options: {
					banner: '/*!\r\n * sp2013-markdown-editor.min.js\r\n * Habanero Consulting Group\r\n * Licensed under MIT\r\n */\r\n',
					separator: '\r\n\r\n'
				}
			}
		},

		shell: {
			bower: {
				options: {
					stdout: true
				},
				command: 'bower-installer'
			}
		},

		watch: {
			scripts: {
				files: ['<%= dirs.source %>/**/*.js'],
				tasks: ['build']
			}
		}
	};

	grunt.initConfig(taskConfig);


	/**
	 * Register tasks
	 */
	grunt.registerTask('bower', [
		'shell'
	]);

	grunt.registerTask('build', [
		'clean:temp', 'jshint', 'jscs', 'cssmin', 'css2js', 'uglify', 'concat', 'clean:temp'
	]);

	grunt.registerTask('serve', [
		'build', 'watch'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};