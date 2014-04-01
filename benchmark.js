var testRegExp = require('./re.js').test;

var ops = {
  partial: true
};

var repeat_times = 50000;

console.time('my toy');
for (var i = 0; i < repeat_times; i++) 
  testRegExp('abc', 'abdabc', ops);
console.timeEnd('my toy');

console.time('V8 implementation');
for (var i = 0; i < repeat_times; i++) 
  (/abc/g).test('abdabc');
console.timeEnd('V8 implementation');

console.time('my toy');
for (var i = 0; i < repeat_times; i++) 
  testRegExp('a+b*c', 'abc', ops);
console.timeEnd('my toy');

console.time('V8 implementation');
for (var i = 0; i < repeat_times; i++) 
  (/a+b*c/g).test('abc');
console.timeEnd('V8 implementation');

console.time('my toy');
for (var i = 0; i < repeat_times; i++) 
  testRegExp('a+bca+b+cbcbcb', 'aaabcaaabbbcbcbcb', ops);
console.timeEnd('my toy');

console.time('V8 implementation');
for (var i = 0; i < repeat_times; i++) 
  (/a+bca+b+cbcbcb/g).test('aaabcaaabbbcbcbcb');
console.timeEnd('V8 implementation');

console.time('my toy');
for (var i = 0; i < repeat_times; i++) 
  testRegExp('a*b*c*d*e*', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccddddddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', ops);
console.timeEnd('my toy');

console.time('V8 implementation');
for (var i = 0; i < repeat_times; i++) 
  (/a*b*c*d*e*/g).test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccddddddddeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
console.timeEnd('V8 implementation');
