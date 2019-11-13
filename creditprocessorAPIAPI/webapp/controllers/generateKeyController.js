/**
 * Created by Manisha on 11/13/2017.
 */
app.controller('generateKeyController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64,$http,$routeParams,$rootScope,$location)
{

    $scope.showDetails = false;
    $scope.error = '';
    $scope.dataLoading = true;
    $scope.generateKey = function(user,reason){
        console.log(user);
        console.log(reason);
        var samplejson = {};
        samplejson.userid = user;
        samplejson.reason = reason;
        console.log(JSON.stringify(samplejson));
        var puturl=__env.apiUrl+"/authenticate/generateAPIKey";
        //var samplePuturl = 'http://9.79.177.140:9080/SCOPEToolsIntegrationServices/api/authenticate/generateAPIKey';
        console.log(puturl);
        //$http.put( __env.apiUrl+'/authenticate/generateAPIKey/+'+user)
        var config = {
            headers : {
                'Content-Type': 'application/json',
            }
        };
        $http.put(puturl,samplejson,config)
            .then(function (response) {
                console.log("Response got is:"+JSON.stringify(response));
                $scope.showDetails = true;
               $scope.usersDetails =response['data'];
                $scope.dataLoading = false;
            }).catch(function (response) {
                console.log("Inside error case");
                $scope.statusCode = response.status;
                $scope.statusText = (response.statusText );
                console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
            });
    };
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
    };


    $scope.resetForm = function(){
        $scope.registerSuccess = '';
        document.getElementById("form").reset();
    };

}]);
