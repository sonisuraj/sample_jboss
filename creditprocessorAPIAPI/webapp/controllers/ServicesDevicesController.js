app.controller('ServicesDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.roleBasedCanBeAssociated=false;
	}
	else {
		$scope.roleBasedCanBeAssociated=true;
	}
	$scope.showRightTable = false;
	$scope.showadd = false;
	$scope.showaddcomp = false;
	$scope.selectdevice = 'services';
	/*Start::Services related actions */
	$scope.addServices =function(){ // this function is not used anywhere
		var post_url ='';
		var name = $scope.name;
		var servicetype =$scope.servicetype;
		var servicestatus =$scope.servicestatus;
		var discoverystatus =$scope.discoverystatus;
		var criticality =$scope.criticality;
		var migrationapproach =$scope.migrationapproach;
		$http.post(post_url,{"name":name,"servicetype":servicetype,"servicestatus":servicestatus,"discoverystatus":discoverystatus,"criticality":criticality,"migrationapproach":migrationapproach}).success(function(data){

		});
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

	$scope.addServiceToLD = function(servicename){
		$scope.table_loader=true;
		$scope.spinServices = true;
		console.log('servicename===' + servicename);
		console.log('$scope.newServiceName===' + $scope.newServiceName);
		if(!servicename || servicename ==''){alert('Please enter valid service name'); return false;}
		var compName = servicename;
		var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"services","devicename":compName,"componentname":"0"})
			.success(function (response){
				alert('Service '+compName+' successfully added and associated with '+$scope.deviceName);
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/services";
				console.log('urlcall==>>>' + urlCall);
				$http.get(urlCall)
					.then(function (response) {
						console.log('response===' +JSON.stringify(response['data']['services']));
						$scope.servicedata =response['data']['services'];
						$scope.$parent.servicedata =response['data']['services'];
						if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
						$scope.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
						$scope.newServiceName ="";
						$scope.searchServiceName = "";
						$scope.table_loader = false;
					});
				//getLogialDeviceRelatedData($scope,$http,__env);
			})
			.catch(function (response) {
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				if($scope.statusCode ==409){
					alert('Service '+ compName + ' already associated with '+$scope.deviceName);
					$scope.table_loader=false;
					$scope.spinServices = false;
					$scope.serviceSearchResult = [];
					$scope.$parent.serviceSearchResult = [];
					return false;
				}
				else{
					alert('Error occurred, Please try again!'+ response.status);
					$scope.table_loader=false;
					$scope.spinServices = false;
				}

				console.log("Inside error case");

			});


	}
	$scope.disassociateDevicesToDevices = function(servicename){
		$scope.table_loader=true;
		$scope.spinServices = true;
		console.log('servicename===' + servicename);
		var compName = servicename;
		var post_url=__env.apiUrl+"/devices/logicaldevices/disassociate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"services","devicename":compName})
			.success(function (response){
				alert('Service '+compName+' successfully disassociated with '+$scope.deviceName);
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/services";
				console.log('urlcall==>>>' + urlCall);
				$http.get(urlCall)
					.then(function (response) {
						console.log('response===' +JSON.stringify(response['data']['services']));
						$scope.servicedata =response['data']['services'];
						$scope.$parent.servicedata =response['data']['services'];
						if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
						$scope.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
						$scope.newServiceName ="";
						$scope.searchServiceName = "";
						$scope.table_loader = false;
					});
				//getLogialDeviceRelatedData($scope,$http,__env);
			})
			.catch(function (response) {
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					alert('Error occurred, Please try again!'+ response.status);
					$scope.table_loader=false;
					$scope.spinServices = false;
				console.log("Inside error case");

			});


	}
	$scope.associateServiceToLD = function(compName){
		$scope.table_loader = false;
		$scope.spinServices = true;
		$scope.showRightTable = false;
		console.log($routeParams);
		console.log(compName);

		var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$routeParams.deviceName+"/services";
		$http.get(urlCall).then(function (response) {
			$scope.servicedata =response['data']['services'];
			for ( var i = 0 ; $scope.servicedata && i < $scope.servicedata.length ; i++) {
					if ( $scope.servicedata[i].name == compName) {
							alert("Service is already assoicated");
							console.log("ssssssssssssss");
							return;
					}

			}
		}).catch(function (response) {

		});
		//alert("Please select Component in order to proceed for association");
		$scope.selectdevice = 'component';
		$('.collapse').collapse('hide');
		$scope.searchServiceName = ''

		$rootScope.servname  =  compName;
		console.log('$rootScope.servname==>>>' +$rootScope.servname);
		/*var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
		console.log('post_url==>>>' + post_url);
		var t={"devicetype":"services","devicename":compName,"componentname":"0"}
		console.log('t==>>>' +JSON.stringify(t));
		$http.post(post_url,{"devicetype":"services","devicename":compName,"componentname":"0"})
			.success(function (response){
				alert('Successfully associated service '+ compName + ' with '+$scope.deviceName);
				var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/services";
				$http.get(urlCall)
					.then(function (response) {
						$scope.$parent.servicedata =response['data']['services'];
						$scope.servicedata =response['data']['services'];
						$scope.table_loader = false;
						$scope.spinServices = false;
						if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
						$scope.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
					});
				//getLogialDeviceRelatedData($scope,$http,__env);
			}).catch(function (response) {
				alert('Service  '+ compName + ' already associated with '+$scope.deviceName);
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				$scope.table_loader = false;
				$scope.spinServices = false;
			});*/
	}

	$scope.associateSelectedcompservToLD = function(componentname,associationagain){
		console.log(componentname);
		console.log($scope.deviceName);
		console.log($rootScope.servname);
		if($scope.InitialAssociation === 1 && associationagain != true){
			//alert('second time association starts');
			// call get url api  of this comp to LD
			/*get api call starts*/
			console.log(__env.apiUrl+'/devices/components/'+componentname+'/services');
			$http.get(__env.apiUrl+'/devices/components/'+componentname+'/services').then(function (response) {
				$scope.compList = response.data['services'];
				//console.log('comp list===>>>>' +JSON.stringify($scope.compList));
				console.log('comp list lenght===>>>>' +JSON.stringify($scope.compList.length));
				if($scope.compList.length == 0){
					//alert('length === 0');
					$scope.associateCompToLD(componentname);
					// associate this component to service
					// add associate call to add comp to LD   *********
					//$scope.addDevicesToLD(n,'Components','components','','stopNav');  ***********
					//return false;
					//throw "exit";
				}
				else {
					$http.get(__env.apiUrl+'/devices/logicaldevices/'+$scope.deviceName+'/services').then(function (response) {
						$scope.LDList = response.data['services'];
						console.log('LD list===>>>>' +JSON.stringify($scope.LDList));
						console.log('LD list lenght===>>>>' +JSON.stringify($scope.LDList.length));
						$scope.tempArray = [];
						for(var i=0;i<$scope.compList.length;i++){
							for(var j=0;j<$scope.LDList.length;j++){
								if($scope.compList[i].name == $scope.LDList[j].name){
									console.log('do nothing');
								}
								else{
									$scope.tempArray.push($scope.compList[i].name);
								}
							}
						}
						console.log(JSON.stringify($scope.tempArray));
						for(var p =0;p<$scope.tempArray.length;p++){
							$scope.doAssociationaagain = true;
							//$rootScope.setServName = n ;

							$rootScope.servname = $scope.tempArray[p];
							console.log($rootScope.servname);
							console.log(componentname);

							$scope.associateSelectedcompservToLD(componentname,$scope.doAssociationaagain);
						}

					}).catch(function(response){
						console.log('error occured');
					});

					// compare what all LD's this comp is associated to , remove duplicates and then one by one asspociate it to
				}
			}).catch(function(response){
				console.log('erorr occured');
			});
			/* get api call ends*/

		}
		else{
			//alert('inside comp length >0');
			var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
			console.log('post_url==>>>' + post_url);
			console.log('componentname==>>>' + componentname);
			var t={"devicetype":"services","devicename":$rootScope.servname,"componentname":componentname}
			console.log('t==>>>' +JSON.stringify(t));
			$http.post(post_url,{"devicetype":"services","devicename":$rootScope.servname,"componentname":componentname})
				.success(function (response){
					alert('Successfully  created Logical Device to Service mapping from " '+$scope.deviceName+'" to   "'+ $rootScope.servname + '" with component name "'+componentname+'"');
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/services";
					console.log('urlCall===>>>>' + urlCall);
					$http.get(urlCall)
						.then(function (response) {
							$rootScope.relatedCountShowMark =true;
							$scope.$parent.servicedata =response['data']['services'];
							$scope.servicedata =response['data']['services'];
							$scope.table_loader = false;
							$scope.spinServices = false;
							$scope.InitialAssociation = 1;
							//$scope.selectdevice = 'services';
							//$('.collapse').collapse('hide');
							//$scope.showRightTable = false;
							if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
							$scope.logicalDeviceData.servicecount = $scope.$parent.servicedata.length;
							/* cmt-1157 updating comp count also*/
							var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/components";
							$http.get(urlCall).then(function(response){
								$scope.$parent.compdata =response['data']['components'];
								$scope.compdata =response['data']['components'];
								if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.compcount = $scope.$parent.compdata.length;
								$scope.logicalDeviceData.compcount = $scope.$parent.compdata.length;
							});

							console.log('$scope.logicalDeviceData.servicecount===' + $scope.logicalDeviceData.servicecount);
							console.log('$scope.logicalDeviceData.compcount==' + $scope.logicalDeviceData.compcount);
							$scope.setLastPage($scope.currentPage);

						});
					//getLogialDeviceRelatedData($scope,$http,__env);
				})
				.catch(function (response) {
					alert('Service  '+ $rootScope.servname + ' already associated with '+$scope.deviceName);
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					//$scope.selectdevice = 'services';
					//$('.collapse').collapse('hide');
					$scope.showRightTable = false;
					$scope.table_loader = false;
					$scope.spinServices = false;
				});
		}

	}

	$scope.setPageInitial = function(pageNo) {
		//alert('inside set page');
		//$scope.table_loader=true;
		console.log("Inside setPage page no got is:"+pageNo);
		$scope.currentPage = pageNo;
		$scope.recordStart = (($scope.currentPage - 1) * $scope.recordsPP)+1;
		console.log('$scope.recordStart==' + $scope.recordStart);
		$scope.recordEnd = $scope.currentPage * $scope.recordsPP;
		console.log('$scope.recordEnd===' + $scope.recordEnd);
		console.log('$scope.sevicedCount===' + $scope.devicesCount);
		if($scope.recordEnd > $scope.devicesCount)
		{
			//alert('recordends > devices count');
			$scope.recordEnd = $scope.devicesCount;
		}
		//$scope.table_loader=false;
	};
	$scope.setLastPage = function(pageNo) {
		console.log("Inside setPage page no got is:"+pageNo);
		$scope.currentPage = pageNo;
		$scope.devicesCount=$scope.servicedata.length;
		$scope.recordStart = (($scope.currentPage - 1) * $scope.recordsPP)+1;
		console.log('$scope.recordStart==' + $scope.recordStart);
		$scope.recordEnd = $scope.currentPage * $scope.recordsPP;
		console.log('$scope.recordEnd===' + $scope.recordEnd);
		console.log('$scope.sevicedCount===' + $scope.devicesCount);
		if($scope.recordEnd > $scope.devicesCount)
		{
			//alert('recordends > devices count');
			$scope.recordEnd = $scope.devicesCount;
		}
		//$scope.table_loader=false;
	};


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
		$scope.showaddcomp = false;
		$scope.showRightTable = false;
		console.log('$scope.searchServiceName===' + $scope.searchServiceName);
		if($scope.searchServiceName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		if($scope.searchServiceName === '*'){
			//alert('value===empty');
			//$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			//$scope.showadd = false;
		}
	}



	//$scope.compSearchResult = [{"name":"AAA Investment Management Triple A","componenttype":"Application"},{"name":"AAR Loro Billing","componenttype":"Application"},{"name":"AARMS","componenttype":"Application"},{"name":"ABC Reporting","componenttype":"Application"},{"name":"Abnamromarkets","componenttype":"Application"}];
	$scope.searchServiceForLD = function(){
		$scope.serviceSearchResult = [];
		$scope.table_loader = true;
		$scope.spinServices = true;
		$scope.showRightTable = true;
		$scope.compadd = '1';
		if($scope.searchServiceName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		var post_url=__env.apiUrl+"/devices/search";
		console.log('$scope.searchServiceName==' + $scope.searchServiceName);
		$http.post(post_url,{"devicetype":"services","search":[{"fieldname":"name","fieldvalue":$scope.searchServiceName}]})
			.then(function (response){
				$scope.serviceSearchResult =response['data'];
				$scope.$parent.serviceSearchResult =response['data'];
				console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.serviceSearchResult));
				$scope.table_loader = false;
				$scope.spinServices = false;
				if($scope.serviceSearchResult.length === 0){
					if($scope.searchServiceName === '*'){
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
				$scope.spinServices = false;
			});

		if($scope.searchServiceName === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.serviceSearchResult));
			$scope.showadd = false;
		}
	}

	/* cmt 1157 starts*/

	$scope.searchCompAfterServiceForLD = function(){
		$scope.serviceSearchResult = [];
		$scope.table_loader = true;
		$scope.spinServices = true;
		$scope.showRightTable = true;
		$scope.compadd = '2';
		if($scope.searchServiceName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		var post_url=__env.apiUrl+"/devices/search";
		console.log('$scope.searchServiceName==' + $scope.searchServiceName);
		$http.post(post_url,{"devicetype":"components","search":[{"fieldname":"name","fieldvalue":$scope.searchServiceName}]})
			.then(function (response){
				$scope.serviceSearchResult =response['data'];
				$scope.$parent.serviceSearchResult =response['data'];
				console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.serviceSearchResult));
				$scope.table_loader = false;
				$scope.spinServices = false;
				if($scope.serviceSearchResult.length === 0){
					if($scope.searchServiceName === '*'){
						$scope.showaddcomp = false;
					}
					else{
						$scope.showaddcomp = true;
					}
				}
				else{
					$scope.showaddcomp = false;
				}
			}).catch(function (response) {
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				$scope.table_loader = false;
				$scope.spinServices = false;
			});

		if($scope.searchServiceName === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.serviceSearchResult));
			$scope.showaddcomp = false;
		}
	}
	/* cmt 1157 ends*/
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

	/*End::Services related actions */
} //end controller



]);
