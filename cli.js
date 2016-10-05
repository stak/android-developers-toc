'use strict';
const program = require('commander');
const getToc = require('./index');
const packageJson = require('./package.json');
const urls = require('./url.json');

function addIndent(str, indent = 4) {
  return str.split('\n')
            .map(line => ' '.repeat(indent) + line)
            .join('\n');
}

function toMarkdown(toc) {
  return toc.map(item =>
    `- [${item.title}](${item.url})` + (item.children ?
                                       '\n' + addIndent(toMarkdown(item.children)) :
                                       '')).join('\n');
}

program.version(packageJson.version)
       .usage(`[options] <target: ${Object.keys(urls).join(', ')}>`)
       .description('Fetch and scrape https://developer.android.com/')
       .option('-t, --type [type]', 'Output format', /^(json|md)$/i, 'json')
       .parse(process.argv);

if (!program.args.length) {
    program.help();
    return;
}

getToc(program.args).then(v => {
  switch (program.type) {
  case 'json':
    process.stdout.write(JSON.stringify(v));
    break;
  case 'md':
    process.stdout.write(toMarkdown(v));
    break;
  default:
    process.stderr.write('invalid format was specified');
    process.exit(1);
    break;
  }
}).catch(err => {
  process.stderr.write(`failed to fetch "${program.args}"`);
  process.exit(1);
});
