
app.controller('addotherDevicesController',['$scope','$http','$location','$rootScope','$uibModal','$routeParams',function($scope, $http,$location,$rootScope,$uibModal,$routeParams) {
  if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
  {
    $location.url("/");
  }

$rootScope.putLogicalName= "";
$scope.deviceIdName=$routeParams.deviceID.toLowerCase();

var urlCall =__env.apiUrl+"/devices/displaynames";
$http.get(urlCall).then(function (response) {
    $scope.deviceDisplayNames =response['data'];
    $scope.deviceDisplayName=$scope.deviceDisplayNames[$routeParams.deviceID.toLowerCase()];
});

	$scope.navtoLanding = function(){
		$location.path('/');
	}
$scope.device_add = [];
//$scope.device_add.otherDevice.hostname ="";
$scope.table_loader=true;
$scope.vertical_show=true;
$scope.fileSystemsLogicalDevice=false;

var url = __env.apiUrl+'/devices/fields/'+'/'+$scope.deviceIdName;

$http.get(url).then(function (response) {
		$scope.devicedata = response.data.fields;
		for ( var indexc1 = 0 ; $scope.devicedata && indexc1 < $scope.devicedata.length ; indexc1++) {
			if ( $scope.devicedata[indexc1].fieldtype == "select" ) {
				$http.get(__env.apiUrl+'/devices/'+$scope.deviceIdName+'/dropdown/'+$scope.devicedata[indexc1].key).then(function (response) {
					$scope[response.data.name] = response.data.dropdown;
					$scope.table_loader = false;
				}).catch(function (response) {
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					$scope.table_loader = true;
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					//Dummy data in case of error

				});
			}
		}

  if($routeParams.deviceID =='FileSystems' || $routeParams.deviceID =='LogicalNetworks' || $routeParams.deviceID =='DeviceInterfaces'){
    $scope.fileSystemsLogicalDevice =true;
    $scope.noResults = false;
    setRecordsPP($scope,__env);
    var url =__env.apiUrl +"/devices/logicaldevices/getallcommon?offset=1&limit="+$scope.recordsPP;
    $http.get(url).then(function(response){
      console.log(response);
		  $scope.logicalDevices = response.data;
		  $scope.table_loader=false;
		  console.log("ddddddddddddd");

	}).catch(function (response) {
		console.log("Inside error case");
		$scope.statusCode = response.status;
		$scope.statusText = (response.statusText);
		$scope.table_loader = true;
        $scope.noResults = true;
		console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		//Dummy data in case of error

	});

  }
    $scope.devicedata = response.data.fields;
    $scope.changeClassMand =false;
    for ( var indexc = 0 ; $scope.devicedata && indexc < $scope.devicedata.length ; indexc++) {
      if ( $scope.devicedata[indexc].group == "relevant" ) {
        $scope.changeClassMand =true;
        break;
      }
    }
   $scope.devicedataAdd=[];
    for ( var i = 0 ; $scope.devicedata && i < $scope.devicedata.length ; i++) {
      if ( $scope.devicedata[i].returntype != "showtouser") {
          if($scope.devicedata[i].returntype.split(":")[2] ==1){
            $scope.devicedataAdd.push($scope.devicedata[i]);
          }

      }else{
          $scope.devicedataAdd.push($scope.devicedata[i]);
      }

    }
    console.log($scope.devicedataAdd);

}).catch(function (response) {
		console.log("Inside error case");
		$scope.statusCode = response.status;
		$scope.statusText = (response.statusText);
		$scope.table_loader = false;
		console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		//Dummy data in case of error


});

$scope.getDropDowns = function(val) {
			console.log("Getting  dropdown for :"+val);
			var retvalue = $scope[val];
			console.log("Returning values:"+retvalue);
		 	return retvalue;
}

$scope.focusOut = function(t){
  if(t==undefined){
    $("#hideText").removeClass('displayNone');
  }
  console.log(t.length);
  if(t.length>0){
  $("#hideText").addClass('displayNone');
  }
}
$scope.cancel=function(){
  $scope.device_add.text="";
}
var deviceName= $scope.deviceIdName.toLowerCase();
var url = __env.apiUrl+'/devices/'+deviceName+'/add';

var formData =""

var config = {
  headers : {
    'Content-Type': 'application/json',
  }
}

$scope.AddOtherDevices =function(){
  console.log($routeParams.deviceIdName);
  console.log($rootScope.putLogicalName);
  if($scope.deviceIdName =='filesystems' || $scope.deviceIdName =='logicalnetworks' || $scope.deviceIdName =='deviceinterfaces'){
    console.log($rootScope.FileSystemsLogicalDeviceName);
    $("#logicalDeviceName").val($rootScope.FileSystemsLogicalDeviceName);
    if($rootScope.FileSystemsLogicalDeviceName == undefined || $rootScope.FileSystemsLogicalDeviceName.length ==0){
      alert("Please Associate Logical Device By Clicking on checkbox and select respective Logical Device");
      return;
    }
    $scope.device_add.otherDevice.hostname =$rootScope.FileSystemsLogicalDeviceName;
  }
  if($scope.deviceIdName =='logicalnetworks'){
    var ipv6 = $scope.device_add.otherDevice.name;
     checkIPAddress(ipv6);

  }
  if($scope.deviceIdName =='events'){
    if($scope.device_add.otherDevice.hourto == $scope.device_add.otherDevice.hourfrom){
      if($scope.device_add.otherDevice.minto < $scope.device_add.otherDevice.minfrom){
          $('.hourstofrom').focus();
        alert("Time from <<"+ $scope.device_add.otherDevice.hourfrom +":"+$scope.device_add.otherDevice.minfrom +" >>should be lesser than Time to <<"+ $scope.device_add.otherDevice.hourto +":"+$scope.device_add.otherDevice.minto+">>");
        return;
      }
    }
    if($scope.device_add.otherDevice.hourto < $scope.device_add.otherDevice.hourfrom){
      $('.hourstofrom').focus();
      alert("Time from <<"+ $scope.device_add.otherDevice.hourfrom +":"+$scope.device_add.otherDevice.minfrom +" >>should be lesser than Time to <<"+ $scope.device_add.otherDevice.hourto +":"+$scope.device_add.otherDevice.minto+">>");
      return;
    }
  }

	if( !$scope.device_add.otherDevice.name  || $scope.device_add.otherDevice.name =='' )
	{
		alert("Please enter required attribute values <"+$scope.device_add.otherDevice.name+">");
		return false;
	}

  document.getElementById("submit").disabled = true;
  var formData = $scope.device_add.otherDevice;
  console.log(formData);
  $http.post(url, formData, config)
    .success(function (data, status, headers, config) {
      console.log(data);
        var nameid =$scope.device_add.otherDevice.name;
        $rootScope.FileSystemsLogicalDeviceName=undefined;
        alert($scope.deviceDisplayName+" <"+$scope.device_add.otherDevice.name +"> Added Successfully!!");
        if($scope.deviceIdName==='filesystems' || $scope.deviceIdName==='events' || $scope.deviceIdName === 'logicalnetworks' || $scope.deviceIdName === 'deviceinterfaces' || $scope.deviceIdName === 'documents' || $scope.deviceIdName === 'interfacegroups'){
          var nameid =data.id;
        }
        console.log('/otherDevices/LIST/NULL/'+nameid+'/'+$scope.deviceIdName);
        $location.url('/otherDevices/LIST/NULL/'+nameid+'/'+$scope.deviceIdName);

//      $location.url('/otherDevices/'+$scope.deviceIdName);

      $scope.device_add.otherDevice="";
    })
    .catch(function (response) {

      console.log(response);
      document.getElementById("submit").disabled = false;
      alert("Error occurred <"+( response.data ? response.data.errorMessage : response.data)+">");
    });
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
	$rootScope.exportLDCsv = function(devicetype){
		//alert('inside export LD function' + devicetype);
		console.log('devicetype===' + devicetype);
		$http.get(__env.apiUrl+'/'+devicetype+'/getall').then(function (response) {
			console.log('success!!!')
			console.log('response.data===' +JSON.stringify(response.data));
			console.log('response.data[devicetype]===' + JSON.stringify(response.data[devicetype]));
			$scope.items = response.data[devicetype];
			console.log('$scope.items===' +JSON.stringify($scope.items));
			var filename = devicetype + '.csv'
			alasql('SELECT * INTO CSV("'+ filename+'", {headers:true,separator:","}) FROM ?',[$scope.items]);
		})
	}
	$rootScope.exportLDXls = function(devicetype){
		//alert('inside export LD function' + devicetype);
		console.log('devicetype===' + devicetype);
		$http.get(__env.apiUrl+'/'+devicetype+'/getall').then(function (response) {
			console.log('success!!!')
			console.log('response.data===' +JSON.stringify(response.data));
			console.log('response.data[devicetype]===' + JSON.stringify(response.data[devicetype]));
			$scope.items = response.data[devicetype];
			console.log('$scope.items===' +JSON.stringify($scope.items));
			var filename = devicetype + '.xlsx'
			alasql('SELECT * INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items]);
		})
	}



}]);
