// deploy.js (в корне проекта)
const ghpages = require('gh-pages');

ghpages.publish(
  'build',
  {
    branch: 'gh-pages',
    repo: 'https://github.com/Vlplay021/uni23-26.git',
    dotfiles: true
  },
  (err) => {
    if (err) {
      console.error('Error deploying:', err);
    } else {
      console.log('Deployment successful!');
    }
  }
);