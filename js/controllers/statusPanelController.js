'use strict';

var statusPanelController = angular.module('statusPanelController', []);

statusPanelController.controller('statusPanelController', function($scope, $http, $interval, $document) {

	$scope.errorText = "N/A";

	$scope.pollingRate;

	$scope.refreshTimer = 10;
	$scope.queryInProgress = false;

	$scope.lastUpdate;
	$scope.lastUpdateTime;
	$scope.lastUpdateVerbose;

	$scope.refreshTick = function() {
		$scope.lastUpdateVerbose = moment($scope.lastUpdate).fromNow();
		if($scope.refreshTimer == 0 && !$scope.queryInProgress) {
			$scope.refreshTimer = 10;
			$scope.queryMetadata();
		} else if ($scope.refreshTimer != 0) {
			$scope.refreshTimer = $scope.refreshTimer - 1;
		}
	};

	$scope.queryMetadata = function() {
		$scope.queryInProgress = true;
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663?datastreams=polling-rate',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			$scope.pollingRate = $scope.calculatePollingTime(parseInt(data.datastreams[0].current_value));
			$scope.lastUpdate = data.updated;
			$scope.lastUpdateTime = moment($scope.lastUpdate).format('HH:mm:ss');
			$scope.lastUpdateVerbose = moment($scope.lastUpdate).fromNow();
			$scope.queryInProgress = false;
		}).error(function(data) {
			$scope.pollingRate = $scope.errorText;
			$scope.lastUpdateTime = $scope.errorText;
			$scope.queryInProgress = false;
		});
	};

	$scope.calculatePollingTime = function(data) {
		var minutes;
		minutes = moment.duration(data).asMinutes();
		if (minutes >= 1) {
			return {'value': minutes, 'unit': 'mins' };
		}

		var seconds;
		seconds = moment.duration(data).asSeconds();
		if (seconds >= 1) {
			return {'value': seconds, 'unit': 'secs' };
		}

		return {'value': data, 'unit': 'ms' };
	}

	$document.ready(function() {
		$scope.queryMetadata();
		$interval($scope.refreshTick, 1000);
	});

});