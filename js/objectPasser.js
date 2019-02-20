'use strict';

var objectPasser = angular.module('objectPasser', []);

objectPasser.factory('objectPasser', function($rootScope) {
	var objectPasser = {};

	objectPasser.val = '';

	objectPasser.prepareData = function(object) {
		this.val = object;
		this.broadcast();

	};

	objectPasser.broadcast = function() {
		$rootScope.$broadcast('handleBroadcast');
	};
	
	return objectPasser;
});