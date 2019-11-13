

	app.controller('markForDeletionController',['$scope','$http','__env','$location','orderByFilter',function($scope,$http,__env,$location,orderBy) {

		$scope.showData =false;
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

$scope.Delete = function (id){
	var name= id.toLowerCase()
    $location.url("/logicalDeviceListView/"+name+"/0/markfordeletion");
	return true;
	$http.get(__env.apiUrl+'/devices/fields/'+name).then(function(response){
			$scope.getFieldResponse = response.data;
			$scope.FieldData = response.data.fields;
			$scope.cols = $scope.FieldData;
			$scope.tempkeys1 =[];
			//$scope.tempkeys1=$scope.cols;
			for(var i=0;i<$scope.cols.length;i++){
				 var fieldDetails = $scope.cols[i];
				 if(fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") )){
					 $scope.tempkeys1.push($scope.cols[i].key);
				 }

			 }
			 console.log($scope.tempkeys1);
		});
	$scope.showData=true;
	$scope.Name =id;
	var urlCall =__env.apiUrl+"/devices/getmarkfordeletion/"+id;
	$http.get(urlCall)
		.then(function (response) {
			$scope.restData =response.data;
			console.log($scope.restData);
				$scope.headingName = id;



		}).catch(function (response) {
			console.log(response);
		});
};
}]);
