'use strict';

var intensityPanelController = angular.module('intensityPanelController', []);

intensityPanelController.controller('intensityPanelController', function($scope, $http, $document) {

	$scope.queryResults;

	$scope.addChart = function(date) {
		nv.addGraph(function() {
			var chart = nv.models.lineChart();

			chart.xAxis
				.axisLabel('Date')
				.ticks(30)
				.tickFormat(function(d) { 
					if (date == 'months') {
						return d3.time.format('%d %b')(new Date(d));
					} else if (date == 'weeks') {
						return d3.time.format('%a')(new Date(d));
					} else if (date == 'days') {
						return d3.time.format('%H:%M')(new Date(d));
					} else {
						return d3.time.format('%H:%M')(new Date(d));
					}
				});

			chart.yAxis
				.axisLabel('Value')
				.tickFormat(d3.format('.01f'));

			d3.select('#chart svg')
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
				?start=' + moment().subtract(timespan, 1).toISOString() + '\
				&end=' + moment(new Date()).toISOString() + '\
				&interval=' + $scope.getQueryInterval(timespan) + '&datastreams=Intensity&limit=1000',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			var temp = [];

			for(var i = 0; i < data.datastreams[0].datapoints.length; i++) {
				temp.push({x: moment(data.datastreams[0].datapoints[i].at).toDate(), y: parseInt(data.datastreams[0].datapoints[i].value)});
			}

			$scope.queryResults = temp;

			$scope.addChart(timespan);
		}).error(function(data) {

		});
	};

	$scope.getData = function() {
		return [
			{
				values: $scope.queryResults,
				key: 'Intensity',
				color: '#CF1332'
			}
		];
	};

	/* Xively only accepts certain intervals to prevent data overload
	 * This function returns the best options
	 * */
	$scope.getQueryInterval = function(timespan) {
		if (timespan === 'month') {
			return 3600;
		} else if (timespan === 'week') {
			return 1800;
		} else if (timespan === 'day') {
			return 300
		} else if (timespan === 'hour') {
			return 60;
		} else {
			return 60;
		}
	}

	$document.ready(function() {
		$scope.queryIntensity('hour');
	});

});