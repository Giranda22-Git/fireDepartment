module.exports = {
  apps : [{
    name: 'fireDepartment-api',
    script: './backEnd/index.js',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }]
}
