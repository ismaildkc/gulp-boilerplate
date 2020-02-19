const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');


gulp.task('clean:dist', function () {
    return del.sync('dist');
})

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif)')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('svgs', function () {
    return gulp.src('app/svgs/**/*.+(svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/svgs'))
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: [
                "> 1%",
                "last 2 versions",
                "ie >= 11"
            ],
            cascade: false,
            flexbox: "no-2009"
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function () {
    browserSync.init({
        proxy: "localhost/gulp-boilerplate"
    })
})

gulp.task('watch', ['browserSync', 'sass', 'js'], function () {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/js/**/*.js', ['js']);
    gulp.watch('application/views/*.php', browserSync.reload);
});

gulp.task('js', function () {
    gulp.src('app/js/**/*')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: [
                ['@babel/preset-env']
            ]
        }))
        .pipe(concat('index.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('build', function (callback) {
    runSequence('clean:dist',
        ['sass', 'js', 'images', 'svgs', 'admins'],
        callback
    )
})

gulp.task('default', function (callback) {
    runSequence('build',
        ['watch'],
        callback
    )
})
