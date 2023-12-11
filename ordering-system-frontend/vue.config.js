const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 9010,
  },
  configureWebpack: {
    plugins: [
      require("unplugin-vue-components/webpack").default({
        /* options */
      }),
      require("unplugin-auto-import/webpack").default({
        /* options */
      }),
    ],
  },
});
