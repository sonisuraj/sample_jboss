/*angular.element(window.document.body).ready(myInit);

 var myInit = function () {
    console.log("Inside getReady function to set focus");
    if (  document.getElementById('username') ) {
	 document.getElementById('username').focus();
	 }

};
*/

app.controller('forgotPasswordController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64, $http,$routeParams,$rootScope,$location)
{

$scope.error = '';
$scope.validateUser = function()
{
  if(!$scope.username)
  {
    $scope.error = 'Please enter valid username.';
  }
  else
  {
    $scope.dataLoading = true;
    //var get_url =  __env.apiUrl+'/localLoginAuthenticate/securityQA/'+$scope.username;
    var get_url =  __env.apiUrl+'/localLoginAuthenticate/forgotPassword/'+Base64.encode($scope.username);

      $http.get(get_url)
      .success(function (response,data, status) {
          console.log('Validate User API response' + JSON.stringify(data));
          $scope.dataLoading = false;
          $scope.error = '';
          if(response["securityQuestion"] !== '')
          {
            if(response["securityQuestion"] =='')
            {
              $scope.error = "Please contact SCOPE+ Admin to change your password.";
              document.getElementById('userNameForm').style.display = "none";
            }
            else {
              document.getElementById('userNameForm').style.display = "none";
              document.getElementById('QAForm').style.display = "block";
              $scope.securityQuestion = response["securityQuestion"];
            }
          }
          else{
            //$location.url('/changePassword');
            $scope.error = response["message"];
            return false;
          }
        })
        .error(function (response,data, status) {
          $scope.dataLoading = false;
          $scope.isValidUser = false;
          //$scope.error = 'Error occurred while changing password, please try again';
          $scope.error = response["message"];
        });
 }
}
$scope.validateQA = function()
{
  if(!$scope.answer)
  {
    $scope.error = 'Please enter security answer.';
  }
  else {
      $scope.dataLoading = true;
      //var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commitcommon/"+$scope.importID;
      //var post_url =  __env.apiUrl+'/localLoginAuthenticate/checksecurityQA';

      var post_url =  __env.apiUrl+'/localLoginAuthenticate/forgotPassword/checkSecurityAnswer';
          var jsonPost =
          {
          "securityAnswer":Base64.encode($scope.answer),
          "securityQuestion":$scope.securityQuestion,
          "userName":Base64.encode($scope.username)
          };

        var config = {
					headers : {'Content-Type': 'application/json',}
				}

        $http.post(post_url, jsonPost, config)
        .success(function (response,data, status, headers, config) {
						console.log('Validate QA for forgot password ' + JSON.stringify(data));
            $scope.dataLoading = false;
            $scope.error = '';
            if(response["status"] == 'success')
            {
              //document.getElementById('userNameForm').style.display = "none";
              document.getElementById('QAForm').style.display = "none";
                document.getElementById('passwordForm').style.display = "block";
              //alert(response["message"] +' You will be redirected to the login page.');
              //$location.url('/logout');
            }
            else{
              //$location.url('/changePassword');
              $scope.error = response["message"];
              $scope.resetForm();
              return false;
            }
					})
					.error(function (response,data, status, headers, config) {
            $scope.dataLoading = false;
						//$scope.error = 'Error occurred while changing password, please try again';
            $scope.error = response["message"];
					});
  }
}

$scope.setPassword = function()
{
  if(!$scope.password || !$scope.confirmpassword)
  {
    $scope.error = 'All fields are mandatory, please enter required information';
    $scope.resetForm();
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
  $scope.error = 'New Password and Confirm New Password fields do not match';
  $scope.resetForm();
  }
  else {
      $scope.dataLoading = true;
      //var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commitcommon/"+$scope.importID;
      var post_url =  __env.apiUrl+'/localLoginAuthenticate/forgotPassword/updateNewPassword';
          var jsonPost =
          {
          "newPassword":Base64.encode($scope.password),
          "confirmNewPassword":Base64.encode($scope.confirmpassword),
          "userName":Base64.encode($scope.username)
          };

        var config = {
					headers : {'Content-Type': 'application/json',}
				}

        $http.put(post_url, jsonPost, config)
        .success(function (response,data, status, headers, config) {
						console.log('Forgot password set ' + JSON.stringify(data));
            $scope.dataLoading = false;
            $scope.error = '';
            if(response["status"] == 'success')
            {
              //document.getElementById('userNameForm').style.display = "none";
                document.getElementById('QAForm').style.display = "none";
                //document.getElementById('passwordForm').style.display = "none";
              alert(response["message"] +' You will be redirected to the login page.');
              $location.url('/login');
            }
            else{
              //$location.url('/changePassword');
              $scope.error = response["message"];
              $scope.resetForm();
              return false;
            }
					})
					.error(function (response,data, status, headers, config) {
            $scope.dataLoading = false;
						//$scope.error = 'Error occurred while changing password, please try again';
            $scope.error = response["message"];
            $scope.resetForm();
					});
  }
}
$scope.resetForm = function(){
  document.getElementById("form").reset();
};

}]);
