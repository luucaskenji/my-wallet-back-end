const stringStripHtml = require('string-strip-html');

const sanitize = array => {
  array.forEach((e, i) => {
    array.splice(i, 1, stringStripHtml(e).result.trim());
  });

  return array;
};

module.exports = sanitize;