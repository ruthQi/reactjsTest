var gulp = require('gulp');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
//var colors = require('colors');
var runSequence = require('run-sequence');
var through = require('through2');
var filter = require('gulp-filter');
var spritesmith = require('gulp.spritesmith');
var del = require('del');
var rev = require('gulp-rev');
var beautify = require('gulp-beautify');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var webpack = require('webpack-stream');
var named = require('vinyl-named');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var imagemin = require('gulp-imagemin');
//var livereload = require('gulp-livereload');
var server = require('gulp-express');
var gulpIf = require('gulp-if');
//var px2rem = require('gulp-px2rem');
//var newer = require('gulp-newer');
var changed = require('gulp-changed');
//var print = require('gulp-print');
var size = require('gulp-size');
var Vinyl = require('vinyl');
//var rename = require('gulp-rename');
//var ejsMates = require('ejs-mate');
var replace = require('gulp-replace');
var Ftp = require('ftp');
var Pem = require('pem');
var slash = require('slash');
var fileHelper = require('./lib/fileHelper');
var packageJson = require('./package.json');
var CONFIG = {
   isDebug: false,
   isPreview: false,
   isDeploy: false,
   isProduction: false,
   firstServerRun: true
};
var resourceSrcBasePath = './public/src';
var resourceDistBasePath = './public/dist';
var builtBasePath = './public/built';
var cdnPath = packageJson.cdnDomain + packageJson.projectDirPath;
var projectDirPath = packageJson.projectDirPath;

gulp.task('sprite', function(cb) {
   var spriteOptions = require('./gulp/options/sprites')(resourceSrcBasePath, resourceDistBasePath);
   var item = {}, spriteData = null;
   Object.keys(spriteOptions).map(function(key, index) {
      item = spriteOptions[key];
      // console.log('------------------------------------------------');
      // console.log(item);
      spriteData = gulp.src(item.src)
                       .pipe(spritesmith(item))
                       .pipe(gulp.dest('./'));
   });

   // console.log('====================================================');
   // console.log(spriteData);

   return spriteData;
});

var AUTOPREFIXER_BROWSERS = [
   'ie >= 8',
   'ff >= 30',
   'chrome >= 34',
   'safari >= 7',
   'opera >= 23',
   'ios >= 7',
   'android >= 2.3',
   'bb >=   10'
];

function fsOperationFailed(stream, sourceFile, err) {
   if (err) {
      if (err.code !== 'ENOENT') {
         stream.emit('error', new gutil.PluginError('gulp-changed', err, {
            fileName: sourceFile.path
         }));
      }
      stream.push(sourceFile);
   }
   return err;
}


gulp.task('copy:image:page', function () {
   return gulp.src([resourceSrcBasePath + '/images/**/*', '!' + resourceSrcBasePath + '/images/sprite/**/*'])
              .pipe(changed(resourceDistBasePath + '/images'))
              .pipe(gulp.dest(resourceDistBasePath + '/images'));
});

gulp.task('copy:font', function () {
   return gulp.src(resourceSrcBasePath + '/font/**')
              .pipe(changed(resourceDistBasePath + '/font'))
              .pipe(gulp.dest(resourceDistBasePath + '/font'));
});

gulp.task('copy:less', function () {
   return gulp.src(resourceSrcBasePath + '/less/**/**/*')
              .pipe(changed(resourceDistBasePath + '/less'))
              .pipe(gulp.dest(resourceDistBasePath + '/less'));
});

gulp.task('copy:crossdomain:dist', function () {
   return gulp.src(resourceSrcBasePath + '/crossdomain.xml')
              // .pipe(changed(resourceDistBasePath))
              .pipe(gulp.dest(resourceDistBasePath));
});

gulp.task('copy:crossdomain:built', function () {
   return gulp.src(resourceSrcBasePath + '/crossdomain.xml')
              .pipe(gulp.dest(builtBasePath));
});


