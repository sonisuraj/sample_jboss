app.factory("LDSearchGetFields", function($http, $q) {
return {
  get: function(key) {
      var deferred = $q.defer();
      if ( key == 'clusterslogicaldevices_servers' ) {
          key = 'logicaldevices';
      }
      $http.get( __env.apiUrl+'/devices/fields/'+key+'?main=yes')
      .then(function(response){
        //console.log(key)
         deferred.resolve(response.data.fields);
      })
      .catch(function(response){
        deferred.reject(response);
      });
      return deferred.promise;
  }
}
});
app.factory("LDSearchStakeholderGetFields", function($http, $q) {
return {
  get: function(key) {
      var deferred = $q.defer();
      $http.get( __env.apiUrl+'/devices/fields/stakeholders?main=yes')
      .then(function(response){
        //console.log(key)
         deferred.resolve(response.data.fields);
      })
      .catch(function(response){
        deferred.reject(response);
      });
      return deferred.promise;
  }
}
});
app.controller('logicalDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal','$route','LDSearchStakeholderGetFields','LDSearchGetFields','$q','$log','$window',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal,$route,LDSearchStakeholderGetFields,LDSearchGetFields,$q,$log,$window) {
	var mystyle = {
		headers:true,
		separator:","
	}
  //rename devices
    $scope.renameDevices=false;
  $scope.changeOnlyName =function(name,pkid){
    //alert(name+pkid);
    //http://localhost:9080/SCOPEToolsIntegrationServices/api/devices/rename/services/433?newname=ZSSDDDD123
    //var devicename=$routeParams.objid.toLowerCase();
    var url = __env.apiUrl+"/devices/rename/logicaldevices"+"/"+pkid+'?newname='+name;
    console.log(url)
    $http({
        method: 'PUT',
        url: url,
        data:{
            'pkid':pkid,
            'name':name
        },
    }).then(function(response) {
        console.log(response);
        if(response['status'] == 200){
        alert('Name updated successfully !!');
        }
        else{
          alert("Something went wrong!!");
        }

  }).catch(function(response) {
	    var status = response.status;
		$scope.disableFields = false;
		$scope.disableSave = false;
		$scope.saveSpinner = false;
		$scope.table_loader = false;
		if ( status == 409 ) {
			alert("Duplicate Device Name exists<"+name+"> Please use unique name");
		} else {
			alert("Error occurred while updating device<"+name+">Status is<"+status+">");
		}
   });

  }
  //rename devices
	$scope.getValueMine = function(val) {
//      console.log("Getting dropdown value for :"+val);
		if ( $scope[val] ) {
//          console.log("Value got is :"+$scope[val]+":"+$scope[val].myDynamicClass);
			return $scope[val].myDynamicClass;
		} else {
			return "";
		}
	}
  $scope.onFocus = function (e) {
      console.log("D");
      $timeout(function () {
          $(e.target).trigger('input');
          $(e.target).trigger('change'); // for IE
      });
  };
	console.log("Ddddddddddddd");
	console.log(__env.apiUrl+'/devices/logicaldevices/menu');
	$http.get(__env.apiUrl+'/devices/logicaldevices/menu').then(function (response) {
		$scope.association = response.data.devicemenu;
		for ( var i = 0 ; $scope.association && i <$scope.association.length ; i++) {
			var key = $scope.association[i].key;
			$scope.association[i].flatkey = key.replace(/-/g, "").toLowerCase();
			for ( var j = 0 ; $scope.association[i].submenu && j <$scope.association[i].submenu.length ; j++) {
				$scope.association[i].submenu[j].flatkey = $scope.association[i].submenu[j].subkey.replace(/-/g, "").toLowerCase();
			}
		}
		console.log($scope.association);
	});

	/* call for setting usr preference in case of page refresh starts*/
	var associateGetUrl = __env.apiUrl+"/devices/userpreference";
	$http({
		method: 'GET',
		url: associateGetUrl,
		headers: {
			'email': $rootScope.globals.currentUser.username
			//'email' : 'abcd123456@in.ibm.com'
		}
	}).then(function(response) {

		$scope.getData = response['data']
		console.log(JSON.stringify($http.defaults.headers.common['sortdetails']));
		$http.defaults.headers.common['sortdetails'] = JSON.stringify($scope.getData);
		console.log(JSON.stringify($http.defaults.headers.common['sortdetails']));
	})
		.catch(function(response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText);
			console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
			//Dummy data in case of error
		});
	/* call for setting user prefer in case of page refresh ends*/

	//deletion of device
	$scope.deletionDevices =function(nameid){
		var url = __env.apiUrl+"/devices/delete/logicaldevices"+"/"+nameid;
		console.log(url);
		$http({
			method: 'DELETE',
			url: url,

		}).success(function (response) {
			console.log(response);
			if(response == true){
				alert('Devices Deleted Successfully');
				$location.url('/logicalDevices/');
			}
		}).catch(function(response){
			alert(response.data.errorMessage);
		});
	}
	$scope.hideExportDoc = false;
	$scope.relatedCountLD =[];
	$scope.checkOtherAudit =false;
	$scope.open_Audit = function(pkid,fieldname) {
		$scope.pkidCollector =pkid;
		$scope.fieldnameCollector =fieldname;
		document.getElementById('Modal_audit').style.display = "block";
	}
	$scope.dropDownMismatch = [{'old':'environment','new':'env'},{'old':'migrationapproach','new':'migrationApp'},{'old':'drrequired','new':'drRequired'},{'old':'windowsdomain','new':'windowsDomain'},{'old':'backupmethod','new':'backupMethod'}]; // not used for now
	$scope.dropDownMismatchObj = {};// not used for now
	$scope.dropdownfields = [];
	$scope.dropdownfieldsMap = {'environment': 'env', 'migrationapproach':'migrationApp','drrequired' : 'drRequired','windowsdomain':'windowsDomain','backupmethod':'backupMethod'}; // not used for now
	$http.get(__env.apiUrl+'/devices/fields/logicaldevices?main=yes').then(function (response) {
		$scope.devicedata = response.data.fields;
		$scope.fieldsdata = response.data.fields;
		for ( var indexc1 = 0 ; $scope.fieldsdata && indexc1 < $scope.fieldsdata.length ; indexc1++) {
			if ( $scope.fieldsdata[indexc1].fieldtype == "select" ) {
			    $scope.dropdownfields.push({'name':$scope.fieldsdata[indexc1].key});
				$http.get(__env.apiUrl+'/devices/logicaldevices/dropdown/'+$scope.fieldsdata[indexc1].key).then(function (response) {
					$scope[response.data.name] = response.data.dropdown;
					var newname = 'drop_down_'+response.data.name;
					$scope[newname] = response.data.dropdown;
					$scope['drop_down_'+$scope.dropdownfieldsMap[response.data.name]] = response.data.dropdown;
					console.log('dropdown response in detail view for <'+response.data.name+'><===='+JSON.stringify($scope[response.data.dropdown]));
				});
			}
		}
		for ( var indexc1 = 0; indexc1  < $scope.dropDownMismatch.length ; indexc1++ ){
			var newname = 'drop_down_'+$scope.dropDownMismatch[indexc1]['new'];
			var oldname = 'drop_down_'+$scope.dropDownMismatch[indexc1]['old'];
		    $scope[newname] = $scope[$scope.dropDownMismatch[indexc1]['old']];
			$scope.dropDownMismatchObj[$scope.dropDownMismatch[indexc1]['new']] = $scope.dropDownMismatch[indexc1]['old'] ;
		}
	});
	//usecommonhtml, deviceid,canbeadded,headingAssociation,name,currentIndex
	$scope.logicaldevicemenu = {
		'services' : {'usecommonhtml' : 'false','deviceid' : 'services','canbeadded' : 'true'} ,
		'components' : {'usecommonhtml' : 'false','deviceid' : 'components','canbeadded' : 'true'} ,
		'componenttoservice' : {'usecommonhtml' : 'true','deviceid' : 'componenttoservice','canbeadded' : 'false','headingAssociation' : 'Component'} ,
		'componenttocomponent' : {'usecommonhtml' : 'true','deviceid' : 'componenttocomponent','canbeadded' : 'false','headingAssociation' : 'Component'} ,
		'logicalnetworks' : {'usecommonhtml' : 'true','deviceid' : 'logicalnetworks','canbeadded' : 'true', 'headingAssociation' : 'Logical Networks'} ,
		'physicaldevices' : {'usecommonhtml' : 'false','deviceid' : 'physicaldevices','canbeadded' : 'true'} ,
		'service_cluster' : {'usecommonhtml' : 'false','deviceid' : 'service_cluster','canbeadded' : 'true', 'headingAssociation' : 'Clusters'} ,
		'clusterslogicaldevices' : {'usecommonhtml' : 'true','deviceid' : 'clusterslogicaldevices','canbeadded' : 'false', 'headingAssociation' : 'Clusters'} ,
		'clusterslogicaldevices_servers' : {'usecommonhtml' : 'true','deviceid' : 'clusterslogicaldevices_servers','canbeadded' : 'false', 'headingAssociation' : 'Clusters'} ,
		'filesystems' : {'usecommonhtml' : 'true','deviceid' : 'filesystems','canbeadded' : 'true', 'headingAssociation' :'File Systems'} ,
		'deviceinterfaces' : {'usecommonhtml' : 'true','deviceid' : 'deviceinterfaces','canbeadded' : 'true', 'headingAssociation' :'Device Interfaces'} ,
		'stakeholder' : {'usecommonhtml' : 'false','deviceid' : 'stakeholder','canbeadded' : 'true'} ,
		'stakeholderscomponents' : {'usecommonhtml' : 'true','deviceid' : 'stakeholderscomponents','canbeadded' : 'false','headingAssociation' : 'Stakeholders'} ,
		'stakeholdersservices' : {'usecommonhtml' : 'true','deviceid' : 'stakeholdersservices','canbeadded' : 'false','headingAssociation' : 'Stakeholders'} ,
		'stakeholdersphysicaldevices' : {'usecommonhtml' : 'true','deviceid' : 'stakeholdersphysicaldevices','canbeadded' : 'false','headingAssociation' : 'Stakeholders'} ,
		'document' : {'usecommonhtml' : 'false','deviceid' : 'document','canbeadded' : 'true'} ,
		'events' : {'usecommonhtml' : 'false','deviceid' : 'events','canbeadded' : 'true','headingAssociation' :'Events'} ,
		'notes' : {'usecommonhtml' : 'false','deviceid' : 'notes','canbeadded' : 'false'} ,
		'audit' : {'usecommonhtml' : 'false','deviceid' : 'audit','canbeadded' : 'false'} ,
		'relationale' : {'usecommonhtml' : 'false','deviceid' : 'relationale','canbeadded' : 'false'},
		'audit-components' : {'usecommonhtml' : 'false','deviceid' : 'audit-components'} ,
		'audit-logicanetworks' : {'usecommonhtml' : 'false','deviceid' : 'audit-logicanetworks'} ,
		'audit-clusters' : {'usecommonhtml' : 'false','deviceid' : 'audit-clusters'} ,
		'audit-filesystems' : {'usecommonhtml' : 'false','deviceid' : 'audit-filesystems'} ,
		'audit-physicaldevices' : {'usecommonhtml' : 'false','deviceid' : 'audit-physicaldevices'} ,
		'audit-deviceinterfaces' : {'usecommonhtml' : 'false','deviceid' : 'audit-deviceinterfaces'},
		'audit-documents' : {'usecommonhtml' : 'false','deviceid' : 'audit-documents'}
	};
	$scope.getAuditDetail =function(deviceidName,name){
		$scope.deviceID ="RelationalsAudit";
		var url = __env.apiUrl+"/devices/getrelationalaudit/logicaldevices/"+deviceidName+"/"+name;
		console.log(url);
		$scope.mainName = deviceidName;
		$http.get(url).success(function (response) {
			console.log(response);
			$scope.checkOtherAudit =true;
			$scope.auditdatas =response;
			$scope.$parent.auditdatas = response;
		}).error(function(response){
		});
	}
	$scope.saveRationale=function(pkid,desc){
		console.log(pkid);
		var url =  __env.apiUrl+'/devices/rationale/update';
		var t = {
			"pkid":pkid,
			"rationaleDesc":desc
		};
		console.log(t);
		$http({
			method: 'PUT',
			url: url,
			data:t
		}).success(function (response) {
			$("#"+pkid).html(desc);
			alert("Successfully Done !!");
			document.getElementById('Modal_audit').style.display = "none";
		}).catch(function(response){
			console.log("In error scenario response got is:"+response)
			alert("Error ,please try in sometime");
		});

	}
	$scope.reloadPage = function(){
		$route.reload()
	}
	$scope.markForDeletion =function(param,name,index){
		var url = __env.apiUrl+"/devices/"+"logicaldevices/"+name+"/markfordeletion?mark="+param;
		console.log(url);
		$http({
			method: 'PUT',
			url: url,

		}).success(function (response) {
			$scope.logicalDeviceData[index].sconstate =param;
            if ( $scope.deviceID && $scope.deviceID == "audit" ) {
				var urlCall =__env.apiUrl+"/devices/logicaldevices"+"/"+name+"/audit";
				$http.get(urlCall).then(function (response) {
					$scope.auditdata =response['data']['auditdetails'];
					$scope.devicesCount	= $scope.auditdata.length;
					if ( $scope.$parent)  {
						$scope.$parent.auditdata = response['data']['auditdetails'];
					}
					$scope.table_loader = false;
				}).catch(function (response) {
					console.log('response===' + response);
					$scope.auditdata =[];
					if ( $scope.$parent) $scope.$parent.auditdata = [];
					$scope.table_loader = false;
				});

			}

		}).catch(function(response){
			alert("Error ,please try in sometime");
		});
	}

	$scope.headerArray = [];
	/*Records count show with pagination*/
	$scope.recordsPP = 5;
	$scope.recordStart = 1;
	$scope.currentPage = 1;
	$scope.recordEnd =$scope.recordsPP;
	$scope.setPage = function(pageNo) {
		//$scope.table_loader=true;
		console.log("Inside setPage page no got is:"+pageNo);
		$scope.currentPage = pageNo;
		$scope.recordStart = (($scope.currentPage - 1) * $scope.recordsPP)+1;
		$scope.recordEnd = $scope.currentPage * $scope.recordsPP;
		if($scope.recordEnd > $scope.devicesCount)
		{
			$scope.recordEnd = $scope.devicesCount;
		}
		//$scope.table_loader=false;
	};
	/*Records count show with pagination*/

	if ( document.getElementById("recordID") ) {
		document.getElementById("recordID").select();
	}
