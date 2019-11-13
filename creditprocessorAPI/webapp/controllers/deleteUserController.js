app.controller('deleteUserController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64,$http,$routeParams,$rootScope,$location)
{
  if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
  {
  	$location.url("/");
  }
$scope.error = '';
  $scope.dataLoading = true;
/*Code to populate Users */
$http.get( __env.apiUrl+'/localLoginAuthenticate/getAllUsers'+'/'+Base64.encode($scope.globals.currentUser.username))
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
$scope.userSelected = function()
{     $scope.dataLoading = true;
      $http.get( __env.apiUrl+'/localLoginAuthenticate/getRoleProject/'+Base64.encode($scope.user))
      .then(function (response) {
        console.log("Response got is:"+response);
        $scope.userRole =response['data'][0]["Role"];
        $scope.userProject =response['data'][0]["Project"];
        $scope.dataLoading = false;
      }).catch(function (response) {
        console.log("Inside error case");
        $scope.statusCode = response.status;
        $scope.statusText = (response.statusText );
        $scope.dataLoading = false;
        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

      });
}
$scope.deleteUser = function()
{
  var deleteConfirm = confirm("Do you really want to delete selected user '"+$scope.user+"' ?");
  if(!deleteConfirm)
  {
    $scope.resetForm();
    $scope.userRole = "";
    $scope.userProject="";
  }
  else if(!$scope.user)
  {
    $scope.error="Please select user to delete.";
  }
  else {
          $scope.dataLoading = true;
          $http.delete( __env.apiUrl+'/localLoginAuthenticate/'+Base64.encode($scope.user))
          .success(function (response) {
            console.log("Response got is:"+response);
              /*data refresh after delete*/
              $http.get( __env.apiUrl+'/localLoginAuthenticate/getAllUsers'+'/'+Base64.encode($scope.globals.currentUser.username))
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
                /*data refresh after delete*/
                $scope.userRole = "";
                $scope.userProject="";
                alert("User '"+ $scope.user +"' deleted successfully.");

          }).catch(function (response) {
            console.log("Inside error case");
            $scope.statusCode = response.status;
            $scope.statusText = (response.statusText );
            $scope.dataLoading = false;
            alert("Error occurred while delete user '"+ $scope.user +"', Please try again.");
            $scope.resetForm();
            console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
          });
     }
    $scope.dataLoading = false;
  return false;
}

$scope.resetForm = function(){
  $scope.registerSuccess = '';
  document.getElementById("form").reset();
};

}]);
