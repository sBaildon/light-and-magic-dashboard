'use strict';

var lightApp = angular.module('lightApp', ['statusPanelController', 'intensityPanelController', 'lightsPanelController']);

angular.module('lightApp').constant('CONFIG', {
	baseUrl: 'https://api.xively.com/',
	feedId: 'v2/feeds/34780663/datastreams/',
});