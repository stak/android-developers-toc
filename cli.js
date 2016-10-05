'use strict';
const getToc = require('./index');
const packageJson = require('./package.json');
const urls = require('./url.json');
const escape = require('escape-html');

function addIndent(str, indent = 4) {
  return str.split('\n')
            .map(line => ' '.repeat(indent) + line)
            .join('\n');
}

function toMarkdown(toc) {
  return toc.map(item =>
    `- [${escape(item.title)}](${item.url})` + (item.children ?
                                       '\n' + addIndent(toMarkdown(item.children)) :
                                       '')).join('\n');
}

function configure(program, argv) {
  program.version(packageJson.version)
         .usage(`[options] <target: ${Object.keys(urls).join(', ')}>`)
         .description('Fetch and scrape https://developer.android.com/')
         .option('-t, --type [type]', 'Output format', /^(json|md)$/i, 'json')
         .parse(argv);
}

function execute(args, format) {
  return new Promise((resolve, reject) => {
    getToc(args).then(v => {
      switch (format) {
      case 'json':
        resolve(JSON.stringify(v));
        break;
      case 'md':
        resolve(toMarkdown(v));
        break;
      default:
        reject(new Error('invalid format was specified'));
      }
    }).catch(err => {
      reject(new Error(`failed to fetch "${args}"`));
    });
  });
};

module.exports = {
  configure,
  execute,
};
