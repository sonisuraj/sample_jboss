app.controller('HomeController',['$scope','$http','$rootScope','$uibModal' ,'$location', function($scope,$http,$rootScope,$uibModal,$location) {
    console.log('inside home controller');
    //$scope.message = 'Hello from HomeController';
    // WHy do we need this call....
//    var urlCall =__env.apiUrl+"/devices/count";
    //  $http.get(urlCall)
    //    .then(function (response) {
    //console.log(response);
    //$scope.relatedVersions =response['data']['result'];
    //  });
    var urlCall =__env.apiUrl+"/devices/count";
    $http.get(urlCall)
      .then(function (response) {
        console.log("Response got is:"+response);

        $scope.relatedVersions =response['data']['result'];
        $scope.logicalDeviceCount = $scope.relatedVersions[0].count;
        var urlCall =__env.apiUrl+"/devices/displaynames";
        $http.get(urlCall).then(function (response) {
          $scope.deviceDisplayNames =response['data'];
          for ( var inner = 0; inner < $scope.relatedVersions.length; inner++ ) {
            $scope.relatedVersions[inner].displayname = $scope.deviceDisplayNames[$scope.relatedVersions[inner].id.toLowerCase()];
          }
          console.log($scope.relatedVersions);
        });


      }).catch(function (response) {
        console.log("Inside error case");
        $scope.statusCode = response.status;
        $scope.statusText = (response.statusText );
        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
      });


    $rootScope.openexportstab = function(){
        console.log('inside open exports');
        $rootScope.showimporttab = false;
        $rootScope.showexptab = true;
        $rootScope.showcustatt = false;
    };
    $rootScope.openlogDevicexls = function(deviceType,format){
        console.log('inside open log device');
        console.log('deviceType===' + deviceType);
        console.log('format===' + format);
        $rootScope.showdropdownlogDevices = true;
        $rootScope.showexptab= true;
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'selectiveLG.html',
            controller: 'ModalController',
            size: 'lg',
            windowClass: 'app-modal-window-selectpro',
            resolve: {
                DeviceType: function() {
                    return deviceType
                },
                Format : function(){
                    return format
                }
            }

        });

    }
    $rootScope.openlogDevice = function(deviceType,format){
        console.log('inside open log device');
        console.log('deviceType===' + deviceType);
        console.log('format===' + format);
        $rootScope.showdropdownlogDevices = true;
        $rootScope.showexptab= true;
        $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'selectiveLG.html',
            controller: 'ModalController',
            size: 'lg',
            windowClass: 'app-modal-window-selectpro',
            resolve: {
                DeviceType: function() {
                    return deviceType
                },
                Format : function(){
                    return format
                }
            }

        });

    }
    /*Start::Defect21651*/
    $rootScope.openimporttab = function(){
        console.log('inside open Import');
        $rootScope.showimporttab = true;
        $rootScope.showexptab = false;
        $rootScope.showcustatt = false;
    };
    /*End::Defect21651*/
    $rootScope.opencustatt = function(){
        console.log('inside cust att');
        $rootScope.showimporttab = false;
        $rootScope.showexptab = false;
        $rootScope.showcustatt = true;
    };


}]);
