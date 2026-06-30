const { v4: uuidv4 } = require('uuid');

function genId(prefix) {
  return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
}

function genMobile() {
  return '9' + String(Math.floor(100000000 + Math.random() * 899999999));
}

function genPassword() {
  return Math.random().toString(36).slice(2, 8) + Math.floor(Math.random() * 90 + 10);
}

module.exports = { genId, genMobile, genPassword };
