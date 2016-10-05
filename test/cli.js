const url = require('../url.json');
const assert = require('assert');
const exec = require('child_process').exec;

const option = {
  maxBuffer: 1024 * 1024
};

describe('CLI', () => {
  it('works with default option', (done) => {
    exec(`node cli.js ${Object.keys(url)[0]}`, option, (err, stdout, stderr) => {
      if (err) return done(err);
      if (stderr) return done(stderr);
      try {
        const obj = JSON.parse(stdout);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('works with markdown option', (done) => {
    exec(`node cli.js -t md ${Object.keys(url)[0]}`, option, (err, stdout, stderr) => {
      if (err) return done(err);
      if (stderr) return done(stderr);
      if (stdout.indexOf('- ') < 0) return done('fail');
      if (stdout.indexOf('    - ') < 0) return done('fail');
      done();
    });
  });

  it('prints help when no parameter is specified', (done) => {
    exec('node cli.js', option, (err, stdout, stderr) => {
      if (err) return done(err);
      if (stderr) return done(stderr);
      if (stdout.indexOf('Usage') < 0) return done('fail');
      done();
    });
  });
});
