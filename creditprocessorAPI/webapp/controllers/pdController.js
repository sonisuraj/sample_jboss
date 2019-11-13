app.controller('pdController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {

	$scope.showRightTable = false;
	$scope.showadd = false;
	/*Start::Services related actions */
	$scope.addPDToLD = function(PDname){
		$scope.table_loader=true;
		$scope.spinPD = true;
		console.log('PDname===' + PDname);
		console.log('$scope.newPDName===' + $scope.newPDName);
		if(!PDname || PDname ==''){alert('Please enter valid Physical Device name'); return false;}
		//var post_url=__env.apiUrl+"/physicaldevices/add";
		//$http.post(post_url,{"name":PDname,"PDtype":"stype2","PDstatus":"sstatus2","discoverystatus":"sdstatus2","criticality":"criticality2","migrationapproach":"mga2"}).success(function(data){
			/*Start::Defect21453*/
			var compName = PDname;
			var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
			$http.post(post_url,{"devicetype":"physicaldevices","devicename":compName})
				.success(function (response){
					alert('Physical Device '+compName+' successfully added and associated with '+$scope.deviceName);
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/physicaldevices";
					console.log('urlcall==>>>' + urlCall);
					$http.get(urlCall)
						.then(function (response) {
							$scope.PDdata =response['data']['physicaldevices'];
							$scope.$parent.PDdata =response['data']['physicaldevices'];
							if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.PDcount = $scope.$parent.PDdata.length;
							$scope.logicalDeviceData.PDcount = $scope.$parent.PDdata.length;
							$scope.newPDName ="";
							$scope.searchPDName = "";
							$scope.table_loader=false;
						});
					//getLogialDeviceRelatedData($scope,$http,__env);
				}).catch(function (response) {
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					if($scope.statusCode ==409){
						alert('Physical Device '+ compName + ' already associated with '+$scope.deviceName);
						$scope.table_loader=false;
						$scope.spinPD = false;
						$scope.PDSearchResult = [];
						$scope.$parent.PDSearchResult = [];
						return false;
					}
					else{
						alert('Error occurred, Please try again!'+ response.status);
						$scope.table_loader=false;
						$scope.spinPD = false;
					}

					console.log("Inside error case");

				});
			/*End::Defect21453*/

		/*}).catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText);
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
			if($scope.statusCode ==409){
				alert('Physical Device '+compName + ' already exists ');
				$scope.table_loader=false;
				$scope.spinPD = false;
				$scope.PDSearchResult = [];
				$scope.$parent.PDSearchResult = [];
				return false;
			}
			else{
				alert("Name Already exist!! Please Select different Name to avoid Conflict!!");
				$scope.table_loader=false;
				$scope.spinPD = false;
			}

		});*/


	}

	$scope.associatePDToLD = function(compName){
		$scope.table_loader = true;
		$scope.spinPD = true;
		var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"physicaldevices","devicename":compName})
			.success(function (response){
				alert('Successfully associated physical device '+ compName + ' with '+$scope.deviceName);
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/physicaldevices";
				$http.get(urlCall)
					.then(function (response) {
						$scope.$parent.PDdata =response['data']['physicaldevices'];
						$scope.PDdata =response['data']['physicaldevices'];
						$scope.table_loader = false;
						$scope.spinPD = false;
						if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.PDcount = $scope.$parent.PDdata.length;
						$scope.logicalDeviceData.PDcount = $scope.$parent.PDdata.length;
					});
				//getLogialDeviceRelatedData($scope,$http,__env);
			}).catch(function (response) {
				alert('Physical Device  '+ compName + ' already associated with '+$scope.deviceName);
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				$scope.table_loader = false;
				$scope.spinPD = false;
			});
	}


	$scope.checkforEmpty = function(){
		$scope.showadd = false;
		$scope.showRightTable = false;
		console.log('$scope.searchPDName===' + $scope.searchPDName);
		if($scope.searchPDName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		if($scope.searchPDName === '*'){
			//alert('value===empty');
			//$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			//$scope.showadd = false;
		}
	}



	//$scope.compSearchResult = [{"name":"AAA Investment Management Triple A","componenttype":"Application"},{"name":"AAR Loro Billing","componenttype":"Application"},{"name":"AARMS","componenttype":"Application"},{"name":"ABC Reporting","componenttype":"Application"},{"name":"Abnamromarkets","componenttype":"Application"}];
	$scope.searchPDForLD = function(){
		$scope.PDSearchResult = [];
		$scope.table_loader = true;
		$scope.spinPD = true;
		$scope.showRightTable = true;
		if($scope.searchPDName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		var post_url=__env.apiUrl+"/devices/search";
		console.log('$scope.searchPDName==' + $scope.searchPDName);
		$http.post(post_url,{"devicetype":"physicaldevices","search":[{"fieldname":"name","fieldvalue":$scope.searchPDName}]})
			.then(function (response){
				$scope.PDSearchResult =response['data'];
				$scope.$parent.PDSearchResult =response['data'];
				console.log('$scope.PDSearchResult==' +JSON.stringify($scope.PDSearchResult));
				$scope.table_loader = false;
				$scope.spinPD = false;
				if($scope.PDSearchResult.length === 0){
					if($scope.searchPDName === '*'){
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
				$scope.table_loader = false;
				$scope.spinPD = false;
			});

		if($scope.searchPDName === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			console.log('$scope.PDSearchResult==' +JSON.stringify($scope.PDSearchResult));
			$scope.showadd = false;
		}
	}
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

	/*End::PD related actions */
} //end controller



]);
