// Define the `parcelApp` module
dashboardApp = angular.module('dashboardApp',[]);

// Define the `ParcelHisController` controller on the `parcelApp` module
dashboardApp.controller('DashboardController', function DashboardController($scope, $http){
    // Obtain html route
    let URL_ALL_USERS = "http://localhost:8000/getAllUser";
    let URL_INDICATORS = "http://localhost:8000/getIndicators/";
    let URL_BUBBLE = "http://localhost:8000/getBubble";
    //Lists
    $scope.indicators = [];
    $scope.bubbleData=[];
    //want a parameter to contain tun indicator
    
    //Functions
    $http.get(URL_ALL_USERS)
            .then(function (response) {
                console.log(response);
                $scope.tun = response.data;
            });
    //other indicators can use this list to store
    // let newIndicator = {};
    $http.get(URL_INDICATORS+`2021-10-22T22:00:00.000Z`)
            .then((res)=>{
                // console.log(res.data.rows[0]);   
                // console.log(res.data.rows[0].users.length);
                //Daily Actual User
                let dau = res.data.rows[0].users.length;
                console.log(dau);
                //Team Mood Scale
                let tms = res.data.rows[0].mood;
                console.log(tms);
                //Team Action Volume??? in db was it already the mean data of the team?
                let tav = res.data.rows[0].daily_action;
                console.log(tav);
                //Player Action Volume???
                let pav = tav * dau
                console.log(pav);
                $scope.indicators = {"dau":dau,"tms":tms,"tav":tav,"pav":pav};
                // $scope.indicators.push(newIndicator);
            });

    //  bubble
    $http.get(URL_BUBBLE)
            .then((res)=>{
                $scope.bubbleData = res.data;
                
            });
});