'use strict';

var datasetsController = angular.module('datasetsController', []);

datasetsController.controller('datasetsController', function($scope, $http, $document) {

	$scope.datasets;

	$scope.getDatasets = function() {

	};

	$document.ready(function() {
		$scope.getDatasets();
	});

});