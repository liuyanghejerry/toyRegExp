var RE = require('./re.js');

var pattern = process.argv[2];
var text = process.argv[3];
var options = {
  partial: true
};

console.log(RE.test(pattern, text, options));