/**
 * Created by Gerald on 12/2/15.
 */
var argv = require('yargs').argv,
	babel = require('gulp-babel'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	cache = require('gulp-cached'),
	del = require('del'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	jshint = require('gulp-jshint'),
	jshintstylish = require('jshint-stylish'),
	jscs = require('gulp-jscs'),
	less = require('gulp-less'),
	livereload = require('gulp-livereload'),
	nodemon = require('gulp-nodemon'),
	notify = require('gulp-notify'),
	path = require('path'),
	rename = require('gulp-rename'),
	source = require('vinyl-source-stream'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	watchify = require('watchify'),
	// less
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	// servers
	LIVERELOAD_PORT = 35729,
	// flags
	production = !!(argv.production),
	// paths
	paths = {
		server: {
			index: './app/server/index.js'
		},

		scripts: {
			dir: './app/',
			all: './app/**/*.js'
		},

		styles: {
			dir: './less/',
			all: './less/**/*.less'
		},

		tests: {
			dir: './tests/',
			all: './tests/**/*.js'
		},

		build: {
			dir: './build/',
			all: './build/**/*',
			scripts: './build/js/',
			styles: './build/css/'
		}
	};


/************
 * HELPERS
 ************/

function startLivereload() {
	livereload({
		port: LIVERELOAD_PORT,
		start: true
	});
}


function buildScript(file, watch) {
	'use strict';
	var props, bundler, stream;

	props = watch ? watchify.args : {};
	props.entries = [paths.scripts.dir + file];
	props.debug = true;

	bundler = watch ? watchify(browserify(props)) : browserify(props);
	bundler.transform(babelify);

	function rebundle() {
		stream = bundler.bundle();
		return stream.on('error', notify.onError({
				title: 'Compile Error',
				message: '<%= error.message %>'
			}))
			.pipe(source(file))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(gulpif(production, uglify()))
			.pipe(sourcemaps.write('.'))
			.pipe(gulp.dest(paths.build.scripts))
			.pipe(gulpif(watch, livereload()));
	}

	bundler.on('update', function() {
		rebundle();
		gutil.log('Rebundle...');
	});

	return rebundle();
}


/************
 * GULP TASKS
 ************/

/***** MISC START *****/

gulp.task('clean', function() {
	return del.sync([paths.build.all]);
});

gulp.task('copy', function() {
	return gulp.src([
			paths.scripts.dir + '/index.html'
		])
		.pipe(gulp.dest(paths.build.dir));
});

gulp.task('watch', function() {
	gulp.watch(paths.styles.all, ['css']);
});

gulp.task('server:dev', function() {
	startLivereload();

	nodemon({
		script: paths.server.index,
		ext: 'html js',
		env: {
			'NODE_ENV': 'development'
		}
	});
});

/***** MISC END *****/

/***** SCRIPTS START *****/

gulp.task('lint', function() {
	return gulp.src([
			paths.scripts.all
		])
		.pipe(cache('jshint'))
		.pipe(babel())
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter(jshintstylish));
});

gulp.task('jscs', function() {
	return gulp.src([
			paths.scripts.all
		])
		.pipe(cache('jscs'))
		.pipe(jscs());
});

gulp.task('js', ['lint', 'jscs'], function() {
	return buildScript('main.js', true);
});

/***** SCRIPTS END *****/

/***** STYLES START *****/

gulp.task('css', function() {
	return gulp.src([
			paths.styles.all
		])
		.pipe(cache('css'))
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulpif(production, minifyCSS({
			keepBreaks: true
		})))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.build.styles))
		.pipe(livereload());
});

/***** STYLES END *****/

/***** TESTS START *****/
/***** TESTS END *****/


gulp.task('dev', ['clean', 'js', 'css', 'server:dev', 'watch']);

gulp.task('prod', function() {});

gulp.task('default', ['prod']);
