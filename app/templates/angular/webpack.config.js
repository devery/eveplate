const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => ({
    devtool: (argv.mode === 'development') ? 'cheap-eval-source-map' : 'none',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.ts']
    },
    module: {
        rules: [
            {
                // Mark files inside `@angular/core` as using SystemJS style dynamic imports.
                // Removing this will cause deprecation warnings to appear.
                test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
                parser: { system: true },  // enable SystemJS
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: { configFileName: path.resolve(__dirname, 'tsconfig.json') }
                    },
                    'angular2-template-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'to-string-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            },
        ]
    },
    plugins: [
        // Workaround for Critical dependency
        // The request of a dependency is an expression in ./node_modules/@angular/core/fesm5/core.js
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)fesm5/,
            path.resolve(__dirname, '../src')
        ),
        new HtmlWebpackPlugin({
            inject: false,
            template: path.join(__dirname, 'dist/index.html')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        open: true,
        hot: true
    },
});
