// Copyright (c) 2014 Oliver Lau, Heise Zeitschriften Verlag, www.ct.de
// All rights reserved.

var Point = function (x, y) {
  this.x = x;
  this.y = y;
};


(function () {
  "use strict";

  /*******************************************************************
    Die Software wurde zu Lehr- und Demonstrationszwecken geschaffen
    und ist nicht für den produktiven Einsatz vorgesehen. Der Autor
    und der Heise Zeitschriften Verlag haften nicht für Schäden, die
    aus der Nutzung der Software entstehen, und übernehmen keine
    Gewähr für ihre Vollständigkeit, Fehlerfreiheit und Eignung für
    einen bestimmten Zweck.
  ********************************************************************/

  var REPS = 100000000;
  var NUM_RUNS = 5;
  var nRun = 0;
  var out;
  var results = {};

  var Stopwatch = (function () {
    var t0 = Date.now();
    return {
      elapsed: function () { return Date.now() - t0; },
      start: function () { t0 = Date.now(); }
    };
  })();


  function print_result(s, n, ms) {
    var rate = 1e-3 * n / ms;
    if (results[s] === undefined) {
      results[s] = 0;
    }
    else {
      results[s] += rate;
    }
    out.append('<tr><td class="name">' + s + '</td><td class="result"><span class="result">' + rate.toFixed(1) + '</span></td></tr>');
  }


  function run(f, delay) {
    var promise = $.Deferred();
    if (delay === undefined)
      delay = 100;
    setTimeout(function () {
      Stopwatch.start();
      f.call();
      promise.resolve();
    }, delay /* time to repaint DOM */);
    return promise;
  }


  function go_for() {
    return run(function () {
      var N = REPS, i, sum = 0;
      for (i = 0; i < N; ++i) {
        sum += i;
      }
      print_result('<code>for (...)</code>', N, Stopwatch.elapsed());
    });
  }


  function go_while() {
    return run(function () {
      var N = REPS, i = N, sum = 0;
      while (i--) {
        sum += i;
      }
      print_result('<code>while (i--)</code>', N, Stopwatch.elapsed());
    });
  }


  function go_cmp_value() {
    return run(function () {
      var N = REPS, i;
      for (i = 0; i < N; ++i) {
        if (i < 50000000)
          continue;
        else if (i > 50000000)
          continue;
      }
      print_result('<code>if (i < 50000000) ...</code>', N, Stopwatch.elapsed());
    });
  }


  function go_cmp_variable() {
    return run(function () {
      var N = REPS, i, C = 50000000;
      for (i = 0; i < N; ++i) {
        if (i < C)
          continue;
        else if (i > C)
          continue;
      }
      print_result('<code>if (i < C) ...</code>', N, Stopwatch.elapsed());
    });
  }


  function go_a_typeof() {
    return run(function () {
      var N = REPS, i, a = 'foo';
      for (i = 0; i < N; ++i) {
        if (typeof a === 'undefined')
          continue;
      }
      print_result('<code>if (typeof a === "undefined") ...</code>', N, Stopwatch.elapsed());
    });
  }


  function go_a_undefined() {
    return run(function () {
      var N = REPS, i, a = 'foo';
      for (i = 0; i < N; ++i) {
        if (a === undefined)
          continue;
      }
      print_result('<code>if (a === undefined) ...</code>', N, Stopwatch.elapsed());
    });
  }


  function go_a_not() {
    return run(function () {
      var N = REPS, i, a = 'foo';
      for (i = 0; i < N; ++i) {
        if (!a)
          continue;
      }
      print_result('<code>if (!a) ...</code>', N, Stopwatch.elapsed());
    });
  }


  function go_random() {
    return run(function () {
      var N = REPS / 10, i, v = [];
      for (i = 0; i < N; ++i) {
        v.push(Math.random());
      }
      print_result('generating floats with <code>Math.random()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_mt() {
    return run(function () {
      var N = REPS / 10, i, rng = new MersenneTwister(1337), v = [];
      for (i = 0; i < N; ++i) {
        v.push(rng.genrand_int32() / RNG.MAX_VALUE);
      }
      print_result('generating floats with <code>MersenneTwister()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_lcg_rng() {
    return run(function () {
      var N = REPS / 10, i, rng = new RNG(1337), v = [];
      for (i = 0; i < N; ++i) {
        v.push(rng.next() / RNG.MAX_VALUE);
      }
      print_result('generating floats with LCG', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_random_int() {
    return run(function () {
      var N = REPS / 10, i, v = [];
      for (i = 0; i < N; ++i) {
        v.push(Math.floor(Math.random() * RNG.MAX_VALUE));
      }
      print_result('generating integers with <code>Math.random()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_mt_int() {
    return run(function () {
      var N = REPS / 10, i, rng = new MersenneTwister(1337), v = [];
      for (i = 0; i < N; ++i) {
        v.push(rng.genrand_int32());
      }
      print_result('generating integers with <code>MersenneTwister()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_lcg_rng_int() {
    return run(function () {
      var N = REPS / 10, i, rng = new RNG(1337), v = [];
      for (i = 0; i < N; ++i) {
        v.push(rng.next());
      }
      print_result('generating integers with LCG', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_new_array1() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Array(2);
      }
      print_result('2D array with <code>new Array(2)</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_new_array2() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = [0, 0];
      }
      print_result('2D array with <code>[0, 0]</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_new_object() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = { x: 0, y: 0 };
      }
      print_result('2D array with <code>{x:0, y:0}</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_new_point() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Point(0, 0);
      }
      print_result('2D array with <code>new Point(0, 0)</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_new_float32array() {
    return run(function () {
      var N = REPS / 10, i, v;
      for (i = 0; i < N; ++i) {
        v = new Float32Array(2);
      }
      print_result('2D array with <code>new Float32Array(2)</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_new_float64array() {
    return run(function () {
      var N = REPS / 10, i, v;
      for (i = 0; i < N; ++i) {
        v = new Float64Array(2);
      }
      print_result('2D array with <code>new Float64Array(2)</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_array1() {
    return run(function () {
      var N = REPS / 10, i, v = [];
      for (i = 0; i < N; ++i)
        v.push(0);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>[]</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_array2() {
    return run(function () {
      var N = REPS / 10, i, v = new Array(N);
      for (i = 0; i < N; ++i)
        v[i] = 0;
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Array()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_float32array() {
    return run(function () {
      var N = REPS / 10, i, v = new Float32Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Float32Array()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_float64array() {
    return run(function () {
      var N = REPS / 10, i, v = new Float64Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Float64Array()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_int32array() {
    return run(function () {
      var N = REPS / 10, i, v = new Int32Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Int32Array()</code>', N, Stopwatch.elapsed());
      v = undefined;
    });
  }


  function go_write_to_xy() {
    return run(function () {
      var N = REPS, i, sum = 0, x = 0, y = 0;
      for (i = 0; i < N; ++i) {
        sum += i;
        x = i;
        y = sum;
      }
      print_result('write to <code>x</code>, <code>y</code>', N, Stopwatch.elapsed());
    });
  }


  function go_write_to_array() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = [0, 0];
      for (i = 0; i < N; ++i) {
        sum += i;
        obj[0] = i;
        obj[1] = sum;
      }
      print_result('write to <code>[0, 0]</code>', N, Stopwatch.elapsed());
    });
  }


  function go_write_to_obj() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = {x:0, y:0};
      for (i = 0; i < N; ++i) {
        sum += i;
        obj.x = i;
        obj.y = sum;
      }
      print_result('write to <code>{x:0, y:0}</code>', N, Stopwatch.elapsed());
    });
  }


  function go_write_to_point() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = new Point(0, 0);
      for (i = 0; i < N; ++i) {
        sum += i;
        obj.x = i;
        obj.y = sum;
      }
      print_result('write to <code>new Point()</code>', N, Stopwatch.elapsed());
    });
  }


  function go_write_to_float32array() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = new Float32Array(2);
      for (i = 0; i < N; ++i) {
        sum += i;
        obj[0] = i;
        obj[1] = sum;
      }
      print_result('write to <code>Float32Array(2)</code>', N, Stopwatch.elapsed());
    });
  }


  function go_read_from_xy() {
    return run(function () {
      var N = REPS, i, sum = 0, x = 1, y = 2;
      for (i = 0; i < N; ++i) {
        sum += x + y;
      }
      print_result('read from <code>x</code>, <code>y</code>', N, Stopwatch.elapsed());
    });
  }


  function go_read_from_array() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = [1, 2];
      for (i = 0; i < N; ++i) {
        sum += obj[0] + obj[1];
      }
      print_result('read from <code>[0, 0]</code>', N, Stopwatch.elapsed());
    });
  }


  function go_read_from_obj() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = { x: 1, y: 2 };
      for (i = 0; i < N; ++i) {
        sum += obj.x + obj.y;
      }
      print_result('read from <code>{x:0, y:0}</code>', N, Stopwatch.elapsed());
    });
  }


  function go_read_from_point() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = new Point(1, 2);
      for (i = 0; i < N; ++i) {
        sum += obj.x + obj.y;
      }
      print_result('read from <code>Point(0, 0)</code>', N, Stopwatch.elapsed());
    });
  }


  function go_read_from_float32array() {
    return run(function () {
      var N = REPS, i, sum = 0, obj = new Float32Array(2);
      obj[0] = 1;
      obj[1] = 2;
      for (i = 0; i < N; ++i) {
        sum += obj[0] + obj[1];
      }
      print_result('read from <code>Float32Array(2)</code>', N, Stopwatch.elapsed());
    });
  }


  function makeOutputTable(heading) {
    out = $('<table class="output" style="width: ' + Math.floor($(window).width() / NUM_RUNS - 32) + 'px"></table>')
      .append($('<tr><th colspan="2">' + heading + '</th></tr>'))
      .append('<tr><td>Funktion</td><td class="result">1K&nbsp;calls/s<sup></sup></td></tr>')
      .appendTo($('body'));
  }


  function ready() {
    if (++nRun <= NUM_RUNS) {
      run(benchmark, 1000);
    }
    else {
      makeOutputTable('Mittelwerte der Messungen');
      $.each(results, function (s, v) {
        out.append('<tr><td class="name">' + s + '</td><td class="result"><span class="result">' + (v / NUM_RUNS).toFixed(1) + '</span></td></tr>');
      });
    }
  }


  function benchmark() {
    run(function () {
      makeOutputTable(nRun === 0 ? 'Warm-up' : 'Messlauf #' + nRun);
    })
      .then(go_for)
      .then(go_while)
      .then(go_cmp_value)
      .then(go_cmp_variable)
      .then(go_a_typeof)
      .then(go_a_undefined)
      .then(go_a_not)
      .then(go_random)
      .then(go_mt)
      .then(go_lcg_rng)
      .then(go_random_int)
      .then(go_mt_int)
      .then(go_lcg_rng_int)
      .then(go_array1)
      .then(go_array2)
      .then(go_float32array)
      .then(go_float64array)
      .then(go_int32array)
      .then(go_new_array1)
      .then(go_new_array2)
      .then(go_new_object)
      .then(go_new_point)
      .then(go_new_float32array)
      .then(go_new_float64array)
      .then(go_write_to_xy)
      .then(go_write_to_array)
      .then(go_write_to_obj)
      .then(go_write_to_point)
      .then(go_write_to_float32array)
      .then(go_read_from_xy)
      .then(go_read_from_array)
      .then(go_read_from_obj)
      .then(go_read_from_point)
      .then(go_read_from_float32array)
      .then(ready);
  }


  $(document).ready(benchmark);
})();
