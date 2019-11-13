/*angular.element(window.document.body).ready(myInit);

 var myInit = function () {
    console.log("Inside getReady function to set focus");
    if (  document.getElementById('username') ) {
	 document.getElementById('username').focus();
	 }

};
*/

app.controller('forcePasswordController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64,$http,$routeParams,$rootScope,$location)
{

$scope.error = '';
$scope.changePassword = function()
{
  if(!$scope.oldpassword || !$scope.password || !$scope.confirmpassword || !$scope.securityquestion || !$scope.securityanswer)
  {
    $scope.error = 'All fields are mandatory, please insert required information';
  }
  else if($scope.password.length < 8){
  $scope.error = 'New password should be atleast 8 characters.';
  $scope.resetForm();
  }
  else if($scope.password.length > 50){
  $scope.error = 'Password must be maximum 50 characters in length.';
    $scope.resetForm();
  }
  //else if(!($scope.password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,50}$/))){
  else if(!($scope.password.match(/^(?=.*\d)(?=.*[A-Z]).{8,50}$/))){
  $scope.error = 'Password must contain at least one capital letter and number.';
  $scope.resetForm();
  }
  else if($scope.password !== $scope.confirmpassword){
  $scope.error = 'New Password and Confirm New Password fields do not match.';
  $scope.resetForm();
  }
  else if($scope.oldpassword == $scope.password){
  $scope.error = 'Old Password and New Password cannot be same.';
  $scope.resetForm();
  }
  else {

      $scope.dataLoading = true;
      $scope.error = "";
      //var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commitcommon/"+$scope.importID;
      var post_url =  __env.apiUrl+'/localLoginAuthenticate/forcePassword';
          var jsonPost =
          {
          "oldPassword":Base64.encode($scope.oldpassword),
          "newPassword":Base64.encode($scope.password),
          "confirmNewPassword":Base64.encode($scope.confirmpassword),
          "securityQuestion":$scope.securityquestion,
          "securityAnswer":Base64.encode($scope.securityanswer),
          "userName":Base64.encode($scope.globals.currentUser.username)
          };

        var config = {
					headers : {'Content-Type': 'application/json',}
				}

        $http.put(post_url, jsonPost, config)
        .success(function (response,data, status, headers, config) {
						console.log('change Password API response' + JSON.stringify(data));
            $scope.dataLoading = false;
            $scope.error = "";

            $scope.registerSuccess ="Changed Password";
            if(response["status"] == 'success')
            {
              $rootScope.globals.currentUser.changePassword = false;
                $rootScope.globals.currentUser.expiryPassword = false;
              alert(response["message"] +' You will be redirected to the login page.');
              $location.url('/logout');
            }
            else{
              //$location.url('/changePassword');
              $scope.error = response["message"];
              return false;
            }
					})
					.error(function (response,data, status, headers, config) {
            $scope.dataLoading = false;
						//$scope.error = 'Error occurred while changing password, please try again';
              $scope.resetForm();
            $scope.error = response["message"];
					});
  }
  return false;
}

$scope.resetForm = function(){
  document.getElementById("form").reset();
};

}]);
