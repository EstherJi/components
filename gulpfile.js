
var gulp = require('gulp'),
	del = require('del'),
	fs = require('fs'),
	browserSync = require('browser-sync').create(),
	args = require('minimist')(process.argv.slice(2));

var source = 'src/' + args.p + '/';

gulp.task('browserSync', function(){
	browserSync.init({
		server: './',
		startPath: source + 'index.html'
	})

	gulp.watch(source + '**/*.css').on('change', browserSync.reload);
	gulp.watch(source + '**/*.js').on('change', browserSync.reload);
	gulp.watch(source + '*.html').on('change', browserSync.reload);
})

gulp.task('pathCheck', function(){
	if(!args.p){
		console.log('缺少文件路径 -p');
		return false;
	}

	return new Promise(function(resolve, reject){
		fs.stat(source, function(err, stat){
			if(!err){
				return resolve();
			}else if(err.code == 'ENOENT'){
				console.log('路径错误');
				return false;
			}
		})
	})
})

gulp.task('dev', gulp.series('pathCheck', 'browserSync'));