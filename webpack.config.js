const path = require('path')

const HTMLPLUGIN  = require('html-webpack-plugin');
const webpack  = require('webpack');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry : path.join(__dirname,'src/index.js'),
    output : {
        filename:'bundle_[hash:8].js',
        path:path.join(__dirname,'dist')
    },
    module : {
        rules:[
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.jsx$/,
                loader:'babel-loader'
            },
            //图片处理
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				use: [{
					loader: 'file-loader',
					options: {
						outputPath: 'img',
						name: '[name]_[hash:8].[ext]'
					}
				}]
            }           
        ]
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env' : {
                NODE_ENV : isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPLUGIN()
    ]
}

if(isDev){    
    config.module.rules.push({
        test:/\.styl$/,
        use:[
            'style-loader',
            'css-loader',
            {
                loader:'postcss-loader',
                options:{
                    sourceMap:true
                }
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
    config.devServer = {
        port:8080,
        host:'127.0.0.1',
        overlay:{
            errors:true
        },
        hot : true
    }
    
}else{
    config.entry = {
        app:path.join(__dirname,'/src/index.js'),
        vendor:['vue']
    }
    config.output.filename = 'js/[name]_[chunkHash:8].js'
    config.module.rules.push({
        test:/\.styl$/,
        use: [
            MiniCssExtractPlugin.loader,
            //'style-loader', //会将 css-loader 解析的结果转变成 JS 代码，运行时动态插入 style 标签来让 CSS 代码生效
            'css-loader',
            {
                loader:'postcss-loader',
                options:{
                    sourceMap:true
                }
            },
            'stylus-loader'
        ]
    })
    config.optimization = ({
        minimizer: [],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor'
                }
            }
        },
        runtimeChunk : {
            name: 'runtime'
        }
    });
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: "css/[name]_[contentHash:8].css"
        })
    )
}

module.exports = config