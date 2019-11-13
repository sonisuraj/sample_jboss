app.controller('importJobListController', ['$scope','$http','$routeParams','$rootScope','$location',function($scope, $http,$routeParams,$rootScope,$location) {
$scope.pageHeading = 'Job List';
$scope.importID = $routeParams.importID;
$scope.importTitle = 'Import Job List';
$scope.pageUrl = $location.url();
$scope.table_loader=true;
	$scope.navigateImportDetail = function(id,detail,source){
		//var temp_arr =detail.toLowerCase().split(' ');
		//var deviceName_temp = temp_arr[0]+temp_arr[1]+'s';
		$location.url('/importDetails'+'/'+detail+'/'+id+'/'+source);
		//$location.url('/importDetails'+'/logicaldevices'+'/'+id+'/'+source);

	}
	$scope.headingArray =  [ "Logical Devices", "Services",
		"Components", "Physical Devices","Logical Network",
		"Clusters",   "File Systems",  "Device Interfaces", "Interface Groups",  "Stakeholders", "Documents", "Events","Notes",
		"Component to Component","importDetails"];

    	if ($routeParams.devicetype ) {
	    $scope.devicetype = $routeParams.devicetype;

			}
			else if ($scope.pageUrl=='/importJobList') {

			$scope.devicetype = "import";
			}
			else {
				$scope.devicetype = "LogicalDevices";

	}



    if ( !$routeParams.index ) {
	    $scope.headingIndex = 0;
	} else {
	    $scope.headingIndex = $routeParams.index;
	}
		console.log("Route Parameters device type got is:"+$scope.devicetype+":"+$scope.headingIndex);


	$scope.heading = $scope.headingArray[$scope.headingIndex];
	$scope.devicetype = 	$scope.devicetype.toLowerCase();
  //  $http.get(__env.apiUrl+'/'+$scope.devicetype+'/getjoblist').then(function (response) {
	$http.get(__env.apiUrl+'/importall/getjoblist').then(function (response) {

		window.console.log("success!");
		//alert("success!");
		if($scope.devicetype =='import')
		{
			$scope.responsedevice = 'importList';
		}
				else{$scope.responsedevice = $scope.devicetype;}
		 // $scope.restData = response.data[$scope.responsedevice].reverse();
		  $scope.restData = response.data.reverse();
			$scope.keys =  Object.keys($scope.restData[0]);
			$scope.tempkeys = [];
			for (var p in $scope.restData[0]) {
			if( $scope.restData[0].hasOwnProperty(p) ) {
			  if ( p != "index" && p != "id" && p != "commit" && p != "commited" && p != "PKID" &&  p != "DeviceType") {
				 $scope.tempkeys.push(p);
			   } else {
					console.log("not pushing :"+p);
			   }
			}
		  }
		  $scope.columnName = [];
		  if ( $scope.devicetype == "logicaldevices" ) {
				$scope.columnName =
		[
		  {"name":"Job Details"},
		  {"name":"Backup Method"},
		  {"name":"Backup Offsite Location"},
		  {"name":"Backup Schedule"},
		  {"name":"Description"},
		  {"name":"Device Type"},
		  {"name":"Discovery Status"},
		  {"name":"DR Physical Device Name"},
		  {"name":"Entity Name"},
		  {"name":"Summary"},
		  {"name":"Field Name"},
		  {"name":"Import Value"},
		  {"name":"Blue Bench Value"},
		  {"name":"Import Trust Level"},
		  {"name":"Blue Bench Trust Level"},
		  {"name":"Audit By"},
		/*  {"name":"Commit"},
		  {"name":"Committed"}*/
		];

			}
			else if ( $scope.devicetype == "import") {
		$scope.columnName =
		[
		{"name":"name"},
		{"name":"Modified By"},
		{"name":"User Name"},
		{"name":"Job Type"},
		{"name":"Completed Date"},
		{"name":"Submitted Date"},
		{"name":"Time Taken"},
		{"name":"Source"},
		{"name":"Job Status"}
		/*{"name":"Commit"},
		{"name":"Commited"},*/
		];

		}
		 else {
			var indexcount = 0;
			for ( p in $scope.tempkeys ) {
				$scope.columnName.push ({'name' : $scope.tempkeys[indexcount++] }) ;
			}
		}
		$scope.currentRowIndex = 0;
		$scope.table_loader=false;
        //console.log("data "+JSON.stringify(response.data.logicaldevices));
		if ( $scope.restData && $scope.restData.length > 0 ) {
            console.log( $scope.restData[0].name);
		}

        //console.log('$scope.restData.length===' + $scope.restData);
        var arrayLength = $scope.restData ? $scope.restData.length : 0 ;
        console.log('arrayLength===' + arrayLength);
        $scope.currentPage = 1; //current page
        $scope.maxSize = __env.recordsPP; //pagination max size
        $scope.entryLimit = __env.recordsPP; //max rows for data table
        $scope.itemsPerPage = __env.recordsPP;
        /* init pagination with $scope.list */
        $scope.noOfPages = Math.ceil(arrayLength/$scope.entryLimit);
				console.log("Noof pages got is:"+$scope.noOfPages);
        $scope.setPage = function(pageNo) {
		    console.log("Inside setPage page no got is:"+pageNo);
            $scope.currentPage = pageNo;
        };
		$rootScope.openimporAction = function(){
			console.log('inside open import action');
			$rootScope.showexptab = false;
			$rootScope.showimporttab = false;
			$rootScope.showcustatt = false;
			$rootScope.showimportaction = true;
		};
    }).catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText );
		    $scope.table_loader=false;
			console.log("Error received while retreiving import data:"+response.statusText +":"+"Request failed"+":"+response.status);
		});


}]);
