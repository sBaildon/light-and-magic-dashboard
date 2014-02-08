'use strict';

var statusPanelController = angular.module('statusPanelController', []);

statusPanelController.controller('statusPanelController', function($scope, $http, $interval, $document) {

	$scope.errorText = "N/A";

	$scope.pollingRate;

	$scope.refreshTimer = 10;
	$scope.queryInProgress = false;

	$scope.lastUpdate;

	$scope.refreshTick = function() {
		$scope.lastUpdateVerbose = moment($scope.lastUpdate).fromNow();

		if($scope.refreshTimer != 0) {
			$scope.refreshTimer = $scope.refreshTimer - 1;
		} else if ($scope.refreshTimer == 0 && !$scope.queryInProgress) {
			$scope.queryMetadata();
		}
	};

	$scope.queryMetadata = function() {
		$scope.queryInProgress = true;
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663?datastreams=polling-rate,wifi-ssid,heartbeat,Intensity',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			$scope.pollingRate = $scope.calculatePollingTime(data.datastreams[2].current_value);

			$scope.wifiSSID = data.datastreams[3].current_value;

			if ( moment(data.datastreams[0].at).isAfter(moment().subtract('s', 45).toISOString()) ) {
				$scope.isConnected = 'Online';
			} else {
				$scope.isConnected = 'Offline';
			}

			$scope.lastUpdate = data.datastreams[1].at;
			$scope.lastUpdateTime = moment($scope.lastUpdate).format('HH:mm:ss');
			$scope.lastUpdateVerbose = moment($scope.lastUpdate).fromNow();
		}).error(function(data) {
			$scope.pollingRate = $scope.errorText;
			$scope.lastUpdateTime = $scope.errorText;
			$scope.wifiSSID = $scope.errorText;
		}).then(function() {
			$scope.refreshTimer = 10;
			$scope.queryInProgress = false;
		});
	};

	$scope.calculatePollingTime = function(data) {
		data = parseInt(data);
		
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