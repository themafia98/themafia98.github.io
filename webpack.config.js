const path = require('path'), 
      webpack = require('webpack'),
      TerserPlugin = require('terser-webpack-plugin'), // minim
      extractWebpackPlugin = require('extract-text-webpack-plugin'), // for css files
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
     LiveReloadPlugin = require('webpack-livereload-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin'),
      CopyWebpackPlugin= require('copy-webpack-plugin'),
      autoprefixer = require('autoprefixer');

const prod = process.env.NODE_ENV === 'development';

const config = {
    mode: 'development', //"webpack-dev-server/client","webpack/hot/dev-server",
    entry: ['./src/js/main.js'],
    output : {
        path: path.resolve(__dirname, 'build'),
        filename: './js/bundle.js'
    },

    watch: true,
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: false,
                parallel: true,
                sourceMap: true, // Must be set to true if using source-maps in production
                terserOptions: {
                }
            }),
        ],
    },
    module: {

        rules: [
            {  /* собирает цсс */
                test: /\.scss$/,
                use: extractWebpackPlugin.extract({
                    fallback: 'style-loader', // inline if fail
                    use: [
                            { loader:'css-loader',
                                options: {
                                url: false
                              }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: [
                                        autoprefixer({
                                            browsers:['ie >= 11', 'last 2 version']
                                        })
                                    ]
                                }
                            },
                            { loader: 'sass-loader' },
                        ]
                })
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                exclude: /node_modules/,
                use: [
                    {
                    loader: 'babel-loader',
                    options: {
                        presets: [['@babel/preset-env',{
                            targets: {
                                browsers: ["last 2 versions", "ie >= 11"]
                            }
                        }]]
                    }
                }
            ]
            },
            {
                test: /\.(gif|png|jpeg|svg|jpg|ico)$/,
                use: [
                    {
                    loader: 'file-loader',
                    options: {
                        name:'[name].[ext]',
                        useRelativePath: true,
                    }
                    },
                    {
                      loader: 'image-webpack-loader',
                      options: {
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                          },
                          pngquant: {
                            quality: '65-90',
                            speed: 4
                          },
                          gifsicle: {
                            interlaced: false,
                          },


                      }
                    },
                  ],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                    name: '[name].[ext]',
                    outputPath: 'font/'
                    }
                }
            },
            {
                test: /\.html$/,

                    use: {
                        loader: 'html-loader',
                        options: {
                          attrs: [':data-src']
                        }
                        }
            }
        ]
    },


    plugins: []
};

if (!prod) { 

      // dev plugins

    config.plugins = config.plugins.concat([

        new CopyWebpackPlugin([{
            from: './src/js/lib/',
            to: './js/lib'
        }]),

        new CopyWebpackPlugin([{
            from: './src/audio/',
            to: './audio'
        }]),

        new CopyWebpackPlugin([{
            from: './src/js/data.json',
            to: './js'
        }]),

        // new webpack.HotModuleReplacementPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[name].js.map',
            exclude: ['style.css'],
            append: '\n//# sourceMappingURL=http://localhost:9001/[url]',
        }),
        new HtmlWebpackPlugin({hash: true,filename:'./index.html',template: 'src/index.html'}),
        new extractWebpackPlugin({filename: './style/style.css', disable: false, allChunks: true}), // main css
        new webpack.DefinePlugin({
            'processs.env.NODE_ENV': '"production"' // compiller if production
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
              preset: ['default'],
            },
            canPrint: true
          }),
        new webpack.IgnorePlugin({
            resourceRegExp: /^\.\/locale$/, // dir for import ignor
            contextRegExp: /moment$/ // import module for ignore
          }),
    ]);
    new webpack.HotModuleReplacementPlugin()
}

module.exports = config;
