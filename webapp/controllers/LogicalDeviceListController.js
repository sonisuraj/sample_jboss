app.controller('logicalDeviceListViewController', ['$window','$scope','$http','$routeParams','$rootScope','$uibModal','$location','orderByFilter',function($window,$scope, $http,$routeParams,$rootScope,$uibModal,$location,orderBy) {
console.log($routeParams);
	$scope.keyPressed = function (keyEvent) {
		if (keyEvent.keyCode == 13 && keyEvent.target ) {
		    if ( keyEvent.target.value.length > 0  ) {
                //angular.element('#updateResult').click();
				$scope.submitSearch($scope.pageNo);
			} else {
			    $window.alert("Please give input for <"+ keyEvent.target.name+"> to search");
			}
		}
	};
    var base_post_url=__env.apiUrl+"/devices/search?listview=true";
	if( $scope.globals && $scope.globals.currentUser && $scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.canbeDeleted=false;
	}
	else {
		$scope.canbeDeleted=true;
	}

	$scope.table_loader=true;

	$scope.setsortType = function(sorttype,rev)
	{
		if($scope.multisortAct)
		{
			$scope.sortType     = ''; // set the default sort type
			$scope.sortReverse  = '';  // set the default sort order
		}

		if(sorttype)
			{
				$scope.correctDataType(sorttype);
				$scope.sortType     = sorttype; // set the default sort type
			  $scope.sortReverse  = rev;  // set the default sort order
			}
			else if(!$scope.multisortAct){
				$scope.sortType     = 'name'; // set the default sort type
				$scope.sortReverse  = false;  // set the default sort order
				$scope.searchDevice   = '';     // set the default search/filter term

			}

	}
$scope.correctDataType =function(sorttype)
{
	if($scope.FieldData.find(function (o){ if ( o.key === sorttype) return o.key;}).datatype =='number')
	{
	angular.forEach($scope.restData, function (data) {
		if(data[sorttype] == '')
		{
		//data[sorttype] = 0;
		data[sorttype] = 0;
	}else{data[sorttype] = parseFloat(data[sorttype]);}
	});
 }
}
	$scope.deletionDevices =function(name,id,heading){
		console.log(heading);


		heading = heading.toLowerCase();
		heading= heading.replace(/\s/g, '');
		if(heading =='componenttocomponent'){
			heading='componenttocomponents';
		}
		if(heading =='datasource'){
			heading='datasources';
		}
		var url = __env.apiUrl+"/devices/delete/"+heading+"/"+id;
		console.log(url);
		$http({
			method: 'DELETE',
			url: url,

		}).success(function (response) {
			console.log(response);
			if(response ==true){
				$("#name"+id).remove();
				alert("Devices Deleted Successfully");

			}else{
				alert("Internal Error");
			}
			//http://9.109.123.149:9081/scopeplus/#/logicalDeviceListView/Services/1
		//	http://9.17.237.36:9082/scopeplus/#/logicalDeviceListView/logicaldevices/0/markfordeletion
			//http://9.109.123.149:9081/scopeplus/#/logicalDeviceListView/logicaldevices/0/markfordeletion
			if($routeParams.markfordeletion){
				$window.location.reload();
				//$route.reload()
			}else{

				  $location.url("/logicalDeviceListView/"+$scope.devicetype+"/"+$scope.headingIndex+"/");
			}

		}).catch(function(response){
			alert(response.data.errorMsg);
		});

	}
    setRecordsPP($scope,__env);
	$scope.recordStart = 1;
	$scope.currentPage = 1;
	$scope.recordEnd = $scope.recordsPP;
	if ( !$routeParams.devicetype ) {
		$scope.devicetype = "LogicalDevices";
	} else {
		$scope.devicetype = $routeParams.devicetype;
	}
	if ( !$routeParams.index ) {
		$scope.headingIndex = 0;
	} else {
		$scope.headingIndex = $routeParams.index;
	}
	$scope.deletion =true;
    $scope.markfordelete = "sconstate";
	$scope.setforreview = "setreview";
	$scope.markfordeleteFldVal = 'NON-CANDIDATE';
	$scope.setforreviewFldVal = "YES";
	$scope.mainJsonCollector = [];
	if ( $routeParams.markfordeletion &&  $routeParams.markfordeletion =='markfordeletion' ) {
		$scope.getmarkfordeletion = $routeParams.markfordeletion;
		$scope.deletion =true;
	    $scope.mainJsonCollector.push({ "fieldname" : $scope.markfordelete, "fieldvalue" : $scope.markfordeleteFldVal , "devicetype" :$scope.devicetype.toLowerCase()});
	}
	if ( $routeParams.markfordeletion &&  $routeParams.markfordeletion =='markforreview' ) {
		$scope.getmarkforreview = $routeParams.markfordeletion;
		$scope.deletion =false;
	    $scope.mainJsonCollector.push({ "fieldname" : $scope.setforreview, "fieldvalue" : $scope.setforreviewFldVal , "devicetype" :$scope.devicetype.toLowerCase()});
	}
	console.log("Route Parameters device type got is:"+$scope.devicetype+":"+$scope.headingIndex+":"+$scope.markfordeletion);
	/* api to display names starts*/
	var urlCall =__env.apiUrl+"/devices/displaynames";
	$http.get(urlCall).then(function (response) {
		$scope.headingArray =response['data'];
		//console.log('$scope.headingArray===' +JSON.stringify($scope.headingArray.logicaldevices));
		$scope.devTypeFinal = $scope.devicetype.toLowerCase();
		//console.log('$scope.devTypeFinal===' +$scope.devTypeFinal);
		var typeDev = $scope.devTypeFinal;
		//console.log('$scope.headingArray[$scope.devTypeFinal]===' +$scope.headingArray[typeDev]);
		$scope.heading = $scope.headingArray[$scope.devTypeFinal];

	});
	/* api to display names */


	//$scope.heading = $scope.headingArray[$scope.headingIndex];
	$scope.devicetype = 	$scope.devicetype.toLowerCase();
	//console.log('$scope.devicetype===' + $scope.devicetype);
	console.log('$scope.selectedData==>>>>>' +JSON.stringify($scope.selectedData));

	$http.get(__env.apiUrl+'/devices/countcommon/').then(function(response){
		//console.log('success count API !!!');
		for( var countindex = 0 ; countindex < response.data.length ; countindex++ ) {
			if ( response.data[countindex]["id"].toLowerCase() == $scope.devicetype ) {
				$scope.devicesCount = response.data[countindex]['count'];
				if($scope.recordEnd > $scope.devicesCount)
				{
					$scope.recordEnd = $scope.devicesCount;
					//$scope.recordsPP = $scope.devicesCount;
				}

			}
		}
		$scope.noOfPages = Math.ceil($scope.devicesCount/$scope.recordsPP);
		//alert($scope.noOfPages);
		//console.log('$scope.devicesCount====' + JSON.stringify($scope.devicesCount));
	})
	$scope.showMandatoryAttributes = false;
	$scope.showRelevantAttributes = false;
	$scope.showCustomAttributes = false;
	$http.get(__env.apiUrl+'/devices/fields/'+$scope.devicetype).then(function(response){
		console.log('success!!!');
		//console.log('response.dataaaaa===' + JSON.stringify(response.data));
		$scope.getFieldResponse = response.data;
		$scope.FieldData = response.data.fields;
		$scope.devicedata = response.data.fields;
		$scope.showMandatoryAttributes = false;
		for(var i=0;i<$scope.devicedata.length;i++){
			var fieldDetails = $scope.devicedata[i];
			if ( $scope.showMandatoryAttributes == false && fieldDetails && fieldDetails.group =='mandatory' ) {
	            $scope.showMandatoryAttributes = true;
			}
			if ( $scope.showRelevantAttributes == false && fieldDetails && fieldDetails.group =='relevant' ) {
	            $scope.showRelevantAttributes = true;
			}
			if ( $scope.showCustomAttributes == false && fieldDetails && fieldDetails.group =='customattribute' ) {
	            $scope.showCustomAttributes = true;
			}
			if ( $scope.showMandatoryAttributes == true && $scope.showRelevantAttributes == true && $scope.showCustomAttributes == true ) {
			    break;
			}

		}
	})

    //// SEARCH CODE STARTS
	$scope.searchManRel =[];
	$scope.searchCustomAttribute=[];
	$scope.searchRelatedCount=[];
	var mainJsonCollector = [];
	$scope.table_loader_search =true;
	for(var k in $scope.searchManRel){
		mainJsonCollector.push({ "fieldname" : k , "fieldvalue" : $scope.searchManRel[k], "devicetype" :$scope.devicetype.toLowerCase()});
	}
	for (var k in $scope.searchCustomAttribute){
		mainJsonCollector.push({ "fieldname" : k , "fieldvalue" : $scope.searchCustomAttribute[k], "devicetype" :$scope.devicetype.toLowerCase()});
	}
	if ( mainJsonCollector.length == 0 ) {
		mainJsonCollector.push({ "fieldname" : 'name' , "fieldvalue" : "*", "devicetype" :$scope.devicetype.toLowerCase()});
	}
	if ( $scope.mainJsonCollector && ( $scope.getmarkfordeletion || $scope.getmarkforreview ) ) { // this means we are in markfor delete or setreview
		mainJsonCollector = mainJsonCollector.concat($scope.mainJsonCollector);
	}
	var post_url=base_post_url+"&offset="+$scope.recordStart+'&limit='+$scope.recordsPP;
	$http.post(post_url,{
			"devicetype":$scope.devicetype.toLowerCase(),
			"search":mainJsonCollector
	}).then(function (response) {
		$scope.restData = response.data.results;
		$scope.devicesCount = response.data.total;
		$scope.noOfPages = Math.ceil($scope.devicesCount/$scope.recordsPP);
		console.log('$scope.restData====>>' + ( $scope.restData ? $scope.restData.length : 0 ) );
		$scope.currentRowIndex = 0;
		if ( $scope.restData && $scope.restData.length > 0 ) {
			console.log( $scope.restData[0].name);
		}
		$scope.table_loader=false;
		$scope.recordEnd =( $scope.recordEnd > $scope.devicesCount ? $scope.devicesCount  : $scope.recordEnd );
		//$scope.recordsPP =( $scope.recordsPP > $scope.devicesCount ? $scope.devicesCount  : $scope.recordsPP );
		console.log("Noof pages got is:"+$scope.noOfPages);
		// CMT-210 changes strats
		if($scope.selectedData  === undefined){
			//console.log('selected data is undefined');
			var associateGetUrl = __env.apiUrl+"/devices/userpreference";
			$http({
				method: 'GET',
				url: associateGetUrl,
				headers: {
					'email' : $rootScope.globals.currentUser.username
					//'email' : 'abcd123456@in.ibm.com'
				}
			})
				.then(function (response) {
					//alert('success of get api');
					$scope.getData =response['data'];
					$http.defaults.headers.common['sortdetails'] = JSON.stringify($scope.getData);
					//console.log('$scope.devicetype==>>>>' +$scope.devicetype);
					console.log('$scope.getData===>' + JSON.stringify($scope.getData));
					$scope.fetchuserPrefData = $scope.getData["list"];
					console.log(JSON.stringify($scope.fetchuserPrefData));
					if($scope.fetchuserPrefData){
						for(var d=0;d<$scope.fetchuserPrefData.length;d++){
							Object.keys($scope.fetchuserPrefData[d]).forEach(function(key, index) {
								console.log(key);
								console.log($scope.devicetype);
								if(key === $scope.devicetype){
									$scope.prefData = $scope.fetchuserPrefData[d][$scope.devicetype]
								}
							});
						}
					}
					console.log(JSON.stringify($scope.prefData));
					$scope.getColumnData = $scope.getData[$scope.devicetype];
					$scope.tempkeys1 = [];
					$scope.showtoUserFields=[];
					console.log('$scope.FieldData to compare===' + JSON.stringify($scope.FieldData));
					console.log('$scope.getColumnData to compare====' + JSON.stringify($scope.getColumnData));
					//console.log('JSON.stringify($scope.getData[$scope.devicetype]===' +JSON.stringify($scope.getData[$scope.devicetype]));
					if($scope.prefData === undefined ||  !$scope.prefData){
						console.log('inside if set pref');
						$scope.getData={};
						$scope.getData[$scope.devicetype] = $scope.getFieldResponse;
						$scope.getColumnData = $scope.getData[$scope.devicetype];
						console.log('$scope.getData[$scope.devicetype].fields.lengt===' +JSON.stringify($scope.getData));
						if($scope.devicetype === 'events'){
                            for(var i=0;i<$scope.getData[$scope.devicetype].fields.length;i++){
                                var fieldDetails = $scope.getData[$scope.devicetype].fields[i];
                                /*if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:")) ) {
                                 $scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);
                                 }

                                 if (fieldDetails.returntype != "showtouser") {
                                 if(fieldDetails.returntype.split(":")[1] ==1){
                                 $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                 }
                                 }else{
                                 $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                 }*/

                                if((fieldDetails.group && ( fieldDetails.group == "mandatory" || fieldDetails.group == "relevant")) || fieldDetails.key === "minto" || fieldDetails.key === "minfrom"){
                                    $scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);
                                }
                            }
                        }
                        else{
                            for(var i=0;i<$scope.getData[$scope.devicetype].fields.length;i++){
                                var fieldDetails = $scope.getData[$scope.devicetype].fields[i];
                                if(fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:"))){
                                    $scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);

                                }
                                if (fieldDetails.returntype != "showtouser") {
                                    if(fieldDetails.returntype.split(":")[1] ==1){
                                        $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                    }
                                } else {
                                    $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                }
                            }
                        }
						$scope.showtoUserFields.sort(function(a,b){
						 var x = a.fieldname < b.fieldname ? -1:1;
						  return x;
						});
					}
					else{
						console.log('inside else get preference');
						$scope.getColumnData1 = []
						for(var q=0;q<$scope.prefData.length;q++){
							for(var h=0;h<$scope.getFieldResponse.fields.length;h++){
								if($scope.prefData[q] === $scope.getFieldResponse.fields[h].key){
									$scope.getColumnData1.push($scope.getFieldResponse.fields[h]);
								}
							}
						}

						//$scope.getColumnData = $scope.getFieldResponse;
						console.log(JSON.stringify($scope.getColumnData1));
						$scope.getColumnData = {
							"fields" :''
						}
						$scope.getColumnData.fields = $scope.getColumnData1;
						//$scope.getColumnData = $scope.getData[$scope.devicetype];
						//$scope.getColumnData = $scope.prefData;
						for(var i=0;i<$scope.prefData.length;i++){
							$scope.tempkeys1.push($scope.prefData[i]);
						}
					}

					//console.log('$scope.tempkeys1==' +JSON.stringify($scope.tempkeys1));
					for(var p =0;p<$scope.tempkeys1.length;p++){
						if($scope.tempkeys1[p].key === 'name'){
							//console.log('do nothing');
							$(".addifnoName").removeClass('addClassTable');
						}
						else {
							$(".addifnoName").addClass('addClassTable');
						}
					}
				}).catch(function (response) {
					//console.log("Inside error case");
					$scope.responseData = response['data'];
					//console.log('$scope.responseData==>>>' +JSON.stringify($scope.responseData));
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					//console.log('$scope.statusCode===' +$scope.statusCode);
					//console.log('response.errorMessage===' +response.errorMessage);
					if(response.status == 404){
						//alert('no data found');
						$scope.getData ={};
						$scope.tempkeys1 = [];
						$scope.showtoUserFields=[];
						//console.log('$scope.getFieldResponse===' +JSON.stringify($scope.getFieldResponse));
						//console.log('$scope.getData[$scope.devicetype]===' +$scope.getData);
						$scope.getData[$scope.devicetype] = $scope.getFieldResponse;
						$scope.getColumnData = $scope.getData[$scope.devicetype];
						//console.log('$scope.getData[$scope.devicetype].fields.lengt===' +JSON.stringify($scope.getData));
						if($scope.devicetype === 'events'){
                            for(var i=0;i<$scope.getData[$scope.devicetype].fields.length;i++){
                                var fieldDetails = $scope.getData[$scope.devicetype].fields[i];
                                /*if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:")) ) {
                                 $scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);
                                 }

                                 if (fieldDetails.returntype != "showtouser") {
                                 if(fieldDetails.returntype.split(":")[1] ==1){
                                 $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                 }
                                 }else{
                                 $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                 }*/

                                if((fieldDetails.group && ( fieldDetails.group == "mandatory" || fieldDetails.group == "relevant")) || fieldDetails.key === "minto" || fieldDetails.key === "minfrom"){
                                    $scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);
                                }
                            }
                        }
                        else{
                            for(var i=0;i<$scope.getData[$scope.devicetype].fields.length;i++){
                                var fieldDetails = $scope.getData[$scope.devicetype].fields[i];
                                if(fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:"))){
                                    $scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);

                                }
                                if (fieldDetails.returntype != "showtouser") {
                                    if(fieldDetails.returntype.split(":")[1] ==1){
                                        $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                    }
                                } else {
                                    $scope.showtoUserFields.push({"key":$scope.getData[$scope.devicetype].fields[i].key,"fieldname":$scope.getData[$scope.devicetype].fields[i].fieldname});
                                }
                            }
                        }
					}
					//console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					//Dummy data in case of error
					$scope.showtoUserFields.sort(function(a,b){
					    var x = a.fieldname < b.fieldname ? -1:1;
					    return x;
					});
				});
		}
		// CMT 210 changes ends
	}).catch(function (response) {
		console.log("Inside error case of LIST view for<"+$scope.devicetype+"> So trying to get all without pagination");
		$scope.recordStart = 0;
		$scope.devicesCount = 0;
		$scope.recordEnd = 0;
		//$scope.recordsPP = 0;
		//$http.get(__env.apiUrl+'/'+$scope.devicetype+'/getall').then(function (response) {
		$scope.statusCode = response.status;
		$scope.statusText = (response.statusText);
		$scope.restData = response.data;
		if(response.status == 404){
			//alert('no data found');
			$scope.getData ={};
			$scope.tempkeys1 = [];
			//console.log('$scope.getFieldResponse===' +JSON.stringify($scope.getFieldResponse));
			//console.log('$scope.getData[$scope.devicetype]===' +$scope.getData);
			$scope.getData[$scope.devicetype] = $scope.getFieldResponse;
			$scope.getColumnData = $scope.getData[$scope.devicetype];
			//console.log('$scope.getData[$scope.devicetype].fields.lengt===' +JSON.stringify($scope.getData));
			for(var i=0;i<$scope.getData[$scope.devicetype].fields.length;i++){
				var fieldDetails = $scope.getData[$scope.devicetype].fields[i];
				if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
					$scope.tempkeys1.push($scope.getData[$scope.devicetype].fields[i].key);
				}
			}
		}
		$scope.table_loader=false;
	});
	$scope.table_loader_search =false;
	$scope.pageNo = 1;
    $scope.doingExport = false;
	$scope.exportType = 'xlsx';
	$scope.exportSearch = function(type) {
	    $scope.doingExport = true;
		$scope.exportType = type;
		$scope.submitSearch(1);
	}
	$scope.submitSearch =function(pageNo){
	    $scope.table_loader_search =true;
		console.log("Inside submitSearch page no got is:"+pageNo);
		if ( !pageNo ) {
		    pageNo = $scope.pageNo;
		} else {
		    $scope.pageNo = pageNo;
		}
        setRecordsPP($scope,__env); // this call sets both record PP and current page no
		$scope.currentPage = pageNo;
		$scope.recordStart = (($scope.currentPage - 1) * $scope.recordsPP)+1;
	    var mainJsonCollector = [];
		$scope.table_loader_search =true;
		for(var k in $scope.searchManRel){
			mainJsonCollector.push({ "fieldname" : k , "fieldvalue" : $scope.searchManRel[k], "devicetype" :$scope.devicetype.toLowerCase()});
		}
		for (var k in $scope.searchCustomAttribute){
		    mainJsonCollector.push({ "fieldname" : k , "fieldvalue" : $scope.searchCustomAttribute[k], "devicetype" :$scope.devicetype.toLowerCase()});
		}
		if ( mainJsonCollector.length == 0 ) {
			mainJsonCollector.push({ "fieldname" : 'name' , "fieldvalue" : "*", "devicetype" :$scope.devicetype.toLowerCase()});
		}
		if ( $scope.mainJsonCollector && ( $scope.getmarkfordeletion || $scope.getmarkforreview ) ) { // this means we are in markfor delete or setreview
		    mainJsonCollector = mainJsonCollector.concat($scope.mainJsonCollector);
		}
		console.log("Search array after splice is:"+JSON.stringify(mainJsonCollector));
		var post_url=base_post_url;
		if ( $scope.doingExport == false ) {
		    post_url = base_post_url+"&offset="+$scope.recordStart+'&limit='+$scope.recordsPP;
		}
		$http.post(post_url,{
			"devicetype":$scope.devicetype.toLowerCase(),
			"search":mainJsonCollector
		}).then(function(response){
			if (  $scope.doingExport == true ) {
		        $scope.otherDeviceData1 = response.data.results;
			    exportData($scope);
				$scope.doingExport = false;
			    $scope.table_loader_search =false;
				return true;
			}
			$scope.table_loader_search =false;
			$scope.restData = response.data.results;
			$scope.devicesCount = response.data.total;
			if ( $scope.devicesCount == 0 ) {
			    $scope.recordStart = 0;
			}
			$("#demo12").removeClass('in');
			$scope.recordEnd = $scope.currentPage * $scope.recordsPP;
			/**if ( $scope.recordsPP > $scope.devicesCount ) {
				$scope.recordsPP =( $scope.recordsPP > $scope.devicesCount ? $scope.devicesCount  : $scope.recordsPP );
			}**/
			if ( $scope.recordEnd > $scope.devicesCount ) {
				$scope.recordEnd =( $scope.recordEnd > $scope.devicesCount ? $scope.devicesCount  : $scope.recordEnd );
			}
		}).catch(function(response){
			alert(response.data.errorMsg);
			$scope.doingExport = false;
			$scope.table_loader_search =false;
		});
	}// end of submit search
    //// SEARCH CODE ENDS
	/*Record per page update*/

	$scope.inputRecordPP = function(recordPP){
		if( parseInt(recordPP) > 0 ) {
			$scope.recordsPP = recordPP;
		} else {
			alert('Please enter numeric device ID starting from 1');
			document.getElementById("recordPP").value = $scope.recordsPP;
			document.getElementById("recordPP").focus();
			document.getElementById("recordPP").select();
		}
	}
	/*Record per page update*/

	$scope.showInfo = function(DeviceDetails,FieldNames,keyData,devType,check){
		if(check ==0){
			console.log(DeviceDetails.name);
			$("#putLogicalName").val(DeviceDetails.name);
			$rootScope.FileSystemsLogicalDeviceName =DeviceDetails.name;
			console.log($rootScope.FileSystemsLogicalDeviceName);
		}
		console.log('devType===' + devType);
		if(devType === 'Services'){
			$("#demoDetail").addClass('adjustMargin');
		}
		//console.log('DeviceDetails==>>>>>' +JSON.stringify(DeviceDetails));
		//console.log('FieldNames==>>>>>>' + JSON.stringify(FieldNames));
		//console.log('keyData===>>>>' + JSON.stringify(keyData));
		/*var tempKeyData =[];
		 tempKeyData.push(keyData);
		 console.log('tempKeyData===' + JSON.stringify(tempKeyData));*/
		$scope.DeviceArray =[];
		/*for (var key in DeviceDetails) {
		 if(key==='index' || key==='importid'){
		 delete DeviceDetails[key];
		 }
		 else{
		 alert(JSON.stringify(FieldNames));
		 }
		 }*/

		for (var i=0;i<FieldNames.length;i++) {

			for(var p=0 ;p<keyData.length;p++){

				if(FieldNames[i].key == keyData[p] && FieldNames[i].key !=='index' && FieldNames[i].key !=='importid' && FieldNames[i].key !=='successflag' && FieldNames[i].returntype && ( FieldNames[i].returntype == "showtouser" || FieldNames[i].returntype.startsWith("1:") ) ){
					//alert(FieldNames[i].fieldname +' '+ DeviceDetails[FieldNames[i].key]);
					$scope.DeviceArray.push({"key":FieldNames[i].fieldname,"value":DeviceDetails[FieldNames[i].key]});
				}
			}
		}
		console.log('DeviceDetails after==>>>>>' +JSON.stringify(DeviceDetails));
		console.log('FieldNames==>>>' + JSON.stringify(FieldNames));
		console.log('device array after===>>>>' + JSON.stringify($scope.DeviceArray));
		//$scope.DeviceArray = DeviceDetails;
		$scope.DeviceName = DeviceDetails.name;
		$scope.FieldData = FieldNames;
	}

	$scope.opendetailOverlay = function(x,fieldData){
		//alert('open overlay');
		console.log('x array====>>>>' +JSON.stringify(x));
		console.log('fielddata===>>>' +JSON.stringify(fieldData));
		$uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'deviceDetail.html',
			controller: 'deviceDetailController',
			size: 'lg',
			windowClass: 'app-modal-window-selectpro',
			resolve: {
				DeviceDetails: function(){
					return x;
				},
				FieldNames : function(){
					return fieldData;
				}
			}

		});
	}
	$scope.navigateView = function(devicetype,xindex,index,name,pkid){
		console.log(pkid);
		console.log(devicetype.toLowerCase());
		console.log(pkid);
		if ( devicetype && devicetype.toLowerCase() !== 'logicaldevices' && devicetype.toLowerCase() !== 'documents' && devicetype.toLowerCase() !== 'events' && devicetype.toLowerCase() !== 'deviceinterfaces' && devicetype.toLowerCase() !== 'logicalnetworks' && devicetype.toLowerCase() !== 'interfacegroups' && devicetype.toLowerCase() !== 'componenttocomponents' && devicetype.toLowerCase() !== 'filesystems' ) {

			$location.url("/otherDevices" +"/"+"LIST"+"/"+xindex+"/"+name+"/"+devicetype.toLowerCase());
			return true;
		}
		if (devicetype && devicetype && devicetype.toLowerCase() == 'documents' || devicetype.toLowerCase() == 'events' || devicetype.toLowerCase() == 'logicalnetworks' || devicetype.toLowerCase() == 'deviceinterfaces' || devicetype && devicetype.toLowerCase() == 'interfacegroups' || devicetype && devicetype.toLowerCase() == 'componenttocomponents' || devicetype.toLowerCase() == 'filesystems') {
			//alert('devicetype ==  events');
			$location.url("/otherDevices" +"/"+"LIST"+"/"+xindex+"/"+pkid+"/"+devicetype.toLowerCase());
			return true;
		}
		else {
			$location.url("/logicalDevices" +"/"+"LIST"+"/"+xindex+"/"+name);
			return true;
		}
	};
	/* export in header*/
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
	$scope.openConfigureFieldsModal = function(){
		console.log('inside open modal pop up');
		console.log('$scope.devicetype===' +JSON.stringify($scope.devicetype));
		console.log('$scope.FieldData===>>>' +JSON.stringify($scope.FieldData));
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'configureFieldsListView.html',
			controller: 'configureFieldController',
			size: 'lg',
			windowClass: 'app-modal-window-selectpro',
			resolve: {
				deviceType: function(){
					return $scope.devicetype;
				},
				fieldData : function(){
					return $scope.FieldData;
				}
			}

		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selectedData = selectedItem;
			console.log('$scope.selectedData==>>>' +JSON.stringify($scope.selectedData))
		}, function () {
			console.log('Modal dismissed at: ' + new Date());
		});


	}

	/* Sorting Functionality starts-Manisha*/
	$scope.doSorting = function(){
		//console.log($routeParams.objid);
		//$scope.devicetype =  $routeParams.objid.toLowerCase();
		$http.get(__env.apiUrl+'/devices/fields/'+$scope.devicetype).then(function(response){
			$scope.FieldData = response.data.fields;
			console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
			var modalInstance =   $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'SortRecords.html',
				controller: 'SortRecordsController',
				size: 'lg',
				scope: $scope,
				windowClass: 'app-modal-window-selectpro',
				resolve: {
					deviceType: function(){
						return $scope.devicetype;
					},
					fieldData : function(){
						return $scope.FieldData;
					},
					devType : function(){
						return $scope.headingIndex
					},
					page : function(){
						return "listView"
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				console.log('closing modal instance');


				//$route.reload();
				//$window.location.href = '/';
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		})
	}
	/* Sorting Functionality Ends - Manisha*/

	/*Start::Column sorting function */
	$scope.reverse = true;
	var OldelementID='';
	$scope.sortbyColumn = function(sortby,sortaction,element)
	{ var elementID = document.getElementById(element+'_'+sortby);

		elementID.style.color='grey';
		if(OldelementID){OldelementID.style.color='white';}
		$scope.sortby = sortby;
		if($scope.presortaction === sortaction && $scope.presortby === sortby){return false;}
		$scope.reverse = (sortby !== null && $scope.sortby === sortby)? !$scope.reverse : false;
		$scope.restData = orderBy($scope.restData, sortby, $scope.reverse);
		$scope.presortaction = sortaction;
		OldelementID = elementID;
		$scope.presortby = sortby;
	}
	/*End::Column sorting function */
	/*Sort by multiple options */
	$scope.openSortby = function(){
		console.log('inside open sortby action');
		$scope.showsortby = true;
		//$scope.showimportfilteraction = false;
	};
	$scope.multisort = {};
	$scope.multiSortArr = [];
	$scope.sortMultiChange = function(sortby,optval){
		$scope.multisortAct = true;
		$scope.setsortType();
	if($scope.multiSortArr.indexOf(sortby) !== -1){
		$scope.multiSortArr.splice($scope.multiSortArr.indexOf(sortby),1);
	}else
	{
		$scope.multiSortArr.push(sortby);
			$scope.correctDataType(sortby);
	}
			$scope.reverse = false;
			$scope.restData = orderBy($scope.restData,$scope.multiSortArr);

			//alert(JSON.stringify($scope.multiSortArr));
			$("#sortMenu").addClass('open');

if($scope.multiSortArr.length == 0)
{
	$scope.sortMultiChange('name');
	$scope.multiSortArr = [];
}

	}

	/*Sort by multiple options */
}]);
