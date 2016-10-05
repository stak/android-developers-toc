'use strict';
const url = require('../url.json');
const assert = require('assert');
const exec = require('child_process').exec;

const bin = 'bin/android-developers-toc.js';
const option = {
  maxBuffer: 1024 * 1024
};

describe('CLI', () => {
  it('works with default option', (done) => {
    exec(`${bin} ${Object.keys(url)[0]}`, option, (err, stdout, stderr) => {
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
    exec(`${bin} -t md ${Object.keys(url)[0]}`, option, (err, stdout, stderr) => {
      if (err) return done(err);
      if (stderr) return done(stderr);
      if (stdout.indexOf('- ') < 0) return done('fail');
      if (stdout.indexOf('    - ') < 0) return done('fail');
      done();
    });
  });

  it('prints help when no parameter is specified', (done) => {
    exec(`${bin}`, option, (err, stdout, stderr) => {
      if (err) return done(err);
      if (stderr) return done(stderr);
      if (stdout.indexOf('Usage') < 0) return done('fail');
      done();
    });
  });
});
