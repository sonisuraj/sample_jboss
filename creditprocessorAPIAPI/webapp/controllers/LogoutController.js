app.controller('LogoutController',['$scope','$location','AuthenticationService', '__env',function($scope,$location,AuthenticationService,__env) {
$scope.logout = function() {

    // reset login status
	AuthenticationService.ClearCredentials();
    $location.url("/index");
}
    // reset login status
	console.log("Inside logout controller");
	AuthenticationService.ClearCredentials();
    $location.url("/index");

}]);
 
