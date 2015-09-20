gulp       = require('gulp')
plugins    = require('gulp-load-plugins')()
browserify = require('browserify')
babelify   = require('babelify')
pkg        = require(__dirname + '/package.json')
path       = require('path')

electron = require('electron-connect').server.create()

gulp.task 'build', ['sass', 'compile'], ->

gulp.task 'compile', ->
  gulp.src('src/**/*.{js,jsx}')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({optional: ["runtime"]}))
    .on('error', plugins.util.log)
    .on('error', plugins.notify.onError((err) -> {title: "Babel Compile (Error)", message: "Error: #{err}"}))
    .on('error', -> this.emit('end'))
    .pipe(plugins.duration("compiled"))
    .pipe(plugins.notify(title: "Babel", message: "compiled"))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build'))

gulp.task 'sass', ->
  gulp.src('sass/**/*.{sass,scss}')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({outputStyle: 'compressed'}))
    .on('error', plugins.util.log)
    .on('error', plugins.notify.onError((err) -> {title: "Sass Compile (Error)", message: "Error: #{err}"}))
    .on('error', -> this.emit('end'))
    .pipe(plugins.duration("compiled"))
    .pipe(plugins.notify(title: "Sass", message: "compiled"))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('stylesheets'))


gulp.task 'watch', ['build'], ->
  electron.start()
  gulp.watch('src/**/*.{js,jsx}', ['compile'])
  gulp.watch('sass/**/*.{sass,scss}', ['sass'])
  gulp.watch('main.js', electron.restart)
  gulp.watch(['index.html', 'build/**/*.{html,js,css}', 'stylesheets/**/*.css'], electron.reload)

gulp.task 'default', ['build']