var px2remOptions = {
   rootValue: 100,
   replace: true
};
gulp.task('less', function() {
   // console.log('gulp less');
   return gulp.src(resourceSrcBasePath + '/less/**/*.less')
               // .pipe(newer({dest:resourceDistBasePath + '/style', ext: '.css'}))
               .pipe(changed(resourceDistBasePath + '/style', {extension: '.css', hasChanged: function (stream, cb, sourceFile, targetPath) {
                  fs.stat(targetPath, function (err, targetStat) {
                     if (!fsOperationFailed(stream, sourceFile, err)) {
                        if (sourceFile.stat.mtime > targetStat.mtime) {
                           // console.log('push sourceFile = ' + sourceFile.path);
                           stream.push(sourceFile);

                           var relativeSourceFilePath = sourceFile.path.replace(path.resolve(process.cwd(), resourceSrcBasePath + '/less'), '');
                           var lessPath = path.resolve(process.cwd(), resourceSrcBasePath + '/less');
                           fileHelper.eachFile(lessPath, function(path) {
                              var code = fs.readFileSync(path, 'utf-8');

                              var regex = new RegExp(relativeSourceFilePath, 'g');
                              if (regex.test(code)) {
                                 // console.log('push path1path1 = ' + path);
                                 stream.push(new Vinyl({
                                    cwd: sourceFile.cwd,
                                    base: sourceFile.base,
                                    path: path,
                                    contents: new Buffer(code)
                                 }));
                              }
                           });
                        }
                     }
                     cb();
                  });
               }}))
               // .pipe(print())
               .pipe(less())
               // .pipe(sourcemaps.init())
               .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
               // .pipe(sourcemaps.write('.'))
               //.pipe(px2rem(px2remOptions))
               .pipe(gulp.dest(resourceDistBasePath + '/style'))
               .pipe(gulpIf(CONFIG['isDebug'] && !CONFIG['firstServerRun'], server.notify()));
});


gulp.task('webpack', function() {
   return gulp.src(resourceSrcBasePath + '/script/page/**/*')
              .pipe(named())
              .pipe(webpack(require('./webpack.config.js')))
              .pipe(gulp.dest(resourceDistBasePath + '/script/page/'))
              .pipe(gulpIf(CONFIG['isDebug'] && !CONFIG['firstServerRun'], server.notify()));
});

gulp.task('watch', function () {
   gulp.watch([resourceSrcBasePath + '/images/sprite/**/*'], function(){ runSequence('sprite', 'less')});
   gulp.watch([resourceSrcBasePath + '/images/**/*', '!' + resourceSrcBasePath + '/images/sprite/**/*'], ['copy:image:page']);
   gulp.watch([resourceSrcBasePath + '/less/**/*.less'], function(){ runSequence('copy:less', 'less')});
   gulp.watch([resourceSrcBasePath + '/script/**/*.js'], ['webpack']);
   //gulp.watch([resourceSrcBasePath + '/components/**/*'], function(){ runSequence('component', 'webpack')});
});

gulp.task('rev', function(){
   var cssFilter = filter('**/*.css', { restore: true });
   var jsFilter = filter('**/*.js', { restore: true });
   var imageFilter = filter('**/*.png', { restore: true });

   return gulp.src([resourceDistBasePath + '/style/page/**/*.css',
                    resourceDistBasePath + '/style/common.css',
                    resourceDistBasePath + '/style/*.css',
                    resourceDistBasePath + '/script/page/**/*.js',
                    resourceDistBasePath + '/images/**/*'], {base: resourceDistBasePath})
              .pipe(cssFilter)
              // .pipe(print())
              .pipe(cssmin({
                 keepBreaks: !CONFIG['isDeploy']
              }))
              .pipe(cssFilter.restore)
              .pipe(jsFilter)
              .pipe(gulpIf(CONFIG['isDeploy'], uglify({
                 output: {
                    ascii_only: true
                 }
              }), beautify()))
              .pipe(jsFilter.restore)
              .pipe(imageFilter)
              .pipe(imagemin())
              .pipe(size({title: 'source images'}))
              .pipe(imageFilter.restore)
              .pipe(rev())
              .pipe(gulp.dest(builtBasePath))
              .pipe(rev.manifest())
              .pipe(gulp.dest('./public'));
});

