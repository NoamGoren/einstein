const path = require('path');
module.exports = {
    entry: path.resolve('./src/index.jsx'),
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: {
                    loader:'babel-loader',
                    options: {
                        presets: ["env","react"]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            }
        ]
    },
    target: 'web'
};