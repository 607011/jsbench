// Copyright (c) 2014 Oliver Lau, Heise Zeitschriften Verlag, www.ct.de
// All rights reserved.

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
  var out;
  var results = {};

  var Clock = (function () {
    var t0 = Date.now();
    var t00 = Date.now();
    return {
      ms: function () {
        return Date.now() - t00;
      },
      secs: function () {
        var now = Date.now();
        var t = now - t0;
        t0 = now;
        return 1e-3 * t;
      },
      reset: function () {
        t00 = t0 = Date.now();
      }
    };
  })();


  function print_result(s, n, ms) {
    if (results[s] === undefined)
      results[s] = 0;
    var rate = 1e-3 * n / ms;
    results[s] += rate;
    out.append('<p>' + s + ': ' + (ms) + 'ms (' + rate.toFixed(1) + ' ms<sup>&minus;1</sup>)</p>');
  }


  function run(f, delay) {
    var promise = $.Deferred();
    if (delay === undefined)
      delay = 100;
    setTimeout(function () {
      Clock.reset();
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
      print_result('<code>for (&hellip;)</code>', N, Clock.ms());
    });
  }


  function go_while() {
    return run(function () {
      var N = REPS, i = N, sum = 0;
      while (i--) {
        sum += i;
      }
      print_result('<code>while (i--)</code>', N, Clock.ms());
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
      print_result('<code>if (i < 50000000) &hellip;</code>', N, Clock.ms());
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
      print_result('<code>if (i < C) &hellip;</code>', N, Clock.ms());
    });
  }


  function go_random() {
    return run(function () {
      var N = REPS / 10, i, v = new Array(N);
      for (i = 0; i < N; ++i) {
        v[i] = Math.random();
      }
      print_result('generating floats with <code>Math.random()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_mt() {
    return run(function () {
      var N = REPS / 10, i, rng = new MersenneTwister(1337), v = new Array(N);
      for (i = 0; i < N; ++i) {
        v[i] = rng.genrand_int32() / RNG.MAX_VALUE;
      }
      print_result('generating floats with <code>MersenneTwister()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_lcg_rng() {
    return run(function () {
      var N = REPS / 10, i, rng = new RNG(1337), v = new Array(N);
      for (i = 0; i < N; ++i) {
        v[i] = rng.next() / RNG.MAX_VALUE;
      }
      print_result('generating floats with LCG', N, Clock.ms());
      v = undefined;
    });
  }


  function go_random_int() {
    return run(function () {
      var N = REPS / 10, i, v = new Array(N);
      for (i = 0; i < N; ++i) {
        v[i] = Math.floor(Math.random() * RNG.MAX_VALUE);
      }
      print_result('generating integers with <code>Math.random()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_mt_int() {
    return run(function () {
      var N = REPS / 10, i, rng = new MersenneTwister(1337), v = new Array(N);
      for (i = 0; i < N; ++i) {
        v[i] = rng.genrand_int32();
      }
      print_result('generating integers with <code>MersenneTwister()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_lcg_rng_int() {
    return run(function () {
      var N = REPS / 10, i, rng = new RNG(1337), v = new Array(N);
      for (i = 0; i < N; ++i) {
        v[i] = rng.next();
      }
      print_result('generating integers with LCG', N, Clock.ms());
      v = undefined;
    });
  }


  function go_new_array1() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Array(2);
      }
      print_result('<code>new Array(2)</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_new_array2() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = [0, 0];
      }
      print_result('<code>[0, 0]</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_new_float32array() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Float32Array(2);
      }
      print_result('<code>new Float32Array(2)</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_new_float64array() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Float64Array(2);
      }
      print_result('<code>new Float64Array(2)</code>', N, Clock.ms());
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
      print_result('loop over <code>[]</code>', N, Clock.ms());
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
      print_result('loop over <code>Array()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_float32array() {
    return run(function () {
      var N = REPS / 10, i, v = new Float32Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Float32Array()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_float64array() {
    return run(function () {
      var N = REPS / 10, i, v = new Float64Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Float64Array()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  function go_int32array() {
    return run(function () {
      var N = REPS / 10, i, v = new Int32Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over <code>Int32Array()</code>', N, Clock.ms());
      v = undefined;
    });
  }


  var NUM_RUNS = 5;
  var nRun = 0;

  function ready() {
    if (++nRun < NUM_RUNS) {
      return run(benchmark);
    }
    else {
      out = $('body');
      out.append('<h2>Mittelwerte der Messungen</h2>');
      $.each(results, function (s, v) {
        out.append('<p>' + s + ': ø ' + (v / NUM_RUNS).toFixed(1) + '&nbsp;ms<sup>&minus;1</sup></p>');
      });
    }
  }


  function benchmark() {
    run(function () {
      out = $('<span class="output" style="width: ' + (100 / NUM_RUNS) + '%" id="run-' + nRun + '"></span>');
      $('body').append(out.append($('<h2>Messlauf #' + (nRun+1) + '</h2>')));
    })
      .then(go_for)
      .then(go_while)
      .then(go_cmp_value)
      .then(go_cmp_variable)
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
      .then(go_new_float32array)
      .then(go_new_float64array)
      .then(ready);
  }


  function init() {
    $('body').append('<h1>JS Benchmark</h1>');
    benchmark();
  }


  $(document).ready(init);
})();
