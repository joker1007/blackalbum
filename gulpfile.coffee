gulp       = require('gulp')
plugins    = require('gulp-load-plugins')()
browserify = require('browserify')
babelify   = require('babelify')
pkg        = require(__dirname + '/package.json')
path       = require('path')
process    = require('process')
_          = require('lodash')
del        = require('del')

es         = require('event-stream')
source     = require('vinyl-source-stream')

electron = require('electron-connect').server.create()
packager = require('electron-packager')

env = process.env.NODE_ENV || "development"
VERSION = "0.0.1"

isProduction = ->
  env == "production"

gulp.task 'build', ['html', 'sass', 'compile_main', 'compile_renderer'], ->

gulp.task 'clean', (cb) ->
  del(['dist/**/*', 'build/**/*'], cb)

gulp.task 'compile_main', ->
  gulp.src('src/main.js')
    .pipe(plugins.preprocess({context: {NODE_ENV: env}}))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({optional: ["runtime"]}))
    .on('error', plugins.util.log)
    .on('error', plugins.notify.onError((err) -> {title: "Babel Compile (Error)", message: "Error: #{err}"}))
    .on('error', -> this.emit('end'))
    .pipe(plugins.if(isProduction, plugins.uglify()))
    .pipe(plugins.duration("compiled"))
    .pipe(plugins.notify(title: "Babel", message: "compiled"))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build'))

gulp.task 'compile_renderer', ->
  gulp.src('src/**/*.{js,jsx}')
    .pipe(plugins.preprocess({context: {NODE_ENV: env}}))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel({optional: ["runtime"]}))
    .on('error', plugins.util.log)
    .on('error', plugins.notify.onError((err) -> {title: "Babel Compile (Error)", message: "Error: #{err}"}))
    .on('error', -> this.emit('end'))
    .pipe(plugins.if(isProduction, plugins.uglify()))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('build'))
    .pipe(plugins.concat("dummy.js"))
    .pipe(plugins.duration("compiled"))
    .pipe(plugins.notify(title: "Babel", message: "compiled"))

gulp.task 'browserify', ['compile_main'], ->
  browserify('src/app.js').bundle()
    .pipe(source("app.js"))
    .pipe(plugins.streamify(plugins.uglify()))
    .pipe(gulp.dest("build"))

gulp.task 'sass', ->
  gulp.src('sass/**/*.{sass,scss}')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      outputStyle: 'compressed'
      includePaths: [
        './node_modules'
      ]
    }))
    .on('error', plugins.util.log)
    .on('error', plugins.notify.onError((err) -> {title: "Sass Compile (Error)", message: "Error: #{err}"}))
    .on('error', -> this.emit('end'))
    .pipe(plugins.duration("compiled"))
    .pipe(plugins.notify(title: "Sass", message: "compiled"))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('stylesheets'))

gulp.task 'html', ->
  gulp.src('src/**/*.html')
    .pipe(plugins.preprocess({context: {NODE_ENV: env}}))
    .pipe(gulp.dest('build'))

packageConfig = {
  name: "BlackAlbum"
  dir: "."
  out: "dist"
  arch: "x64"
  version: "0.33.7"
  prune: true
  ignore: /(^\/node_modules\/(?!fs-extra|glob|fluent-ffmpeg|adm-zip|jimp).*|gulpfile\.coffee|src|sass|.*\.map)/
  asar: true
  overwrite: true
  "app-version": VERSION
}
gulp.task 'package:mac', ['browserify', 'html'], (done) ->
  packager(_.extend({}, packageConfig, platform: "darwin"), (err, path) ->
    done()
  )
gulp.task 'package:linux', ['browserify', 'html'], (done) ->
  packager(_.extend({}, packageConfig, platform: "linux"), (err, path) ->
    done()
  )
gulp.task 'package', ['package:mac', 'package:linux']

gulp.task 'watch', ['build'], ->
  electron.start()
  gulp.watch('src/main.js', ['compile_main', electron.restart])
  gulp.watch(['src/**/*.{js,jsx}', '!src/main.js'], ['compile_renderer'])
  gulp.watch('src/**/*.html', ['html'])
  gulp.watch('sass/**/*.{sass,scss}', ['sass'])
  gulp.watch(['index.html', 'build/**/*.{html,js,css}', 'stylesheets/**/*.css'], electron.reload)

gulp.task 'default', ['build']
