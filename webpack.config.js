const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");

const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    index: path.resolve("./src/components/index.tsx"),
    // options: path.resolve("./src/options/index.tsx"),
    background: path.resolve("./src/background/index.ts"),
    // "content-script": path.resolve("./src/content-script/index.ts"),
    // inject: path.resolve("./src/inject/index.ts"),
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx$/,
        exclude: /node_modules/,
      },
      {
        use: "asset/resource",
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                ident: "postcss",
                plugins: [tailwindcss, autoprefixer],
              },
            },
          },
        ],
        test: /\.css$/i,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src/static"),
          to: path.resolve("dist"),
        },
      ],
    }),
    ...getHtmlPlugins(["index"]),
  ],

  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: "Cross Check",
        filename: `${chunk}.html`,
        chunks: [chunk],
      })
  );
}
