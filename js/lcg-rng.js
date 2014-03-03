// Copyright (c) 2014 Oliver Lau, Heise Zeitschriften Verlag, www.ct.de
// All rights reserved.

var RNG = function (seed) {
  this.seed(seed || Date.now());
};
RNG.MAX_VALUE = 4294967296;
RNG.prototype.seed = function (seed) {
  if (typeof seed !== 'number')
    throw new TypeError('Parameter `seed` must be a number');
  this.X = seed;
};
RNG.prototype.next = function () {
  // LCG from the book 'Numerical Recipes'
  this.X = (1664525 * this.X + 1013904223) % RNG.MAX_VALUE;
  return this.X;
};
