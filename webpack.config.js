var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/jsx/instagram.jsx',
    output: {
        publicPath: "/",
        filename: 'bundle.js'
    },
    context: __dirname,
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    presets: ['stage-0', 'es2015', 'react']
                },
                exclude: /node_modules/,
                include: path.resolve(__dirname, 'src')
            },
            {test: /\.styl$/, loaders: ['style', 'css', 'stylus']}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
