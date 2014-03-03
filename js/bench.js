(function () {
  "use strict";

  var REPS = 100000000;
  var out;

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
    console.info(s, ms);
    out.append('<p><strong>' + s + '</strong>: ' + (ms) + 'ms (' + (1e-3 * n / ms).toFixed(1) + ' ms<sup>&minus;1</sup>)</p>');
  }


  function run(f) {
    var promise = $.Deferred();
    setTimeout(function () {
      Clock.reset();
      f.call();
      promise.resolve();
    }, 0);
    return promise;
  }


  function go_for() {
    return run(function () {
      var N = REPS, i, sum = 0;
      for (i = 0; i < N; ++i) {
        sum += i;
      }
      print_result('for(...)', N, Clock.ms());
    });
  }


  function go_while() {
    return run(function () {
      var N = REPS, i = N, sum = 0;
      while (i--) {
        sum += i;
      }
      print_result('while(i--)', N, Clock.ms());
    });
  }


  function go_new_array1() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Array(2);
      }
      print_result('new Array(2)', N, Clock.ms());
    });
  }


  function go_new_array2() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = [0, 0];
      }
      print_result('[0, 0]', N, Clock.ms());
    });
  }


  function go_new_float32array() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Float32Array(2);
      }
      print_result('new Float32Array(2)', N, Clock.ms());
    });
  }


  function go_new_float64array() {
    return run(function () {
      var N = REPS, i, v;
      for (i = 0; i < N; ++i) {
        v = new Float64Array(2);
      }
      print_result('new Float64Array(2)', N, Clock.ms());
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
      print_result('loop over []', N, Clock.ms());
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
      print_result('loop over Array()', N, Clock.ms());
    });
  }


  function go_float32array() {
    return run(function () {
      var N = REPS, i, v = new Float32Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over Float32Array()', N, Clock.ms());
    });
  }


  function go_float64array() {
    return run(function () {
      var N = REPS, i, v = new Float64Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over Float64Array()', N, Clock.ms());
    });
  }


  function go_int32array() {
    return run(function () {
      var N = REPS, i, v = new Int32Array(N);
      for (i = 1; i < N; ++i) {
        v[i] = v[i - 1] + i;
      }
      print_result('loop over Int32Array()', N, Clock.ms());
    });
  }


  function go() {
    out.append('<h1>JS Benchmark</h1>');
  }


  function ready() {
    out.append('<p><strong>Finished.</strong></p>');
  }


  function init() {
    out = $('#output');
    run(go)
    .then(go_for)
    .then(go_while)
    .then(go_array1)
    .then(go_array2)
    .then(go_float32array)
    .then(go_float64array)
    .then(go_int32array)
    .then(ready);
  }


  $(document).ready(init);
})();
