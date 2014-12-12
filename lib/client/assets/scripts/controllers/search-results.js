(function (window) {
  'use strict';

  var angular = window.angular;
  var _ = window._;
  var moment = window.moment;

  angular.module('bowerBrowser')
    .controller('SearchResultsController', function ($scope, $state, BowerService, ProcessService, SearchService) {

      // Properties
      $scope.service = SearchService;

      // Install component
      $scope.install = function (name, version) {
        var target = name;
        if (typeof version !== 'undefined' && version !== '') {
          target = target + '#' + version;
        }
        ProcessService.execute('bower install --save ' + target);
      };

      // Uninstall component
      $scope.uninstall = function (name) {
        ProcessService.execute('bower uninstall --save ' + name);
      };

      // Check installation
      $scope.isInstalled = function (name) {
        return _.has(BowerService.json.dependencies, name);
      };

      // Get installed version
      $scope.getVersion = function (name) {
        return BowerService.json.dependencies[name];
      };

      // Format date
      $scope.timeago = function (date) {
        return moment(date).fromNow();
      };

      // Has previous page or not
      $scope.hasPrev = function () {
        return $scope.service.page > 1;
      };

      // Has next page or not
      $scope.hasNext = function () {
        return $scope.service.page < $scope.service.pageCount;
      };

      // Return class name according to the sort setting
      $scope.getSortedClass = function (field) {
        var className = '';
        if ($scope.service.sortField === field) {
          className = $scope.service.sortReverse ? 'sort-descend' : 'sort-ascend';
        }
        return className;
      };

      // Sort by field
      $scope.sortBy = function (field) {
        var params = {
          p: null
        };
        if (!$scope.service.loaded) {
          return;
        }
        if (field === $scope.service.sortField) {
          params.r = $scope.service.sortReverse ? '0' : '1';
        }
        else {
          params.s = field;
          params.r = null;
        }
        $state.go('search.results', params);
      };

      // Initialize
      $scope.service.setParams($state.params);

    });

}(window));