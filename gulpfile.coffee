gulp       = require('gulp')
plugins    = require('gulp-load-plugins')()
browserify = require('browserify')
babelify   = require('babelify')
pkg        = require(__dirname + '/package.json')
path       = require('path')

electron = require('electron-connect').server.create()

gulp.task 'build', ->
  gulp.src('src/**/*.{js,jsx}')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({optional: ["runtime"]}))
    .on('error', plugins.util.log)
    .on('error', plugins.notify.onError((err) -> {title: "Compile (Error)", message: "Error: #{err}"}))
    .on('error', -> this.emit('end'))
    .pipe(plugins.duration("compiled"))
    .pipe(plugins.notify(title: "Babel", message: "compiled"))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build'))

gulp.task 'watch', ['build'], ->
  electron.start()
  gulp.watch('src/**/*.{js,jsx}', ['build'])
  gulp.watch('main.js', electron.restart)
  gulp.watch(['index.html', 'build/**/*.{html,js,css}'], electron.reload)

gulp.task 'default', ['build']
