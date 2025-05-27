module.exports = {
  apps: [
    {
      name: 'server-spasi',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
    },
  ],
};
