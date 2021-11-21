questApp = angular.module("questApp", []);

questApp.controller("QuestController", function QuestController($scope, $http) {
	const URL_ALL_QUESTS = "http://localhost:8000/getAllQuests";
	const URL_SUBMIT_QUESTS = "http://localhost:8000/submitQuests";

	$scope.quests = [];
	$scope.selections = [];

	// Get PredefinedQuests
	$http
		.get(URL_ALL_QUESTS)
		.then(function (response) {
			//console.log(response);
			let data = response.data;
			// $scope.quests = data.map(quest=>{

			// })
			$scope.quests = response.data;
		})
		.catch((err) => console.log(err));

	$scope.submitQuests = function (history) {
		console.log($scope.selections);
		const selected = [];

		for (const [key, value] of Object.entries($scope.selections)) {
			if (value === true) {
				selected.push([key]);
			}
		}

		if (selected.length > 3) {
			alert("You can only submitted 3 daily quests");
			return;
		}
		if (selected.length < 3) {
			alert("Select 3 daily quests to continue");
			return;
		}
		console.log(selected);
		$http
			.post(URL_SUBMIT_QUESTS, { questIds: selected })
			.then(function (response) {
				alert("Quests set successfully");
			})
			.catch((e) => console.log(e));
	};
});
