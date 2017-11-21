const path = require('path');

module.exports = {
    output: {
        filename: 'theme.js',
        path: path.resolve(__dirname, 'assets')
    },
    devtool: 'source-map',
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    }
};
