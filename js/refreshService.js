'use strict';

var refresher = angular.module('refresher', []);

refresher.factory('refresher', function($rootScope) {
	var refresher = {};

	refresher.broadcast = function() {
		$rootScope.$broadcast('handleRefresh');
	};
	
	return refresher;
});