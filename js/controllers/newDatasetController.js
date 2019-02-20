'use strict';

var newDatasetController = angular.module('newDatasetController', []);

newDatasetController.controller('newDatasetController', function($scope, $http, $document, refresher) {

	$scope.activeRecording;
	$scope.isRecordingActive;

	$scope.getActiveRecording = function() {
		$http({
			method: 'GET',
			url: 'database/get_active_dataset.js'
		}).success(function(data) {
			if (data.id) {
				$scope.activeRecording = data.id;
				$scope.isRecordingActive = true;
			} else {
				$scope.activeRecording = "New dataset...";
				$scope.isRecordingActive = false;
			}
		}).error(function(data) {
			$scope.activeRecording = "bad";
		});
	};

	$scope.stopRecording = function() {
		$http({
			method: 'POST',
			url: 'database/stop_active_dataset.js',
			data: { 'id':  $scope.activeRecording }
		}).success(function(data) {
			$scope.getActiveRecording();
			refresher.broadcast();
		}).error(function(data) {

		});
	};

	$scope.startRecording = function() {
		$http({
			method: 'POST',
			url: 'database/start_active_dataset.js',
			data: { 'id': $scope.datasetInput }
		}).success(function(data) {
			$scope.getActiveRecording();
		}).error(function(data) {

		});

	};

	$document.ready(function() {
		$scope.getActiveRecording();
	});

});