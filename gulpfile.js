import gulp from 'gulp';
import browserSync from 'browser-sync';
import sassPkg from 'sass';
import gulpSass from 'gulp-sass';
import gulpCssimport from 'gulp-cssimport';
import {deleteAsync} from 'del';
import htmlmin from 'gulp-htmlmin';
import cleanCSS from 'gulp-clean-css';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import gulpImg from 'gulp-image';
import gulpWebp from 'gulp-webp';
import gulpAvif from 'gulp-avif';

import rename from 'gulp-rename';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';

import { stream as critical } from 'critical';

let dev = false;
const prepros = true;

const sass = gulpSass(sassPkg);

const webpackConf = {
  mode: dev ? 'development' : 'production',
  devtool: dev ? 'eval-source-map' : false,
  optimization: {
    minimize: false,
  },
  output: {
    filename: 'index.js',
  },
  module: {
    rules: [],
  },
};

if (!dev) {
  webpackConf.module.rules.push({
    test: /\.(js)$/,
    exclude: /(node_modules)/,
    loader: 'babel-loader',
  });
}


// tasks
// HTML
export const html = () => gulp
  .src('src/*.html')
  .pipe(htmlmin({
    removeComments: true,
    collapseWhitespace: true,
  }))
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream());

  
// CSS & SCSS
export const style = () => {
  if (prepros) {
    return gulp
      .src('src/assets/style/**/*.scss')
      .pipe(gulpif(dev, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS({
        2: {
          specialComments: 0
        }
      }))
      .pipe(gulpif(dev, sourcemaps.write('../maps')))
      .pipe(gulp.dest('dist/css'))
      .pipe(browserSync.stream());
  }

  return gulp
    .src('src/assets/style/index.css')
    .pipe(sourcemaps.init())
    .pipe(gulpCssimport({
      matchPattern: '*.css',
    }))
    .pipe(cleanCSS({
      2: {
        specialComments: 0
      }
    }))
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}


// JS
export const js = () =>
  gulp
    .src('src/assets/script/*.js')
    .pipe(gulpif(dev, sourcemaps.init()))
    .pipe(plumber())
    .pipe(webpackStream(webpackConf, webpack))
    .pipe(gulpif(!dev, gulp.dest('dist/js')))
    .pipe(gulpif(!dev, terser()))
    .pipe(
      rename({
        suffix: '.min',
      }),
    )
    .pipe(gulpif(dev, sourcemaps.write('../maps')))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());

// IMG
export const img = () => gulp
  .src('./src/assets/style/**/*.{png,jpg,jpeg,svg}')
  .pipe(gulpif(!dev, gulpImg({
    optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
    pngquant: ['--speed=1', '--force', 256],
    zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
    jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
    mozjpeg: ['-optimize', '-progressive'],
    gifsicle: ['--optimize'],
    svgo: true,
  })))
  .pipe(gulp.dest('dist/assets/style'))
  .pipe(browserSync.stream());

// AVIF
const avif = () => gulp
  .src('./src/assets/style/**/*.{png,jpg,jpeg}')
  .pipe(gulpAvif({
    quality: 55
  }))
  .pipe(gulp.dest('dist/assets/style'))
  .pipe(browserSync.stream());

// WEBP
const webp = () => gulp
  .src('./src/assets/style/**/*.{png,jpg,jpeg}')
  .pipe(gulpWebp({
    quality: 60
  }))
  .pipe(gulp.dest('dist/assets/style'))
  .pipe(browserSync.stream());


// Critical
export const critCSS = () => gulp
  .src('dist/*.html')
  .pipe(critical({
    base: 'dist/',
    inline: true,
    css: ['dist/css/index.css'],
  }))
  .on('error', err => {
    console.error(err.message);
  })
  .pipe(gulp.dest('dist'))


// Copy
export const copy = () => gulp
  .src('src/assets/fonts/**/*.{woff,woff2}', {
      base: 'src',
    },
  )
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.stream({
    once: true,
  })); 


// Server
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
  gulp.watch('./src/assets/style/**/*.{png,jpg,jpeg,svg}', img);
  gulp.watch('./src/assets/script/**/*.js', js);
  gulp.watch('./src/fonts/**/*', copy);
  gulp.watch('./src/assets/style/**/*.{png,jpg,jpeg}', avif);
  gulp.watch('./src/assets/style/**/*.{png,jpg,jpeg}', webp);
};


// Clear
export const clear = (done) => {
  deleteAsync(['dist/**/*', 'dist'], {force: true});
  done();
};


// run
export const develop = async() => {
  dev = true;
};

export const base = gulp.parallel(html, style, js, img, avif, webp, copy);

export const build = gulp.series(clear, base, critCSS);

export default gulp.series(develop, base, server);