//Service to call total Count
	callCount.fetchTotalCount().success(function(response){
		$scope.total_count = response['result'];
		console.log($scope.total_count);
	});
	$scope.spinsleft = false;
	$scope.spinsRight = false;
//Service end for total Count
	/*API call for recent record count*/
	$scope.next_rev= false;
	$scope.emptyOrNullG = function(item){
		if ( !item.generalnotes ) return false;
		return !(item.generalnotes == null || item.generalnotes.trim().length === 0)
	}
	$scope.emptyOrNullR = function(item){
		if ( !item.reviewnotes ) return false;
		return !(item.reviewnotes == null || item.reviewnotes.trim().length === 0)
	}
	$scope.navigateViewList = function(){
		$location.url('/logicalDeviceListView');
	}
  $scope.getObjbyKey = function(keyVal)
    {
      var tempVar = 'drop_down_'+keyVal;
      return $scope[tempVar];
    }
	$scope.filterFn = function(auditdata)  {
		//console.log("AuditData got is:"+auditdata);
		if ( auditdata.createdby && auditdata.createdby.length> 0 && auditdata.createdby != "DB2ADMIN" && auditdata.createdby != "ADMINISTRATOR"  ) {
			return true;
		}
		return false; // otherwise it won't be within the results
	};

	$rootScope.searchFlag = 0;
	/* defect 977 code change starts*/
	$http.get(__env.apiUrl+'/devices/fields/logicaldevices').then(function (response) {
		$scope.table_loader=false;
		$scope.headerArrayBefore = response.data.fields;
		console.log('$scope.headerArrayBefore==>>>' + JSON.stringify($scope.headerArrayBefore));

		/* removing fields in export for which returntype is not "showtouser"*/
		for(var i=0;i<$scope.headerArrayBefore.length;i++){
			var fieldDetails = $scope.headerArrayBefore[i];
			if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
				$scope.headerArray.push($scope.headerArrayBefore[i]);
			}
		}
		/* removal code changes ends*/
		console.log('$scope.headerArrays after of logical devices====' + JSON.stringify($scope.headerArray));
	});
	/* defect 977 code change ends*/
	$scope.exportSearchCsv = function(type){
		console.log('$scope.logicalDeviceDataExported===>>>>' + JSON.stringify($scope.logicalDeviceDataExported));
		console.log('type===' + type);
		/* columns in csv/excel should come from field api code starts*/
		$scope.ArrayToBeExported = [];
		$scope.selectArray = [];
		for(var j=0;j<$scope.headerArray.length;j++){
			//if ( $scope.headerArray[j].Selected && $scope.headerArray[j].returntype == "showtouser") {
			//if ( $scope.headerArray[j].Selected ) {
			$scope.selectArray.push($scope.headerArray[j].key);
			//	}
		}
		for(var i=0;i<$scope.logicalDeviceDataExported.length;i++){
			var objExport = {};
			for(var j=0;j<$scope.selectArray.length;j++){
				var selectKey = $scope.selectArray[j];
				var selectkey2 = $scope.logicalDeviceDataExported[i][selectKey];
				objExport[selectKey] = selectkey2;
			}
			$scope.ArrayToBeExported.push(objExport);
			console.log('$scope.ArrayToBeExported====' + JSON.stringify($scope.ArrayToBeExported));
		}


		$scope.modifedHeaderArray = [];
		console.log('$scope.selectArray==>>>>' +JSON.stringify($scope.selectArray));
		for(var p =0;p<$scope.headerArray.length;p++){
			for(var q =0;q<$scope.selectArray.length;q++){
				//console.log('$scope.selectArray[q]===' +JSON.stringify($scope.selectArray[q]));
				//console.log('$scope.headerArray[p].key===' +$scope.headerArray[p].key);
				if($scope.selectArray[q] == $scope.headerArray[p].key){
					//console.log('value matches');
					$scope.modifedHeaderArray.push($scope.headerArray[p]);
				}
			}
		}

		/* logic starts*/
		$scope.tempstr = "";
		for(var i=0;i<$scope.modifedHeaderArray.length;i++) {
			//if($scope.ArrayToBeExported[0].hasOwnProperty($scope.headerArray[i].key)){
			if ( i < $scope.modifedHeaderArray.length-1 ) {
				$scope.tempstr += "["+$scope.modifedHeaderArray[i].key +"] as [" + $scope.modifedHeaderArray[i].fieldname +"]," ;
			} else {
				$scope.tempstr += "["+$scope.modifedHeaderArray[i].key +"] as [" + $scope.modifedHeaderArray[i].fieldname +"]";
			}
			//}

		}
		/* logic ends*/
		/* columns in csv/excel should come from field api code change ends*/
		var devicetype = 'ExportResults';
		var formatType = type.toUpperCase();
		var filename = devicetype + '.'  +type;
		//alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
		alasql('SELECT '+$scope.tempstr+' INTO '+formatType+' ("'+ filename+'", ?) FROM ?',[mystyle,$scope.logicalDeviceDataExported]);
		$("#demo12").removeClass('in');
		$rootScope.searchFlag === 0;
	}

	/*$scope.exportSearchExcel = function(){
	 var devicetype = 'ExportResults';
	 var filename = devicetype + '.xlsx';
	 alasql('SELECT * INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.logicalDeviceDataExported]);
	 }*/

	$scope.exportSearch = function(type){
		$scope.searchinExport = 0;
		$rootScope.searchFlag = 0;
		console.log($rootScope.searchFlag);
		if($rootScope.searchFlag === 1){
			$scope.logicalDeviceDataExported = $scope.logicalDeviceData;
			console.log('$scope.logicalDeviceData got is in search ==' +JSON.stringify($scope.logicalDeviceDataExported) );
			for(var p =0;p<$scope.logicalDeviceDataExported.length;p++){
				console.log('$scope.logicalDeviceDataExported[p]===' + JSON.stringify($scope.logicalDeviceDataExported[p]));
				Object.keys($scope.logicalDeviceDataExported[p]).forEach(function(key,index) {
					//console.log('key===' + key);
					//console.log('index==' + index);
					if(key==='index' || key==='importid'){
						delete $scope.logicalDeviceDataExported[p][key];
					}

				});
			}
			//console.log('$scope.logicalDeviceDataExportedafter===' + JSON.stringify($scope.logicalDeviceDataExported));
			if(type === 'csv'){
				$scope.exportSearchCsv('csv');
			}
			else{
				$scope.exportSearchCsv('xlsx');
			}
		}
		else{
          $scope.submitSearch($scope.searchinExport,type);
		}


	};


	$scope.ExportinSearch = function(exporttype,data){
		//$scope.searchinExport = 1;
		$rootScope.searchFlag = 0;
		console.log(exporttype);
		$scope.logicalDeviceDataExported = data;
		console.log('$scope.logicalDeviceData got is in search ==' +JSON.stringify($scope.logicalDeviceDataExported) );
		for(var p =0;p<$scope.logicalDeviceDataExported.length;p++){
			console.log('$scope.logicalDeviceDataExported[p]===' + JSON.stringify($scope.logicalDeviceDataExported[p]));
			Object.keys($scope.logicalDeviceDataExported[p]).forEach(function(key,index) {
				//console.log('key===' + key);
				//console.log('index==' + index);
				if(key==='index' || key==='importid'){
					delete $scope.logicalDeviceDataExported[p][key];
				}

			});
		}
		//console.log('$scope.logicalDeviceDataExportedafter===' + JSON.stringify($scope.logicalDeviceDataExported));
		if(exporttype === 'csv'){
			$scope.exportSearchCsv('csv');

		}
		else{
			$scope.exportSearchCsv('xlsx');

		}
	}
	//Search call for each device to display on ui
	$http.get(__env.apiUrl+'/devices/displaynames').then(function (response) {
		angular.forEach(response.data, function(value, key) {
			console.log(key + ': ' + value);
			$http.get(__env.apiUrl+'/devices/fields/'+key+'?main=yes').then(function (response) {
				$scope[key+'Data'] = response.data.fields;
			});
		});
	});
	//Declare variable for the search
    $scope.LowerOtherDeviceName='logicaldevices';
	$scope.searchManRel =[];
	$scope.searchService =[];
	$scope.searchComponent=[];
	$scope.searchCluster=[];
	$scope.searchDocument=[];
	$scope.searchPhysicalDevice=[];
	$scope.searchDeviceInterface=[];
	$scope.searchFileSystem=[];
	$scope.searchStakeholder=[];
	$scope.searchLogicalDevice=[];
	$scope.searchLogicalNetwork=[];
	$scope.searchDataSource=[];
	$scope.searchEvent=[];
	$scope.searchComponentToComponent=[];
	$scope.searchInterfaceGroup=[];
	$scope.searchCustomAttribute=[];
	$scope.searchRelatedCount=[];
	$scope.table_loader_search =false;
	$scope.submitSearch =function(isexport,exporttype){
		console.log(isexport);
		console.log(exporttype);
		$rootScope.searchFlag = 1;
		$scope.table_loader_search =true;
		var dummyrelatedCount =[];
		var dummycustomAttribute=[];
		var mainDeviceManRel =[];
	    var noDatadisplayResultString = "";
		var devicetype = 'logicaldevices';
		for(var k in $scope.searchManRel){
			mainDeviceManRel.push({ "fieldname" : k , "fieldvalue" : $scope.searchManRel[k], "devicetype" :devicetype});
			if ( $scope.searchManRel[k] && $scope.searchManRel[k].length > 0 ) {
				if ( noDatadisplayResultString.length == 0 ) {
					noDatadisplayResultString = k+"="+$scope.searchManRel[k];
				} else {
					noDatadisplayResultString += "\n"+k+"="+$scope.searchManRel[k];
				}
			}
		}
		for (var k in $scope.searchRelatedCount){
			dummyrelatedCount.push({ "fieldname" : k.replace(/-/g, "").toLowerCase() , "fieldvalue" : $scope.searchRelatedCount[k], "devicetype" :"relatedCount"});
			if ( $scope.searchRelatedCount[k] && $scope.searchRelatedCount[k].length > 0 ) {
				if ( noDatadisplayResultString.length == 0 ) {
					noDatadisplayResultString = k+"="+$scope.searchRelatedCount[k];
				} else {
					noDatadisplayResultString += "\n"+k+"="+$scope.searchRelatedCount[k];
				}
			}
		}
		for (var k in $scope.searchCustomAttribute){
		    dummycustomAttribute.push({ "fieldname" : k , "fieldvalue" : $scope.searchCustomAttribute[k], "devicetype" :'logicaldevices'});
			if ( $scope.searchCustomAttribute[k] && $scope.searchCustomAttribute[k].length > 0 ) {
				if ( noDatadisplayResultString.length == 0 ) {
				  noDatadisplayResultString = k+"="+$scope.searchCustomAttribute[k];
				} else {
				  noDatadisplayResultString += "\n"+k+"="+$scope.searchCustomAttribute[k];
				}
			}
		}

		var array = [];

					$scope.association.map(function (u) {
						if( u.key.replace(/-/g, '').toLowerCase() =='resourcesservices' || u.key.replace(/-/g, '').toLowerCase() =='resources' || u.key.replace(/-/g, '').toLowerCase() =='logicaldevices' || u.key.replace(/-/g, '').toLowerCase() =='components' || u.key.replace(/-/g, '').toLowerCase() =='stakeholders' || u.key.replace(/-/g, '').toLowerCase() =='documents' || u.key.replace(/-/g, '').toLowerCase() =='events'|| u.key.replace(/-/g, '').toLowerCase() =='physicaldevices' || u.key.replace(/-/g, '').toLowerCase() =='componenttocomponents' || u.key.replace(/-/g, '').toLowerCase()=='services'||u.key.replace(/-/g, '').toLowerCase()=='filesystems' || u.key.replace(/-/g, '').toLowerCase()=='deviceinterfaces' || u.key.replace(/-/g, '').toLowerCase()=='datasources' || u.key.replace(/-/g, '').toLowerCase()=='logicalnetworks'){
							 array.push({"main":u.key.replace(/-/g, '').toLowerCase() ,"others":LDSearchGetFields.get(u.key.replace(/-/g, '').toLowerCase())})
						}
						//console.log(u.submenu);

						u.submenu.map( function (ui ) {
							//console.log(ui.subkey.replace(/-/g, '').toLowerCase());
						//  console.log(u.key + "and is "+ ui.subkey);
							if(u.key.replace(/-/g, '').toLowerCase() =='stakeholders' && (ui.subkey.replace(/-/g, '').toLowerCase() =='components'|| ui.subkey.replace(/-/g, '').toLowerCase() =='logicaldevices' || ui.subkey.replace(/-/g, '').toLowerCase() =='physicaldevices')){
									var mainkey = u.key.replace(/-/g, '').toLowerCase() +ui.subkey.replace(/-/g, '').toLowerCase();
									array.push({"main":mainkey ,"others":LDSearchStakeholderGetFields.get(ui.subkey.replace(/-/g, '').toLowerCase())})
							}
							else if(u.key.replace(/-/g, '').toLowerCase() =='stakeholders' && ui.subkey.replace(/-/g, '').toLowerCase() =='logicaldevices' || ui.subkey.replace(/-/g, '').toLowerCase() =='physicaldevices' || ui.subkey.replace(/-/g, '').toLowerCase() =='components' || ui.subkey.replace(/-/g, '').toLowerCase() =='direct' || ui.subkey.replace(/-/g, '').toLowerCase() =='services' ){
									array.push({"main":u.key.replace(/-/g, '').toLowerCase()+ui.subkey.replace(/-/g, '').toLowerCase() ,"others":LDSearchGetFields.get(ui.subkey.replace(/-/g, '').toLowerCase())})
							}
							else if( ui.flatkey == 'clusterslogicaldevices_servers' || ui.subkey.replace(/-/g, '').toLowerCase() =='logicaldevices' || ui.subkey.replace(/-/g, '').toLowerCase() =='clustered' || ui.subkey.replace(/-/g, '').toLowerCase() =='physicaldevices' || ui.subkey.replace(/-/g, '').toLowerCase() =='components'|| ui.subkey.replace(/-/g, '').toLowerCase()=='componentstodevice' ||ui.subkey.replace(/-/g, '').toLowerCase()=='inboundcomponents'||ui.subkey.replace(/-/g, '').toLowerCase()=='outboundcomponents'||ui.subkey.replace(/-/g, '').toLowerCase()=='childphysicaldevices'||ui.subkey.replace(/-/g, '').toLowerCase()=='childfilesystems' ||ui.subkey.replace(/-/g, '').toLowerCase()=='parentphysicaldevices'||ui.subkey.replace(/-/g, '').toLowerCase()=='parentfilesystems' ){

									array.push({"main":ui.subkey.replace(/-/g, '').toLowerCase() ,"others":LDSearchGetFields.get(ui.subkey.replace(/-/g, '').toLowerCase())})
							}

							else{

							}
					});
					 // console.log("ss");
						//console.log(array)
					});
					console.log(array);
				//  return;
					var maindata =[];
					$q.all(array)
						.then( function(res ) {
							 $timeout(function() {
								 res.forEach(function (a ) {
									 //console.log(a.main);
									//console.log(a.others['$$state'].value.length)
									 for(o =0 ;a.others['$$state'] && a.others['$$state'].value && o < a.others['$$state'].value.length;o++){
										 //showinrelateddata
											var t = $("#"+a.main+a.others['$$state'].value[o].key).val();

												if(t !=undefined){
						console.log("Key is available in showrelated data#"+a.main+a.others['$$state'].value[o].key+"and"+a.others['$$state'].value[0].showinrelateddata+t);
							console.log("#"+a.main+a.others['$$state'].value[o].key);
						console.log(t);
													if(t.length>0) {
														//  dummyrelatedCount.push({ "fieldname" : k , "fieldvalue" : $scope.searchRelatedCount[k], "devicetype" :"relatedCount"});
														maindata.push({"devicetype":a.main ,"fieldvalue":t,"fieldname":a.others['$$state'].value[o].key})
														if ( noDatadisplayResultString.length == 0 ) {
															noDatadisplayResultString = a.main+"."+a.others['$$state'].value[o].key+"="+t;
														} else {
															noDatadisplayResultString += "\n"+a.main+"."+a.others['$$state'].value[o].key+"="+t;
														}
													}
												}
												//console.log(t);



									 } // end of for loop of a.others
										//  console.log(maindata);
										//    mainJsonCollector = dummyservice.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummycomponent).concat(dummylogicaldevice).concat(dummydocument).concat(dummystakeholder).concat(dummyevents);
								 });
			//console.log(maindata);
			var mainJsonCollector = mainDeviceManRel.concat(dummycustomAttribute).concat(maindata).concat(dummyrelatedCount);
			//console.log(mainJsonCollector);
			//var mainJsonCollector = maindata;
			//return;
			var post_url=__env.apiUrl+"/devices/search";
			console.log(post_url);
			//var mainJsonCollector=[];
			if ( $scope.searchdevicename && $scope.searchdevicename.length > 0) {
				mainJsonCollector.push({"fieldname": "name", "fieldvalue": $scope.searchdevicename,"devicetype": ""});
				if ( $scope.searchdevicename && $scope.searchdevicename.length > 0 ) {
					if ( noDatadisplayResultString.length == 0 ) {
						noDatadisplayResultString = "Name"+"="+$scope.searchdevicename;
					} else {
						noDatadisplayResultString += "\n"+"Name"+"="+$scope.searchdevicename;
					}
				}
			}

			console.log("Search array after splice is:"+mainJsonCollector);
			console.log(mainJsonCollector);
			$rootScope.search = mainJsonCollector;
			var post_url=__env.apiUrl+"/devices/search";
			$http.post(post_url,{
				"devicetype":"logicaldevices",
				"search":mainJsonCollector
			}).success(function(data){
          window.scrollTo(0,0);
				$scope.table_loader_search =false;
				if ( !data || data.length == 0 ) {
					alert("No result found for given criteria:\n"+noDatadisplayResultString);
					return false;
				}
				$("#demo12").removeClass('in');
				console.log(isexport);
				if(isexport === 0){
					//alert('inside if');
					$scope.ExportinSearch(exporttype,data);
					return;
				}
				$scope.logicalDeviceData = data;


				//alert('after if');

				$scope.totalLDcount = data.length;

				console.log('lenght of $scope.logicalDeviceData==' +( $scope.logicalDeviceData ? $scope.logicalDeviceData.length : 0 ) );
				console.log('$scope.logicalDeviceData got is in search ==' +JSON.stringify($scope.logicalDeviceData) );
				console.log('$scope.deviceID got is in search ==' +$scope.deviceID );

				$scope.currentRecord = 1;
				$scope.recordID = 1;
				$scope.logicalDeviceData.servicecount = 0 ;
				$scope.logicalDeviceData.compcount = 0 ;
				$scope.logicalDeviceData.clustercount = 0 ;
				$scope.logicalDeviceData.stakeholdercount = 0 ;
				$scope.currentIndex = 0;
				$scope.deviceName = $scope.logicalDeviceData[$scope.currentIndex].name;
				$scope.drop_down_value_env=$scope.logicalDeviceData[$scope.currentIndex].environment;
				$scope.drop_down_value_discoverystatus=$scope.logicalDeviceData[$scope.currentIndex].discoverystatus;
				$scope.drop_down_value_os=$scope.logicalDeviceData[$scope.currentIndex].os;
				$scope.drop_down_value_drRequired=$scope.logicalDeviceData[$scope.currentIndex].drrequired;
				$scope.drop_down_value_migrationApp=$scope.logicalDeviceData[$scope.currentIndex].migrationapproach;
				$scope.drop_down_value_windowsDomain=$scope.logicalDeviceData[$scope.currentIndex].windowsdomain;
				$scope.drop_down_value_backupMethod=$scope.logicalDeviceData[$scope.currentIndex].backupmethod;
				$scope.drop_down_value_status=$scope.logicalDeviceData[$scope.currentIndex].status;
				$scope.drop_down_value_inscope=$scope.logicalDeviceData[$scope.currentIndex].inscope;
				$scope.drop_down_value_backupoffsitelocation=$scope.logicalDeviceData[$scope.currentIndex].backupoffsitelocation;
				$scope.memorydetail = $scope.logicalDeviceData[$scope.currentIndex].memory;
				$scope.logicalcpudetail = $scope.logicalDeviceData[$scope.currentIndex].logicalcpu;
				setFrameworkColorCode($scope);
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/customattributes";
				$http.get(urlCall)
					.then(function (response) {
						$scope.customAttributes =response['data']['customattr'];
						console.log('$scope.customAttributes===>' + JSON.stringify($scope.customAttributes));
					}).catch(function (response) {
						$scope.table_loader_search =false;
						if(response.status == 404){
							$scope.customAttributes =[];
							console.log("Setting custom attributes to blank in case of not found");
						} else {
							console.log("Inside error case");
							$scope.customAttributes =[];
							$scope.statusCode = response.status;
							$scope.statusText = (response.statusText);
							console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
						}
						//Dummy data in case of error
					});

				getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
				if ( $scope.deviceID && $scope.deviceID != "LIST" ) {
					var menudata = $scope.logicaldevicemenu[$scope.deviceID];
					//usecommonhtml, deviceid,canbeadded,headingAssociation,name,currentIndex
					if ( menudata.usecommonhtml && menudata.usecommonhtml  == 'true' ) {
						$scope.getAssociatedDeviceDetail( menudata.usecommonhtml  , menudata.deviceid,menudata.canbeadded,  menudata.headingAssociation);
					}
				}


			});



		}, 5000);
						})
						 .catch( function (e ) {
							console.error(e);
						})




	}

	if ( !$scope.totalLDcount ) {
		var urlCall =__env.apiUrl+"/devices/count";
		$http.get(urlCall)
			.then(function (response) {
				$scope.relatedVersions =response['data']['result'];
				$scope.totalLDcount = $scope.relatedVersions[0]['count'];
			});
	}
	if ( $scope.deviceName ) {
		$scope.deviceName = $scope.deviceName.toUpperCase();
	}
	console.log($routeParams);
	console.log("Route Parameters got is:"+$routeParams.deviceID+":"+$routeParams.recordID+":"+$routeParams.deviceName+":"+$scope.deviceName);

	if($routeParams.deviceID && $routeParams.deviceID != "NONE" ){$scope.deviceID=$routeParams.deviceID;}
	if($routeParams.recordID){$scope.recordID=$routeParams.recordID;}else{$scope.recordID=1;}
	if($routeParams.deviceName){$scope.deviceName=$routeParams.deviceName;}else{$scope.deviceName="first";} // hardcoding to first device
	if ( $scope.deviceName && $scope.deviceName != "first" ) {
		$scope.deviceName = $scope.deviceName.toUpperCase();
	}
	$rootScope.relatedCountShowMark =false;
	if ( $rootScope.searchFlag != 1 ) {
		console.log("final Route Parameters got is:"+$routeParams.deviceID+":"+$routeParams.recordID+":"+$routeParams.deviceName+":"+$scope.deviceName);
		$scope.customAttributes = [];
		$scope.logicalDeviceData = [];
		var urlCall =__env.apiUrl+"/devices/displaynames";
		$http.get(urlCall).then(function (response) {
			$scope.deviceDisplayNames =response['data'];
			var testurl = __env.apiUrl+'/devices/logicaldevices/'+$scope.deviceName;
			console.log('testurl====' + testurl);
			$timeout(function () {
				$http.get(__env.apiUrl+'/devices/logicaldevices/'+$scope.deviceName).then(function (response) {
					console.log('response data logical devices===' + JSON.stringify(response.data));
					$http.get(__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/relatedcounts").then(function (response) {
						console.log(__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/relatedcounts");
						$scope.relatedCountLD = response.data;
						console.log($scope.relatedCountLD);
						for ( var count = 0 ; count < $scope.relatedCountLD.length ; count++) {
							console.log($scope.relatedCountLD[count].count);
							if($scope.relatedCountLD[count].count >0){
								// $rootScope.relatedCountShowMark =true;
								// return;
							}
						}
					});
					$scope.logicalDeviceData = response.data;
					console.log('$scope.logicalDeviceData==' +JSON.stringify($scope.logicalDeviceData));
					$scope.firstIndex = $scope.logicalDeviceData[0]["index"];
					$scope.lastIndex = $scope.logicalDeviceData[1]["index"];
					$scope.currentRecord = $scope.recordID;
					$scope.logicalDeviceData.servicecount = 0 ;
					$scope.logicalDeviceData.compcount = 0 ;
					$scope.logicalDeviceData.clustercount = 0 ;
					$scope.logicalDeviceData.stakeholdercount = 0 ;

					if($scope.firstIndex ===0)
					{
						$scope.previousIndex = '';
						$scope.currentIndex = 0;
						$scope.nextIndex = 1;
					}
					else if($scope.lastIndex ===0){
						$scope.previousIndex = 0;
						$scope.currentIndex = 1;
						$scope.nextIndex = '';
					}
					else {
						$scope.previousIndex = 0;
						$scope.currentIndex = 1;
						$scope.nextIndex = 2;
					}
					if ( $scope.deviceName == "first" ) {
						if ( $scope.logicalDeviceData[$scope.currentIndex].ROWNUMBER == "undefined" || !$scope.logicalDeviceData[$scope.currentIndex].ROWNUMBER) {
							$scope.recordID = 1;
						} else {
							$scope.recordID =  $scope.logicalDeviceData[$scope.currentIndex].ROWNUMBER ;
						}
					}
					if ( !$scope.recordID || isNaN($scope.recordID) ) { // this is needed for Add scenario when user is coming from ADD
						$scope.recordID = ( $scope.logicalDeviceData[$scope.currentIndex].ROWNUMBER ?$scope.logicalDeviceData[$scope.currentIndex].ROWNUMBER : $scope.totalLDcount) ;
					}
					$scope.deviceName = $scope.logicalDeviceData[$scope.currentIndex].name;
					$scope.drop_down_value_env=$scope.logicalDeviceData[$scope.currentIndex].environment;
				    $scope.drop_down_value_discoverystatus=$scope.logicalDeviceData[$scope.currentIndex].discoverystatus;
					$scope.drop_down_value_os=$scope.logicalDeviceData[$scope.currentIndex].os;
					$scope.drop_down_value_drRequired=$scope.logicalDeviceData[$scope.currentIndex].drrequired;
					$scope.drop_down_value_migrationApp=$scope.logicalDeviceData[$scope.currentIndex].migrationapproach;
					$scope.drop_down_value_windowsDomain=$scope.logicalDeviceData[$scope.currentIndex].windowsdomain;
					$scope.drop_down_value_backupMethod=$scope.logicalDeviceData[$scope.currentIndex].backupmethod;
					$scope.drop_down_value_status=$scope.logicalDeviceData[$scope.currentIndex].status;
					$scope.drop_down_value_inscope=$scope.logicalDeviceData[$scope.currentIndex].inscope;
					$scope.drop_down_value_backupoffsitelocation=$scope.logicalDeviceData[$scope.currentIndex].backupoffsitelocation;
					$scope.memorydetail = $scope.logicalDeviceData[$scope.currentIndex].memory;
					$scope.logicalcpudetail = $scope.logicalDeviceData[$scope.currentIndex].logicalcpu;
					setFrameworkColorCode($scope);
					var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/customattributes";
					$http.get(urlCall)
						.then(function (response) {
							$scope.customAttributes =response['data']['customattr'];
							console.log('$scope.customAttributes===>' + JSON.stringify($scope.customAttributes));
						}).catch(function (response) {
							console.log("Inside error case");
							$scope.statusCode = response.status;
							$scope.statusText = (response.statusText);
							console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
							//Dummy data in case of error
						});
					getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
					if ( $scope.deviceID && $scope.deviceID != "LIST" ) {
						var menudata = $scope.logicaldevicemenu[$scope.deviceID];
						//usecommonhtml, deviceid,canbeadded,headingAssociation,name,currentIndex
						if ( menudata && menudata.usecommonhtml && menudata.usecommonhtml  == 'true' ) {
							$scope.getAssociatedDeviceDetail( menudata.usecommonhtml  , menudata.deviceid,menudata.canbeadded,  menudata.headingAssociation);
						}
					}
					/*Start::Custom attribute related code*/
				});   // End of http call to get device detail
			}, 1000);
		});   // End of http call to get device names


	}

	$scope.preFieldName = '';
	$scope.allowEdit = function(fieldName){
		angular.element('#'+fieldName)[0].style.backgroundColor = "white";
		if($scope.preFieldName !=='' && $scope.preFieldName !=fieldName){angular.element('#'+$scope.preFieldName)[0].style.backgroundColor = "#e1e1e1";}
		$scope.preFieldName = fieldName;
		/*
		 if($scope.preFieldName !=='' && $scope.preFieldName !=fieldName){angular.element('#'+$scope.preFieldName)[0].disabled = true;}
		 */

	}
	$scope.caValueChange = function(att){

		window.console.log("Custom Attribute update Value Post  API called  from logicalDevicesController!");
		var post_url=__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/customattributes/update";
		$http.post(post_url,{"customattr":[{"attribute":att,"value":angular.element('#'+att).val()}]}).success(function(data){
			// angular.element('#'+att)[0].disabled = true;
		});


	}
  /*filter functionality for assciation*/
  $scope.filterFlag = false;
  var backupData = [];
  $rootScope.filterAssociation = function(searchText,dataNode)
  {
    if(!$scope.filterFlag)
    {
      backupData = $scope.$parent[dataNode];
    }
    else {
      $scope.$parent[dataNode] = backupData;
    }
    var tempArr = [];
    if(searchText)
    {
      for(var i=0;i < $scope.$parent[dataNode].length;i++)
      {
        if($scope.$parent[dataNode][i].name.toLowerCase().includes(searchText.toLowerCase()))
        {
          tempArr.push($scope.$parent[dataNode][i]);
        }
      }
      $scope.$parent[dataNode] = tempArr;
    }
    $scope.filterFlag = true;
  }
  /*filter functionality for assciation*/
	/*Ends::Custom attribute related code*/
	$scope.next_previous_data=function(adata,prevNext){
		//alert($scope.recordID +' New next '+prevNext+'SUM IS '+ (Number($scope.recordID) + Number(prevNext)));
		if(!adata){
			return;
		}
		console.log($routeParams);

		$scope.customAttributes = [];
		console.log("RecordID and total record got is:"+$scope.recordID +":"+$scope.totalLDcount+":and deviceid is"+$scope.deviceID+": and search flag is "+$rootScope.searchFlag+":And prevNext  is :"+prevNext );
		if ( $scope.recordID == 1 && prevNext == -1 ) { // for prev case
			return false;
		}
		if ( $scope.recordID == $scope.totalLDcount && prevNext == 1 ) { // for next case
			return false;
		}

		if (  $rootScope.searchFlag != 1 && !adata || adata =='' ) {
			return;
		}
		$scope.recordID = Number($scope.recordID) + Number(prevNext);
		if ( !$scope.deviceID) $scope.deviceID = "LIST";// by default we are in detail view of device
		if ( $rootScope.searchFlag == 1 ) {
			$scope.currentIndex = Number($scope.currentIndex) + Number(prevNext);
			$scope.deviceName = $scope.logicalDeviceData[$scope.currentIndex].name;
			$scope.drop_down_value_env=$scope.logicalDeviceData[$scope.currentIndex].environment;
			$scope.drop_down_value_discoverystatus=$scope.logicalDeviceData[$scope.currentIndex].discoverystatus;
			$scope.drop_down_value_os=$scope.logicalDeviceData[$scope.currentIndex].os;
			$scope.drop_down_value_drRequired=$scope.logicalDeviceData[$scope.currentIndex].drrequired;
			$scope.drop_down_value_migrationApp=$scope.logicalDeviceData[$scope.currentIndex].migrationapproach;
			$scope.drop_down_value_windowsDomain=$scope.logicalDeviceData[$scope.currentIndex].windowsdomain;
			$scope.drop_down_value_backupMethod=$scope.logicalDeviceData[$scope.currentIndex].backupmethod;
			$scope.drop_down_value_status=$scope.logicalDeviceData[$scope.currentIndex].status;
			$scope.drop_down_value_inscope=$scope.logicalDeviceData[$scope.currentIndex].inscope;
			$scope.drop_down_value_backupoffsitelocation=$scope.logicalDeviceData[$scope.currentIndex].backupoffsitelocation;
			$scope.memorydetail = $scope.logicalDeviceData[$scope.currentIndex].memory;
			setFrameworkColorCode($scope);
			$scope.logicalcpudetail = $scope.logicalDeviceData[$scope.currentIndex].logicalcpu;
			var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/customattributes";
			$http.get(urlCall)
				.then(function (response) {
					$scope.customAttributes =response['data']['customattr'];
				}).catch(function (response) {
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					//Dummy data in case of error
				});
			getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
			if ( $scope.deviceID && $scope.deviceID != "LIST" ) {
				var menudata = $scope.logicaldevicemenu[$scope.deviceID];
				//usecommonhtml, deviceid,canbeadded,headingAssociation,name,currentIndex
				if ( menudata.usecommonhtml && menudata.usecommonhtml  == 'true' ) {
					$scope.getAssociatedDeviceDetail( menudata.usecommonhtml  , menudata.deviceid,menudata.canbeadded,  menudata.headingAssociation);
				}
			}
		} else {
			if(adata){
				adata = adata.toUpperCase();
				console.log("Redirecting to :"+"#logicalDevices/"+$scope.deviceID+"/"+$scope.recordID+"/"+adata);
				// window.location.href = "#logicalDevices/"+$scope.deviceID+"/"+$scope.recordID +"/"+adata;
				if($scope.deviceID == "unsetforreview" || $scope.deviceID == "setforreview"){
					////http://localhost:8080/dilip/BluebenchSIT/#/logicalDevices/LIST/2/00001139
					console.log("Dd");
					$location.url("/logicalDevices/LIST/"+$scope.recordID +"/"+adata);
					return;
				}
				$location.url("/logicalDevices/"+$scope.deviceID+"/"+$scope.recordID +"/"+adata);
				//logicalDevices/:deviceID/:recordID/:deviceName
			}

		}
	} //end of next_previous_data

	$scope.editContent = function(){
		console.log('inside edit content function');
		$scope.disableFields = false;
		$scope.disableSave = false;
    $scope.renameDevices=true;

		$('#myForms .col-md-12 .form-group input').removeClass('hide_input_box');
		$('#myForms .col-md-12 .form-group .input-group input').addClass('input_right_border');
		$('#myForms select').removeClass('select_remove_arrow');
		$('#myFormRel .col-md-12 .form-group input').removeClass('hide_input_box');
		$('#myFormRel .col-md-12 .form-group .input-group input').addClass('input_right_border');
		$('#myFormRel select').removeClass('select_remove_arrow');
		$('#myFormCounts .col-md-12 .form-group input').removeClass('hide_input_box_extended');
		$('#myForms .col-md-12 .form-group .input-group span').removeClass('select_typehead');
		$('#myFormRel .col-md-12 .form-group .input-group span').removeClass('select_typehead');

	}
	$scope.disableFields = true;
	/*$scope.logicalDeviceData = [] ;*/
	$scope.disableSave = true;

	$scope.exportContent = function(){
		$scope.table_loader = true;


		//console.log($scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);


		var export_url = __env.apiUrl+'/devices/details/logicaldevices' +'/' + $scope.deviceName;


		$http.get(export_url)
			.then(function (response) {
				$scope.exportDetailsData = response.data;
				console.log('$scope.exportDetailsData====' +JSON.stringify($scope.exportDetailsData));
				console.log('field api response===' +JSON.stringify($scope.headerArrayBefore));
				var data1 = $scope.exportDetailsData['custom attributes']
				var data2 = $scope.exportDetailsData['related counts']
				var data3 = $scope.exportDetailsData['relateddata']
				var data4 = $scope.exportDetailsData.attributes
				var exportArray2 = {

				}

				exportArray2["attributes"] = $scope.exportDetailsData.attributes;
				if($scope.exportDetailsData['related counts']){
					exportArray2["related counts"] = data2;
				}

				exportArray2["relateddata"] = data3;
				exportArray2["custom attributes"] = data1 ;

				console.log(JSON.stringify(exportArray2));
				var opts = []
				var arrayTobeExported = []
				Object.keys(exportArray2).forEach(function(key,index){
					console.log(key);

					if(key === 'attributes'){

						$scope.headerArray = []
						console.log($scope.LowerOtherDeviceName);
						var optObject1 = {
							"sheetid":' ',
							"headers" : "true"
						}
						optObject1.sheetid = 'Attributes'
						opts.push(optObject1);

						for(var i=0;i<$scope.headerArrayBefore.length;i++){
							var fieldDetails = $scope.headerArrayBefore[i];
							if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
								$scope.headerArray.push($scope.headerArrayBefore[i]);
							}
						}
						console.log('$scope.headerArray----' + JSON.stringify($scope.headerArray));
						/* take fields from field api nd values from detail api starts*/
						var attributeobj = {}
						var oldobject = $scope.exportDetailsData.attributes
						Object.keys(oldobject).forEach(function(key,index){
							console.log(key);
							for(var q=0;q<$scope.headerArray.length;q++){
								if (key === $scope.headerArray[q].key){
									console.log('key matched');
									var selectkey1 = $scope.headerArray[q].fieldname;
									attributeobj[selectkey1] = oldobject[key];
								}
							}
						})
						console.log(JSON.stringify(attributeobj));

						var attData = [];
						attData.push(attributeobj)
						console.log(JSON.stringify(attData));
						arrayTobeExported.push(attData);
						console.log('array exported after attributes==' +JSON.stringify(arrayTobeExported))


					}
					else if(key === 'relateddata'){
						for(var p = 0 ;p< data3.length;p++){
							var optObject = {
								"sheetid":' ',
								"headers" : "true"
							}

							Object.keys(data3[p]).forEach(function(key,index) {
								console.log(key);
								if(data3[p][key].length != 0){
									console.log('field url---' + __env.apiUrl+'/devices/fields/'+key);
									/* $http.get(__env.apiUrl+'/devices/fields/'+key).then(function(response){
									 console.log('success!!!');
									 //console.log('response.dataaaaa===' + JSON.stringify(response.data));
									 // $scope.getFieldResponse = response.data;
									 $scope.FieldData = response.data.fields;
									 console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
									 })*/
									/*$scope.headingAssociation = "";
									 setColumnHeader($scope,key,$http,__env);
									 $scope.headerArray = []
									 console.log(JSON.stringify($scope.currentfielddata));
									 /!* getting fields from feild api nd details from othr api*!/
									 for(var i=0;i<$scope.currentfielddata.length;i++){
									 var fieldDetails = $scope.currentfielddata[i];
									 if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
									 $scope.headerArray.push($scope.currentfielddata[i]);
									 }
									 }
									 console.log(JSON.stringify($scope.headerArray));


									 /!* getting fields from field api *!/*/

									optObject.sheetid = key;
									opts.push(optObject);
									var urlvar = 'data_' +key;
									urlvar=data3[p][key]
									arrayTobeExported.push(urlvar);
								}


							});
						}
					}
					else if(key === 'custom attributes' && data1.length != 0){
						var optObject1 = {
							"sheetid":' ',
							"headers" : "true"
						}
						optObject1.sheetid = 'Custom_Attributes'
						opts.push(optObject1);
						arrayTobeExported.push(data1);
					}

					else if(key === 'related counts' && data2.length != 0){
						var optObject1 = {
							"sheetid":' ',
							"headers" : "true"
						}

						optObject1.sheetid = 'Related_counts'
						opts.push(optObject1);
						arrayTobeExported.push(data2);
					}
					else{
						console.log('do nothing')
					}
				})

				console.log(JSON.stringify(opts));
				console.log(JSON.stringify(arrayTobeExported));
				/* export sample starts*/
				$timeout(function () {
					if($scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'events' ||$scope.LowerOtherDeviceName === 'componenttocomponents'){
						//var opts = [{sheetid:'Custom_Attributes',header:true},{sheetid:'Attributes',header:false}];
						$scope.table_loader = false;
						var res = alasql('SELECT INTO XLSX("exportDetails.xlsx",?) FROM ?',
							[opts,arrayTobeExported]);
					}
					else{
						//var opts = [{sheetid:'Custom_Attributes',header:true},{sheetid:'Related_Counts',header:false},{sheetid:'Attributes',header:false}];
						$scope.table_loader = false;
						var res = alasql('SELECT INTO XLSX("exportDetails.xlsx",?) FROM ?',
							[opts,arrayTobeExported]);
					}
				}, 1000);
				/* export sample ends*/

			})
			.catch(function(response){
				alert('failure')
				console.log(response);
				/*$scope.errorData = response.data;
				 alert($scope.errorData);*/

			});

		//http://9.17.237.107:9082/SCOPEToolsIntegrationServices/api/devices/details/{devicetype}/{devicename}



	}
	$scope.submitEditedData = function(devname){
		$scope.saveSpinner = true;
		$scope.table_loader = true;
		$scope.disableFields = true;
		$scope.disableSave = true;
		//alert($scope.customAttribute.length);return false;
		/*Start::Defect21321*/
		/*Update Custom Attributes*/
		$scope.caUpdatedval = [];
		for (i=0; ( $scope.customAttributes &&  i <= $scope.customAttributes.length) ;i++){
			if($scope.customAttributes[i]){
				$scope.att = $scope.customAttributes[i].attribute;
				//$scope.attval =angular.element('#custAttributeInput_'+$scope.customAttributes[i].attribute).val();
				$scope.attval =document.getElementById('custAttributeInput_'+$scope.customAttributes[i].attribute).value;
				$scope.caUpdatedval.push({"attribute":$scope.att,"value":$scope.attval});
			}
		}
		$scope.caUpdatedvalSubmit = {"customattr":$scope.caUpdatedval};
//alert(JSON.stringify($scope.caUpdatedvalSubmit));
		/*End::Defect21321 Update Custom Attributes*/
		console.log('inside submit editted data');
		console.log('devname===' + devname);
		var devtype = angular.element('#devicetype').val();
		console.log('devtype===' + devtype);

		var drprocess = angular.element('#drprocess').val();
		console.log('drprocess====' + drprocess);

		var env = $scope.drop_down_value_env;
		console.log('env===' + env);

		var devhost = angular.element('#devhost').val();

		console.log('devhost===' + devhost);

		var ostype = $scope.drop_down_value_os;
		console.log('ostype===' + ostype);

		var osversion = angular.element('#osversion').val();
		console.log('osversion===' + osversion);

		var migapp = $scope.drop_down_value_migrationApp;
		console.log('migapp===' + migapp);

		var osarch = angular.element('#osarch').val();
		console.log('osarch===' + osarch);

		var discoverystatus = $scope.drop_down_value_discoverystatus;
		if ( !discoverystatus ) {
			discoverystatus = "";
		}
		console.log('discoverystatus===' + discoverystatus);

		var ospatch = angular.element('#ospatch').val();
		console.log('ospatch===' + ospatch);

		var sites = angular.element('#sites').val();
		console.log('sites===' + sites);

		var memory = angular.element('#memory').val();
		console.log('memory===' + memory);
		var isNumber = isNaN(memory);
		if ( isNumber === true ) {
			memory = $scope.memorydetail;
			isNumber = isNaN(memory);
			if ( isNumber === true ) {
				memory = "";
			};
		}
		console.log('Final memory===' + memory);
		var drreq = $scope.drop_down_value_drRequired;
		console.log('drreq===' + drreq);

		var windomain = $scope.drop_down_value_windowsDomain;
		console.log('windomain===' + windomain);

		var role = angular.element('#role').val();
		console.log('role===' + role);

		var backmethod = $scope.drop_down_value_backupMethod;
		console.log('backmethod===' +backmethod);

		var isvirt = angular.element('#isvirt').val();
		console.log('isvirt===' +isvirt);

		var backschedule = angular.element('#backschedule').val();
		console.log('backschedule===' +backschedule);

		var inscope = $scope.drop_down_value_inscope;
		console.log('inscope===' +inscope);

		var physerver = angular.element('#physerver').val();
		console.log('physerver===' +physerver);

		var backupoffsite = $scope.drop_down_value_backupoffsitelocation;
		console.log('backupoffsite===' +backupoffsite);

		var monsystem = angular.element('#monsystem').val();
		console.log('monsystem===' + monsystem);

		var stats = $scope.drop_down_value_status;
		console.log('stats===' + stats);

		var logcpu = angular.element('#logcpu').val();
		console.log('logcpu===' + logcpu);
		var isNumber = isNaN(logcpu);
		if ( isNumber === true ) {
			logcpu = $scope.logicalcpudetail;
			isNumber = isNaN(logcpu);
			if ( isNumber === true ) {
				logcpu = "";
			}
		}
		console.log('Final logcpu===' + logcpu);

		var hosttype = angular.element('#hosttype').val();
		if ( !hosttype) {
			hostype  = "";
		}
		console.log('hosttype===' + hosttype);


		var edittedData =
		{
			"name": devname,
			"devicetype": devtype,
			"drprocess": drprocess,
			"environment": env,
			"os": ostype,
			"osversion": osversion,
			"ospatchlevel": ospatch,
			"memory": memory,
			"drrequired": drreq,
			"logicaldevicehost": devhost,
			"migrationapproach": migapp,
			"windowsdomain": windomain,
			"drphysicalserver": physerver,
			"backupmethod": backmethod,
			"backupschedule": backschedule,
			"backupoffsitelocation": backupoffsite,
			"monitoringsystem": monsystem,
			"status": stats,
			"inscope": inscope,
			"logicalcpu": logcpu,
			"role" : role,
			"isvirtual" : isvirt,
			"discoverystatus" : discoverystatus,
			"hosttype" : hosttype,
			"sites" : sites,
			"osarchitecture" : osarch
		}

		console.log('edittedData===' +JSON.stringify(edittedData));

		var url = __env.apiUrl+'/logicaldevices/update/'+devname;
		console.log('url===' +JSON.stringify(url));
		var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}
		$http.put(url, edittedData, config)
			.success(function (data, status, headers, config) {
				console.log('success data===' + JSON.stringify(data));
				console.log('editted logical device successfully');
				$scope.disableFields = true;
				$scope.disableSave = true;

				/*Update Custom Attributes*/
				var post_url=__env.apiUrl+"/devices/logicaldevices/"+devname+"/customattributes/update";
				$http.post(post_url,JSON.stringify($scope.caUpdatedvalSubmit)).success(function(data){
					$scope.saveSpinner = false;
					$scope.table_loader = false;
					alert("Logical Device < "+devname+" > edited successfully");
					getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
					$location.url('/logicalDevices/'+$scope.deviceID+'/'+$scope.currentRecord+'/'+devname);
					$scope.disableFields = true;
					$scope.disableSave = true;

				}).catch(function (response) {
					$scope.disableFields = false;
					$scope.disableSave = false;
					$scope.saveSpinner = false;
					$scope.table_loader = false;
					alert("Error received while saving data: "+response.statusText +" : "+"Request failed "+" : "+response.status);
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

				});

				/*Update Custom Attributes*/
				//$location.path('/logicalDeviceListView')
				$scope.disableFields = true;
				$scope.disableSave = true;
			})
			.error(function (data, status, headers, config) {
				console.log('data===' + data);
				console.log('status===' + status);
				$scope.disableFields = false;
				$scope.disableSave = false;
				$scope.saveSpinner = false;
				$scope.table_loader = false;
				if ( status == 409 ) {
					alert("Duplicate Device Name exists<"+devname+"> Please use unique name");
				} else {
					alert("Error occurred while updating device<"+devname+">Status is<"+status+">");
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
			});


	}
	$scope.getAssociatedDeviceDetail = function(usecommonhtml, deviceid,canbeadded,headingAssociation,name,currentIndex){
		//alert("d");
		$scope.associationDevices = false;
		console.log("Inside getAssociatedDeviceDetail for deviceid,usecommonhtml,canbeadded <"+deviceid+"><"+usecommonhtml+"><"+canbeadded+">");
		console.log(deviceid);
		if($rootScope.searchFlag == 1 && deviceid=='profile-doc'){
			console.log('$scope.logicalDeviceData----' +JSON.stringify($scope.logicalDeviceData));
			/*open modalpopup for exporting all doc or only one*/
			$scope.ExportWordDoc('searchMode');
			return;
		}

		if(deviceid == 'profile-doc'){
			$scope.ExportWordDoc('normalMode');
			return;
		}
		if(deviceid =='setforreview' || deviceid =='unsetforreview'){
			var param ="No";
			if(deviceid =='setforreview'){
				param ='Yes';
			}
			console.log("fff");
			var url = __env.apiUrl+"/devices/logicaldevices/"+$scope.logicalDeviceData[$scope.currentIndex].name+"/setforreview?setreview="+param;
			console.log(url);
			$http({
				method: 'PUT',
				url: url,

			}).then(function(response) {
				console.log(response);
				$scope.logicalDeviceData[$scope.currentIndex].setreview =param;
			}).catch(function(response){
				console.log(response);
				alert("Error ,please try in sometime");
			});
		} // end of check for setforreview and unsetforreview

		console.log("Inside getAssociatedDeviceDetail for :"+deviceid);
		$scope.deviceID = deviceid;
		$scope.table_loader=true;
		$scope.spinsleft = true;

		if ( usecommonhtml == "false" )  {
			getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
			$location.url("/logicalDevices/"+$scope.deviceID+"/"+$scope.recordID +"/"+$scope.deviceName);
		} else {
			var get_url = __env.apiUrl+'/devices/logicaldevices/'+$scope.deviceName+'/'+$scope.deviceID;
			$scope.canbeAssociated = canbeadded;
			$scope.associationMainHeading = deviceid;
			$scope.setSelectionButton = "normaView";
			$scope.headingAssociation = headingAssociation;
			$scope.headingAssociationTitle = headingAssociation;
			$scope.showSelectionDiv = canbeadded;
			$scope.rows=[];
			setColumnHeader($scope,$scope.deviceID,$http,__env);
			console.log('Columns got is<' + $scope.cols);
			console.log('get_url===>>>' + get_url);
			$http.get(get_url).success(function(response,status,headers){
				$scope.associationDevices = true;
				console.log("Response got for query<"+$scope.deviceID +"> is<<"+response[$scope.deviceID])
				$scope.rows =response[$scope.deviceID];
				$scope.$parent.rows =response[$scope.deviceID];
				console.log('$scope.rows--responsedata==>>>>' + JSON.stringify($scope.rows));
				$scope.table_loader=false;
				$scope.spinsleft = false;
			}).catch(function (response) {
				// use field API to get columns names
				$scope.rows =[];
				$scope.$parent.rows =[];
				$scope.table_loader=false;
				$scope.spinsleft = false;

			});

		}
	}

	/*View LD with row count input*/

	/* LD profile documentation code start*/
	$scope.ExportWordDoc = function(mode){
		console.log('inside export doc');
		if(mode === 'searchMode'){
			var modalInstance =  $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'ProfileDocumentSearchMode.html',
				controller: 'multipleProfileDocController',
				size: 'lg',
				windowClass: 'app-modal-window-selectpro',
				resolve: {
					deviceType: function(){
						return $scope.devicetype;
					},
					fieldData : function(){
						return $scope.FieldData;
					},
					SearchData :function(){
						return $scope.logicalDeviceData;
					}
				}

			});

			modalInstance.result.then(function (selectedMode) {
				$scope.selectedData = selectedMode;
				console.log('$scope.selectedData==>>>' +JSON.stringify($scope.selectedData))
				if(selectedMode === 'single'){
					$scope.ExportWordDoc('normalMode');
				}
				else{
					$scope.ExportWordDoc('ExportAll')
				}
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		}
		else if(mode === 'normalMode'){
			console.log('$rootScope.searchFlag====' +$rootScope.searchFlag);
			$scope.table_loader = true;
			/* calling detail api*/
			if($scope.deviceName === 'first'){
				$scope.deviceName = $scope.logicalDeviceData[0].name;
			}
			else{
				console.log('do nothing');
			}
			//var export_url = __env.apiUrl+'/devices/details/logicaldevices' +'/' + $scope.deviceName+'?showFieldName=true';
			var export_url = __env.apiUrl+'/profiledoc/logicaldevices'+'/'+$scope.deviceName;
			//}
			console.log(export_url);
			$http.get(export_url)
				.then(function (response) {
					$scope.exportDetailsData = response.data;
					$window.open(export_url);
				$scope.table_loader = false;

					/* logic ends*/
				})
				.catch(function(response){
					alert('failure')
					console.log(response);
					/*$scope.errorData = response.data;
					 alert($scope.errorData);*/

				});
		}

		else{
			console.log('Export in case of search mode');
			console.log(JSON.stringify($scope.logicalDeviceData));

			for( var i=0;i<$scope.logicalDeviceData.length;i++){
				/*try1 starts*/
				(function(i){  // i will now become available for the someMethod to call
					$timeout(function() {
						//someMethod(i);
						$scope.newfuncGenerateDoc($scope.logicalDeviceData[i])
					}, i * 1000);
				})(i);

			}

		}

	}

	/* Sorting Functionality starts-Manisha*/
	$scope.doSorting = function(){
		//alert('inside sortinggg');
		//console.log($routeParams.objid);
		$scope.devicetype =  'logicaldevices'
		$http.get(__env.apiUrl+'/devices/fields/'+$scope.devicetype).then(function(response){
			console.log('success!!!');
			$scope.FieldData = response.data.fields;
			console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
			$uibModal.open({
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
						return 'logicalDevices';
					},
					page : function(){
					return "DetailView"
				}
				}
			});
		})
	}
	/* Sorting Functionality Ends - Manisha*/

	$scope.newfuncGenerateDoc = function(searchData){
		console.log(searchData.name);

		//var export_url = __env.apiUrl+'/devices/details/logicaldevices' +'/' + searchData.name+'?showFieldName=true';

		var export_url = __env.apiUrl+'/profiledoc/logicaldevices'+'/'+searchData.name;
		console.log(export_url);
		$http.get(export_url)
			.then(function (response) {
				$scope.exportDetailsData = response.data;
				$window.open(export_url);
			$scope.table_loader = false;

				/* logic ends*/
			})
			.catch(function(response){
				alert('failure')
				console.log(response);
				/*$scope.errorData = response.data;
				 alert($scope.errorData);*/

			});
		/* code ends*/
		//}, 4000);
	}
	/* LD profile documentation code ends*/
	$scope.inputDeviceIDView = function(inputdeviceid){
		if( parseInt(inputdeviceid) > 0 && parseInt(inputdeviceid) <= $scope.totalLDcount ) {
			var urlCall =__env.apiUrl+"/devices/logicaldevices/row/"+inputdeviceid;
			$http.get(urlCall)
				.then(function (response) {
					$scope.deviceIDData =response['data'][0].name;
					$location.url('/logicalDevices/'+$scope.deviceID+"/"+inputdeviceid+"/"+$scope.deviceIDData);
				}).catch(function (response) {
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				});
		} else {
			alert('Please enter numeric device ID starting from 1 to '+$scope.totalLDcount);
			document.getElementById("recordID").value = $routeParams.recordID;
			document.getElementById("recordID").focus();
			document.getElementById("recordID").select();
		}
	}
	/*View LD with row count input*/
	/*Search by name aut action for hint */
	$scope.searchbyNameData={};
	$scope.searchByName = function(searchdevicename){
		var fieldname = $scope.deviceName;
		var fieldvalue = $scope.fieldvalue;
		var search = [{ "fieldname" : "name" , "fieldvalue" :searchdevicename, "devicetype" :""}];
		var post_url=__env.apiUrl+"/devices/search";
		$http.post(post_url,{
			"devicetype":"logicaldevices",
			"search":search
		}).success(function(data){
			$scope.searchbyNameData = data;
			console.log('$scope.searchbyNameData got is in search ==' +JSON.stringify($scope.searchbyNameData) );
			var typeaheadArr=[];
			for(var i=0;i<$scope.searchbyNameData.length;i++){
				typeaheadArr.push({'id':i,'name':$scope.searchbyNameData[i].name});
			}
			$('#searchbyname').typeahead({
				source: typeaheadArr
			})

		})

		//  alert(JSON.stringify($scope.searchbyNameData));
	}

	/*Search by name aut action for hint  */
} //end controller

]);

