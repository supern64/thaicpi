module.exports = {
    apps: [{
      name: "thaicpi",
      script: './build/index.js',
      watch: '.',
      env: {
        PORT: 3532,
        ORIGIN: "https://thaicpi.cirnoslab.me",
        NODE_ENV: "production",
      }
    }],
  
    deploy: {
      production: {
        user: 'node',
        host: 'fubuki.cirnoslab.me',
        ref: 'origin/master',
        repo: 'git@github.com:supern64/thaicpi.git',
        path: '/var/www/thaicpi',
        key: 'deploy.key',
        
        'pre-deploy-local': '',
        'post-deploy' : 'bun install && bun run build && pm2 reload ecosystem.config.cjs',
        'pre-setup': ''
      }
    }
  };