var path = require('path');

module.exports = {
   output: {
      path: path.join(process.cwd(), './public/dist/scripts/pages'),
      filename: '[name].js'
   },
   resolve: {
      extensions: ['', '.js', '.vue'],
      alias: {
         'components': path.resolve(__dirname, './public/dist/components')
      }
   },
   resolveLoader: {
      fallback: [path.join(__dirname, './node_modules')]
   },
   module: {
      loaders: [
         { 
            test: /\.css$/, 
            loader: 'style!css'
         },
         { 
            test: /\.less$/,
            loader: 'style!css!less' 
         },
         { 
            test: /\.hbs$/, 
            loader: 'handlebars-loader', 
            query: {
               helperDirs: path.resolve(__dirname, './lib/handlebarHelper') 
            }
         },
         {
            test: /\.vue$/,
            exclude: /node_modules/,
            loader: 'vue'
         },
         {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015'],
               cacheDirectory: true
            }
         }
      ]
   }
};