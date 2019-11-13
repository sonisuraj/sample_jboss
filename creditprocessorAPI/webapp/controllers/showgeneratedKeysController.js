/**
 * Created by Manisha on 11/13/2017.
 */
app.controller('showgeneratedKeyController', ['$scope','Base64','$http','$routeParams','$rootScope','$location',function($scope,Base64,$http,$routeParams,$rootScope,$location)
{

    $scope.dataLoading = true;

    var post_url=__env.apiUrl+"/authenticate/getgeneratedAPIKeys";
    var post_url_test= 'http://9.79.177.140:9080/SCOPEToolsIntegrationServices/api/authenticate/getgeneratedAPIKeys';
    console.log(post_url);

    var config = {
        headers : {
            'Content-Type': 'application/json',
        }
    };
    var paramData = [{"userid":"*"}];
    $http.post(post_url,paramData, config).success(function(data){
        console.log('success');
        console.log(JSON.stringify(data));
        $scope.Showkeys = data;
    }).catch(function (response) {
        //alert("Error while importing document");
        $scope.errorMsg = "Error received while importing data, Please try again!";
        document.getElementById('Modal_importError').style.display = "block";
        console.log("Inside error case");
        $scope.statusCode = response.status;
        $scope.statusText = (response.statusText);
        console.log("Error received while importing data: "+response.statusText +" : "+"Request failed"+" : "+response.status);

    });


}]);

