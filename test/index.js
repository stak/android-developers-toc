const getToc = require('../');
const url = require('../url.json');
const assert = require('assert');

describe('getToc()', () => {
  const succ = getToc(Object.keys(url)[0]);
  const fail = getToc('bad category name');

  it('returns Promise', () => {
    assert(typeof fail.then === 'function');
    assert(typeof succ.then === 'function');
  });

  it('rejects when unknown category name is specified', () => {
    return new Promise((resolve, reject) => {
      fail.then(v => reject('fail'))
          .catch(err => resolve());
    });
  });

  it('works with all pages defined in url.json', () => {
    const ps = Object.keys(url).map(k => getToc(k));
    return Promise.all(ps).then(values => {
      values.forEach(v => {
        if (v.length == 0) throw new Error('fail');
      });
    }, err => { throw new Error('fail') });
  });
});
