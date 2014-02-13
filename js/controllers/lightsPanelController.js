'use strict';

var lightsPanelController = angular.module('lightsPanelController', []);

lightsPanelController.controller('lightsPanelController', function($scope, $http, $document, $interval) {

	$scope.lightsOn;
	$scope.colour;

	$scope.getLightStatus = function() {
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663/datastreams/lights-on',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			if (data.current_value == '1') {
				$scope.lightsOn = 'On';
				$scope.colour = {color: 'green'};
			} else {
				$scope.lightsOn = 'Off';
				$scope.colour = {color: 'red'};
			}
		}).error(function(data) {
		});
	};

	$document.ready(function() {
		$interval($scope.getLightStatus, 10000);
	});
});