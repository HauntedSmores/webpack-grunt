const path = require('path');
const gulp = require('gulp');
const flatten = require('gulp-flatten');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const changed = require('gulp-changed');
const svg_sprite = require('gulp-svg-sprite');
const webpack = require('webpack-stream');
const webpack_prod = require('./webpack.prod.config.js');
const webpack_dev = require('./webpack.dev.config.js');
const themekit = require('@shopify/themekit');
const del = require('del');
const chalk = require('chalk');

let sprite_config = {
	mode: {
		symbol: {		// Activate the «css» mode
            dest: '',
			inline: true,
            sprite: 'icons',
		}
	}
};

// Clear build folder
gulp.task('clear', function() {
    return del.sync('build');
});

// Compile sass
gulp.task('sass', function () {
  return gulp.src('src/assets/styles/theme.scss')
    .pipe(sass({ outFile: 'theme.scss.liquid' }).on('error', sass.logError))
    .pipe(rename('theme.css.liquid'))
    .pipe(gulp.dest('build/assets'));
});

gulp.task('migrate', function() {
    return gulp.src(['src/**', '!src/assets', '!src/assets/**'])
        .pipe(changed('build'))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['clear', 'sass'], function() {
    // Webpack
    gulp.src('src/assets/scripts/theme.js')
        .pipe(webpack(webpack_prod))
        .pipe(gulp.dest('build/assets'));

    // Copy everything except assets folder contents
    gulp.src(['src/**', '!src/assets', '!src/assets/**']).pipe(gulp.dest('build'));

    // Create svg spritesheet from icons folder
    gulp.src('src/assets/images/icons/**/*.svg')
        .pipe(svg_sprite(sprite_config))
        .pipe(gulp.dest('build/assets'));

    // Copy and flatten all assets, except styles and scripts, to build/assets
    return gulp.src(['src/assets/**', '!src/assets/{scripts,styles}', '!src/assets/{scripts,styles}/**'])
        .pipe(flatten())
        .pipe(gulp.dest('build/assets'));

});

gulp.task('watch', function() {
    let liquid_watcher = gulp.watch(['src/**', '!src/assets', '!src/assets/**']);
    liquid_watcher.on('change', function(event) {
        console.log(chalk.green('[LIQUID]') + 'File ' + event.path + ' was ' + event.type + ', running tasks...');
        if (event.type == 'changed' || event.type == 'added') {
            gulp.src(['src/**', '!src/assets', '!src/assets/**'])
                .pipe(changed('build'))
                .pipe(gulp.dest('build'));
        } else if (event.type == 'deleted') {
            console.log(chalk.red('[Deleted]'));
            console.log()
            del.sync('build/**/' + path.basename(event.path));
        }
    });
});

// gulp.task('watch', ['build'], function() {
//
//     gulp.src('src/assets/scripts/theme.js')
//         .pipe(webpack(webpack_dev))
//         .pipe(gulp.dest('build/assets'));
//
//     let liquid_watcher = gulp.watch(['src/**', '!src/assets', '!src/assets/**'], ['migrate']);
//     liquid_watcher.on('change', function(event) {
//         console.log(chalk.green('[LIQUID]') + 'File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
//
//     let sass_watcher = gulp.watch('src/assets/styles/**/*.scss', ['sass']);
//     sass_watcher.on('change', function(event) {
//         console.log(chalk.magentaBright('[SCSS]') + 'File ' + event.path + ' was ' + event.type + ', running tasks...');
//     });
// });
