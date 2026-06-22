const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

/** @param {unknown} _env @param {{ mode?: string }} argv */
module.exports = (_env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/main.tsx",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      clean: true,
      publicPath: "/",
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "index.html" }),
      new webpack.DefinePlugin({
        "process.env.SUPABASE_URL": JSON.stringify(
          process.env.SUPABASE_URL ?? ""
        ),
        "process.env.SUPABASE_ANON_KEY": JSON.stringify(
          process.env.SUPABASE_ANON_KEY ?? ""
        ),
      }),
    ],
    devServer: {
      historyApiFallback: true,
      port: 3000,
      hot: true,
      static: {
        directory: path.join(__dirname, "public"),
      },
    },
    devtool: isProd ? "source-map" : "eval-source-map",
  };
};
