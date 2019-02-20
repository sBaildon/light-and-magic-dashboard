'use strict';

var intensityPanelController = angular.module('intensityPanelController', []);

intensityPanelController.controller('intensityPanelController', function($scope, $http, $document, objectPasser) {

	$scope.datasets = [];

	$scope.sessionId;
	$scope.sessionStart;
	$scope.sessionEnd;

	$scope.responses;

	$scope.addChart = function(date) {
		nv.addGraph(function() {
			var chart = nv.models.lineChart();

			chart.xAxis
				.axisLabel('Date')
				.ticks(30)
				.tickFormat(function(d) { 
					if (date === 'month') {
						return d3.time.format('%d %b')(new Date(d));
					} else if (date === 'week') {
						return d3.time.format('%a')(new Date(d));
					} else if (date === 'day') {
						return d3.time.format('%H:%M')(new Date(d));
					} else {
						return d3.time.format('%H:%M')(new Date(d));
					}
				});

			chart.yAxis
				.axisLabel('Value')
				.tickFormat(d3.format('.01f'));

			d3.select('#intensity-chart svg')
				.datum($scope.getData())
				.transition().duration(500)
				.call(chart);

			nv.utils.windowResize(chart.update);

			return chart;
		});
	};

	$scope.queryIntensity = function(timespan) {
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663\
				?start=' + moment($scope.sessionEnd).subtract(timespan, 1).toISOString() + '\
				&end=' + moment($scope.sessionEnd).toISOString() + '\
				&interval=' + $scope.getQueryInterval(timespan) + '&datastreams=Intensity&limit=1000',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			if (data.length < 1) {
				return;
			}

			var queryResults = [];

			for(var i = 0; i < data.datastreams[0].datapoints.length; i++) {
				queryResults.push({
					x: moment(data.datastreams[0].datapoints[i].at).toDate(),
					y: parseInt(data.datastreams[0].datapoints[i].value)
				});
			}

			$scope.datasets = [ queryResults ];

			$scope.addChart(timespan);
		}).error(function(data) {

		});
	};

	$scope.getData = function() {
		var data = [];

		for(var i = 0; i < $scope.datasets.length; i++) {
			data.push({
				values: $scope.datasets[0],
				key: parseInt(i)
			});
		}

		return data;
	};

	/* 
	 * Xively only accepts certain intervals to prevent data overload
	 * This function returns the best option for each.
	 */
	$scope.getQueryInterval = function(timespan) {
		if (timespan === 'month') {
			return 3600;
		} else if (timespan === 'week') {
			return 1800;
		} else if (timespan === 'day') {
			return 300
		} else if (timespan === 'hour') {
			return 30;
		} else {
			return 60;
		}
	}

	$document.ready(function() {
		$scope.sessionId = "Real Time";
		$scope.sessionStart = moment().subtract('month', 1);
		$scope.sessionEnd = moment();

		$scope.queryIntensity('hour');
	});

	$scope.$on('handleBroadcast', function() {
		if(objectPasser.val.length === 0) {
			$scope.sessionId = "Real Time";
			$scope.sessionEnd = moment();

			$scope.queryIntensity('hour');
			return;
		}
		$scope.sessionId = objectPasser.val[0].id;
		$scope.sessionStart = objectPasser.val[0].start;
		$scope.sessionEnd = objectPasser.val[0].end;

		$scope.queryIntensity('hour');
		// if(objectPasser.val.length === 0) {
		// 	$scope.sessionId = "Real Time";
		// 	return;
		// } else {
		// 	$scope.sessionId = "";
		// }

		// for(var i = 0; i < objectPasser.val.length; i++) {
		// 	$scope.sessionId = $scope.sessionId + objectPasser.val[i].id + " + ";
		// }
	});

});