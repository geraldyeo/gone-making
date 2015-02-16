/**
 * Created by Gerald on 12/2/15.
 */
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var notify = require('gulp-notify');
var source = require('vinyl-source-stream');
var sourcemaps = require("gulp-sourcemaps");
var to5ify = require('6to5ify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var scriptsDir = './app';
var buildDir = './build';

function buildScript(file, watch) {
	"use strict";

	var props = watchify.args;
	props.entries = [scriptsDir + '/' + file];
	props.debug = true;

	var bundler = watch ? watchify(browserify(props)) : browserify(props);
	bundler.transform(to5ify);

	function rebundle() {
		var stream = bundler.bundle();
		return stream.on('error', notify.onError({
				title: 'Compile Error',
				message: '<%= error.message %>'
			}))
			.pipe(source(file))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(uglify())
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(buildDir + '/'));
	}
	bundler.on('update', function() {
		rebundle();
		gutil.log('Rebundle...');
	});

	return rebundle();
}


///// TASKS /////
gulp.task('build', ['clean:build', 'copy'], function() {
	return buildScript('main.js', false);
});


gulp.task('clean:build', function() {
	return del(['build/**',]);
});


gulp.task('copy', function() {
	return gulp.src([
					scriptsDir + '/index.html'
				])
				.pipe(gulp.dest(buildDir + '/'));;
});


gulp.task('default', ['build'], function() {
	return buildScript('main.js', true);
});
