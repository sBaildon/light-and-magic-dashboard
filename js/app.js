'use strict';

var lightApp = angular.module('lightApp', []);

lightApp.controller('indexController', function($scope, $http, $interval, $document) {

	$scope.errorText = "N/A";

	$scope.pollingRate;
	$scope.lastUpdateTime;
	$scope.lastUpdateVerbose;
	$scope.lastUpdateTest;

	$scope.refreshTick = function() {
		$scope.lastUpdateVerbose = moment($scope.lastUpdateTest).fromNow();
	};

	$scope.queryMetadata = function() {
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			$scope.pollingRate = data.datastreams[4].current_value;
			$scope.lastUpdateTest = data.updated;
			$scope.lastUpdateTime = moment(data.updated).format('HH:mm:ss');
			$scope.lastUpdateVerbose = moment(data.updated).fromNow();
		}).error(function(data) {
			$scope.pollingRate = $scope.errorText;
			$scope.lastUpdateTime = $scope.errorText;
		});
	};

	$document.ready(function() {
		$scope.queryMetadata();
	});

	$interval($scope.queryMetadata, 10000);
	$interval($scope.refreshTick, 3000);
});