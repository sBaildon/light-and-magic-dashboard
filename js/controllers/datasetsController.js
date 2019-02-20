'use strict';

var datasetsController = angular.module('datasetsController', []);

datasetsController.controller('datasetsController', function($scope, $http, $document, $interval, $timeout, $filter, refresher, objectPasser) {

	$scope.datasets;

	$scope.getDatasets = function() {
		$http({
			method: 'GET',
			url: 'database/get_datasets.js'
		}).success(function(data) {
			$scope.datasets = data;
		}).
		error(function(data) {
			$scope.datasets = "bad";
		});
	};

	$scope.toggle = function(dataset) {
		for (var i = 0; i < $scope.datasets.length; i++) {
			$scope.datasets[i].selected = false;
		}
		dataset.selected = !dataset.selected;
		$scope.update();
	};

	$document.ready(function() {
		$scope.getDatasets();
	});

	$scope.$on('handleRefresh', function() {
		$scope.getDatasets();
	});

	/* 
	 * Use debounce to allow only one valid call to this function
	 * at any given time
	 */
	$scope.debounce = false;
	$scope.update = function() {
		if ($scope.debounce) {
			return;
		}

		$scope.debounce = true;

		$timeout(function() { 
			$scope.selectedDatasets = $filter('filter')($scope.datasets, 'true');
			objectPasser.prepareData($scope.selectedDatasets); 
		}, 1500).then(function() {
			$scope.debounce = false;
		});
	};


});