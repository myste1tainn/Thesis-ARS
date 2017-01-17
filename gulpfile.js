var gulp = require('gulp'),
	ts = require('gulp-typescript'),
    watch = require('gulp-watch'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

var tsProject = ts.createProject('tsconfig.json');

// watch and build
gulp.task('scripts', function() {
	return tsProject.src()
	.pipe(tsProject())
	.pipe(gulp.dest('executable'))
})

gulp.task('moveIndex', function() {
  return gulp.src('index.html')
  .pipe(gulp.dest('executable'))
})

gulp.task('reloadCSS', function() {
  return gulp.src('style/**/*.css')
  .pipe(livereload())
})

gulp.task('watch', ['scripts', 'moveIndex', 'reloadCSS'], function() {
	gulp.watch('**/*.ts', ['scripts'])
  gulp.watch('index.html', ['moveIndex'])
  gulp.watch('style/**/*.css', ['reloadCSS'])
})

gulp.task('nodemon', ['watch'], function() {
	livereload.listen({
    quiet: true
  })
	var timeout = null;
	var stream = nodemon({ 
    script: 'executable/server/server.js',
    ext: 'html js',
    tasks: [],
    quiet: true
  })
 
  stream
      .on('restart', function () {
        clearTimeout(timeout)
        timeout = setTimeout(function() {
        	gulp.src('executable/**/*.js')
        	.pipe(livereload())
        }, 1000);
      })
      .on('crash', function() {
        console.error('Application has crashed!\n')
        stream.emit('restart', 10)  // restart the server in 10 seconds 
      })
})