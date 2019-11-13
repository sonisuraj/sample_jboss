app.controller('ComponentDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.roleBasedCanBeAssociated=false;
	}
	else {
		$scope.roleBasedCanBeAssociated=true;
	}

	/*Start::Component related actions */
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
	$scope.showadd = false;
	$scope.showassociateSpinner = false;
	$scope.showRightTable = false;
	$scope.showaddSpinner = false;
	$scope.spinsleft = false;
	$scope.showSpinnerSearch = false;
	$scope.spinsRight = false;

	$scope.addComponents =function(){
		var post_url ='';
		var name = $scope.name;
		var componenttype =$scope.componenttype;
		var servicestatus =$scope.servicestatus;
		var environment =$scope.environment;
		var migrationapproach =$scope.migrationapproach;
		$http.post(post_url,{"name":name,"componenttype":componenttype,"servicestatus":servicestatus,"environment":environment,"migrationapproach":migrationapproach}).success(function(data){

		});
	}
	$scope.disassociateDevicesToDevices = function(compname){
		console.log('inside disassociateDevicesToDevices');
		$scope.showaddSpinner = true;
		$scope.table_loader=true;
		$scope.spinsleft = false;
		$scope.showSpinnerSearch = false;
		$scope.spinsRight = false;
		$scope.showassociateSpinner = false;
		console.log('compname===' + compname);
			var compName = compname;
			var post_url=__env.apiUrl+"/devices/logicaldevices/disassociate/"+$scope.deviceName;
			$http.post(post_url,{"devicetype":"components","devicename":compName})
				.success(function (response){
					alert('Component '+compName+' successfully disassociated with '+$scope.deviceName);
					$scope.showaddSpinner = false;
					$scope.table_loader=false;
					$scope.newCompName="";
					$scope.searchCompName = "";
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/components";
					//console.log('urlcall==>>>>' + urlCall);
					$http.get(urlCall)
						.then(function (response) {
							$scope.compdata =response['data']['components'];
							$scope.$parent.compdata =response['data']['components'];
                            if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.compcount = $scope.$parent.compdata.length;
                            $scope.logicalDeviceData.compcount = $scope.$parent.compdata.length;
						});
					//getLogialDeviceRelatedData($scope,$http,__env);
				}).catch(function (response) {

					$scope.showaddSpinner = false;
					$scope.table_loader=false;
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					alert('Error occurred, Please try again!'+response.status);


				});

	}
	$scope.addCompToLD = function(compname){
		console.log('inside add comp to LD');
		$scope.showaddSpinner = true;
		$scope.table_loader=true;
		$scope.spinsleft = false;
		$scope.showSpinnerSearch = false;
		$scope.spinsRight = false;
		$scope.showassociateSpinner = false;
		console.log('compname===' + compname);
		console.log('$scope.newCompName===' + $scope.newCompName);
		if(!compname || compname ==''){alert('Please enter valid component name'); return false;}
		//var post_url=__env.apiUrl+"/components/add";
		//$http.post(post_url,{"name":compname,"componenttype":"ctype","componentstatus":"service","environment":"windows","migrationapproach":"map","created":"2017-03-23 00:00:00.0"}).success(function(data){
			/*Start::Defect21453*/
			//console.log('inside success of add api');
			var compName = compname;
			var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
			$http.post(post_url,{"devicetype":"components","devicename":compName})
				.success(function (response){
					alert('Component '+compName+' successfully added and associated with '+$scope.deviceName);
					$scope.showaddSpinner = false;
					$scope.table_loader=false;
					$scope.newCompName="";
					$scope.searchCompName = "";
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/components";
					//console.log('urlcall==>>>>' + urlCall);
					$http.get(urlCall)
						.then(function (response) {
							$scope.compdata =response['data']['components'];
							$scope.$parent.compdata =response['data']['components'];
                            if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.compcount = $scope.$parent.compdata.length;
                            $scope.logicalDeviceData.compcount = $scope.$parent.compdata.length;
						});
					//getLogialDeviceRelatedData($scope,$http,__env);
				}).catch(function (response) {

					$scope.showaddSpinner = false;
					$scope.table_loader=false;
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					if($scope.statusCode ==409){
						alert('Component '+ compName + ' already associated with '+$scope.deviceName);
						$scope.compSearchResult =[];
						$scope.$parent.compSearchResult = [];
						return false;
					}
					else{
						alert('Error occurred, Please try again!'+response.status);
					}

				});
			/*End::Defect21453*/
		/*}).catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText);
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					$scope.showaddSpinner = false;
					$scope.table_loader=false;
			if($scope.statusCode ==409){
				alert('Component '+$scope.newCompName + ' already exists ');
				$scope.compSearchResult =[];
				$scope.$parent.compSearchResult = [];
				return false;
			}
			else{
			    alert('Error occurred, Please try again!'+response.status);
			}


		});*/

	}

	$scope.associateCompToLD = function(compName){
		$scope.showassociateSpinner = true;
		$scope.table_loader = true;
		$scope.showaddSpinner = false;
		$scope.spinsleft = false;
		$scope.showSpinnerSearch = false;
		$scope.spinsRight = false;
		var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"components","devicename":compName})
			.success(function (response){
				alert('Successfully associated component '+ compName + ' with '+$scope.deviceName);
				urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/components";
				$http.get(urlCall)
					.then(function (response) {
						$rootScope.relatedCountShowMark =true;
						console.log($rootScope.relatedCountShowMark);
						$scope.compdata =response['data']['components'];
						$scope.$parent.compdata =response['data']['components'];
						console.log(' associate comp to LD data====' + JSON.stringify($scope.compdata));
						$scope.showassociateSpinner = false;
						$scope.table_loader = false;
						if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.compcount = $scope.$parent.compdata.length;
						$scope.logicalDeviceData.compcount = $scope.$parent.compdata.length;
					});
				//getLogialDeviceRelatedData($scope,$http,__env);
			}).catch(function (response) {
				alert('Component '+ compName + ' already associated with '+$scope.deviceName);
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				$scope.showassociateSpinner = false;
				$scope.table_loader = false;
			});
	}

	$scope.checkforEmpty = function(){
		$scope.showadd = false;
		$scope.showRightTable = false;
		if($scope.searchCompName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		if($scope.searchCompName === '*'){
			//alert('value===empty');
			//$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			$scope.showadd = false;
		}
	}



	//$scope.compSearchResult = [{"name":"AAA Investment Management Triple A","componenttype":"Application"},{"name":"AAR Loro Billing","componenttype":"Application"},{"name":"AARMS","componenttype":"Application"},{"name":"ABC Reporting","componenttype":"Application"},{"name":"Abnamromarkets","componenttype":"Application"}];
	$scope.searchCompForLD = function(){
		$scope.compSearchResult = [];
		//$scope.$parent.compSearchResult = [];
		 $scope.showSpinnerSearch = true;
		$scope.table_loader = true;
		$scope.showRightTable = true;
		if($scope.searchCompName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}
		console.log('$scope.searchCompName===' + JSON.stringify($scope.searchCompName));
		var post_url=__env.apiUrl+"/devices/search";
		//console.log('post_url search comp api==>>>>' + post_url);
		$http.post(post_url,{"devicetype":"components","search":[{"fieldname":"name","fieldvalue":$scope.searchCompName}]})
			.then(function (response){
				$scope.compSearchResult =response['data'];
				if ( $scope.$parent) $scope.$parent.compSearchResult =response['data'];
				console.log('$scope.compSearchResult====' + JSON.stringify($scope.compSearchResult))
				$scope.showSpinnerSearch = false;
				$scope.table_loader = false;
				if($scope.compSearchResult.length === 0){
					if($scope.searchCompName === '*'){
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
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				$scope.showSpinnerSearch = false;
				$scope.table_loader = false;
			});
		if($scope.searchCompName === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			$scope.showadd = false;
		}
	} // end of searchcompforld
	/*End::Component related actions */

	$scope.otdtable2 =false;

	$scope.otdtable =function(){
		//alert('inside otdtable');
		$('.change_col').removeClass('col-md-12').addClass('col-md-8');
		$("#otd-table-2").addClass('col-md-4');
		$scope.otdtable2 =true;
	}

	$scope.showInfo = function(info){
		//alert('show info');
		console.log('info===' + JSON.stringify(info));
		$scope.deviceInfo = info;
	}
} //end controller

]);
