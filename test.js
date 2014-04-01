var expect = require('chai').expect;
var RE = require('./re.js');
var buildNFA = RE.buildNFA;
var runNFA = RE.runNFA;

test();

function test() {
  var ops = {
    partial: true
  };

  expect(runNFA('a', buildNFA('a', ops), ops)).to.equal(true);
  expect(runNFA('b', buildNFA('a', ops), ops)).to.equal(false);
  expect(runNFA('ab', buildNFA('ab', ops), ops)).to.equal(true);
  expect(runNFA('abccc', buildNFA('ab', ops), ops)).to.equal(true);
  expect(runNFA('abccc', buildNFA('c', ops), ops)).to.equal(true);
  expect(runNFA('asd', buildNFA('c', ops), ops)).to.equal(false);
  expect(runNFA('abcabc', buildNFA('abc', ops), ops)).to.equal(true);
  expect(runNFA('abdabc', buildNFA('abc', ops), ops)).to.equal(true);

  expect(runNFA('abbabc', buildNFA('ab*abc', ops), ops)).to.equal(true);
  expect(runNFA('ababc', buildNFA('ab*abc', ops), ops)).to.equal(true);
  expect(runNFA('abdabc', buildNFA('ab*abc', ops), ops)).to.equal(false);
  expect(runNFA('a', buildNFA('a*', ops), ops)).to.equal(true);
  expect(runNFA('b', buildNFA('a*', ops), ops)).to.equal(true);
  expect(runNFA('aaaa', buildNFA('a*', ops), ops)).to.equal(true);
  expect(runNFA('av', buildNFA('a*', ops), ops)).to.equal(true);
  expect(runNFA('v', buildNFA('a*', ops), ops)).to.equal(true);

  expect(runNFA('av', buildNFA('a+', ops), ops)).to.equal(true);
  expect(runNFA('a', buildNFA('a+', ops), ops)).to.equal(true);
  expect(runNFA('aa', buildNFA('a+', ops), ops)).to.equal(true);
  expect(runNFA('aab', buildNFA('a+', ops), ops)).to.equal(true);
  expect(runNFA('bb', buildNFA('ba+b', ops), ops)).to.equal(false);
  expect(runNFA('bab', buildNFA('ba+b', ops), ops)).to.equal(true);
  expect(runNFA('baaab', buildNFA('ba+b', ops), ops)).to.equal(true);

  expect(runNFA('aabc', buildNFA('a+b*c', ops), ops)).to.equal(true);
  expect(runNFA('aac', buildNFA('a+b*c', ops), ops)).to.equal(true);
  expect(runNFA('abc', buildNFA('a+b*c', ops), ops)).to.equal(true);
  expect(runNFA('bc', buildNFA('a+b*c', ops), ops)).to.equal(false);

  expect(runNFA('a', buildNFA('a?', ops), ops)).to.equal(true);
  expect(runNFA('a', buildNFA('ab?', ops), ops)).to.equal(true);
  expect(runNFA('ab', buildNFA('ab?', ops), ops)).to.equal(true);
  expect(runNFA('abb', buildNFA('ab?', ops), ops)).to.equal(true);

  expect(runNFA('bcdd', buildNFA('b?a*c+dd+', ops), ops)).to.equal(true);
  expect(runNFA('accdddd', buildNFA('b?a*c+dd+', ops), ops)).to.equal(true);
  expect(runNFA('ccdddd', buildNFA('b?a*c+dd+', ops), ops)).to.equal(true);
}
