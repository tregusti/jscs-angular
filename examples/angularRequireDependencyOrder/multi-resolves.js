/*global angular*/
$stateProvider.state('name', {
  url: '/hello',
  resolve: {
    err1: function($dep, dop, $dip) {

    },
    err2: ['$dep', 'dop', '$dip', function($dep, dop, $dip) {

    }],
    ok: function($dep, dip, dop) {

    }
  }
});
