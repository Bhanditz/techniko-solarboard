app.directive('ngMonthPicker', function(moment) {
	return {
		restrict: 'AE',
		templateUrl: './directives/graph/monthpicker.html',
		scope: true,
		link: function(scope, iElement, iAttrs, ctrl) {
			scope.months = [];
			var now = moment().startOf('year');
			for (var i = 0; i < 12; i++) {
				scope.months.push(now.format('MMM').split('.')[0]);
				now.add(1, 'months');
			}
		}
	};
});