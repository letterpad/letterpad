var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        dashboard: ['webpack-hot-middleware/client', './app/dashboard'],
        client: ['webpack-hot-middleware/client', './client/client']
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"dev"'
            }
        })
    ],
    module: {
        loaders: [
            // js
            {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: path.join(__dirname, 'app')
            }, {
                test: /\.js$/,
                loaders: ['babel-loader'],
                include: path.join(__dirname, 'client')
            },
            // CSS
            {
                test: /\.styl$/,
                include: path.join(__dirname, 'app'),
                loader: 'style-loader!css-loader!stylus-loader'
            }
        ]
    }
};