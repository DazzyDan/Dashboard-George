// Define the `dashboardApp` module
dashboardApp = angular.module("dashboardApp", []);

// Define the `DashboardController` controller on the `dashboardApp` module
dashboardApp.controller(
	"DashboardController",
	function DashboardController($scope, $http, $filter) {
		// Obtain html route
		let URL_ALL_USERS = "http://localhost:8000/getAllUser";
		let URL_INDICATORS = "http://localhost:8000/getIndicators/";
		let URL_RANGE_BUBBLE  = "http://localhost:8000/getRangeBubble/";

		$scope.indicators = [];
		$scope.bubbleData = [];
		//want a parameter to contain tun indicator

		//Main Functions
		//1. Get Total User Numbers
		$http.get(URL_ALL_USERS).then(function (response) {
			//console.log(response);
			$scope.tun = response.data;
		});
		
		//other indicators can use this list to store
		// default=>today
		var today = new Date();
		var date =
			today.getFullYear() +
			"-" +
			(today.getMonth() + 1) +
			"-" +
			today.getDate();
		//console.log(date);
		$http.get(URL_INDICATORS + `${date}`).then((res) => {
			// console.log(res.data.rows[0]);
			// console.log(res.data.rows[0].users.length);
			//Daily Actual User
			loadIndicators(res.data);
		});

		function loadIndicators(data) {
			let dau = data.rows[0].users.length;
			console.log("dau", dau);
			//Team Mood Scale
			let tms = data.rows[0].mood;
			console.log("tms", tms);
			//Player Action Volume=Average number
			let pav = data.rows[0].daily_action;
			console.log("pav", pav);
			//Team Action Volume= Sum of Player Action Volume
			let tav = pav * dau;
			console.log("tav", tav);
			$scope.indicators = { dau: dau, tms: tms, tav: tav, pav: pav };
		}

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

		//  bubble

		$scope.dateRangeChange = function () {
			const [startDateStr, endDateStr] = $scope.dateSearchRange.split(" - ");
			let startDate = formatRangeDate(startDateStr);
			let endDate = formatRangeDate(endDateStr);
			$http
				.get(
					URL_RANGE_BUBBLE + `${startDate}/${endDate}`
				)
				.then((res) => {
					console.log(URL_RANGE_BUBBLE + `${startDate}/${endDate}`);
                    			//not fixed: month need to -1
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
			const date = new Date(year, month, day);
			return $filter("date")(date, "yyyy-MM-dd");
		}
	}
);
