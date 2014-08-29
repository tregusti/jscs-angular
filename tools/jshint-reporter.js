'use strict';

// A lot of this is borrowed from http://git.io/1ivmpQ

require('colors');

function print(str) {
  var args = ['JSHINT: '.cyan + (str || '')];
  args = args.concat([].slice.call(arguments, 1));
  console.log.apply(null, args);
}

var pad = function(msg,length) {
  while (msg.length < length) {
    msg = ' ' + msg;
  }
  return msg;
};

exports.reporter = function(results, data) {
  // Dont report empty data as it's an ignored file
  if (data.length < 1) {
    print('0 files linted. Please check your ignored files.'.yellow);
    return;
  }

  if (results.length === 0) {
    // Success!
    print('No violations found!'.green);
    return;
  }

  var options = data[0].options;

  print();

  var lastfile = null;
  // Iterate over all errors.
  results.forEach(function(result) {

    // Only print file name once per error
    if (result.file !== lastfile) {
      print((result.file ? '   ' + result.file : '').bold);
    }
    lastfile = result.file;

    var e = result.error;

    // Sometimes there's no error object.
    if (!e) { return; }

    if (e.evidence) {
      // Manually increment errorcount since we're not using grunt.log.error().

      // No idea why JSHint treats tabs as options.indent # characters wide, but it
      // does. See issue: https://github.com/jshint/jshint/issues/430
      // Replacing tabs with appropriate spaces (i.e. columns) ensures that
      // caret will line up correctly.
      var evidence = e.evidence.replace(/\t/g, pad('', options.indent));

      print((pad(e.line.toString(),7) + ' |') + evidence.grey);
      print('%s%s^ [%s] %s',
                  pad(' ', 9),
                  pad('', e.character -1),
                  e.code,
                  e.reason);
    } else {
      // Generic "Whoops, too many errors" error.
      print(e.reason);
    }
  });
};
