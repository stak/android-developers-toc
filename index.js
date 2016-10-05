const axios = require('axios');
const cheerio = require('cheerio');
const urls = require('./url.json');

function traverse($, li) {
  if ($(li).hasClass('nav-section')) {
    const div = $(li).find('> div');
    const children = $(li).find('> ul > li').map((i, e) => traverse($, e)).get();
    return {
      title: div.find('> a').text(),
      url: div.find('> a').prop('href'),
      children: children,
    };
  } else {
    return {
      title: $(li).find('> a').text(),
      url: $(li).find('> a').prop('href'),
    }
  }
}

function dom2obj($) {
  return $('#nav > li').map((i, e) => traverse($, e))
                       .get();
}

function getToc(categoryName) {
  const url = urls[categoryName];
  if (!url) {
    return Promise.reject(new Error(`invalid category name "${categoryName}"`));
  }

  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      if (res.status === 200) {
        return res.data;
      } else {
        reject(new Error(`res.status is ${res.status}`));
      }
    })
    .then(data => cheerio.load(data))
    .then($ => dom2obj($))
    .then(obj => resolve(obj))
    .catch(err => reject(err));
  });
}

module.exports = getToc;
