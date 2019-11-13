app.controller('ClusterDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.roleBasedCanBeAssociated=false;
	}
	else {
		$scope.roleBasedCanBeAssociated=true;
	}
	$scope.navigationOther =function(name,pkid,otherdevicename){
			$http.get(__env.apiUrl+"/devices/"+otherdevicename+"/"+name+"/rownum").success(function (response) {
				var no =response.ROWNUM;
				var redirectUrl = "/otherDevices/"+otherdevicename+"/first/"+no+"/"+name +"/undefined/undefined";
				console.log(redirectUrl);
				$location.url(redirectUrl);
			}).error(function(response){
					console.log(response);
					if(response.errorMessage){
							alert(response.errorMessage);
							return;
					}
			});
	}
	$scope.showRightTable = false;
	$scope.showadd = false;

	$scope.checkforEmpty = function(){
		$scope.showadd = false;
		$scope.showRightTable = false;
		console.log('$scope.searchClusName===' + $scope.searchClusName);
		if($scope.searchClusName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		if($scope.searchClusName === '*'){
			//alert('value===empty');
			//$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			//$scope.showadd = false;
		}
	}

	$scope.searchClusForLD = function(){
		$scope.$parent.clusSearchResult = [];
		$scope.clusSearchResult = [];
		$scope.clusterSpinner = true;
		$scope.table_loader = true;
		$scope.showRightTable = true;
		if($scope.searchClusName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}
		var post_url=__env.apiUrl+"/devices/search";
		console.log('$scope.searchClusName===>>>>>' + JSON.stringify($scope.searchClusName));
		$http.post(post_url,{"devicetype":"clusters","search":[{"fieldname":"name","fieldvalue":$scope.searchClusName}]})
			.then(function (response){
				$scope.clusSearchResult =response['data'];
				$scope.$parent.clusSearchResult =response['data'];
				console.log('$scope.clusSearchResultttt===' +JSON.stringify($scope.clusSearchResult));
				console.log('$scope.clusSearchResultttt.length===' +JSON.stringify($scope.clusSearchResult.length));
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
				if($scope.clusSearchResult.length === 0){
					if($scope.searchClusName === '*'){
						$scope.showadd = false;
					}
					else{
						$scope.showadd = true;
					}
				}
				else{
					$scope.showadd = false;
				}
			}).catch(function (response) {
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
			});
		if($scope.searchClusName === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.clusSearchResult));
			//$scope.showadd = false;
		}
	}
	$scope.addClusters =function(){ // this is not used anywhere
		var post_url ='';
		var name = $scope.name;
		var clustertype =$scope.clustertype;
		var discoverystatus =$scope.discoverystatus;
		var clusterdescription =$scope.clusterdescription;
		var migrationapproach =$scope.migrationapproach;
		$http.post(post_url,{"name":name,"clustertype":clustertype,"discoverystatus":discoverystatus,"clusterdescription":clusterdescription,"migrationapproach":migrationapproach}).success(function(data){
		});
	}


	$scope.addClusToLD = function(newClusName){
		$scope.clusterSpinner = true;
		$scope.table_loader = true;
		if(!newClusName || newClusName ==''){alert('Please enter valid cluster name'); return false;}
		//var post_url=__env.apiUrl+"/clusters/add";

		//$http.post(post_url,{"name":newClusName,"clustertype":"ctype","discoverystatus":"discstatus","clusterdescription":"clusterdescription","migrationapproach":"map"}).success(function(data){
			var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
			$http.post(post_url,{"devicetype":"clusters","devicename":newClusName})
				.success(function (response){
					alert('Cluster '+newClusName+' successfully added and associated with '+$scope.deviceName);
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/clusters";
					$http.get(urlCall)
						.then(function (response) {
							$rootScope.relatedCountShowMark =true;
							$scope.$parent.clusterdata =response['data']['clusters'];
							$scope.clusterdata =response['data']['clusters'];
							if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.clustercount = $scope.$parent.clusterdata.length;
							$scope.logicalDeviceData.clustercount = $scope.$parent.clusterdata.length;

							$scope.devicesCount		=		$scope.clusterdata.length;
							$scope.recordEnd = $scope.currentPage * $scope.recordsPP +1;
							if($scope.recordEnd > $scope.devicesCount)
							{
								$scope.recordEnd = $scope.devicesCount;
							}
						});
						$scope.clusterSpinner = false;
						$scope.table_loader = false;



					//getLogialDeviceRelatedData($scope,$http,__env);
				}).catch(function (response) {
					if($scope.statusCode ==409){
						alert('Cluster '+ newClusName + ' already associated with '+$scope.deviceName);
						$scope.clusterSpinner = false;
						$scope.table_loader = false;
						$scope.$parent.clusSearchResult = [];
						$scope.clusSearchResult = [];
						return false;

					}
					else{
						alert('Error occurred, Please try again!');
						$scope.clusterSpinner = false;
						$scope.table_loader = false;
					}

					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

				});
			/*End::Defect21453*/
		/*}).catch(function (response) {
			if($scope.statusCode ==409){
				alert('Cluster '+newClusName + ' already exists for '+ $scope.deviceName);
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
				$scope.$parent.clusSearchResult = [];
				$scope.clusSearchResult = [];
				return false;
			}
			else{
				alert("Name Already exist!! Please Select different Name to avoid Conflict!!");
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
			}

			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText);
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		});*/
		$scope.newClusName ="";

	}

	$scope.disassociateDevicesToDevices = function(newClusName){
		$scope.clusterSpinner = true;
		$scope.table_loader = true;
		var post_url=__env.apiUrl+"/devices/logicaldevices/disassociate/"+$scope.deviceName;
			$http.post(post_url,{"devicetype":"clusters","devicename":newClusName})
				.success(function (response){
					alert('Cluster '+newClusName+' successfully disassociated with '+$scope.deviceName);
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/clusters";
					$http.get(urlCall)
						.then(function (response) {
							$scope.$parent.clusterdata =response['data']['clusters'];
							$scope.clusterdata =response['data']['clusters'];
							if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.clustercount = $scope.$parent.clusterdata.length;
							$scope.logicalDeviceData.clustercount = $scope.$parent.clusterdata.length;

							$scope.devicesCount		=		$scope.clusterdata.length;
							$scope.recordEnd = $scope.currentPage * $scope.recordsPP +1;
							if($scope.recordEnd > $scope.devicesCount)
							{
								$scope.recordEnd = $scope.devicesCount;
							}
						});
						$scope.clusterSpinner = false;
						$scope.table_loader = false;



					//getLogialDeviceRelatedData($scope,$http,__env);
				}).catch(function (response) {
						alert('Error occurred, Please try again!');
						$scope.clusterSpinner = false;
						$scope.table_loader = false;


					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

				});

		$scope.newClusName ="";

	}

	$scope.associateClusToLD = function(clusName){
		$scope.clusterSpinner = true;
		$scope.table_loader = true;
		var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"clusters","devicename":clusName})
			.success(function (response){
				alert('Clusters '+ clusName + ' is associated successfully!');
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/clusters" ;
				$http.get(urlCall)
					.then(function (response) {
						$scope.clusterdata =response['data']['clusters'];
						$scope.$parent.clusterdata =response['data']['clusters'];
						if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.clustercount = $scope.$parent.clusterdata.length;
						$scope.logicalDeviceData.clustercount = $scope.$parent.clusterdata.length;
						$scope.devicesCount		=		$scope.clusterdata.length;
						$scope.recordEnd = $scope.currentPage * $scope.recordsPP +1;
						if($scope.recordEnd > $scope.devicesCount)
						{
							$scope.recordEnd = $scope.devicesCount;
						}
					});
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
				//getLogialDeviceRelatedData($scope,$http,__env);
			}).catch(function (response) {
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
				if($scope.statusCode ==409){
					alert("Cluster <"+clusName+"> Already associated");
					$scope.$parent.clusSearchResult = [];
					$scope.clusSearchResult = [];
					return false;
				}

			});
	} // end of associateClusToLD

	$scope.otdtable2 =false;

	$scope.otdtable =function(){
		$('.change_col').removeClass('col-md-12').addClass('col-md-8');
		$("#otd-table-2").addClass('col-md-4');
		$scope.otdtable2 =true;
	}


	$scope.showInfo = function(info){
		//alert('show info');
		console.log('info===' + JSON.stringify(info));
		Object.keys(info).forEach(function(key,index) {
			//console.log('key===' + key);
			//console.log('index==' + index);
			if(key==='index'){
				delete info[key];
			}

		});
		$scope.deviceInfo = info;

	}

} //end controller

]);
