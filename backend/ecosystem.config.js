module.exports = {
  apps: [{
    name: 'discogs-uploader-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      CORS_ORIGIN: 'https://your-frontend-domain.com'
    }
  }]
}; 