app.controller('logicalDevicesController_extended', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {

  if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.roleBasedCanBeAssociated=false;
    $scope.canbeDeleted=false;
	}
	else {
		$scope.roleBasedCanBeAssociated=true;
    $scope.canbeDeleted=true;
	}

  $scope.otdtable2 =false;
	$scope.navigationOther =function(name,pkid,headingAssociationTitle,otherdevicename){
		console.log(name+pkid+otherdevicename);
		var no ="";
		otherdevicename =otherdevicename.toLowerCase();
		otherdevicename = otherdevicename.replace(/\s/g, '');
		var rownum =name;
		if(otherdevicename == 'clusterslogicaldevices' || otherdevicename == 'clusterslogicaldevices_servers'){
			otherdevicename = 'logicaldevices';
		}
		if(otherdevicename == 'events' || otherdevicename == 'filesystems' || otherdevicename=='documents'|| otherdevicename=='logicalnetworks' || otherdevicename == 'interfacegroups' || otherdevicename=='deviceinterfaces' || otherdevicename == 'componenttocomponents'){
			rownum =pkid;
		}else{
			rownum =name;
		}
		if(otherdevicename){
			otherdevicename = otherdevicename.replace(/\s/g, '');
		}

		//http://9.17.237.107:9082/SCOPEToolsIntegrationServices/api/devices/services/0/rownum
		console.log(__env.apiUrl+"/devices/"+otherdevicename+"/"+rownum+"/rownum");
		$http.get(__env.apiUrl+"/devices/"+otherdevicename+"/"+rownum+"/rownum").success(function (response) {
			console.log(response)
			console.log(response.ROWNUM);
			no =response.ROWNUM;
			if(otherdevicename =='logicaldevices'){
				var redirectUrl ="/logicalDevices/LIST/"+no+"/"+name;
			}
			else if(otherdevicename == 'filesystems' || otherdevicename == 'events' || otherdevicename=='documents'|| otherdevicename=='logicalnetworks' || otherdevicename == 'interfacegroups' || otherdevicename=='deviceinterfaces' || otherdevicename == 'componenttocomponents'){
				var redirectUrl ="/otherDevices/"+otherdevicename+"/first/"+no+"/"+pkid +"/undefined/undefined";
			}else{
				var redirectUrl = "/otherDevices/"+otherdevicename+"/first/"+no+"/"+name +"/undefined/undefined"
			}
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

	$scope.navigationOtherNew =function(name,otherdevicename){
		console.log("name+otherdevicename "+name+otherdevicename);
		if(otherdevicename){
			otherdevicename = otherdevicename.replace(' Name', 's');
		}

		var no ="";
		otherdevicename =otherdevicename.toLowerCase();

		var rownum =name;

		if(otherdevicename){
			otherdevicename = otherdevicename.replace(/\s/g, '');
		}
		console.log("otherdevicename "+otherdevicename);

		//http://9.17.237.107:9082/SCOPEToolsIntegrationServices/api/devices/services/0/rownum
		console.log(__env.apiUrl+"/devices/"+otherdevicename+"/"+rownum+"/rownum");
		$http.get(__env.apiUrl+"/devices/"+otherdevicename+"/"+rownum+"/rownum").success(function (response) {
			console.log(response)
			console.log(response.ROWNUM);
			no =response.ROWNUM;
			var redirectUrl = "/otherDevices/"+otherdevicename+"/first/"+no+"/"+name +"/undefined/undefined"

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

	$scope.disassociateDevicesToDevices = function(servicename,headingAssociationTitle,id){
		var nameid =id;
		if(headingAssociationTitle =='Logical Networks'){
			var devicetypeName = 'logicalnetworks';

		}else if (headingAssociationTitle =='File Systems') {
			var devicetypeName = 'filesystems';
			//nameid=servicename;

		}else if (headingAssociationTitle =='Device Interfaces') {
			var devicetypeName = 'deviceinterfaces';

		}else if (headingAssociationTitle =='Events') {
			var devicetypeName = 'events';

		}else{
			alert("Please try later ");
			return;
		}
		$scope.deviceID = devicetypeName;
		$scope.table_loader=true;
		$scope.spinServices = true;
		console.log('servicename===' + servicename);
		var compName = servicename;
		var post_url=__env.apiUrl+"/devices/logicaldevices/disassociate/"+$scope.deviceName;
		console.log(post_url);
		console.log({"devicetype":devicetypeName,"devicename":nameid});
		$http.post(post_url,{"devicetype":devicetypeName,"devicename":nameid})
			.success(function (response){
				alert( headingAssociationTitle.slice(0, -1) +' ' +compName+' successfully disassociated with '+$scope.deviceName);
				var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/"+devicetypeName;
				console.log('urlcall==>>>' + urlCall);
				$http.get(urlCall)
					.then(function (response) {
						//console.log('response===' +JSON.stringify(response['data']['services']));
						setColumnHeader($scope,devicetypeName,$http,__env);
						if(headingAssociationTitle =='Logical Networks'){
							$scope.rows =response['data']['logicalnetworks'];
							$scope.$parent.rows =response['data']['logicalnetworks'];
							console.log($scope.$parent.rows);
							console.log($scope.$parent.rows.length);
							$scope.logicalDeviceData.lncount = $scope.$parent.rows.length;
						}else if (headingAssociationTitle =='File Systems') {
							$scope.rows =response['data']['filesystems'];
							$scope.$parent.rows =response['data']['filesystems'];
							$scope.logicalDeviceData.fscount = $scope.$parent.rows.length;
						}
						else if (headingAssociationTitle =='Device Interfaces') {
							$scope.rows =response['data']['deviceinterfaces'];
							$scope.$parent.rows =response['data']['deviceinterfaces'];
							$scope.logicalDeviceData.interfacecount = $scope.$parent.rows.length;
						}else if (headingAssociationTitle =='Events') {
							$scope.rows =response['data']['events'];
							$scope.$parent.rows =response['data']['events'];
						}
						//console.log($scope.$parent.cols);

						if(devicetypeName =='events'){
							if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.eventscount = $scope.$parent.cols.length;
							$scope.logicalDeviceData.eventscount = $scope.$parent.cols.length;
						}
						$scope.newServiceName ="";
						$scope.table_loader = false;
						$scope.searchServiceName = "";
					});
				getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
			})
			.catch(function (response) {
				console.log(response);
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				alert('Error occurred, Please try again!'+ response.status);
				$scope.table_loader=false;
				$scope.spinServices = false;
				console.log("Inside error case");

			});


	}
	$scope.searchOtherForLD = function(q,q1){
		console.log("dssssssssssssssssssssssssssss");
		$scope.otherSearchResult = [];
		$scope.$parent.otherSearchResult = [];
    if($scope.headingAssociation =='Logical Networks'){
        if($scope.searchCompName != '*'){
          var t =checkIPAddress($scope.searchCompName);
          if(t == false){
            return ;
          }
        }
    }
		$scope.showRightTable = true;
		//$scope.normalAdd = 1;
		$scope.compAdd = 3;
		$(".change_col").removeClass('col-md-12').addClass('col-md-6');
		$scope.otdtable2=true;
		$(".change_col2").addClass('col-md-6');
		console.log('$routeParams===' + $routeParams.objid);
		if($scope.searchCompName === ''){
			$scope.showRightTable = false;
		}
		var associationName = q;
		//associationName = associationName.toLowerCase()+"s";
		console.log('associationName===>>>' + associationName);
		console.log('$scope.searchCompName==>>>' + $scope.searchCompName);
		console.log('$routeParams.objid===' + $routeParams.objid);
		$scope.showSpinnerSearch = true;
		$scope.table_loader = true;
		console.log('$scope.headingAssociation===>>>>' + $scope.headingAssociation);


		$scope.headingAssociationFinal =$scope.headingAssociation;
		console.log('$scope.headingAssociationFinal==>>>>' + $scope.headingAssociationFinal);
		var post_url=__env.apiUrl+"/devices/searchcommon";
		console.log('post_url==>>>' + post_url);
		if($scope.headingAssociationFinal === 'componenttocomponents'){
			$scope.headingAssociationFinal = "components"
		}
		else if($scope.headingAssociationFinal == 'interfacegroupstodeviceinterfaces'){
			$scope.headingAssociationFinal = 'deviceinterfaces';
		}
		else{
			console.log('no change');
		}
		var t ={"devicetype":q,"search":[{"fieldname":"name","fieldvalue":$scope.searchCompName}]};
		console.log(JSON.stringify(t));
		$http.post(post_url,t)
			.then(function (response){
				//console.log(response);
				//$scope.$parent.otherSearchResult =response['data'];
				$scope.otherSearchResult = response['data'];
				console.log('result of seargch api===' +JSON.stringify($scope.otherSearchResult));
				//$scope.compAdd = 0;
				if($scope.headingAssociation === 'component-to-components'){
					//alert('comptocomp');
					$scope.compAdd = 4;
				}
				else{
					$scope.compAdd = 3;
				}
				//$scope.normalAdd = 1;
				$scope.showSpinnerSearch = false;
				$scope.table_loader = false;
				if($scope.otherSearchResult.length === 0){
					if($scope.searchCompName === '*'){
						$scope.showadd = false;
						//$scope.compAdd = 0;
						if($scope.headingAssociation === 'component-to-components'){

							$scope.compAdd = 4;
						}
						else{
							$scope.compAdd = 3;
						}
						//$scope.normalAdd = 1;
					}
					else{
						$scope.showadd = true;
						$scope.showRightTable = true;
						if(q === 'filesystems'){
							console.log('call to add api nd pass accesstype,fetch pkid in response');
							$scope.addFStoLD();
						}

					}
				}
				else{
					$scope.showadd = false;
					$scope.showRightTable = true;
				}
				// $scope.searchCompName = ''
			}).catch(function (response) {
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				$scope.showSpinnerSearch = false;
				$scope.table_loader = false;
			});

		/* if($scope.searchCompName === '*'){
		 $scope.showRightTable = true;
		 console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.clusSearchResult));
		 //$scope.showadd = false;
		 }*/
	}
	/* code change for search func ends--manisha*/

	$scope.addFStoLD = function(){
		console.log('inside add FS to LD');
	}

	$scope.checkforEmpty = function(){
		$scope.showadd = false;
		$scope.showRightTable = false;
		console.log('$scope.searchClusName===' + $scope.searchClusName);
		if($scope.searchCompName === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}
		if($scope.searchCompName === '*'){
			//alert('value===empty');
			//$scope.showRightTable = true;
			//console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
			//$scope.showadd = false;
		}
	}


	// Please do not call this function for any other device types except LDs kids
	$scope.addDevicesToLD = function(devicedata,q,q1,create,isAddFS,pkid){
		console.log('inside add comp to LD');
		//console.log(type);
		console.log(devicedata);
		console.log(create);
		console.log(pkid);
		console.log('To be associated devicename ===>>>' +devicedata.name);
		console.log("Association name is :"+q);
		console.log("Sub-Association name is :"+q1);
		console.log(isAddFS);
		if(q === 'filesystems' && isAddFS === 'newFSAdd'){
			console.log('inside file systems');
			var modalInstance = 	$uibModal.open({
				animation: $scope.animationsEnabled,
				scope : $scope,
				templateUrl: 'chooseFSType.html',
				controller: 'FileSystemTypeSelectionController',
				size: 'lg',
				windowClass: 'app-modal-window-selectpro',
				resolve: {
					dummyDeviceData: function(){
						return devicedata;
					},
					dummyq: function(){
						return q;
					},
					dummyq1: function(){
						return q1;
					},
					dummyCreate: function(){
						return create;
					}




				}
			});
			return;
			/*modalInstance.result.then(function (a1,a2,a3,a4,selectedItem) {
			 console.log('closing modal instance');
			 console.log(a1);
			 console.log(a2);
			 console.log(a3);
			 console.log(a4);
			 console.log('type===' +selectedItem);
			 $scope.addDevicesToLD()
			 }, function () {
			 console.log('Modal dismissed at: ' + new Date());
			 });*/
		}

		$scope.devToBeAssociated = devicedata.name;
		var associationName = q.toLowerCase();
		$scope.showaddSpinner = true;
		$scope.table_loader=true;
		$scope.spinsleft = false;
		$scope.showSpinnerSearch = false;
		$scope.spinsRight = false;
		$scope.showassociateSpinner = false;
		if(!$scope.devToBeAssociated || $scope.devToBeAssociated =='') {
			alert('Please enter valid device name');
			return false;
		}
		$scope.deviceName = $scope.logicalDeviceData[$scope.currentIndex].name;
		console.log('associationName==>>>' +associationName);
		/* manisha's code changes associate api starts*/
		if ( create && create == true && ( associationName == "events" ||  associationName == "logicalnetworks" ||  associationName == "deviceinterfaces" ) ) {
			var post_url =__env.apiUrl+"/devices/"+q+"/add";
			$rootScope.relatedCountShowMark =false;
			var paramObj={
				"hostname":$scope.logicalDeviceData[$scope.currentIndex].name,
				"name":$scope.devToBeAssociated
			};
		}
		else if( pkid && create == true && associationName == "filesystems"){
			console.log(pkid);
			var idtobeused = pkid;
			var post_url =__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.logicalDeviceData[$scope.currentIndex].name;
			var paramObj={
				"devicetype":q,
				"devicename":idtobeused
			};

		}
		else {
			var idtobeused = devicedata.id;
			var post_url =__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.logicalDeviceData[$scope.currentIndex].name;
			var paramObj={
				"devicetype":q,
				"devicename":idtobeused
			};

		}
		console.log('post_url===>>>>>>>' + post_url);
		console.log('paramObj===>>>>' +JSON.stringify(paramObj));
		$http.post(post_url,paramObj).success(function(data){
			$rootScope.relatedCountShowMark =true;
			console.log("ffff");
			if ( associationName == "events"  ) {
				console.log("data got is:"+JSON.stringify(data));
				if ( data.id ) {
					var post_url =__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.logicalDeviceData[$scope.currentIndex].name;
					var paramObj={
						"devicetype":q,
						"devicename":data.id
					};
					$http.post(post_url,paramObj).success(function(data){
						alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames['logicaldevices']);
						$('.collapse').collapse('hide');
					    $scope.showadd = false;
					    $scope.showRightTable = false;
					    $scope.searchCompName = '';
						$scope.table_loader=false;
						console.log('associationName==>>>' + associationName);
						var idtobeused = $scope.logicalDeviceData[$scope.currentIndex].name;
						var get_url = __env.apiUrl+'/devices/logicaldevices/'+idtobeused+'/'+associationName;
						$http.get(get_url).success(function(response){
							$scope.rows =response[associationName];
							getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
							console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
							return;
						}).catch(function(response){
							alert("Assocaiton failed:"+data);
							$scope.rows = [];
						});

					}).error(function(data){
						console.log(data);
						$scope.table_loader=false;
						if(data.errorMessage){
							alert(data.errorMessage+" "+ data.userAction);
						} else {
							alert("Create of events failed:"+data);
						}
					});
				} else {// end of ID check
					alert("<" +$scope.devToBeAssociated+ '> associated successfully with '+ $scope.deviceDisplayNames['logicaldevices']);
					$('.collapse').collapse('hide');
					$scope.showadd = false;
					$scope.showRightTable = false;
					$scope.searchCompName = '';
				}
			}

			if ( associationName != "events"  ) {
				alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames['logicaldevices']);
				$('.collapse').collapse('hide');
					$scope.showadd = false;
					$scope.showRightTable = false;
					$scope.searchCompName = '';
			}
			$scope.table_loader=false;
			console.log('associationName==>>>' + associationName);
			var idtobeused = $scope.logicalDeviceData[$scope.currentIndex].name;
			var get_url = __env.apiUrl+'/devices/logicaldevices/'+idtobeused+'/'+associationName;
			$http.get(get_url).success(function(response){
				$scope.rows =response[associationName];
				getLogialDeviceRelatedData($scope,$http,__env,$rootScope);
				console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
			}).catch(function(response){
				$scope.rows = [];
			});

		}).error(function(data){
			console.log(data);
			$scope.table_loader=false;
			if(data.errorMessage){
				alert(data.errorMessage+" "+ data.userAction);
			} else {
				alert("Assocaiton failed:"+data);
			}
		});
	}; //end of function
	$scope.getAssociatedDeviceDetail = function(usecommonhtml, deviceid,canbeadded,headingAssociation){
		console.log("Inside getAssociatedDeviceDetail for deviceid,usecommonhtml,canbeadded <"+deviceid+"><"+usecommonhtml+"><"+canbeadded+">");
		$scope.deviceID = deviceid;
		$scope.table_loader=true;
		$scope.spinsleft = true;
		$scope.associationDevices = true;
		$scope.rows=[];
		var get_url = __env.apiUrl+'/devices/logicaldevices/'+$scope.$parent.deviceName+'/'+$scope.deviceID;
		$scope.canbeAssociated = canbeadded;
		$scope.associationMainHeading = deviceid;
		$scope.setSelectionButton = "normaView";
		$scope.headingAssociation = headingAssociation;
		$scope.headingAssociationTitle = headingAssociation;
		$scope.showSelectionDiv = canbeadded;
		setColumnHeader($scope,$scope.deviceID,$http,__env);
		console.log('Columns got is<' + $scope.cols);
		console.log('get_url===>>>' + get_url);
		$http.get(get_url).success(function(response,status,headers){
			console.log("Response got for query<"+$scope.deviceID +"> is<<"+response[$scope.deviceID])
			$scope.rows =response[$scope.deviceID];
			console.log('$scope.rows--responsedata==>>>>' + JSON.stringify($scope.rows));
			$scope.table_loader=false;
			$scope.spinsleft = false;
		}).catch(function (response) {
			// use field API to get columns names
			$scope.rows =[];
			$scope.table_loader=false;
			$scope.spinsleft = false;
		});
	}; // end of getAssociatedDeviceDetail
} //end controller logicaldevicescontroller_extendeed
]);


app.controller('FileSystemTypeSelectionController', ['$scope', '$http', '$uibModal', '$uibModalInstance', '$rootScope', '$location', '$window','dummyDeviceData','dummyq','dummyq1','dummyCreate', function($scope, $http, $uibModal, $uibModalInstance,$rootScope, $location, $window,dummyDeviceData,dummyq,dummyq1,dummyCreate) {
	$scope.ngShowModalFSFileType = true;
	console.log(dummyCreate);
	console.log(dummyq);
	console.log(dummyq1);

	$scope.dismissPopup = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.selectAccessType = function(type){
		console.log(type);
		//call to add api
		var post_url =__env.apiUrl+"/devices/filesystems/add";
		if(dummyCreate === 'otherdevices'){
			var paramObj={
				"name":dummyDeviceData,
				"accessType" : type,
				"path" : "",
				//"hostname":""
			};
		}
		else{
			var paramObj={
				"name":dummyDeviceData.name,
				"accessType" : type,
				"path" : ""
			};
		}

		console.log(JSON.stringify(paramObj));
		$http.post(post_url,paramObj).success(function(data){
			//$rootScope.relatedCountShowMark =true;
			console.log("success");
			console.log(data.id);
			$scope.PKIDFs = data.id;
			console.log($scope.PKIDFs);

           if(dummyCreate === 'otherdevices'){
			   /*var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$rootScope.PkidData;
			   var paramObj={
				   "devicetype":dummyDeviceData,
				   "devicename":$scope.PKIDFs
			   }

			   $http.post(post_url,paramObj).success(function(data){


				   alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);

				   $scope.table_loader=false;


				   var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+associationName;

				   var idtobeused = $scope.device_add.name;
				   if($scope.LowerOtherDeviceName === 'filesystems' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
					   idtobeused = $scope.device_add.PKID;
				   }
				   console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
				   $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
					   $scope.relatedCount = response.data;
					   //$scope.$parent.relatedCount = response.data;
					   setRelatedCounts($scope,response.data,$rootScope);
				   }).catch(function(response){
					   $scope.relatedCount = [];
					   //$scope.$parent.relatedCount = [];
				   });
				   console.log(  $scope.relatedCount );

				   console.log('get_url==>>>>' + get_url);
				   $http.get(get_url).success(function(response){
					   $rootScope.rows =response[associationName];
					   console.log('AssociationArray==>>>>' + JSON.stringify($rootScope.rows));

					   /!* column heading change starts*!/
					   $scope.cols = [];
					   var relateddevicename = associationName;

					   if ( associationName && associationName.toLowerCase() == "networks" ) {
						   relateddevicename = "logicalnetworks";
					   }
					   // code to get 2nd level string... so that  corresponding columns can be fetched
					   var remainingtitle = "";
					   var prefixcases = [{"key" : "child","display" : "Child" },{"key" : "parent", "display" : "Parent"},{"key" : "indirect" , "display" : "Indirect"}];
					   var found =  false;
					   for ( var j = 0 ; j < prefixcases.length ; j++  ) {
						   if ( associationName.startsWith(prefixcases[j].key) )  {
							   $scope.associateLowerTitle = prefixcases[j].display;
							   relateddevicename = associationName.substr(prefixcases[j].key.length );
							   var displayname  = $scope.deviceDisplayNames[relateddevicename];
							   if ( displayname  ) $scope.associateLowerTitle =  $scope.associateLowerTitle+" " + displayname;
							   found = true;
						   }
					   }
					   if (  found === false ) {
						   if ( $scope.headingAssociation && (relateddevicename.indexOf($scope.headingAssociation.toLowerCase()) > -1 ) && (relateddevicename.length > $scope.headingAssociation.length) ) {
							   relateddevicename = relateddevicename.substring($scope.headingAssociation.length);
							   var indexvalue = relateddevicename.indexOf("_");
							   if (  indexvalue != -1 ) {
								   var temp = relateddevicename.substring(0,indexvalue);
								   remainingtitle = relateddevicename.substring(indexvalue+1);
								   relateddevicename = temp;
							   }
						   }
						   $scope.associateLowerTitle = $scope.deviceDisplayNames[relateddevicename]+" "+remainingtitle;
						   if ( associationName.toLowerCase().startsWith("stakeholders") ) { // if stakeholders then always stakeholders has to be shown
							   relateddevicename = "stakeholders";
						   }
					   }
					   $scope.mainAssociationName = associationName;
					   if ( relateddevicename == "filesystemslogicaldevices"   ) {
						   $scope.cols = JSON.parse(headers()["customheaders"]);
						   $scope.associateLowerTitle = "Filesystems To Logical Devices";
					   } else if (   relateddevicename == "aliases" ) {
						   $scope.associateLowerTitle = "Aliases";
						   $scope.cols.push({"key":"aliasname","fieldname": "Aliases"});

					   } else {
						   if(relateddevicename == 'todevice'){
							   relateddevicename = 'componentstodevice';
						   }
						   console.log(__env.apiUrl+'/devices/fields/'+relateddevicename);
						   console.log('relateddevicename===>>>' + relateddevicename);

						   $http.get(__env.apiUrl+'/devices/fields/'+relateddevicename).then(function (response) {
							   $scope.currentfielddata = response.data.fields;
							   $scope.cols = [];
							   for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
								   if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
									   $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
								   }
							   }
							   if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("stakeholders") && $scope.mainAssociationName.length > 13 ) {
								   $scope.cols.push({"key":"entityname","fieldname": "Entity Name"});
							   }
							   if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("clusters") && $scope.mainAssociationName.length > 13 ) {
								   $scope.cols.push({"key":"resources","fieldname": "Resources"});
								   $scope.cols.push({"key":"devices","fieldname": "Devices"});
								   $scope.cols.push({"key":"services","fieldname": "Services"});
							   }
						   });
					   }
					   console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));

					   $scope.associateLowerTitle = $scope.deviceDisplayNames[$scope.associateLowerTitle] ? $scope.deviceDisplayNames[$scope.associateLowerTitle]  : $scope.associateLowerTitle;
					   /!* column heading change ends*!/

				   });


			   }).error(function(data){
				   console.log(data);
				   $scope.table_loader=false;
				   if(data.errorMessage){
					   $scope.newCompName = '';
					   alert(data.errorMessage+" "+ data.userAction);
				   }
			   });*/
			   $scope.addDevicesToLD(dummyDeviceData,dummyq,dummyq1,$scope.PKIDFs,'doneAdd');
		   }
			else{
			   $scope.addDevicesToLD(dummyDeviceData,dummyq,dummyq1,$scope.PKIDFs,'newAddFS');
		   }

			/*if ( associationName == "events"  ) {
			 console.log("data got is:"+JSON.stringify(data));
			 if ( data.id ) {
			 var post_url =__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.logicalDeviceData[$scope.currentIndex].name;
			 var paramObj={
			 "devicetype":q,
			 "devicename":data.id
			 };
			 $http.post(post_url,paramObj).success(function(data){
			 alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames['logicaldevices']);
			 $scope.table_loader=false;
			 console.log('associationName==>>>' + associationName);
			 var idtobeused = $scope.logicalDeviceData[$scope.currentIndex].name;
			 var get_url = __env.apiUrl+'/devices/logicaldevices/'+idtobeused+'/'+associationName;
			 $http.get(get_url).success(function(response){
			 $scope.rows =response[associationName];
			 getLogialDeviceRelatedData($scope,$http,__env);
			 console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
			 return;
			 }).catch(function(response){
			 alert("Assocaiton failed:"+data);
			 $scope.rows = [];
			 });

			 }).error(function(data){
			 console.log(data);
			 $scope.table_loader=false;
			 if(data.errorMessage){
			 alert(data.errorMessage+" "+ data.userAction);
			 } else {
			 alert("Create of events failed:"+data);
			 }
			 });
			 } else {// end of ID check
			 alert("<" +$scope.devToBeAssociated+ '> associated successfully with '+ $scope.deviceDisplayNames['logicaldevices']);
			 }
			 }

			 if ( associationName != "events"  ) {
			 alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames['logicaldevices']);
			 }
			 $scope.table_loader=false;
			 console.log('associationName==>>>' + associationName);
			 var idtobeused = $scope.logicalDeviceData[$scope.currentIndex].name;
			 var get_url = __env.apiUrl+'/devices/logicaldevices/'+idtobeused+'/'+associationName;
			 $http.get(get_url).success(function(response){
			 $scope.rows =response[associationName];
			 getLogialDeviceRelatedData($scope,$http,__env);
			 console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
			 }).catch(function(response){
			 $scope.rows = [];
			 });*/

		}).error(function(data){
			console.log(data);
			$scope.table_loader=false;
			if(data.errorMessage){
				alert(data.errorMessage+" "+ data.userAction);
			} else {
				alert("Assocaiton failed:"+data);
			}
		});
		//$scope.addDevicesToLD(dummyDeviceData,dummyq,dummyq1,dummyCreate,type);
		$uibModalInstance.close(dummyDeviceData,dummyq,dummyq1,dummyCreate,type);
	}



}
]);
