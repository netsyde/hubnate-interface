const path = require('path');

module.exports = {
  // mode: 'production',
  mode: "development",
	watch: true,
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
    ],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'src/images'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@routes': path.resolve(__dirname, 'src/routes'),
    },
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
};