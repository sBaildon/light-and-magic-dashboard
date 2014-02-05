'use strict';

var lightApp = angular.module('lightApp', []);

lightApp.controller('indexController', function($scope, $http, $interval) {

	$scope.errorText = "N/A";

	$scope.pollingRate;
	$scope.lastUpdateTime;
	$scope.lastUpdateVerbose;

	$scope.queryMetadata = function() {
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD'
			}
		}).success(function(data) {
			$scope.pollingRate = data.datastreams[4].current_value;
			$scope.lastUpdateTime = moment(data.updated).format('HH:mm:ss');
			$scope.lastUpdateVerbose = moment(data.updated).fromNow();
		}).error(function(data) {
			$scope.pollingRate = $scope.errorText;
			$scope.lastUpdate = $scope.errorText;
		});
	};

	$interval($scope.queryMetadata(), 60000);
});