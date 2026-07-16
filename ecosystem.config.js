export default {
  apps: [
    {
      name: "tradexpress-api",
      cwd: "./tradexpress-api",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      env: { NODE_ENV: "production", PORT: 4000 }
    },
    {
      name: "tradexpress.co",
      cwd: "./",
      script: "./node_modules/vite/bin/vite.js",
      args: "preview --host 0.0.0.0 --port 3000",
      instances: 1,
      exec_mode: "fork"
    }
  ]
}
