app.controller('updateUserController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64,$http,$routeParams,$rootScope,$location)
{
  if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
  {
  	$location.url("/");
  }

  if(!$scope.activeUsers)
  {
    $scope.dataLoading = true;
    $scope.activeUsers = false;
    $scope.userAction = 'active';
    /*Code to populate Users */
    $http.get( __env.apiUrl+'/localLoginAuthenticate/getAllUsers'+'/'+Base64.encode($scope.globals.currentUser.username)+'/?enable=false')
        .then(function (response) {
          console.log("Response got is:"+response);
          $scope.users =response['data'];
          $scope.dataLoading = false;
        }).catch(function (response) {
          console.log("Inside error case");
          $scope.statusCode = response.status;
          $scope.statusText = (response.statusText );
          console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
        });

    /*Code to populate Users */

  }
  else
  {
    $scope.dataLoading = true;
    $scope.activeUsers = true;
    $scope.userAction = 'inactive';

  }

$scope.showUsers = function(usertype)
{
    $scope.userAction = usertype;
    $scope.dataLoading = true;
    $scope.filterUser = [];
    $scope.userArray = [];
    if($scope.userAction == 'active')
    {
    $scope.activeUsers = false;
    /*Code to populate Users */
    $http.get( __env.apiUrl+'/localLoginAuthenticate/getAllUsers'+'/'+Base64.encode($scope.globals.currentUser.username)+'/?enable=false')
        .then(function (response) {
          console.log("Response got is:"+response);
          $scope.users =response['data'];
          $scope.dataLoading = false;
        }).catch(function (response) {
          console.log("Inside error case");
          $scope.statusCode = response.status;
          $scope.statusText = (response.statusText );
          console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
        });

    /*Code to populate Users */
    }
    else if($scope.userAction == 'inactive')
    {
      $scope.activeUsers = true;
      /*Code to populate Users */
      $http.get( __env.apiUrl+'/localLoginAuthenticate/getAllUsers'+'/'+Base64.encode($scope.globals.currentUser.username)+'/?enable=true')
          .then(function (response) {
            console.log("Response got is:"+response);
            $scope.users =response['data'];
            $scope.dataLoading = false;
          }).catch(function (response) {
            console.log("Inside error case");
            $scope.statusCode = response.status;
            $scope.statusText = (response.statusText );
            console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
          });

      /*Code to populate Users */
    }
    else {
      return false;
      $scope.dataLoading = false;
    }

    $scope.error = '';
}

$scope.userArray = [];
$scope.selectUser = function(username)
{
  //document.getElementById("user_"+username).checked= true;
  if($scope.userArray.indexOf(username) == -1)
  {
    $scope.userArray.push(username);
  }
  else
  {
    $scope.userArray.splice($scope.userArray.indexOf(username),1)
  }
}

$scope.error = '';
$scope.updateUser = function()
{

  if($scope.userArray.length <=0)
  {
    $scope.error="Please select user to update.";
    return false;
  }
  else {
  var updateConfirm = confirm("Do you really want to update selected user(s) ?");
  if(!updateConfirm)
  {
    //$scope.userAction = "inactive";
    $scope.activeUsers = "";
    $scope.showUsers($scope.userAction);
    $scope.resetForm();
    return false;
  }
  else {
    var post_url = __env.apiUrl+'/localLoginAuthenticate/enableDisableUser';
    var config = {
      headers : {'Content-Type': 'application/json',}
    }
          if($scope.userAction == 'active')
          {
            var jsonPost =
              {
                "userlist": $scope.userArray.toString(),
                 "enable" :true
              }
          }
          else {
                var jsonPost =
                  {
                    "userlist": $scope.userArray.toString(),
                     "enable" :false
                  }
          }

          $scope.dataLoading = true;
              $http.put(post_url, jsonPost, config)
              .success(function (response,data, status, headers, config) {
                  console.log('Activate user API call');
                  $scope.dataLoading = false;
                  $scope.error = '';
                  $scope.showUsers($scope.userAction);
                  alert(response["message"]);
                  $scope.filterUser="";
                  $scope.resetForm();
                })
                .error(function (response,data, status, headers, config) {
                  $scope.dataLoading = false;
                  //$scope.error = 'Error occurred while changing password, please try again';
                  $scope.error = response["message"];
                  $scope.filterUser="";
                  $scope.resetForm();
                });
     }
   }
    $scope.dataLoading = false;
    return false;
};

$scope.resetForm = function(){
  $scope.registerSuccess = '';
  document.getElementById("form").reset();
};

}]);
