/**
 * Created by Gerald on 12/2/15.
 */
var browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	cache = require('gulp-cached'),
	del = require('del'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	jshintstylish = require('jshint-stylish'),
	notify = require('gulp-notify'),
	react = require('gulp-react'),
	rename = require('gulp-rename'),
	source = require('vinyl-source-stream'),
	sourcemaps = require("gulp-sourcemaps"),
	to5ify = require('6to5ify'),
	uglify = require('gulp-uglify'),
	watchify = require('watchify'),
	// paths
	scriptsDir = './app/',
	testsDir = './tests/',
	buildDir = './build/';


function buildScript(file, watch) {
	"use strict";
	var props, bundler, stream;

	props = watch ? watchify.args : {};
	props.entries = [scriptsDir + '/' + file];
	props.debug = true;

	bundler = watch ? watchify(browserify(props)) : browserify(props);
	bundler.transform(to5ify);

	function rebundle() {
		stream = bundler.bundle();
		return stream.on('error', notify.onError({
				title: 'Compile Error',
				message: '<%= error.message %>'
			}))
			.pipe(source(file))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest(buildDir));
	}

	bundler.on('update', function() {
		rebundle();
		gutil.log('Rebundle...');
	});

	return rebundle();
}


///// TASKS /////
gulp.task('clean:build', function() {
	return del.sync(['build/**/*']);
});


gulp.task('copy', function() {
	return gulp.src([
			scriptsDir + '/index.html'
		])
		.pipe(gulp.dest(buildDir + '/'));;
});


gulp.task('jshint', function() {
	return gulp.src([
			scriptsDir + '**/*.js'
		])
		.pipe(cache('jshint'))
		.pipe(react())
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(jshintstylish));
});


gulp.task('build', ['clean:build', 'copy', 'jshint'], function() {
	return buildScript('main.js', false);
});


gulp.task('default', ['build'], function() {
	return buildScript('main.js', true);
});
