const path = require('path');
const gulp = require('gulp');
const themekit = require('@shopify/themekit');
const del = require('del');

function buildDist() {
    del('build').then(() => {
        gulp.src(['src/**/*'] ).pipe(gulp.dest('build'));
    });
}

gulp.task('default', function() {
    // themekit.command({
    //   args: ['version']
    // }, function(err) {
    //   if (err) {
    //     console.error(err);
    //     return;
    //   }
    //
    //   console.log('Theme Kit command has completed.');
    // });
    console.log('Default');
    buildDist();
});

gulp.task('watch', function() {
    buildDist();
    gulp.watch('src/**/*').on('change', function(event) {
        if (event.type == 'deleted') {
            del('build/**' + path.basename(event.path));
            console.log('File deleted: ' + path.basename(event.path));
        } else {
            console.log('Other');
            buildDist();
        }
    });
});
