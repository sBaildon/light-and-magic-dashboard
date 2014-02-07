'use strict';

var activityPanelController = angular.module('activityPanelController', []);

activityPanelController.controller('activityPanelController', function($scope, $http, $document) {

	$scope.addChart = function() {
		nv.addGraph(function() {
			var chart = nv.models.lineChart();

			chart.xAxis
				.axisLabel('Date')
				.ticks(31)
				.tickFormat(function(d) { return d3.time.format('%H:%M')(new Date(d)); });

			chart.yAxis
				.axisLabel('Value')
				.tickFormat(d3.format('.02f'));

			d3.select('#chart svg')
				.datum($scope.getData())
				.transition().duration(500)
				.call(chart);

			nv.utils.windowResize(chart.update);

			return chart;
		});

	};

	$scope.queryRGBData = function(interval, date) {
		$http({
			method: 'GET',
			url: 'https://api.xively.com/v2/feeds/34780663\
				?start=' + moment().subtract(date, 1).toISOString() + '\
				&end=' + moment(new Date()).toISOString() + '\
				&interval=' + interval + '&datastreams=Red,Green,Blue&limit=1000',
			headers: {
				'X-ApiKey': 'TuQQMiTAvUUg7qVwoQQmCi0i4CyGIcmmzKKDshENxCxibDaD',
				'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
				'Pragma': 'no-cache'
			}
		}).success(function(data) {
			$scope.result = data;
			var temp = [];

			for(var i = 0; i < $scope.result.datastreams[0].datapoints.length; i++) {
				temp.push({x: moment($scope.result.datastreams[0].datapoints[i].at).toDate(), y: parseInt($scope.result.datastreams[0].datapoints[i].value)});
			}
			$scope.Blue = temp;

			temp = [];

			for(var i = 0; i < $scope.result.datastreams[1].datapoints.length; i++) {
				temp.push({x: moment($scope.result.datastreams[1].datapoints[i].at).toDate(), y: parseInt($scope.result.datastreams[1].datapoints[i].value)});
			}
			$scope.Green = temp;

			temp = [];

			for(var i = 0; i < $scope.result.datastreams[2].datapoints.length; i++) {
				temp.push({x: moment($scope.result.datastreams[2].datapoints[i].at).toDate(), y: parseInt($scope.result.datastreams[2].datapoints[i].value)});
			}
			$scope.Red = temp;

			$scope.addChart(date);
		}).error(function(data) {
			$scope.result = moment().utc().subtract('months', 1).toISOString();
		});
	};

	$scope.getData = function() {
		return [
			{
				values: $scope.Red,
				key: 'Red',
				color: '#CF1332'
			},
			{
				values: $scope.Green,
				key: 'Green',
				color: '#24BCA4'
			},
			{
				values: $scope.Blue,
				key: 'Blue',
				color: '#2BB2DD'
			}
		];
	};

	$scope.getYAxis = function(date) {
		if (date == 'months') {
			return d3.time.format('%d %m')(new Date());
		} else if (date == 'weeks') {
			return d3.time.format('%a')(new Date());
		} else if (date == 'days') {
			return d3.time.format('%H %M')(new Date());
		} else {
			return d3.time.format('%H %M')(new Date());
		}
	};

	$scope.getYAxis2 = function(d) {
			return d3.time.format('%H:%M')(new Date(d));
	}


	$document.ready(function() {
		$scope.queryRGBData(60, 'hours');
	});

});