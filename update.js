const cli = require('./cli');
const path = require('path');
const fs = require('fs');
const packageJson = require('./package.json');
const urls = require('./url.json');
const badges = require('./readmeBadges.json');

const readmeFile = path.resolve(__dirname) + '/README.md';

function zip(a1, a2) {
  return a1.map((e, i) => [e, a2[i]]);
}

const pages = Object.keys(urls);
const promises = pages.map(k => cli.execute(k, 'md'))
Promise.all(promises).then(contents => {
  const header = '# ' + packageJson.name + '\n' + badges.join('\n');
  const joinedContents = zip(pages, contents).reduce((prev, [page, content]) =>
    prev + '\n\n## ' + page.toUpperCase() + '\n\n' + content
  , '');

  fs.writeFileSync(readmeFile, header + joinedContents);
  console.log('Updated successfully');
}).catch(error => console.error(error));
