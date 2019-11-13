app.controller('StakeHolderDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')	{
		$scope.roleBasedCanBeAssociated=false;
	} else {
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
	$scope.StakeHolderNames = [];
	$http.get(__env.apiUrl+'/devices/dropdown/stakeholderroles').then(function (response) {
		for ( var j = 0 ; j < response.data.length ; j++  ) {
			$scope.StakeHolderNames.push(response.data[j].value);
		}
	}).catch(function(response){
		$scope.StakeHolderNames = ["Developer","Lead","Role1" , "Role2" , "Role3"];
	});
	$scope.addNewStakeholder = function(stakeholder){
		$scope.stakeholderSpinner = true;
		$scope.table_loader = true;
		console.log('$scope.addStakeholder===' +JSON.stringify(stakeholder));
		console.log('inside add new stakeholder');
		var stakeholdername = angular.element('#stakeholdername').val();
		console.log('stakeholdername===' + stakeholdername);
		var stakeHolderData = {
			"name" : stakeholder,
		}

		console.log('stakeHolderData==='+JSON.stringify(stakeHolderData));
		var url = __env.apiUrl+"/devices/stakeholders/add"
		var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}


		$http.post(url, stakeHolderData, config)
			.success(function (data, status, headers, config) {
				console.log('stakeholder data===' + JSON.stringify(data));
				console.log('new stakeholder added successfully in db');
				$scope.stakeHolderTble.push(stakeholder);
				console.log('$scope.stakeHolderTble===' +JSON.stringify($scope.stakeHolderTble));
				//$location.path('/logicalDeviceListView')
				/*Start::Defect21453*/
				//var compName = $scope.stakeholder;
				var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
				$http.post(post_url,{"devicetype":"stakeholders","devicename":stakeholder,"role":"Developer"})
					.success(function (response){
						$scope.stakeholderSpinner = false;
						$scope.table_loader = false;
						alert('Stakeholder '+stakeholder+' successfully added and associated with '+$scope.deviceName);
						$scope.filterTextNew.name = '';
						$scope.addStakeholder = '';
						var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/stakeholders";
						$http.get(urlCall)
							.then(function (response) {
								$scope.data =response['data']['stakeholders'];
								$scope.$parent.data =response['data']['stakeholders'];
								if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.stakeholdercount = $scope.$parent.data.length;
								$scope.logicalDeviceData.stakeholdercount = $scope.data.length;
							});
						//getLogialDeviceRelatedData($scope,$http,__env);
					}).catch(function (response) {
						alert('Stakeholder '+ stakeholder + ' already associated with '+$scope.deviceName);
						console.log("Inside error case");
						$scope.statusCode = response.status;
						$scope.statusText = (response.statusText);
						console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

					});
				/*End::Defect21453*/
			})
			.error(function (data, status, headers, config) {
				$scope.stakeholderSpinner = false;
				$scope.table_loader = false;
				console.log('data===' + data);
				console.log('status===' + status);
				if ( status == 409 ) {
					alert("Duplicate Device Name exists<"+stakeholder+"> Please use unique name");
					$rootScope.searchResultJson = [];
				} else {
					alert("Error occurred while creating device<"+stakeholder+"><"+status);
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
			});

	} // end of function


	$scope.checkforEmpty = function(){
		$scope.showadd = false;
		$scope.showRightTable = false;
		console.log('$scope.filterTextNew.name===' + $scope.filterTextNew.name);
		if($scope.filterTextNew.name === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}

		if($scope.filterTextNew.name === '*'){
			//alert('value===empty');
			//$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			//$scope.showadd = false;
		}
	}

	$scope.searchStakeHolder = function(stakeholdername){
		$rootScope.searchResultJson = [];
	    if ( $scope.$parent ) $scope.$parent.searchResultJson = [];
		$scope.stakeholderSpinner = true;
		$scope.table_loader = true;
		$scope.showRightTable = true;
		console.log('inside search stakeholder');
		console.log('stakeholdername===' + stakeholdername);
		if(stakeholdername === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}
		var searchURL = __env.apiUrl+"/devices/search"

		var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}
		var searchStakeholderData = { "devicetype" : "stakeholders",
			"search":[{ "fieldname" : "name" , "fieldvalue" :stakeholdername}]
		}

		$http.post(searchURL, searchStakeholderData, config)
			.success(function (data, status, headers, config) {
				console.log('stakeholder search  data===' + JSON.stringify(data));
				$rootScope.searchResultJson = data;
				if ( $scope.$parent ) $scope.$parent.searchResultJson = data;
				console.log('$scope.searchResultJson===' + JSON.stringify($rootScope.searchResultJson));
				console.log('inside search api');
				console.log("Stakeholder<"+stakeholdername+"> searched successfully");
				if($rootScope.searchResultJson.length === 0){
					if(stakeholdername === '*'){
						//alert('value===empty');
						$scope.showadd = false;
					}
					else{
						$scope.showadd = true;
					}
				}
				else{
					$scope.showadd = false;
				}
				$scope.stakeholderSpinner = false;
				$scope.table_loader = false;
			})
			.error(function (data, status, headers, config) {
				console.log('data===' + data);
				console.log('status===' + status);
				if ( status == 409 ) {
					alert("Stakeholder <"+stakeholder+"> already exists Please use unique name");
					$rootScope.searchResultJson = [];
				    $scope.$parent.searchResultJson = [];
				} else {
					alert("Error occurred while searching stakeholder<"+stakeholder+"><"+status+">");
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
				$scope.stakeholderSpinner = false;
				$scope.table_loader = false;
			});
		if(stakeholdername === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			console.log('$scope.serviceSearchResult==' +JSON.stringify($rootScope.searchResultJson));
			//$scope.showadd = false;
		}

	}
	/*$scope.stake = {
		value: ''
	};*/
	$scope.stakeChange = function(stakeName){
		//alert('ng change triggered');
		console.log(stakeName);
		//$scope.filterTextNew.name = stakeName;
		$scope.filterTextNew.name = stakeName;
		//angular.element('#stakeholdernameVal').val(stakeName);
	}
	$scope.associateStakeholder = function(selectedName,stakeholdername){
		$scope.stakeholderSpinner = true;
		$scope.table_loader = true;
		console.log('selected role===' + JSON.stringify(selectedName));
		console.log('stakeholdername===' + JSON.stringify(stakeholdername));
		console.log('$scope.deviceName====' + JSON.stringify($scope.deviceName));
		/*var associateurl = "https://localhost:10041/SCOPEToolsIntegrationServices/api/logicaldevices/associate/REMLVMETDB2011"*/
		var associateurl = __env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName+""
		console.log('associateurl===' + JSON.stringify(associateurl));

		var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}

		var associateJson = {
			"devicetype":"stakeholders",
			"devicename":( stakeholdername ? stakeholdername  : $scope.filterTextNew.name ),
			"role":selectedName
		}
		console.log('associateJson===' + JSON.stringify(associateJson));

		$http.post(associateurl, associateJson, config)
			.success(function (data, status, headers, config) {
				$rootScope.relatedCountShowMark =true;
				console.log('associate stakeholder response===' + JSON.stringify(data));
				console.log('new stakeholder associated successfully');
				alert("Stakeholder<"+( stakeholdername ? stakeholdername  : $scope.filterTextNew.name )+"> associated successfully");
				$scope.filterTextNew.name = '';
				$('.collapse').collapse('hide');
				$scope.showRightTable = false;
				$scope.stakeholderSpinner = false;
				$scope.selectedName = '';
				$scope.table_loader = false;
				getLogialDeviceRelatedData($scope,$http,__env);
				if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.stakeholdercount = $scope.$parent.stakeholdercount.length;
				$scope.logicalDeviceData.stakeholdercount = $scope.$parent.stakeholdercount.length;
			})
			.error(function (data, status, headers, config) {
				console.log('data===' + data);
				console.log('status===' + status);
				if ( status == 409 ) {
					alert("Associate failed with <"+$scope.deviceName+"> association already exists with stakeholder:"+stakeholdername);
					$rootScope.searchResultJson =[];
				} else {
					alert("Error occurred while associating device<"+$scope.deviceName+"><"+status+">");
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
				$scope.stakeholderSpinner = false;
				$scope.table_loader = false;
			});
	}

	$scope.otdtable2 =false;

	$scope.otdtable =function(){
		$('.change_col').removeClass('col-md-12').addClass('col-md-8');
		$("#otd-table-2").addClass('col-md-4');
		$scope.otdtable2 =true;
	}
	$scope.disassociateDevicesToDevices = function(servicename,role){

		$scope.table_loader=true;
		$scope.spinServices = true;
		console.log('servicename===' + servicename);
		var compName = servicename;
		var post_url=__env.apiUrl+"/devices/logicaldevices/disassociate/"+$scope.deviceName;
		console.log(post_url);
		console.log({"devicetype":"stakeholders","devicename":compName,"role":role});
		$http.post(post_url,{"devicetype":"stakeholders","devicename":compName,"role":role})
			.success(function (response){
				alert('Service '+compName+' successfully disassociated with '+$scope.deviceName);
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/stakeholders";
				console.log('urlcall==>>>' + urlCall);
				$http.get(urlCall)
					.then(function (response) {
						console.log('response===' +JSON.stringify(response['data']['stakeholders']));
						$scope.data =response['data']['stakeholders'];
						$scope.$parent.data =response['data']['stakeholders'];
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
	$scope.showInfo = function(info){
		//alert('show info');
		console.log('info===' + JSON.stringify(info));
		/*Object.keys(info).forEach(function(key,index) {
			//console.log('key===' + key);
			//console.log('index==' + index);
			if(key==='index'){
				delete info[key];
			}

		});*/
		$scope.deviceInfo = info;

	}

   } //end controller

]);
