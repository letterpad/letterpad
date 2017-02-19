var path = require('path');
var webpack = require('webpack');

module.exports = {
    devtool: 'source-map',
    entry: {
        dashboard: ['./app/dashboard'],
        client: ['./client/client']
    },
    output: {
        path: path.join(__dirname, 'public/js'),
        filename: '[name]-bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': "'production'"
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            // js
            {
                test: /\.js$/,
                loaders: ['babel'],
                include: path.join(__dirname, 'app')
            }, {
                test: /\.js$/,
                loaders: ['babel'],
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