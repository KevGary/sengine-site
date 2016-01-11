var app = angular.module('sengineSite', ['ui.ace', 'ngMaterial', 'ngMessages', 'ngRoute' ]);

app.constant('API_URL', 'http://104.236.15.225:8080');

app.factory('httpFactory', function ($http, API_URL) {
  return {
    hostHTML: hostHTML,
    execute: execute
  }
  function hostHTML(code) {
    return $http.post(API_URL + '/html', {"data": code});
  }
  function execute(code) {
    return $http.post(API_URL + '/execute', {"data": code});
  }
});

app.filter('reverse', function() {
  return function(results) {
    return results.slice().reverse();
  };
});

app.controller('LandingController', function($scope) {

})

app.controller('EditorController', function($scope, httpFactory, reverseFilter) {

  $scope.aceLoaded = function(_editor) {
    _editor.getSession().setUseWorker(false);
    _editor.renderer.session.doc.$lines[0] = "console.log('Hello world!');";
    _editor.setOptions({
      fontSize: 16
    });
    $scope.currentEditorValue = _editor.getSession().doc.$lines.join('\n');
  }

  $scope.aceChanged = function(e) {
    $scope.currentEditorValue = e[1].session.doc.$lines.join('\n');
    console.log($scope.currentEditorValue);
  }

  $scope.results = [];

  $scope.execute = function() {
    httpFactory.execute($scope.currentEditorValue)
    .then(function success(response) {
      console.log(response.data);
      console.log('working')
      var result = {};
      if (response.data.stderr == "") {
        result.output = response.data.response.stdout;
      } else {
        result.output = response.data.response.stdout + "\n" + response.data.response.stderr;
      }
      result.language = response.data.language;
      // result.lang = response.data.
      // result.time = response.data.
      $scope.results.push(result)
    })
  }

})

app.controller('HostingController', function($scope, httpFactory) {

})

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/partials/landing.html',
      controller: 'LandingController'
    })
    .when('/editor', {
      templateUrl: '/partials/editor.html',
      controller: 'EditorController'
    })
    .when('/hosting', {
      templateUrl: '/partials/hosting.html',
      controller: 'HostingController'
    })
    // .when('/page-not-found', {
    //   templateUrl: '/partials/error.html'
    // })
    // .otherwise({
    //   redirectTo: '/page-not-found'
    // });
  $locationProvider.html5Mode(true);
}]);