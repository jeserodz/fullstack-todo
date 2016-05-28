(function() {
	var app = angular.module("FullstackTodo", ['ngResource', 'ui.router', 'ngAnimate', 'lbServices']);
	app.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/home");
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'partials/home.html',
				controller: 'HomeCtrl'
			})
			.state('about', {
				url: '/about',
				templateUrl: 'partials/about.html'
			})
			.state('contact', {
				url: '/contact',
				templateUrl: 'partials/contact.html'
			});
	});

	app.controller('HomeCtrl', function($scope, $log, User, Task) {
		$scope.tasks = [];

		User.findById({id: 'me'}, 
			function(user) {
				$log.info(user);
				$scope.user = user;
				Task.find({filter: {where: {userId: user.id, completed: false}}},
					function(tasks) {
						$scope.tasks = tasks;
					},
					function(err) {
						$log.error(err);
					});
			}, 
			function(err) {
				$log.error(err);
			});

		$scope.logout = function() {
			User.logout();
			$scope.user = null;
		};

		$scope.addNewTask = function() {
			if($scope.newTaskName) {

				var newTask = { 
					name: $scope.newTaskName, 
					completed: false, 
					userId: $scope.user.id 
				};

				Task.create(newTask, function(task) {
					$scope.tasks.push(task);
				});								
			}
		};

		$scope.completeTask = function(task) {
			task.completed = true;
			task.$save(
				function(completedTask) {
					$scope.tasks = _.reject($scope.tasks, function(task) {
						return task.id === completedTask.id;
					});
					toastr.success("Successfully completed task!");
				}, 
				function(err) {
					$log.error(err);
				});
		};
	});

})();