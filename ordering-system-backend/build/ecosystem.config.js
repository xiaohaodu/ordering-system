module.exports = {
  apps: [
    {
      name: "ordering-system-backend", // app name
      script: "./index.js", // 启动执行文件
      watch: true,
      exec_mode: "cluster",
      instances: "max",
      watch_delay: 1000, // 文件变化后，延迟重启时间
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
