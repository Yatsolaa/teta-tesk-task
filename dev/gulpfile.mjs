import gulp from 'gulp';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';

const sass = gulpSass(dartSass);

const paths = {
    scss: 'styles/**/*.scss',
    css: '../assets'
};

function compileSCSS() {
    return gulp.src(paths.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.css));
}

function watchFiles() {
    gulp.watch(paths.scss, compileSCSS);
}

export default gulp.series(compileSCSS, watchFiles);
export const build = compileSCSS;