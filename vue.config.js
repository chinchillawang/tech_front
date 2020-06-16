/*
 * @Descripttion:
 * @version: v1.0
 * @Author: chinchilla
 * @LastEditors: chinchilla
 * @Date: 2020-06-13 21:07:20
 * @LastEditTime: 2020-06-13 21:11:02
 */

module.exports = {
  outputDir: "dist", //build输出目录
  assetsDir: "assets", //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "localhost",
    port: "8080",
    https: false, //是否使用https协议
    hotOnly: false, //是否开启热更新
    proxy: {
      "/api": {
        target: "http://localhost:8392/api", //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  }
};
