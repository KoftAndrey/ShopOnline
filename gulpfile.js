import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import gulpCssimport from 'gulp-cssimport';
import {deleteAsync} from 'del';

const prepros = true;

const sass = gulpSass(sassPkg);

// tasks
export const html = () => gulp
  .src('src/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());

export const style = () => {
  if (prepros) {
    return gulp
      .src('src/assets/style/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  }

  return gulp
    .src('src/assets/style/index.css')
    .pipe(gulpCssimport({
      matchPattern: '*.css',
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

export const js = () => gulp
  .src('src/assets/script/*.js')
  .pipe(gulp.dest('dist/js'))
  .pipe(browserSync.stream());

export const copy = () => gulp
  .src([
      'src/assets/fonts/**/*.{woff,woff2}',
      'src/assets/style/**/*.{png,jpg,jpeg,svg,webp}',
    ], {
      base: 'src',
    },
  )
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream({
    once: true,
  })); 

export const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'dist',
    },
  });

  gulp.watch('./src/**/*.html', html);
  gulp.watch(prepros ? './src/assets/style/**/*.scss' : './src/assets/style/**/*.css', style);
  gulp.watch('./src/assets/script/**/*.js', js);
  gulp.watch(['./src/fonts/**/*', './src/assets/style/**/*.{png,jpg,jpeg,svg,webp}'], copy);
};

export const clear = (done) => {
  deleteAsync(['dist/**/*', 'dist'], {force: true});
  done();
};


// run
export const base = gulp.parallel(html, style, js, copy);

export const build = gulp.series(clear, base);

export default gulp.series(
  base,
  server,
);
