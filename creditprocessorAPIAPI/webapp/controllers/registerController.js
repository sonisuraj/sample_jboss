/*angular.element(window.document.body).ready(myInit);

 var myInit = function () {
    console.log("Inside getReady function to set focus");
    if (  document.getElementById('username') ) {
	 document.getElementById('username').focus();
	 }

};
*/

app.controller('registerController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64,$http,$routeParams,$rootScope,$location)
{
  if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
  {
  	$location.url("/");
  }
$scope.error = '';
/*Code to populate Role and Project
  $scope.dataLoading = true;
$http.get( __env.apiUrl+'/localLoginAuthenticate/dropdown/project')
		.then(function (response) {

			console.log("Response got is:"+response);
			$scope.projects =response['data'];
      $scope.dataLoading = false;
		}).catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText );
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		});
*/
    $http.get( __env.apiUrl+'/localLoginAuthenticate/dropdown/role')
    		.then(function (response) {
    			console.log("Response got is:"+response);
    			$scope.roles =response['data'];
            $scope.dataLoading = false;
    		}).catch(function (response) {
    			console.log("Inside error case");
    			$scope.statusCode = response.status;
    			$scope.statusText = (response.statusText );
    			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
    		});

/*Code to populate Role and Project */



$scope.registerUser = function()
{

  if(!$scope.username || !$scope.firstname  ||  !$scope.lastname || !$scope.email  || !$scope.role || !$scope.password || !$scope.confirmpassword)
  {
    $scope.error = 'All fields are mandatory, please insert required information.';
  }
  else if(!($scope.validatorFunction($scope.username,'^[a-zA-Z]+$') || $scope.validatorFunction($scope.username,'^[a-zA-Z\s]+$') || $scope.validatorFunction($scope.username,'^[a-zA-Z0-9\s]+$') || $scope.validatorFunction($scope.username,'^[a-zA-Z0-9_.]+$'))){
    $scope.error = 'Enter valid username';
  }
  else if(!($scope.validatorFunction($scope.firstname,'^[a-zA-Z]+$') || $scope.validatorFunction($scope.firstname,'^[a-zA-Z\s]+$'))){
    $scope.error = 'Enter valid First Name';
  }
  else if(!($scope.validatorFunction($scope.lastname,'^[a-zA-Z]+$') || $scope.validatorFunction($scope.lastname,'^[a-zA-Z\s]+$'))){
  $scope.error = 'Enter valid Last Name';
  }
  /*else if(!($scope.validatorFunction($scope.phone,'^[0-9\-\+]{10,20}$'))){
  $scope.error = 'Please enter valid 10 digit Phone number.';
}
else if(!$scope.validatorFunction($scope.phone,'^[0-9\-\+]{10,20}$')){
$scope.error = 'Entered Phone number is not valid';
}*/
  else if($scope.password.length < 8){
  $scope.error = 'Password should be atleast 8 characters.';
  }
  else if($scope.password.length > 50){
  $scope.error = 'Password must be maximum 50 characters in length.';
  $scope.password="";
  }
  else if(!($scope.password.match(/^(?=.*\d)(?=.*[A-Z]).{8,50}$/))){
  $scope.error = 'Password must contain at least one capital letter and number.';
  $scope.password="";
  $scope.confirmpassword="";
  }
  else if($scope.password !== $scope.confirmpassword){
  $scope.error = 'Entered Password and Confirm password are not matching.';
  $scope.password="";
  $scope.confirmpassword="";
  }
  else if($scope.form.$error.email){
  $scope.error = 'Please enter valid email address.';
}
//alert($scope.validatorFunction($scope.email,'/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/'));
else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($scope.email))){
  $scope.error = 'Please enter valid email address.';
}
  else {
  $scope.dataLoading = true;
  $scope.error = "";
      //var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commitcommon/"+$scope.importID;
      var post_url =  __env.apiUrl+'/localLoginAuthenticate/register';
          var jsonPost =
          {
          "firstName": $scope.firstname,
          "lastName": $scope.lastname,
          "userName": Base64.encode($scope.username),
          "email": $scope.email,
          "phone": $scope.phone,
          "password": Base64.encode($scope.password),
          "confirmPassword": Base64.encode($scope.confirmpassword),
          "role":$scope.role,
          "project":$scope.project
        };
        var config = {
					headers : {'Content-Type': 'application/json',}
				}

        $http.post(post_url, jsonPost, config)
        .success(function (response,data, status, headers, config) {
						console.log('Register API response' + JSON.stringify(data));
            $scope.dataLoading = false;
            $scope.error = '';
            $scope.resetForm();
            $scope.registerSuccess ="Registration Success";
						alert('New User "'+$scope.username+'" Successfully Registered!');
					})
					.error(function (response,data, status, headers, config) {
            $scope.dataLoading = false;
						//$scope.error = 'Error occurred while registration process, please try again';
            $scope.error = response["message"];
            $scope.emailExists = response["emailExists"];
            if($scope.emailExists)
            {
              $scope.email="";
            }
            else {
                $scope.resetForm();
            }
          });
  }
  return false;
}

$scope.validatorFunction = function(input,reg)
{
  var reg = new RegExp(reg);
  return reg.test(input);
}
$scope.resetForm = function(){
  $scope.registerSuccess = '';
  document.getElementById("registerform").reset();
};

}]);
