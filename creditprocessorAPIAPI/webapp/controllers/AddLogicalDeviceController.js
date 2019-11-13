app.controller('addlogicalDevicesController',['$scope','$http','$location','$rootScope','$uibModal',function($scope, $http,$location,$rootScope,$uibModal) {
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$location.url("/");
	}

	$scope.addDeviceName=  "remlvmetdb20112";
	$scope.addDeviceType=  "Server";
	$scope.addEnv= "Decommed";
	$scope.addOs= "HP";
	$scope.addOsVersion= "UX B.11.11";
	$scope.addOsPatchLevel= "";
	$scope.addMemory= "20";
	$scope.addDrReq= "";
	$scope.addDrProcess= "";
	$scope.addLogicalDeviceHost= "metadb2clu81";
	$scope.addMigrationApproach= "";
	$scope.addWidowsDomain= "";
	$scope.addDRPhysicalServerName= "";
	$scope.addBackUpMethod= "Test Backup1";
	$scope.addBackUpSchedule= "1:00 PM";
	$scope.addBackUpOffSiteLoc= "";
	$scope.addMonitoringSystem= "";
	$scope.addStatus= "";
	$scope.addInScope= "Yes";
	$scope.addLogicalCpu= "5";
	$scope.disableSave=false;

	$scope.navtoLanding = function(){
		$location.path('/');
	}

	$rootScope.openexportstab = function(){
		console.log('inside open exports');
		$rootScope.showexptab = true;
		$rootScope.showcustatt = false;
	};
	$rootScope.opencustatt = function(){
		console.log('inside cust att');
		$rootScope.showexptab = false;
		$rootScope.showcustatt = true;

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
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/os').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDeviceOS = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/deviceType').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicedeviceType = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/environment').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDeviceenvironment = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/drRequired').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicedrRequired = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/migrationApp').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicemigrationApp = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/windowsDomain').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicewindowsDomain = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/backupMethod').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicebackupMethod = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/status').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicestatus = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/inscope').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDeviceinscope = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/ldhost').then(function (response) {
		//window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDeviceldhost = response.data.dropdown;
		//window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	$http.get(__env.apiUrl+'/logicaldevices/dropdown/backupoffsitelocation').then(function (response) {
		window.console.log("success addlogicalDevicesController!");
		//alert("success!");
		$scope.RDAddLogicalDevicebackupoffsitelocation = response.data.dropdown;
		window.console.log("success addlogicalDevicesController!"+response.data.dropdown);
	});
	/*$scope.showErrorAlert = false;*/
	/*angular.element(document.getElementById('submit'))[0].disabled = false;*/
	$scope.clear = function() {

		$scope.addDeviceName = "";
		$scope.addLogicalDeviceHost = "";
		$scope.addDeviceType = "";
		$scope.addEnv = "";
		$scope.addOs = "";
		$scope.addOsVersion= "";
		$scope.addMemory = "";
		$scope.addOsPatchLevel= "";
		$scope.addDrReq = "";
		$scope.addDrProcess= "";
		$scope.addMigrationApproach= "";
		$scope.addWidowsDomain= "";
		$scope.addDRPhysicalServerName= "";
		$scope.addBackUpMethod= "";
		$scope.addBackUpSchedule= "";
		$scope.addBackUpOffSiteLoc= "";
		$scope.addMonitoringSystem= "";
		$scope.addStatus= "";
		$scope.addInScope= "";
		$scope.addLogicalCpu= "";

	}

	$scope.submitFormData = function(){
		console.log('inside submit form data');
		if ( !$scope.addDeviceName || $scope.addDeviceName == "" ) {
			alert("Device name is mandatory. Please give name");
			document.getElementById("deviceName").focus();
			return false;
		}
		if( !$scope.addDeviceName  || $scope.addDeviceName =='' )
		{
			alert("Please enter required attribute values <"+$scope.addDeviceName+">");
			document.getElementById("deviceName").focus();
			return false;
		}

		if ( $scope.addMemory && !Number($scope.addMemory)  ) {
			alert("memory should be an integer. Please give integer as input for memory");
			document.getElementById("addMemory").focus();
			return false;
		}
		$scope.disableSave =true;
		var url = __env.apiUrl+'/logicaldevices/add';
		var formData = {

			"name": $scope.addDeviceName,
			"devicetype": $scope.addDeviceType,
			"environment": $scope.addEnv,
			"os": $scope.addOs,
			"osversion": $scope.addOsVersion,
			"ospatchlevel": $scope.addOsPatchLevel,
			"memory": $scope.addMemory,
			"drrequired": $scope.addDrReq,
			"drprocess": $scope.addDrProcess,
			"logicaldevicehost": $scope.addLogicalDeviceHost,
			"migrationapproach": $scope.addMigrationApproach,
			"windowsdomain": $scope.addWidowsDomain,
			"drphysicalserver": $scope.addDRPhysicalServerName,
			"backupmethod": $scope.addBackUpMethod,
			"backupschedule": $scope.addBackUpSchedule,
			"backupoffsitelocation": $scope.addBackUpOffSiteLoc,
			"monitoringsystem": $scope.addMonitoringSystem,
			"status": $scope.addStatus,
			"inscope": $scope.addInScope,
			"logicalcpu": $scope.addLogicalCpu

		};
		console.log('formData====' +JSON.stringify(formData));
		var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}
		$http.post(url, formData, config)
			.success(function (data, status, headers, config) {
				$scope.disableSave =true;
				console.log('success data===' + JSON.stringify(data));
				console.log('added logical device successfully');
				alert("Logical Device < "+ $scope.addDeviceName +" > is created successfully.");
				$location.url('/logicalDevices/LIST/'+($scope.logicalDeviceCount+1)+'/'+$scope.addDeviceName);
			})
			.error(function (data, status, headers, config) {
				console.log('data===' + data);
				console.log('status===' + status);
				if ( status == 409 ) {
					alert("Duplicate Device Name exists<"+$scope.addDeviceName+"> Please use unique name");
					$scope.disableSave=false;
					/*$scope.showErrorAlert = true;*/
					/*angular.element(document.getElementById('submit'))[0].disabled = true;*/
				} else {
					alert("Error occurred while creating device<"+$scope.addDeviceName+"><"+status);
					$scope.disableSave=false;
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
			});
	}
}]);
