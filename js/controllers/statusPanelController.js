'use strict';

var statusPanelController = angular.module('statusPanelController', []);

statusPanelController.controller('statusPanelController', function($scope, $http, $interval, $document) {

	$scope.errorText = "N/A";

	$scope.pollingRate;
	$scope.pollingRateUnit;

	$scope.lastUpdate;
	$scope.lastUpdateTime;
	$scope.lastUpdateVerbose;

	$scope.refreshTick = function() {
		$scope.lastUpdateVerbose = moment($scope.lastUpdate).fromNow();
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
			$scope.pollingRate = $scope.calculatePollingTime(parseInt(data.datastreams[4].current_value));

			$scope.lastUpdate = data.updated;
			$scope.lastUpdateTime = moment($scope.lastUpdate).format('HH:mm:ss');
			$scope.lastUpdateVerbose = moment($scope.lastUpdate).fromNow();
		}).error(function(data) {
			$scope.pollingRate = $scope.errorText;
			$scope.lastUpdateTime = $scope.errorText;
		});
	};

	$scope.calculatePollingTime = function(data) {
		var minutes;
		minutes = moment.duration(data).asMinutes();
		if (minutes >= 1) {
			$scope.pollingRateUnit = "mins";
			return minutes;
		}

		var seconds;
		seconds = moment.duration(data).asSeconds();
		if (seconds >= 1) {
			$scope.pollingRateUnit = "secs";
			return seconds;
		}

		$scope.pollingRateUnit = "ms";
		return data;
	}

	$document.ready(function() {
		$scope.queryMetadata();
	});

	$interval($scope.queryMetadata, 10000);
	$interval($scope.refreshTick, 3000);
});