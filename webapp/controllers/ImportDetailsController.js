app.controller('importDetailsController', ['$scope','$http','$window','$routeParams','$rootScope','$location',function($scope, $http,$window,$routeParams,$rootScope,$location) {

	$scope.pageHeading = 'Import Data';
	$scope.table_loader=true;
	$scope.importType = $routeParams.importType.toLowerCase();
	$scope.importID = $routeParams.importID;
	$scope.importTitle = $routeParams.importTitle;
	$scope.indirectImport = false;
	$scope.showLogview = true;
	$scope.showFilter = true;
	$scope.indirectReqFields=[];
	$scope.importTypeURL = $scope.importType.split("-")[0];
	if($scope.importTypeURL =='componenttocomponents')
	{
		//$scope.importTypeURL ='componenttocomponents';
		$scope.importTypeURL ='components';
	}
	$scope.offset=($scope.offset) ? $scope.offset : 1;
	$scope.offsetPage = 400;

$scope.getLogicalView =function(name,pkid){
	//$http.get(__env.apiUrl+'/logicaldevices/'+name+'/rownum').then(function(response){

	if((pkid !=='' && pkid !==undefined) && ($scope.importTypeURL =='logicalnetworks' || $scope.importTypeURL == 'deviceinterfaces' || $scope.importTypeURL =='documents' || $scope.importTypeURL =='events' || $scope.importTypeURL == 'filesystems' || $scope.importTypeURL == 'filesystems' || $scope.importTypeURL == 'interfacegroups'))
	{
		$location.url('/otherDevices/'+$scope.importTypeURL+'/LIST/'+name+"/"+pkid+'/'+$scope.importType);
	}
	else
	{
				$http.get(__env.apiUrl+'/devices/'+$scope.importTypeURL+'/'+name+'/rownum').then(function(response){
					var rowNum = response['data']['ROWNUM'];
					if($scope.importTypeURL =='logicaldevices')
					{
					$location.url('/logicalDevices/LIST/'+rowNum+"/"+name+'/');
					//alert('/logicalDevices/LIST/'+rowNum+"/"+name+'/');
					}
					else
				 	{
						$location.url('/otherDevices/'+$scope.importTypeURL+'/LIST/'+rowNum+"/"+name+'/'+$scope.importTypeURL);
				 	}

				});
	}
}

$scope.navigateImportLog = function(){
		$location.url('/importLog'+'/'+$scope.importType+'/'+$scope.importID+'/'+$scope.importTitle);
	}

$http.get(__env.apiUrl+'/devices/fields/' +$scope.importType)
	.then(function (response) {
		console.log("Response got is:"+response);
		$scope.fieldKeyObj =response['data']['fields'];
		var arrfields = [];
		for (var key in $scope.fieldKeyObj) {
		arrfields[$scope.fieldKeyObj[key]['key']] = $scope.fieldKeyObj[key]['fieldname'];
		/*Start::Code to check indirect import*/
			if($scope.fieldKeyObj[key]['indirectimport'] == 1)
			{
				$scope.indirectImport = true;
				$scope.indirectReqFields.push({"key":$scope.fieldKeyObj[key]['key']});
			}
		}
		if($scope.indirectImport == 1 && $scope.importType.split("-")[0] == 'stakeholders')
		{
			$scope.indirectReqFields.push({"key":"jobtitle","fieldname":"Role","indirectimport":1,"maxlength":"50","minlength":"0","required":"","fieldtype":"text","dropdowntype":0,"group":"","datatype":"string","returntype":"showtouser","showinrelateddata":""});
			arrfields['jobtitle'] = 'Role';
		}

		arrfields["summary"] = "Summary";
/*hide log view and filter option*/
if($scope.indirectImport == true && $scope.importType !== 'filesystems-logicaldevices' && $scope.importType !== 'filesystems-filesystemschild'  && $scope.importTypeURL !=='events' && $scope.importType !=='logicalnetworks' && $scope.importType !=='componenttocomponents')
{
	$scope.showLogview = false;
	$scope.showFilter = false;
}
/*hide log view and filter option*/
		/*End::Code to check indirect import*/
				/*Code for displaying records and count*/
				//$http.get(__env.apiUrl+'/import/getall'+'/'+$routeParams.importID)
				$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
					.then(function (response) {
					window.console.log("success!");
				//$scope.responsedevice = 'logicaldevices';
				$scope.restData = response.data[$scope.importType];
				//$scope.totalrestDataCount = (response.data["totalCount"])? response.data["totalCount"]:response.data[$scope.importType].length;
				$scope.totalrestDataCount = response.data[$scope.importType].length;
				$scope.totalrestDataImported = response.data["totalCount"];
				/*if($scope.totalrestDataCount < $scope.totalrestDataImported)
				{
					$scope.offsetPage = $scope.totalrestDataCount;
				}*/
				//$scope.restData = response.data;
				/*$scope.recordImport = $scope.restData.length;
				$scope.recordUpdated = 0;
				$scope.recordCreated = 0;
				$scope.recordFiltered = 0;
				$scope.recordNotUpdated = 0;
				for(var i = 0; i < $scope.restData.length; ++i){
				if($scope.restData[i]["filter"] == 'CREATE')
				{
								$scope.recordCreated++;
				}
				if($scope.restData[i]["filter"] == 'UPDATE')
				{
								$scope.recordUpdated++;
				}
				if($scope.restData[i]["filter"] !== '')
				{
								$scope.recordFiltered++;
				}
				if($scope.restData[i]["filter"] == 'NO UPDATE')
				{
								$scope.recordNotUpdated++;
				}
				}
*/
				$scope.keys =  Object.keys($scope.restData[0]);
				$scope.tempkeys = [];
				for (var p in $scope.restData[0]) {
					if( $scope.restData[0].hasOwnProperty(p) ) {
					if ( p != "index" && p != "importid" && p != "filter" && p !="successflag" && p !="rownumber") {
							 $scope.tempkeys.push(p);
					 } else {
									console.log("not pushing :"+p);
						 }
					}
				}

				$scope.columnName = [];
					var indexcount = 0;
						for ( p in $scope.tempkeys ) {

							if(arrfields[$scope.tempkeys[indexcount]] !==undefined && arrfields[$scope.tempkeys[indexcount]] !=='')
							{
								$scope.columnName.push ({'key' : $scope.tempkeys[indexcount], 'name' :  arrfields[$scope.tempkeys[indexcount]]}) ;
							}else{  $scope.columnName.push ({'key' : $scope.tempkeys[indexcount], 'name' : $scope.tempkeys[indexcount]});}

								indexcount++;
							 }
 						 //alert(JSON.stringify($scope.columnName));
				$scope.currentRowIndex = 0;
					$scope.table_loader=false;

					if ( $scope.restData && $scope.restData.length > 0 ) {
									console.log( $scope.restData[0].name);
					}

					//console.log('$scope.restData.length===' + $scope.restData);
					var arrayLength = $scope.restData ? $scope.restData.length : 0 ;
					console.log('arrayLength===' + arrayLength);
					$scope.currentPage = 1; //current page
					$scope.maxSize = 5; //pagination max size
					$scope.entryLimit = 5; //max rows for data table
					$scope.itemsPerPage = 5;
					/* init pagination with $scope.list */
					$scope.noOfPages = Math.ceil(arrayLength/$scope.entryLimit);
					console.log("Noof pages got is:"+$scope.noOfPages);
					$scope.setPage = function(pageNo) {
						console.log("Inside setPage page no got is:"+pageNo);
						$scope.currentPage = pageNo;
					};
			}).catch(function (response) {
			    $scope.table_loader=false;
				console.log("Inside error case for getall<"+JSON.stringify(response));
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText );
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
			});
				/*Code for displaying records and count*/

	}).catch(function (response) {
		console.log("Inside error case");
		$scope.statusCode = response.status;
		$scope.statusText = (response.statusText );
		console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
	});

		$scope.openimporAction = function(){
				console.log('inside open import action');
				$scope.showimportaction = true;
				$scope.showimportfilteraction = false;
		};
		$scope.showimportfilterAction = function(){
				console.log('inside open import action');
				$scope.showimportaction = false;
				$scope.showimportfilteraction = true;
		};




$scope.commitFieldArr = [];
$scope.commitFieldChange = function(commitName,commitRowData,indirectImport){
$scope.toggleFlag = false;
var nameID = $scope.getUniqueName(commitName,commitRowData);
//angular.element(document.getElementById('commit_AAAIMPORT1_EXCEL')).disabled = true;
/*if(indirectImport =='undefined' && $scope.importType !=='logicalnetworks')
{
	alert('Individual record commit not allowed, Please toggle and commit records!');
	document.getElementById('commit_'+commitName).checked=false;
	return false;
}*/
	var addToArray=true;
	var remIndex = '';
	for(var i=0;i<$scope.commitFieldArr.length;i++){
  //  if($scope.commitFieldArr[i].name === commitName){
	if($scope.commitFieldArr[i].nameID === nameID){
			remIndex = i;
			addToArray = false;
    }
	}
	if($scope.indirectImport)
	{
		if(addToArray){
		var obj={};
		for(var i = 0;i<$scope.indirectReqFields.length;i++)
		{
			if(commitRowData[$scope.indirectReqFields[i]['key']])
		   {
				 obj[$scope.indirectReqFields[i]['key']] = commitRowData[$scope.indirectReqFields[i]['key']].trim();
		   }
			 else{
				 obj[$scope.indirectReqFields[i]['key']] = "";
		   }
			 obj['nameID'] = nameID;
		}
		$scope.commitFieldArr.push(obj);

	}
	else{$scope.commitFieldArr.splice(remIndex,1);}
}
	else if(!$scope.indirectImport)
	{
		if(addToArray)
		{
			$scope.commitFieldArr.push({"nameID":commitName});
		}
		else{
			$scope.commitFieldArr.splice(remIndex,1);
		}
	}
}
/*Commit all action code*/
$scope.commitAll = function()
{
	$scope.table_loader=true;
	$http.post(__env.apiUrl+'/importall/'+$scope.importType+'/commitall/'+$scope.importID)
	.success(function (response) {
		alert('Successfully commited all record(s) for import ID '+$scope.importID+' ');
		/*Get API call to refresh data after commit*/
				//$http.get(__env.apiUrl+'/import/getall/'+$routeParams.importID)
				$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
				.then(function (response) {
					$scope.restData = response.data[$scope.importType];
				})
		/*Get API call to refresh data after commit*/
		$scope.table_loader=false;
	})
	.error(function (response) {
		//alert("Commit error occurred while updating import ID < "+$routeParams.importID+". "+response.status);
		alert(response.errorMessage+' , '+response.userAction);
		$scope.table_loader=false;
	});
}
/*Commit all action code*/

$scope.commitField = function()
{
	if($scope.commitFieldArr.length > 0)
	{
		if($scope.toggleFlag && !$scope.filterFlag)
		{
			$scope.commitAll();
		}
		else
		{
		//alert(JSON.stringify($scope.commitFieldArr));
		/*Call to Commit API*/
		$scope.table_loader=true;
		  //var post_url = __env.apiUrl+"/import/commit/"+$scope.importID;
			if($scope.indirectImport)
			{
				 var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commitcommon/"+$scope.importID;
				 var postData = '{"recordcommit" :"true","records":'+JSON.stringify($scope.commitFieldArr).replace(/"nameID[^,}]+,/g,'')+'}';
			}else{
				var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commit/"+$scope.importID;
				var postData = '{"recordcommit" :true,"records":'+JSON.stringify($scope.commitFieldArr).replace(/nameID/g,'name')+'}';
		}
		var config = {
			headers : {'Content-Type': 'application/json',}
		}

		$http.post(post_url, postData, config)
			.success(function (data, status, headers, config) {
				$scope.commitFieldArr = [];
				$scope.table_loader=false;
				console.log('Commit data===' + JSON.stringify(data));
				/*Get API call to refresh data after commit*/
						//$http.get(__env.apiUrl+'/import/getall/'+$routeParams.importID)
						$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
						.then(function (response) {
							$scope.restData = response.data[$scope.importType];
						})
				/*Get API call to refresh data after commit*/
				/*for(var i=0;i<$scope.commitFieldArr.length;i++){

					angular.element(document.getElementById('commit_'+$scope.commitFieldArr[i].name)).disabled = true;
				}*/
				alert('Successfully commited selected record(s) for import ID '+$scope.importID+' ');

			})
			.error(function (response,data, status, headers, config) {
				//alert("Commit error occurred while updating import ID < "+$scope.importID+" >< "+status+" > ");
				//alert(JSON.stringify(response));
				alert(response.errorMessage+' , '+response.userAction);
			});
		/*Call to Commit API*/
	}
}
	else{alert('No records to commit!');}
}


/*Filter actions from API*/
if($scope.indirectImport == false || $scope.importType =='logicalnetworks' || $scope.importType =='componenttocomponents')
{
//$http.get(__env.apiUrl+'/import/filters/'+$routeParams.importID).then(function(response){
  $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/filters/'+$routeParams.importID).then(function(response){
	$scope.filteractions =  response.data;
	//$scope.filteractions =  [{"filter":"CREATE"},{"filter":"UPDATE"},{"filter":"None"}];
	//alert($scope.filteractions);
})
}
/*Filter actions from API*/

$scope.filterBy_UPDATE = function()
{
	$scope.table_loader=true;
	//$http.get(__env.apiUrl+'/import/getall/'+$routeParams.importID)
	$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
	.then(function (response) {
		//$scope.restData =  response.data["logicaldevices"];
		$scope.restData =  response.data[$scope.importType];
		$scope.resTempData = [];
	for(var i = 0; i < $scope.restData.length; i++) {
	  if ($scope.restData[i].filter =='UPDATE') {
				$scope.resTempData.push($scope.restData[i]);
			}
  }
	$scope.restData=[];
	 $scope.restData = JSON.parse(JSON.stringify($scope.resTempData));
	 $scope.table_loader=false;
}
)}

$scope.filterByObj = [];
$scope.filterBy= function(fltBy)
{
	$scope.filterFlag = true;
	$("#sortMenu").addClass('open');
	$scope.table_loader=true;
  if($scope.filterByObj.indexOf(fltBy) !== -1){
 		$scope.filterByObj.splice($scope.filterByObj.indexOf(fltBy),1);
 	}else
 	{
 		$scope.filterByObj.push(fltBy);
 	}

	$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
	.then(function (response) {
		//$scope.restData =  response.data["logicaldevices"];
		$scope.restData =  response.data[$scope.importType];
		$scope.resTempData = [];
		for(var i = 0; i < $scope.restData.length; i++)
		{
			for(var j = 0; j < $scope.filterByObj.length; j++)
			{
			if ($scope.restData[i].filterTL == $scope.filterByObj[j] && fltBy !=='None') {
				$scope.resTempData.push($scope.restData[i]);
				console.log($scope.filterByObj[j]);
			}
			else if (fltBy =='None') {
				$scope.resTempData.push($scope.restData[i]);
			}
		}
  	}
	 $scope.restData = JSON.parse(JSON.stringify($scope.resTempData));
	  $scope.table_loader=false;
	 //alert(JSON.stringify($scope.restData));
}
)
}
/*Filter record code here*/
/*Function to create unique name for both direct and indirect import case*/
$scope.getUniqueName=function(commitName,commitRowData)
{	var tempName = '';
	if($scope.indirectImport && $scope.indirectImport !='undefined')
	{
		for(var i = 0;i<$scope.indirectReqFields.length;i++)
		{
			tempName= tempName+'_'+commitRowData[$scope.indirectReqFields[i].key];
		}
		return commitName+'_'+tempName;
	}
	else{return commitName;}

}
/*Function to create unique name for both direct and indirect import case*/
/*toggle Records*/
$scope.toggleRecords = function()
{
for(var i=0;i<$scope.restData.length;i++){
	//var currentElement = document.getElementById('commit_'+$scope.restData[i].name);
	var currentElement = document.getElementById('commit_'+$scope.getUniqueName($scope.restData[i].name,$scope.restData[i]));
	if(currentElement && currentElement.checked && currentElement.disabled == false){
		currentElement.checked = false;
	}else if(currentElement) {
			currentElement.checked = true;
	}
	if(currentElement && currentElement.disabled == false)
	{
	$scope.commitFieldChange($scope.restData[i].name,$scope.restData[i],$scope.indirectImport);
	}
}
  $scope.toggleFlag = true; //flag for offset page, toggle commit;
}
/*toggle Records*/
/*Export Log records*/
	$scope.exportLDLogXLS = function(){

					//$http.get(__env.apiUrl+'/import/getall/'+$scope.importID).then(function (response) {
					$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString()).then(function (response) {
							console.log('response.data===' +JSON.stringify(response.data));
							console.log('response.data[$scope.importType]===' + JSON.stringify(response.data[$scope.importType]));
							//$scope.items = response.data["logicaldevices"];
							$scope.items = response.data[$scope.importType];
							$scope.items = JSON.stringify($scope.items).replace(/null/g, '""');
							$scope.items2 = JSON.parse($scope.items);
							console.log('$scope.items===' +JSON.stringify($scope.items));
							var filename = $scope.importType + '.xlsx';
							//alasql('SELECT * INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items]);
							/*alasql('SELECT [name] AS [Name],[backupmethod] AS [Backup Method],[backupoffsitelocation] AS [Backup Offsite Location],[backupschedule] AS [Backup Schedule],[description] AS [Description],[devicetype] AS [Device Type],[discoverystatus] AS [Discovery Status],[drphysicalserver] AS [DR Physical Server],[drprocess] AS [DR Process],[drrequired] AS [DR Required],[environment] AS [Environment],[inscope] AS [In Scope],[isvirtual] AS [IS Virtual],[logicalcpu] AS [Logical CPU],[logicaldevicehost] AS [Logical Device Host],[memory] AS [Memory],[migrationapproach] AS [Migration Approach],[monitoringsystem] AS [Monitoring System],[os] AS [OS],[osversion] AS [OS Version],[osarchitecture] AS [OS Architecture],[ospatchlevel] AS [OS Patchlevel],[role] AS [Role],[status] AS [Status],[windowsdomain] AS [Windows Domain],[hosttype] AS [Host Type],[sites] AS [Sites],[customattributes] AS [Custom Attributes],[filter] AS [Summary],[commit] AS [Commit],[commited] AS [Commited] INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items]);*/
						 alasql('SELECT * INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items2]);
					})
			}
	/*Export Log Records*/

angular.element($window).bind("scroll", function(e) {
		var totalScrollPage =Math.ceil($scope.totalrestDataCount/$scope.offsetPage);
		if(angular.element(document.querySelector('#slide-wrap'))[0])
		{
		var totalHeight = angular.element(document.querySelector('#slide-wrap'))[0].offsetHeight;
		}
		else{var totalHeight = 1200;}
		window.console.log(totalHeight);
		$scope.posY = this.pageYOffset;

		//var actionHeight = Math.ceil($scope.offset * (totalHeight/totalScrollPage));
		var downActionHeight = totalHeight-1200;
		var upActionHeight = 200;
		if(this.pageYOffset == 0 && $scope.offset !==1)
		{
			window.console.log('User Requested first page:'+$scope.posY);
			$scope.offset = 1;
			$scope.scrollAction();
		}
		else if($scope.posY > downActionHeight && !$scope.pendingRequest && $scope.totalrestDataCount >= $scope.offset*$scope.offsetPage && $scope.totalrestDataCount !=0)
		{
		 $window.scrollTo(0, 500);
			$scope.offset = $scope.offset+1;
			$scope.scrollAction();
		}
		else if($scope.posY < upActionHeight && !$scope.pendingRequest && $scope.offset != 1){
			$scope.offset = $scope.offset-1;
			$scope.scrollAction();
		}

	});

	$scope.scrollAction = function()
	{
		$scope.pendingRequest= true;
	/*  if(angular.element(document.querySelector('#slide-wrap'))[0])
		{
		angular.element(document.querySelector('#slide-wrap'))[0].style.cursor = "wait";
		}
	*/

		document.getElementById("waiting_overlay").style.display = "block";
		$http.get(__env.apiUrl+'/importall/'+$scope.importType+'/getall/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
			.then(function (response) {
			document.getElementById("waiting_overlay").style.display = "none";
			//angular.extend($scope.restData, response.data["importfielddetails"]);

			if(response.data[$scope.importType].length > 0)
			{
				//$scope.restData = response.data["importfielddetails"];
				$scope.restData = response.data[$scope.importType];

			}
			if($scope.offset ==1)
			{
				$window.scrollTo(0, 0);
			}else{$window.scrollTo(0, 500);}

			$scope.pendingRequest= false;
			$scope.lastPosY = $scope.posY;
		})
		.catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText );
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		});
	}
}]);