gulp.task('htmlReplace', function(){
  var manifest = require('./public/rev-manifest.json');
  
  return gulp.src('./views/dev/**/*.ejs', {base: './views/dev'})
             // .pipe(revReplace({manifest: manifest}))
             .pipe(replace(/\/(?:style|script|images)\/.*?\.(?:css|js|png|jpg|gif)/gi, function ($0) {
                var key = $0.replace(/^\//, '');
                // console.log('key = ' + key);
                // console.log('manifest[key] = ' + manifest[key]);
                var outputPath = '';
                if (manifest[key]) {
                   if (CONFIG['isProduction']) {
                      outputPath = cdnPath + manifest[key];
                   } else {
                      outputPath = '/' + manifest[key];
                   }
                } else {
                   outputPath = $0;
                   gutil.log(('no replace key = ' + key).red);
                }
                return outputPath;
             }))
             .pipe(gulp.dest('./views/release'));
});

gulp.task('cssReplace', function() {
  var manifest = require('./public/rev-manifest.json');

  return gulp.src(['./public/built/style/**/*.css',
                   './public/built/script/**/*.js'
                  ], {base: '.'})
             .pipe(replace(/\/?(?:font|images)\/.*?\.(?:png|jpg|gif|eot|woff|ttf|svg)/gi, function ($0) {
                var key = $0.replace(/^\//, '');
                // console.log('key = ' + key);
                // console.log('manifest[key] = ' + manifest[key]);
                var outputPath = '';
                if (manifest[key]) {
                   if (CONFIG['isDeploy']) {
                      outputPath = cdnPath + manifest[key];
                   } else {
                      outputPath = '/' + manifest[key];
                   }
                } else {
                   outputPath = $0;
                   gutil.log(('no replace key = ' + key).red);
                }
                return outputPath;
             }))
             .pipe(gulp.dest('./'));
});

var uploadFiles = [];
gulp.task('sftp:files', function(cb){
   return gulp.src(['./public/built/style/**/*',
                    './public/built/script/**/*',
                    './public/built/images/**/*',
                    './public/built/font/**/*'
                   ])
               .pipe(through.obj(function(file, encode, cb) {
                  if (!file.isNull()) {
                     uploadFiles.push(slash(path.relative(process.cwd(), file.path)))
                  }
                  cb(null, file, encode);
               }));
});

///TODO: 处理ftp根目录权限
var fixedFtpPath = (function () {
   var ftpBasePath = packageJson.sftp.ftpBasePath || '/';
   ftpBasePath = ftpBasePath.replace(/^\/|\/$/gi, '');

   return function (path) {
      if (ftpBasePath !== '') {
         path = path.replace(new RegExp('^\/' + ftpBasePath), '');
      }
      return path;
   }
})();

gulp.task('sftp:upload', function(cb){
   var ftp = new Ftp();
   var ftpFiles = [];

   ftp.on('ready', function() {
      gutil.log('[INFO] ftp connect ready!!!!');
      ftp.cwd(projectDirPath, function (err) {
         if (err) {
            gutil.log('[INFO] ftp mkdir ' + fixedFtpPath(projectDirPath).green);
            ftp.mkdir(fixedFtpPath(projectDirPath), true, function() {
               startFtp();
            });
         } else {
            startFtp();
         }
      });
   });

   function startFtp() {
      gutil.log('[INFO] ftp start!!!!')
      var walkInto = function (src, callback) {
         src = fixedFtpPath(src);
         gutil.log('[INFO] ftp list src = ' + src);

         ftp.list(src, function (err, files) {
            var pending = typeof files !== 'undefined' ? files.length : 0;
            if (!pending) {
               return callback();
            }
            files.forEach(function (item) {
               var filePath = src + item.name;
               if (item.type === 'd') {
                  filePath = filePath + '/';
                  walkInto(filePath, function(err, res){
                     if (!--pending) {
                        callback();
                     }
                  });
               } else {
                  ftpFiles.push(filePath.replace(fixedFtpPath(projectDirPath), ''));
                  if (!--pending) {
                     callback();
                  }
               }
            });
         });
      };
      
      walkInto(projectDirPath, function () {
         // console.log('ftpFiles');
         // console.log(ftpFiles);
         var newFiles = uploadFiles.filter(function (file) {
            var flag = true;

            if (ftpFiles.indexOf(file.replace(/^public\/built\//i, '')) !== -1) {
               flag = false;
            }
            return flag;
         });
         console.log('newFiles');
         console.log(newFiles);
         onUploadFiles(newFiles);
      });
   }

   function onUploadFiles(newFiles) {
      gutil.log('[INFO] ftp uploading!!!!');
      var i = 0;

      var filesLength = newFiles.length;
      if (filesLength != 0) {
         gutil.log('[INFO]' + new String(filesLength) + ' 个文件需要上传.');
         
         newFiles.forEach(function(file) {
            var destPath = projectDirPath + file.replace(/^public\/built\//i, '');
            destPath = fixedFtpPath(destPath);
            console.log('destPath = ' + destPath);
            ftp.mkdir(destPath.match(/(.*)\/.*/)[1], true, function() {
               ftp.put(file, destPath, function(err) {
                  if (err) {
                     gutil.log(err);
                  } else {
                     i++;
                     gutil.log('[INFO] File ' + destPath.cyan + ' uploaded.' + ' 还有 ' + new String(filesLength - i).cyan + ' 个文件需要上传.');
                     if (i == filesLength) {
                        ftp.end();
                        gutil.log('upload Done!'.green)
                        cb();
                     }
                  }
               });
            });
         });
      } else {
         ftp.end();
         gutil.log('[INFO] no file to upload!'.green)
         cb();
      }
   };

   Pem.createCertificate({}, function(err, keys) {
      if (err) {
         gutil.log(err)
      }
      keys = keys || {};

      var options = packageJson.sftp;

      ftp.connect({
         host: options.auth.host,
         port: options.auth.port,
         user: options.auth.user.username,
         password: options.auth.user.password,
         secure: options.auth.secure,
         secureOptions: {
            key: undefined,
            cert: undefined,
            requestCert: true,
            rejectUnauthorized: false
         }
      });
   });
});

gulp.task('clean:static', function (cb) {
   return del([
      resourceSrcBasePath + '/less/sprites/**',
      resourceDistBasePath,
      builtBasePath,
      './views/release',
   ], {force: true}, cb);
});


gulp.task('server', function() {
   var options = {
   };
   options.env = process.env || {};
   if (CONFIG.isDebug) {
      options.env.NODE_ENV = 'development';
   } else if (CONFIG.isPreview) {
      options.env.NODE_ENV = 'preview';   
   } else if (CONFIG.isDeploy) {
      options.env.NODE_ENV = 'production';
   }
   server.run(['bin/www'], options);
   if (CONFIG['firstServerRun']) {
      CONFIG['firstServerRun'] = false;
   }
});

gulp.task('server:preview', function(){
  var options = {
  };
  options.env = process.env || {};
  options.env.NODE_ENV = 'preview';
  server.run(['bin/www'], options, false);
});

gulp.task('dev', function (done) {
   CONFIG['isDebug'] = true;
   runSequence(
      'clean:static',
      'sprite',
      'copy:image:page',
      //'copy:font',
      'copy:less',
      'copy:crossdomain:dist',
      'less',
      //'component',
      'webpack',
      'watch',
      'server',
   done);
});

gulp.task('preview', function (done) {
   CONFIG['isPreview'] = true;
   runSequence(
      'clean:static',
      'sprite',
      'copy:image:page',
      //'copy:font',
      'copy:less',
      'copy:crossdomain:built',
      'less',
      //'component',
      'webpack',
      'rev',
      'htmlReplace',
      'cssReplace',
      //'ursLoginReplace',
   done);
});

gulp.task('deploy', function (done) {
   CONFIG['isDeploy'] = true;
   runSequence(
      'clean:static',
      'sprite',
      'copy:image:page',
      //'copy:font',
      'copy:less',
      'less',
      //'component',
      'webpack',
      'rev',
      'cssReplace',
      //'ursLoginReplace',
      'sftp:files',
      'sftp:upload',
   done);
});

gulp.task('production', function (done) {
   CONFIG['isProduction'] = true;
   runSequence(
      'clean:static',
      'copy:crossdomain:built',
      'htmlReplace',
   done);
});

gulp.task('default', function () {
   console.log('default');
});
