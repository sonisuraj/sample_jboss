app.controller('autoLoadController', ['$scope','$http','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {

  $scope.$watch('gFiles', function() {
    $scope.upload($scope.gFiles);
  });
  $scope.upload = function(gFiles) {

    if (gFiles && gFiles.length) {
      /*for (var i = 0; i < gFiles.length; i++) {
        var file = gFiles[i];*/
        console.log(gFiles);
        if (!gFiles.$error) {
          Upload.upload({
            url: __env.apiUrl+'/documents/autoload',
              data: {
                'file': gFiles
              }
            })
            .then(function(response) {
            	if(response.data && response.data.FilesFailed && response.data.FilesFailed != "[]" ){        	
            		alert("File uploaded successfully. Processing will begin after 10 mins. Following files did not process -"+ response.data.FilesFailed);
            	}else{
            		alert("File uploaded successfully.Processing will begin after 10 mins.");
            	}
            }).catch(function(response) {
                  alert("File upload failed.Please contact system administrator");
            });
        }
     //     }
    }
  }

}]);
