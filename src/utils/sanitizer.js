const stringStripHtml = require('string-strip-html');

const sanitize = array => {
  array.forEach((e, i) => {
    array.splice(i, 1, stringStripHtml(e).result);
  });

  return array;
};

module.exports = sanitize;