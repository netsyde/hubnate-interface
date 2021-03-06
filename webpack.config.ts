const path = require('path');

module.exports = {
  mode: 'production',
  // mode: "development",
	// watch: true,
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /(\.ts|\.tsx)$/, 
				loader: "ts-loader",
				exclude: /node_modules/,
				options: {
					transpileOnly: true
				}
      },
      {
				test: /\.s[ac]ss$/i,
				use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
			},
      {
				test: /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: '/dist/assets/',
          publicPath: '/dist/assets/',
				}
			},
    ],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'src/images'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@fonts': path.resolve(__dirname, 'src/fonts'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
};