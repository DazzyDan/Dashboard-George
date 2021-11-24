// Define the `dashboardApp` module
dashboardApp = angular.module("dashboardApp", []);

// Define the `DashboardController` controller on the `dashboardApp` module
dashboardApp.controller(
	"DashboardController",
	function DashboardController($scope, $http, $filter) {
		// Obtain html route
		let URL_ALL_USERS = "http://localhost:8000/getAllUser";
		let URL_INDICATORS = "http://localhost:8000/getIndicators/";
		let URL_RANGE_BUBBLE = "http://localhost:8000/getRangeBubble/";
		let URL_TEAM_CHART = "http://localhost:8000/getTeamChart";
		let URL_USER_CHART = "http://localhost:8000/getUserChart/";
		
		$scope.dateTest = [];
		$scope.indicators = [];
		$scope.bubbleData = [];
		$scope.compareIndicators = [];
		$scope.indicatorsYes = [];


		//Main Functions
		//1. Get Total User Numbers
		$http.get(URL_ALL_USERS).then(function (response) {
			//console.log(response);
			$scope.tun = response.data;
		});
		

		//other indicators can use this list to store
		// default=>today and compared with yesterday's data
		var today = new Date();
		var date =
			today.getFullYear() +
			"-" +
			(today.getMonth() + 1) +
			"-" +
			today.getDate();

		//yesterday's indicators
		let yesterday = new Date(new Date().setDate(new Date().getDate()-1));		
		var yesDate = 
			yesterday.getFullYear() +
			"-" +
			(yesterday.getMonth() + 1) +
			"-" +
			yesterday.getDate();
		//yesterday indicators
		$http.get(URL_INDICATORS + `${yesDate}`).then((res) => {
			addcomparedYes(res.data);
			// console.log(res.data);
		});
		//compare with yesterday
		function addcomparedYes(data){
			let dau = data[0].users.length;
			//Team Mood Scale
			let tms = data[0].mood;
			//Player Action Volume=Average number
			let pav = data[0].daily_action;
			//Team Action Volume= Sum of Player Action Volume
			let tav = pav * dau;
			console.log("dau", dau,", tms", tms,", pav", pav,", tav", tav);
			$scope.indicatorsYes = { dau: dau, tms: tms, tav: tav, pav: pav };
			addComparedIndicator($scope.indicatorsYes);
		};

		//today indicators
		$http.get(URL_INDICATORS + `${date}`).then((res) => {
			loadIndicators(res.data);	
		});
		function loadIndicators(data) {
			let dau = data[0].users.length;
			//Team Mood Scale
			let tms = data[0].mood;
			//Player Action Volume=Average number
			let pav = data[0].daily_action;
			//Team Action Volume= Sum of Player Action Volume
			let tav = pav * dau;
			console.log("dau", dau,", tms", tms,", pav", pav,", tav", tav);
			$scope.indicators = { dau: dau, tms: tms, tav: tav, pav: pav };
			addComparedIndicator($scope.indicators);
		};
		
		// Save the current one indicator and the one before it
		function addComparedIndicator(data){
			if ($scope.compareIndicators.length < 2){
				$scope.compareIndicators.push(data);
				console.log('Push one data');
				console.log($scope.compareIndicators);
				
			} else {
				let tmp = $scope.compareIndicators[1];
				$scope.compareIndicators = [];
				$scope.compareIndicators.push(tmp);
				$scope.compareIndicators.push(data);
				console.log('Old data erase and push new data');
				// console.log($scope.compareIndicators);
			};
		};

		//Get all historical indicators of one choosen date
		$scope.hisInd = function () {
			//transfer format to match up the type of database:
			//Date
			var newDate =
				$scope.dateSearch.getFullYear() +
				"-" +
				("0" + ($scope.dateSearch.getMonth() + 1)).slice(-2) +
				"-" +
				("0" + $scope.dateSearch.getDate()).slice(-2);
			console.log(newDate);

			$http.get(URL_INDICATORS + `${newDate}`).then((res) => {
				loadIndicators(res.data);
			});
		};

		// Bubble
		// Default display last 7 days' data
		//7 days ago
		let defaultDay = new Date(new Date().setDate(new Date().getDate()-7));		
		var defaultDate = 
			defaultDay.getFullYear() +
			"-" +
			(defaultDay.getMonth() + 1) +
			"-" +
			defaultDay.getDate();

		$http.get(URL_RANGE_BUBBLE + `${defaultDate}/${date}`).then((res) => {
			console.log(URL_RANGE_BUBBLE + `${defaultDate}/${date}`);
		});

		// Select the range of date
		$scope.dateRangeChange = function () {
			const [startDateStr, endDateStr] = $scope.dateSearchRange.split(" - ");
			let startDate = formatRangeDate(startDateStr);
			let endDate = formatRangeDate(endDateStr);
			$http.get(URL_RANGE_BUBBLE + `${startDate}/${endDate}`).then((res) => {
				console.log(URL_RANGE_BUBBLE + `${startDate}/${endDate}`);
				
			});
		};
			  
		/**
		 * Take a string date in format dd/MM/YYYY and
		 * returns it in the format YYYY-MM-dd
		 * @param String strDate
		 * @returns Date
		 */
		function formatRangeDate(strDate) {
			[day, month, year] = strDate.split("/");
			const date = new Date(year, month-1, day);
			return $filter("date")(date, "yyyy-MM-dd");
		};
		
		// Team Chart
		$http.get(URL_TEAM_CHART).then((res) => {	
			console.log(res.data)
		});

		//Personal Chart
		
		
		$scope.personalChart = function(){
			//access the html using document.getElementbyTags("username")
			//firstNode. 
			//get the content of the node ==> username
			const userName = $scope.getUserName;
			alert(userName);
			$http.get(URL_USER_CHART + `${'Qiudan'}`).then((res) => {
				console.log(URL_USER_CHART + `${'Qiudan'}`);

			});
		}
	}
);
