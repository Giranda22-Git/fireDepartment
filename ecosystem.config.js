module.exports = {
  apps : [{
    name: 'fireDepartment-api',
    script: './back/index.js',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }]
}
