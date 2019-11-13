'use strict';

/**
 * @ngdoc function
 * @name testingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the testingApp
 */
var app = angular.module('landingApp2', ['ngRoute','ngCookies','angularUtils.directives.dirPagination','ngFileUpload','ui.bootstrap','720kb.datepicker','ng-ip-address','ui']);
// Register environment in AngularJS as constant
app.constant('__env', env);
function disableLogging($logProvider, __env){
	$logProvider.debugEnabled(__env.enableDebug);
}
// Inject dependencies
disableLogging.$inject = ['$logProvider', '__env'];
app.config(disableLogging);



app.controller('landingController2',['$log','$location','$scope','$http','__env', '$uibModal','$timeout','$rootScope', function($log,$location,$scope,$http,__env,$uibModal,$timeout,$rootScope) {
	$scope.urlProtocol = window.location.protocol;
	console.log("Inside landingController2 getting environment values<"+__env.apiUrl+":"+$scope.urlProtocol +">");
	$scope.customer = {
		custname: 'Naomi',
		custaddress: '1600 Amphitheatre'
	};
	$scope.openautoload =function(){
		$location.url('/autoload');
	}
	$scope.getCognoServerURL = function(item){

		if(typeof __env.storeIds[item] == undefined){
			return  "";
		}
		return __env.IPofCognosServer.replace("{{storeId}}", __env.storeIds[item]);

	};

	$scope.showListView = function(objid,index){
		$log.log("Inside openListView for objid<"+objid+">and index <"+index+">");
		$location.url("/logicalDeviceListView/"+objid+"/"+index);
	}

	var exportoptions = {
		headers:true,
		separator:","
	}
	$scope.showFirstLogicaldevice = function(urlto,objid,index){
		$log.log("Inside openLogical Device  for objid<"+urlto+":"+objid+">and index <"+index+">");
		console.log("Inside openLogical Device  for objid<"+urlto+":"+objid+">and index <"+index+">");
		if ( objid!='LogicalDevices' ) {
			$location.url("/otherDevices/"+objid);
		} else {
			$location.url(urlto);
		}
	}
	$scope.showFirstOtherdevice =function(urlto,objid,index){
		$location.url(urlto+"/"+objid);
	}
	$scope.logout = function() {

		// reset login status
		$location.url("/logout");
	}

	$scope.navigateHome = function(){
		$location.url('/index')
	}

	$scope.navigateCustAtt = function(){
		$location.url('/custom_attribute');
	}
	$scope.navigateMarkDeletion = function(){
		$location.url('/markForDeletion');
	}
	$scope.navigateReview = function(){
		$location.url('/markforReview');
	}

	$scope.navigateHeatMap = function(){
		$location.url('/custom_attribute/heatmap/')
	}

	$scope.navigateFramework = function(){
		$location.url('/framework');
	}


	$scope.navigateimport = function(){
		$location.url('/importJobList');
	}

	$scope.navigateAddLg = function(devicetype){
		if ( devicetype == "LogicalDevices" ) {
			$location.url('/addlogicalDevices');
		} else {
			$location.url('/addotherDevices/'+devicetype);
		}
	}
	$scope.imageArray = [
		{'imagename':'img/logicalDevices.png'},
		{'imagename':'img/services.png'},
		{'imagename':'img/components.png'},
		{'imagename':'img/PhysicalDevices.png'},
		{'imagename':'img/LogicalNetwork.png'},
		{'imagename':'img/cluster.png'},
		{'imagename':'img/FileSystems.png'},
		{'imagename':'img/DeviceInterface.png'},
		{'imagename':'img/interfaceGroup.png'},
		{'imagename':'img/Stakeholders.png'},
		{'imagename':'img/documents.png'},
		{'imagename':'img/events.png'},
		{'imagename':'img/componenttocomponents.png'}
	];
	$scope.statusCode = 200;
	$scope.statusText = "";
	$scope.logicalDeviceCount = 0;
	console.log("Image array is :"+$scope.imageArray[0].imagename);
	var urlCall =__env.apiUrl+"/devices/count";
	$http.get(urlCall)
		.then(function (response) {
			console.log("Response got is:"+response);

			$scope.relatedVersions =response['data']['result'];
			$scope.logicalDeviceCount = $scope.relatedVersions[0].count;
			var urlCall =__env.apiUrl+"/devices/displaynames";
			$http.get(urlCall).then(function (response) {
				$scope.deviceDisplayNames =response['data'];
				console.log(JSON.stringify($scope.deviceDisplayNames));
				for ( var inner = 0; inner < $scope.relatedVersions.length; inner++ ) {
					$scope.relatedVersions[inner].displayname = $scope.deviceDisplayNames[$scope.relatedVersions[inner].id.toLowerCase()];
				}
			});


		}).catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText );
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		});

	urlCall =__env.apiUrl+"/devices/releasedetails";
	$http.get(urlCall)
	.then(function (response) {
		console.log("Response got is:"+JSON.stringify(response));
		$scope.releaseData = response["data"];
	}).catch(function (response) {
		console.log("Inside error case");
		$scope.statusCode = response.status;
		$scope.statusText = (response.statusText );
		console.log("Error received while retreiving release data:"+JSON.stringify(response));
	});

	/*Import key and display name api call use*/
	var urlCall2 =__env.apiUrl+"/devices/countcommon";
	$http.get(urlCall2)
		.then(function (response) {
			console.log("Response got is countcommon:"+response);
			$scope.getCountCommon=response['data'];
			$scope.getCountCommonDisplayNames ={};
			for ( var inner = 0; inner < $scope.getCountCommon.length; inner++ ) {
				$scope.getCountCommonDisplayNames[$scope.getCountCommon[inner].id.toLowerCase()] = $scope.getCountCommon[inner].displayname;
			}
		}).catch(function (response) {
			console.log("Inside error case");
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText );
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
		});
	/*Import key and display name api call use*/
	$scope.openexportstab = function(){
		console.log('inside open exports');
		$scope.showexptab = true;
		$scope.showcustatt = false;
		$scope.showimporttab = false;
		$scope.showreport =false;
	};
	/*Start::Defect21651*/
	$scope.openimporttab = function(){
		console.log('inside open Import');
		$scope.showimporttab = true;
		$scope.showexptab = false;
		$scope.showcustatt = false;
		$scope.showreport =false;
	};
	/*End::Defect21651*/
	$scope.opencustatt = function(){
		console.log('inside cust att');
		$scope.showexptab = false;
		$scope.showcustatt = true;
		$scope.showimporttab = false;
		$scope.showreport =false;
	};
	$scope.openreport = function(){
		//alert("f");
		console.log('inside report att');
		$scope.showexptab = false;
		$scope.showcustatt = false;
		$scope.showimporttab = false;
		$scope.showreport =true;
		//alert("h"+$scope.showcustatt+$scope.showreport);
	};


	/* $scope.openlogDevicexls = function(deviceType,format){
	 console.log('inside open log device');
	 console.log('deviceType===' + deviceType);
	 console.log('format===' + format);
	 $scope.showdropdownlogDevices = true;
	 $scope.showexptab= true;
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

	 }*/
	$scope.ShowCounts = function(){
		console.log('inside countss');
		var count_url = __env.apiUrl+'/devices/admin/count';
		$http.get(count_url)
			.then(function (response) {
				$scope.CountsData = response.data;
				console.log('count data====' +JSON.stringify($scope.CountsData));
				$uibModal.open({
					animation: $scope.animationsEnabled,
					templateUrl: 'DevicesCount.html',
					controller: 'DevCountController',
					size: 'lg',
					windowClass: 'app-modal-window-selectpro',
					resolve: {
						CountData: function(){
							return $scope.CountsData;
						}
					}
				});
			})
			.catch(function(response){
				alert('failure')
				console.log(response);

			});
	}

	$scope.generateKeys = function(){
      $location.url('/keygen');
	};

	$scope.showKeys = function(){
		$location.url('/showKeys')
	}

	/* Indirect Export starts*/
	$scope.ExportIndirect = function(devType , format){
		console.log(devType,format);
		$scope.filename = devType + '.' +format;
		var exportFormat = format.toUpperCase();
		console.log($scope.filename);
		console.log(__env.apiUrl+'/devices/export/'+devType);
		$http.get(__env.apiUrl+'/devices/export/'+devType).then(function (response) {
			$scope.IndirectExportData = response.data;
			console.log(JSON.stringify($scope.IndirectExportData));
			console.log(exportFormat);
			console.log($scope.filename);
			alasql('SELECT * INTO '+exportFormat+'("'+ $scope.filename+'", ?) FROM ?',[exportoptions,$scope.IndirectExportData]);
			//alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
		});
	}
	/* Indirect Export ends*/

	/* reports export starts*/
	$scope.ExportReports = function(name,orphandev,compreport,format,reportName){
		console.log(name);
		console.log(orphandev);
		console.log(compreport);
		console.log(format);
		var exportFormat = format.toUpperCase()
		$scope.filename = reportName + '.' +format;
		var reportUrl = __env.apiUrl+'/devices/servicesldpdabborphanreports?names='+name+'&orphandev='+orphandev+'&comprreports='+compreport+''
		$http.get(reportUrl).then(function (response) {
			$scope.ReportExportData = response.data;
			console.log(JSON.stringify($scope.ReportExportData));
			console.log(exportFormat);
			console.log($scope.filename);
			alasql('SELECT * INTO '+exportFormat+'("'+ $scope.filename+'", ?) FROM ?',[exportoptions,$scope.ReportExportData]);
			//alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
		});

	}
	/* reports export ends*/
	$scope.openlogDevice = function(deviceType,format){
		//console.log('inside open log device');
		//console.log('deviceType===' + deviceType);
		//console.log('format===' + format);
		$scope.showdropdownlogDevices = true;
		$scope.showexptab= true;
		/* check if user preference is set or not*/
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
				//console.log('$scope.devicetype==>>>>' +$scope.devicetype);
				//console.log('$scope.getData user pref===>' + JSON.stringify($scope.getData));
				$scope.getColumnData = $scope.getData[deviceType];
				//console.log('$scope.getColumnData===>>>>' + JSON.stringify($scope.getColumnData));
				if($scope.getColumnData == undefined){
					//alert('no user pref set , show dialogue box');
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
				} else {
					$scope.table_loader=true;
					//alert('export the user selected fields');
					$scope.headerArray = [];
					/* cmt-977 changes strat*/
					console.log('getall url-->' +__env.apiUrl+'/devices/getall/'+deviceType);
					$http.get(__env.apiUrl+'/devices/'+deviceType+'/getall').then(function (response) {
						//console.log('response.data===>>>>' + JSON.stringify(response.data));
						$scope.exportLgData = response.data;
						//console.log('$scope.exportLgData123=====' +JSON.stringify($scope.exportLgData));
						//console.log('$scope.getColumnData===>>>>' + JSON.stringify($scope.getColumnData.fields));
						$scope.headerArrayBefore = $scope.getColumnData.fields;
						/* removing fields in export for which returntype is not "showtouser"*/
						for(var i=0;i<$scope.headerArrayBefore.length;i++){
							var fieldDetails = $scope.headerArrayBefore[i];
							if (fieldDetails.returntype && (fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
								$scope.headerArray.push($scope.headerArrayBefore[i]);
							}
						}
						//console.log('$scope.headerArray===>>>>' +JSON.stringify($scope.headerArray));
						/* removal code changes ends*/
						/* export user selected fields starts*/
						$scope.selectArray = [];
						$scope.ArrayToBeExported = [];
						for(var j=0;j<$scope.headerArray.length;j++){
							$scope.selectArray.push($scope.headerArray[j].key);
						}
						for(var i=0;i<$scope.exportLgData.length;i++){
							var objExport = {};
							for(var j=0;j<$scope.selectArray.length;j++){
								var selectKey = $scope.selectArray[j];
								var selectkey2 = $scope.exportLgData[i][selectKey];
								objExport[selectKey] = selectkey2;
							}
							$scope.ArrayToBeExported.push(objExport);
							//console.log('$scope.ArrayToBeExported====' + JSON.stringify($scope.ArrayToBeExported));
						}
						$scope.filename = deviceType + '.' +format;
						$scope.FinalArrayToExport = [];
						//console.log('filename====' + $scope.filename);

						$scope.modifedHeaderArray = [];
						//console.log('$scope.selectArray==>>>>' +JSON.stringify($scope.selectArray));
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
						//console.log('$scope.modifedHeaderArray===' +JSON.stringify($scope.modifedHeaderArray));
						//console.log('$scope.headerArray===' +JSON.stringify($scope.headerArray));
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
						var mystyle = {
							headers:true,
							separator:","
						}
						var formatType = format.toUpperCase();

						console.log('FinalArrayExportedin csv/excel is===>>>>' + JSON.stringify($scope.ArrayToBeExported));

						alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
						$scope.table_loader=false;
					});
					/*cmt-977 changes ends*/

					//alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", {headers:true,separator:","}) FROM ?',[$scope.ArrayToBeExported]);

					/* export user selcted fields ends*/
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
					/*$scope.getData ={};
					 $scope.tempkeys1 = [];
					 $scope.getData[deviceType] = $scope.getFieldResponse;
					 $scope.getColumnData = $scope.getData[deviceType];
					 //console.log('$scope.getData[$scope.devicetype].fields.lengt===' +JSON.stringify($scope.getData));
					 for(var i=0;i<$scope.getData[deviceType].fields.length;i++){
					 var fieldDetails = $scope.getData[deviceType].fields[i];
					 if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
					 $scope.tempkeys1.push($scope.getData[deviceType].fields[i].key);
					 }
					 }*/
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
				//console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				//Dummy data in case of error
			});
		/* code change ends*/


	}
	$scope.exportLDCsv = function(devicetype,type){
		$scope.table_loader=true;
		$scope.ArrayToBeExported = [];
		//alert('inside export LD function' + devicetype);
		console.log('devicetype===' + devicetype);
		$scope.filename = devicetype + '.' +type;
		$scope.resType = type.toUpperCase();
		console.log('$scope.resType==>>>' +$scope.resType);
		console.log('getall url-->' +__env.apiUrl+'/devices/'+deviceType+'/getall');
		$http.get(__env.apiUrl+'/devices/getall/'+devicetype).then(function (response) {
			console.log('response.data===' +JSON.stringify(response.data));
			console.log('response.data[devicetype]===' + JSON.stringify(response.data[devicetype]));
			$scope.items = response.data[devicetype];
			console.log('$scope.items===' +JSON.stringify($scope.items));
			$http.get(__env.apiUrl+'/devices/fields/' +devicetype).then(function (response) {
				$scope.table_loader=false;
				//console.log('response.data===' +JSON.stringify(response.data));
				$scope.headerArray = response.data.fields;
				$scope.tempstr = "";
				//console.log('$scope.headerArray==>>>>' + JSON.stringify($scope.headerArray));
				/* change Exported file headers to Readable Name  instead of keys code starts*/
				/*for(var i=0;i<$scope.items.length;i++){
				 var objExport = {};
				 for(var j=0;j<$scope.headerArray.length;j++){
				 Object.keys($scope.items[i]).forEach(function(key) {
				 if($scope.items[i].hasOwnProperty($scope.headerArray[j].key)) {
				 var selectKey = $scope.headerArray[j].key;
				 var selectKey3 = $scope.headerArray[j].fieldname;
				 var selectkey22 = $scope.items[i][selectKey];
				 objExport[selectKey3] = selectkey22;
				 }
				 })

				 }
				 $scope.ArrayToBeExported.push(objExport);

				 }*/

				for(var i=0;i<$scope.headerArray.length;i++) {
					if ( i < $scope.headerArray.length-1 ) {
						$scope.tempstr += "["+$scope.headerArray[i].key +"] as [" + $scope.headerArray[i].fieldname +"]," ;
					} else {
						$scope.tempstr += "["+$scope.headerArray[i].key +"] as [" + $scope.headerArray[i].fieldname +"]";
					}
				}


				alasql('SELECT '+$scope.tempstr+' INTO '+$scope.resType+'("'+ $scope.filename+'", ?) FROM ?',[exportoptions,$scope.items]);

			});
			//$timeout($scope.FinalCsvExport, 4000);
			/*change Exported file headers to Readable Name  instead of keys code ends*/
		})
	}


	$scope.FinalCsvExport = function(){
		//console.log('$scope.ArrayToBeExported====' + JSON.stringify($scope.ArrayToBeExported));

		alasql('SELECT * INTO CSV("'+ $scope.filename+'", ?) FROM ?',[exportoptions,$scope.ArrayToBeExported]);
		$scope.table_loader=false;
	}

	$scope.generateTMExcel = function(){
		console.log('generate excel for TM');
		console.log(JSON.stringify($scope.deviceDisplayNames));
		$uibModal.open({
			animation: $scope.animationsEnabled,
			templateUrl: 'transactionManager.html',
			controller: 'transactionManagerController',
			size: 'lg',
			windowClass: 'app-modal-window-selectpro',
			resolve: {
				DisplayNameData: function(){
					return $scope.deviceDisplayNames;
				}
			}
		});
	}
	/*Start::Defect21651*/
	/*Import functionality*/


	$scope.import_LD = function(import_type,bySerial) {
	$scope.indirectImport = false;
		if(!(import_type))
		{
			$scope.errorMsg = "Import IDs not loaded, please try after few seconds!";
			document.getElementById('Modal_importError').style.display = "block";
		}
		else{
			$scope.importDisplayName = $scope.getCountCommonDisplayNames[import_type];
			document.getElementById('Modal_import').style.display = "block";
			$scope.import_type=import_type.toLowerCase();
			if(bySerial){$scope.import_type_bySerial=true;$scope.bySerialTxt = 'by Serial No.';}else{$scope.import_type_bySerial=false;$scope.bySerialTxt = '';}
		}
	}

	$scope.close_Modal = function(modalID)
	{
		if($scope.table_loader)
		{
			$scope.table_loader=false;
		}
		if(document.getElementById("import_now")){
			document.getElementById("import_now").disabled = false;
		}

		document.getElementById(modalID).style.display = "none";

	}
	$scope.importTrue = function()
	{
		document.getElementById('Modal_import').style.display = "none";
		document.getElementById("importfile").click();
	}
	$scope.importFileSelect=function($fileContent){
		$scope.tabCount = $fileContent.length;
		$scope.wbObj = [];
		if($scope.tabCount > 1)
		{
			//var Object.keys($scope.fileContent[0]['sheetContent'][0]);
			for(var i=0;i< $scope.tabCount;i++)
			{
				$scope.wbObj.push({"wbIndex":i,"wbTitle":$fileContent[i]['sheet'],"wbContent":$fileContent[i]['sheetContent']});
			}
			document.getElementById('Modal_tabSelection').style.display = "block";
		}
		else {
			$scope.importFileChange($fileContent[0]['sheetContent']);
		}
	}
	//$scope.importFileChange = function($fileContent){
	$scope.importFileChange = function(fileContentObj){
		if(document.getElementById('Modal_tabSelection').style.display !== "none")
		{
			$scope.close_Modal('Modal_tabSelection');
		}
		$scope.fieldKeyStr='';
		$scope.errorMsg="";
		$scope.table_loader=true;
		//$scope.fileContent = $scope.validateFileContent($fileContent);
		$scope.fileContent = fileContentObj;

		var filePath = document.getElementById("importfile").value;
		var fileExt = filePath.split('.').pop();
		$scope.fileExt = fileExt;
		$scope.fileName = filePath.split(/(\\|\/)/g).pop();
		$scope.fileContentValuesArr = $scope.validateFileContent($scope.fileContent);
		//  alert(fileName);return false;

		/*$scope.keywordObj =[
		 {"key":"name","keywords":"name,Device,Name"},
		 {"key":"backupmethod","keywords":"backupmethod,Backup,Method"},
		 {"key":"backupoffsitelocation","keywords":"backupoffsitelocation,Backup,Offsite,Location"},
		 {"key":"backupschedule","keywords":"backupschedule,Backup,Schedule"},
		 {"key":"description","keywords":"description,Description"},
		 {"key":"devicetype","keywords":"devicetype,Device,Type"},
		 {"key":"discoverystatus","keywords":"discoverystatus,Discovery,Status"},
		 {"key":"drphysicalserver","keywords":"drphysicalserver,DR,Physical,Server"},
		 {"key":"drprocess","keywords":"drprocess,DR,Process"},
		 {"key":"drrequired","keywords":"drrequired,DR,Required"},
		 {"key":"environment","keywords":"environment,Environment"},
		 {"key":"inscope","keywords":"inscope,In,Scope"},
		 {"key":"isvirtual","keywords":"isvirtual,Is,Virtual"},
		 {"key":"logicalcpu","keywords":"logicalcpu,Logical,CPU"},
		 {"key":"logicaldevicehost","keywords":"logicaldevicehost,logical,Device,Host"},
		 {"key":"memory","keywords":"memory,Memory"},
		 {"key":"migrationapproach","keywords":"migrationapproach,Migration,Approach"},
		 {"key":"monitoringsystem","keywords":"monitoringsystem,Monitoring System,Monitoring Systems,Monitoring"},
		 {"key":"os","keywords":"os,OS"},
		 {"key":"osversion","keywords":"osversion,OS,Version"},
		 {"key":"osarchitecture","keywords":"osarchitecture,OS,Architecture"},
		 {"key":"ospatchlevel","keywords":"ospatchlevel,OS,Patch,Level"},
		 {"key":"role","keywords":"role,Role"},
		 {"key":"status","keywords":"status,Status"},
		 {"key":"windowsdomain","keywords":"windowsdomain,Windows,Domain"},
		 {"key":"hosttype","keywords":"hosttype,Host,Type"},
		 {"key":"sites","keywords":"sites,SITES"},
		 {"key":"notes","keywords":"notes,Notes"},
		 {"key":"customattributes","keywords":"customattributes,Custom,Attributes"}
		 ]
		 ;*/
		$scope.postarr=[];
		$scope.pparray =
		{
			"importdetails":
			{
				"jobDetail": $scope.import_type,
				"source": $scope.fileName,
				"submittedDate": Date(),
				"completedDate": Date(),
				"timeTaken": "",
				"userName": $scope.globals.currentUser.username,
				"modifiedBy": $scope.globals.currentUser.username,
				"jobType": $scope.import_type,
				"jobStatus": "",
				"bySerial":$scope.import_type_bySerial
			}
		};
		var urlCall =__env.apiUrl+"/devices/fields/"+$scope.import_type.toLowerCase();
		$http.get(urlCall)
			.then(function (response) {
				console.log("Response got is:"+response);
				$scope.csvfieldObj=[];
				$scope.fieldKeyArr_Res =response['data']['fields'];
				/*Removing additional keys sent by field API*/
				$scope.fieldKeyArr = [];
				for(var i=0; i < $scope.fieldKeyArr_Res.length;i++)
				{
					/*Start::Code to check indirect import*/
					if($scope.fieldKeyArr_Res[i].indirectimport == 1)
					{
						$scope.indirectImport = true;
						//$scope.indirectReqFields.push({"key":$scope.fieldKeyObj[key]['key']});
					}
					/*End::Code to check indirect import*/
					if ( $scope.fieldKeyArr_Res[i].returntype && $scope.fieldKeyArr_Res[i].fieldtype !=='text:readonly' && ($scope.fieldKeyArr_Res[i].returntype =='import' || $scope.fieldKeyArr_Res[i].returntype == "showtouser" || $scope.fieldKeyArr_Res[i].returntype.startsWith("1:") ) )
					{
						$scope.fieldKeyArr.push($scope.fieldKeyArr_Res[i]);
					}
				}
				if($scope.indirectImport == 1 && $scope.import_type.split("-")[0] == 'stakeholders')
				{
					$scope.fieldKeyArr.push({"key":"jobtitle","fieldname":"Role","indirectimport":1,"maxlength":"50","minlength":"0","required":"","fieldtype":"text","dropdowntype":0,"group":"","datatype":"string","returntype":"showtouser","showinrelateddata":""});
				}
				/*Removing additional keys sent by field API*/
				//$scope.csvUnmatchedObj_final_Opt=[];
				$scope.csv_all_Opt=[];
				$scope.keywordObj =[];
				$scope.fieldMap =[];
				for(var x=0;x<$scope.fieldKeyArr.length;x++){
					var keywords= $scope.fieldKeyArr[x].fieldname.trim().toLowerCase().split(' ').toString();
					if($scope.fieldKeyArr[x].key == 'name')
					{
						keywords = keywords+','+ $scope.import_type.split("-")[0].substr(1,$scope.import_type.split("-")[0].length-2);
					}
					if(keywords.indexOf($scope.fieldKeyArr[x].key) > -1)
					{
						$scope.keywordObj.push({"key":$scope.fieldKeyArr[x].key,"keywords":keywords,"keytype":$scope.fieldKeyArr[x].fieldtype});
					}
					else {
						$scope.keywordObj.push({"key":$scope.fieldKeyArr[x].key,"keywords":$scope.fieldKeyArr[x].key+','+keywords,"keytype":$scope.fieldKeyArr[x].fieldtype});
					}
					$scope.fieldMap[$scope.fieldKeyArr[x].key] = {"fieldname":$scope.fieldKeyArr[x].fieldname,"fieldtype":$scope.fieldKeyArr[x].fieldtype,"datatype":$scope.fieldKeyArr[x].datatype,"indirectimport":$scope.fieldKeyArr[x].indirectimport}; // we can add other data here like max length etc..
				}

				/*CSV field mapping array*/
				//alert(JSON.stringify($scope.fileContent[0]['sheetContent'][0]));
				//$scope.csvHeadersArr = Object.keys($scope.fileContent[0]);
				/*Keys from csv file*/
				$scope.csvHeadersArr = [];
				for (var i=0; i < $scope.fileContent.length;i++) {
					for (var key in $scope.fileContent[i]) {
						if(!($scope.csvHeadersArr.indexOf(key) >= 0))
						{
							$scope.csvHeadersArr.push(key);
						}
					}
				}
				/*Keys from csv file*/
				//$scope.csvHeadersArr=$scope.lines[0].replace('  ', "").split(",");
				for(var x=0;x<$scope.csvHeadersArr.length;x++){
					for(var y=0;y<$scope.fieldKeyArr.length;y++){
						if($scope.csvHeadersArr[x]){
							if($scope.csvHeadersArr[x].toLowerCase() == $scope.fieldKeyArr[y]['fieldname'].toLowerCase())
							{
								$scope.csvfieldObj.push({"fieldkey":$scope.fieldKeyArr[y]["key"],"fieldname":$scope.fieldKeyArr[y]["fieldname"],"csvfieldkey":$scope.csvHeadersArr[x].replace(/ /g, '').toLowerCase(),"csvfieldname":$scope.csvHeadersArr[x]});
								//$scope.csvUnmatchedObj_final_Opt.push({"fieldkey":$scope.fieldKeyArr[y]["key"],"fieldname":$scope.fieldKeyArr[y]["fieldname"],"csvfieldkey":$scope.csvHeadersArr[x].replace(/ /g, '').toLowerCase(),"csvfieldname":$scope.csvHeadersArr[x]});

								$scope.csvHeadersArr.splice(x,1);
							}
						}
					}
				}

				for(var i=0;i<$scope.csvHeadersArr.length;i++){
					var keyMatchArr=[];
					for(var j=0;j<$scope.keywordObj.length;j++){
						var matchCount=-1;
						var apiKeysArr = $scope.keywordObj[j].keywords.replace(/[^\w\s]|_/g, function ($1) { return ' ' + $1 + ' ';}).replace(/[ ]+/g, ' ').toLowerCase().split(' ');

						for(var k=0;k<apiKeysArr.length;k++)
						{
							var foundIndex = $scope.csvHeadersArr[i].toLowerCase().indexOf(apiKeysArr[k].toLowerCase());
							if(foundIndex !==-1)
							{
								matchCount++;
							}
						}
						if(matchCount !==-1){
							keyMatchArr.push({"index":j,"mcount":matchCount});
						}
						if(keyMatchArr.length > 0 ){
							var maxsortIndex = keyMatchArr.slice(0).sort(function(a, b) { return b.mcount - a.mcount })[0].index;
						}
					}
					if(maxsortIndex > -1)
					{
						var fieldname_temp = '';
						for (var a=0; a<$scope.fieldKeyArr.length; a++) {
							if($scope.fieldKeyArr[a]['key'] == $scope.keywordObj[maxsortIndex]['key'])
								fieldname_temp = $scope.fieldKeyArr[a]['fieldname'];
						}
						$scope.csvfieldObj.push({"fieldkey":$scope.keywordObj[maxsortIndex]['key'],"fieldname":fieldname_temp,"csvfieldkey":$scope.csvHeadersArr[i].replace(/ /g, '').toLowerCase(),"csvfieldname":$scope.csvHeadersArr[i]});
						//$scope.csvUnmatchedObj_final_Opt.push({"fieldkey":$scope.keywordObj[maxsortIndex]['key'],"fieldname":fieldname_temp,"csvfieldkey":$scope.csvHeadersArr[i].replace(/ /g, '').toLowerCase(),"csvfieldname":$scope.csvHeadersArr[i]});
					}
				}

				$scope.csvfieldObj_final=[];
				$scope.csvUnmatchedObj_final=[];
				/*Processing unmatched keys*/
				for(var i=0;i<$scope.fieldKeyArr.length;i++)
				{
					var fflag = false;
					for(var j=0;j<$scope.csvfieldObj.length;j++)
					{
						if($scope.fieldKeyArr[i]['key'] == $scope.csvfieldObj[j]['fieldkey'])
						{
							$scope.csvfieldObj_final.push($scope.csvfieldObj[j]);
							$scope.csv_all_Opt.push($scope.csvfieldObj[j]);
							fflag = true;
							break;
						}
					}
					if(fflag !== true)
					{
						$scope.csvfieldObj_final.push({"fieldkey":$scope.fieldKeyArr[i]['key'],"fieldname":$scope.fieldKeyArr[i]['fieldname'],"csvfieldkey":"","csvfieldname":""});
						//$scope.csv_all_Opt.push({"fieldkey":$scope.fieldKeyArr[i]['key'],"fieldname":$scope.fieldKeyArr[i]['fieldname'],"csvfieldkey":"","csvfieldname":""});
					}
				}
				for(var i=0;i<$scope.csvHeadersArr.length;i++)
				{
					var fflag = false;
					for(var j=0;j<$scope.csvfieldObj_final.length;j++)
					{
						var csvfieldkey=$scope.csvfieldObj_final[j]['csvfieldkey'];
						if(csvfieldkey == $scope.csvHeadersArr[i].replace(/ /g, '').toLowerCase())
						{
							fflag = true;
							break;
						}
					}
					if(fflag == false)
					{
						$scope.csvUnmatchedObj_final.push({"fieldkey":"","fieldname":"","csvfieldkey":$scope.csvHeadersArr[i].replace(/ /g, '').toLowerCase(),"csvfieldname":$scope.csvHeadersArr[i]});
						$scope.csv_all_Opt.push({"fieldkey":"","fieldname":"","csvfieldkey":$scope.csvHeadersArr[i].replace(/ /g, '').toLowerCase(),"csvfieldname":$scope.csvHeadersArr[i]});
					}
				}

				/*Processing unmatched keys*/
				$scope.tempMapObj=[];
				for(var i=0;i<$scope.csvfieldObj_final.length;i++)
				{
					$scope.tempMapObj.push({"fieldkey":$scope.csvfieldObj_final[i]['fieldkey'],"fieldname":$scope.csvfieldObj_final[i]['fieldname'],"csvfieldkey":$scope.csvfieldObj_final[i]['csvfieldkey'],"csvfieldname":$scope.csvfieldObj_final[i]['csvfieldname']});
				}


				$scope.table_loader=false;
				/*CSV field mapping array*/
				document.getElementById('Modal_fieldMap').style.display = "block";


			}).catch(function (response) {
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText );
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
			});


	} // end of importFileChange
	$scope.selectedFields = {};
	$scope.fieldMapChange = function(selVal) {
		$scope.errorMsg="";
		var a = 0;

		var selectBox = document.getElementById(selVal);
		var selectedValue = selectBox.options[selectBox.selectedIndex].value;
		/*Client side validation process for show message*/
		var inputArr = Object.keys($scope.selectedFields).map(function(e) {
			return [$scope.selectedFields[e]];
		});
		for (var i = 0; i < inputArr.length; i++)
		{ if(selectedValue.split(':')[1] == inputArr[i]) {
			a++;
		}
		}

		if(a > 1)
		{$scope.errorMsg = "Duplicate target fields selection!";
			document.getElementById("import_now").disabled = true;
		}
		else{$scope.errorMsg="";
			angular.element('#import_now')[0].disabled = false;
		}
		/*Key swap condition on mapping change*/
		for(var i=0;i<$scope.tempMapObj.length;i++)
		{
			if($scope.tempMapObj[i]['fieldkey'] == selVal)
			{
				$scope.tempMapObj[i]['csvfieldkey'] = selectedValue.split(':')[1];
				break;
			}
		}

		/*Key swap condition on mapping change*/
	}// end of fieldMapChange

	$scope.importNow = function()	{
		//$scope.fieldMapChange();
		$scope.table_loader=true;
		$scope.tempObj = {};
		$scope.errorMsg="";
		document.getElementById('Modal_fieldMap').style.display = "none";
		$scope.CsvReturnVal=$scope.csvJSON($scope.fileContentValuesArr,$scope.tempMapObj);
		/*Removing blank values*/
		$scope.CsvReturnVal.forEach(function (eleVal) {
			Object.keys(eleVal).forEach(function (key) {
				if (eleVal[key] == ""){ delete eleVal[key];//eleVal[key] = '';
				}
			});
		});
		/*Removing blank values*/
		if ( $scope.CsvReturnVal == false ) {
			return false;
		}
		/*Validation logic starts here */
		var nameFlag = false;
		for(var i=0;i<$scope.tempMapObj.length;i++)
		{
			if($scope.tempMapObj[i]['fieldkey']=='name')
			{
				nameFlag = true;
				var tempname = '';
				var isDuplicate = false;
				var csvkeyName = $scope.tempMapObj[i]['csvfieldkey'];
				var csvfieldName = $scope.tempMapObj[i]['csvfieldname'];
				if(csvkeyName !=='')
				{
					for(var j=0;j<$scope.fileContentValuesArr.length;j++)
					{
						if($scope.fileContentValuesArr[j][csvkeyName] && $scope.fileContentValuesArr[j][csvkeyName] == tempname)
						{
							isDuplicate = true;
							break;
						}
						tempname = $scope.fileContentValuesArr[j][csvkeyName];
					}
				}
			}
		}
		if(nameFlag == false)
		{
			$scope.errorMsg = "There is no matching source field found for "+csvfieldName;
			document.getElementById('Modal_importError').style.display = "block";
		}
		else if((isDuplicate && !$scope.indirectImport))
		{
			$scope.errorMsg = "Duplicate value entries under mapped target filed for "+csvfieldName;
			document.getElementById('Modal_importError').style.display = "block";
		}
		else
		{
			/*Validate all data for data type*/
			$scope.CsvReturnValJson= '"'+$scope.import_type.toLowerCase()+'":'+JSON.stringify($scope.CsvReturnVal);
			$scope.postarr.push(JSON.stringify($scope.pparray).substr(1,JSON.stringify($scope.pparray).length-2));
			$scope.postarr.push($scope.CsvReturnValJson);
			//svar post_url=__env.apiUrl+"/"+$scope.import_type.toLowerCase()+"/import";
			var post_url=__env.apiUrl+"/importall/"+$scope.import_type.toLowerCase()+"/import";

			var config = {
				headers : {
					'Content-Type': 'application/json',
				}
			}
			$http.post(post_url,'{'+$scope.postarr+'}', config).success(function(data){
				//alert("Logical devices document successfully imported!");
				$scope.importID = data["id"];
				if($scope.indirectImport !== true || $scope.import_type == 'logicalnetworks' || $scope.import_type == 'componenttocomponents' || $scope.import_type == 'filesystems-logicaldevices' || $scope.import_type  == 'filesystems-filesystemschild' || $scope.import_type.split("-")[0] =='events')
				{
				document.getElementById('Modal_importPost').style.display = "block";
				}
				else {
				document.getElementById('Modal_importPost_Indirect').style.display = "block";
				}
				$scope.table_loader=false;

				if($scope.indirectImport !== true || $scope.import_type == 'logicalnetworks' || $scope.import_type == 'componenttocomponents' || $scope.import_type == 'filesystems-logicaldevices' || $scope.import_type  == 'filesystems-filesystemschild' || $scope.import_type.split("-")[0] =='events')
				{
					$http.get(__env.apiUrl+'/importall/'+$scope.import_type.toLowerCase()+'/showlog/'+$scope.importID+'?offset=1')
						.then(function (response) {
							console.log("Response got is:"+response);
							document.getElementById('Modal_importPost').style.display = "none";
							document.getElementById('Modal_importSuccess').style.display = "block";

						}).catch(function (response){
							console.log("Inside error case");
							$scope.statusCode = response.status;
							$scope.statusText = (response.statusText );
							console.log("Error received while retreiving data, please try again!");
						});
				}
			}).catch(function (response) {
				//alert("Error while importing document");
				if ( response.data && response.data.userAction) {
				    $scope.errorMsg = "Error<<"+response.data.userAction+">>";
				} else {
    				$scope.errorMsg = "Error received while importing data, Please try again!";
				}
				document.getElementById('Modal_importError').style.display = "block";
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while importing data: "+response.statusText +" : "+"Request failed"+" : "+response.status);

			});
		}
	} // end of importNow

	$scope.validateFileContent = function(contentArr) {
		var contentValues = [];
		for(var j=0;j<contentArr.length;j++){
			var currentline = contentArr[j];
			var obj = {};
			for(var k in currentline){
				var htitle = (k) ? k.replace(/ /g, '').toLowerCase().trim() : k;
				if(currentline[k]){
					var currentVal = (currentline[k]) ? currentline[k].replace(/\"/g, '') : currentline[k];
					obj[htitle] = currentVal;
				}
				else if(htitle !==""){
					obj[htitle] = "";
				}
			}
			contentValues.push(obj);
		}
		return contentValues;
	} // end of validateFileContent

	$scope.csvJSON = function(fileContentValuesArr,tempMapObj){
		$scope.needToConfrim = false;
		$scope.importConfirmed = false;
		var tempMapArray =[];
		for(var j=0;j<tempMapObj.length;j++){
			tempMapArray[tempMapObj[j].csvfieldkey] = {"fieldkey" : tempMapObj[j].fieldkey};
		}

		var final_Content_Obj_Temp=[];
		for(var i=0;i<fileContentValuesArr.length;i++){
			var obj={};
			for(var key in fileContentValuesArr[i])
			{
				for(var j=0;j<tempMapObj.length;j++){
					if(tempMapObj[j]['csvfieldkey'] == key)
					{
						var currentVal = (fileContentValuesArr[i][key]) ? fileContentValuesArr[i][key].trim(): fileContentValuesArr[i][key];
						obj[tempMapObj[j]['fieldkey']] = currentVal;
					}
					if(tempMapObj[j]['csvfieldkey'] =='' && $scope.indirectImport)
					{

						obj[tempMapObj[j]['fieldkey']] = "";
					}
				}
			}
			final_Content_Obj_Temp.push(obj);
		}
/*Confirmation block for continue with import ignoing blank name values*/
var final_Content_Obj = [];
for(var i=0;i< final_Content_Obj_Temp.length;i++){
	if(final_Content_Obj_Temp[i]['name'])
	{
		final_Content_Obj.push(final_Content_Obj_Temp[i]);
	}
	else if(!$scope.importConfirmed)
	{
		$scope.needToConfrim = true;
	}
}
/*Confirmation block for continue with import ignoing blank name values*/
/*Skipping blank name records here*/
		for(var k=0;k<final_Content_Obj.length;k++){
			if($scope.needToConfrim)
			{
				if($scope.import_type == 'deviceinterfaces')
				{
					var confirmMsg = 'Found one or more records without mandatory field "Address" value, would you like to import anyway?';
				}
				else
				{
					 var confirmMsg = 'Found one or more records without mandatory field "Name" value, would you like to import anyway?';
				}
			  var importConfirm = confirm(confirmMsg);
				if(importConfirm)
				{
					$scope.needToConfrim = false;
					$scope.importConfirmed = true;
					continue;
				}else
				{
					$scope.table_loader = false;
					$scope.importConfirmed = false;
					return false;
				}
			}

			/*DB side smaller case delete value not accepted for action*/
			if(final_Content_Obj[k]['action'])
			{
				final_Content_Obj[k]['action'] = final_Content_Obj[k]['action'].toUpperCase();
			}
			/*DB side smaller case delete value not accepted for action*/
			if($scope.import_type == 'deviceinterfaces')
			{
				if((!final_Content_Obj[k]['pdname'] && !final_Content_Obj[k]['hostname']) || (final_Content_Obj[k]['pdname'] == '' && final_Content_Obj[k]['hostname'] == ''))
				{
				$scope.invalidDIRecord = true;
				}
			}
		}

		/*Skipping blank name records here*/
		if(final_Content_Obj.length <= 0)
		{
			$scope.errorMsg = 'There is no valid record or device name found to import for '+$scope.deviceDisplayNames[$scope.import_type]+'.';
			document.getElementById('Modal_importError').style.display = "block";
			return false;
		}
    if($scope.import_type == 'deviceinterfaces' && $scope.invalidDIRecord)
		{
			$scope.errorMsg = 'There is invalid record found without "Logical Device" or "Physical Device" to import for '+$scope.deviceDisplayNames[$scope.import_type]+'.';
			document.getElementById('Modal_importError').style.display = "block";
			return false;
		}
		var jsonValueObj=[];
		for(var i=0;i<final_Content_Obj.length;i++){
			var obj={};
			for(var key in final_Content_Obj[i])
			{
				var actualFieldKey = key;

				if ( !actualFieldKey  ) {
					console.log("mapping key not found for key<"+key+"> and value is :"+actualFieldKey);
					continue;
				}

				if(final_Content_Obj[i][key] =='null' || final_Content_Obj[i][key] =='NaN' || final_Content_Obj[i][key] =='undefined'){
					//  obj[tempMapArray[key]['fieldkey']] = '';
					obj[key] = '';
				} else {
					//obj[tempMapArray[key]['fieldkey']] = fileContentValuesArr[i][key];
					obj[key] = final_Content_Obj[i][key];
				}
				// var curfieldVal = final_Content_Obj[i][key].trim();
				var curfieldVal = (final_Content_Obj[i][key]) ? final_Content_Obj[i][key].trim(): final_Content_Obj[i][key];

				if('name' in final_Content_Obj[i] == false)
				{
					if($scope.import_type == 'deviceinterfaces')
					{
						$scope.errorMsg = 'There is no valid record with correct mapping for target field Address.';
					}
					else {
						$scope.errorMsg = 'There is no valid record with correct mapping for target field Name.';
					}
					document.getElementById('Modal_importError').style.display = "block";
					return false;
				}
				else if(key == 'name' && $scope.import_type !== 'deviceinterfaces')
				{
					//var curfieldVal = final_Content_Obj[i][key].trim();
					if(!checkValidName(curfieldVal)){
						$scope.errorMsg = 'Please enter Alphanumeric Device name with no special character for target field "Name": "'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}
				if(key == "serialNo")
				{   //var curfieldVal = final_Content_Obj[i][key].trim();
					if(($scope.import_type_bySerial && curfieldVal ==''))
					{
						$scope.errorMsg = 'Please enter valid serial number for target field "Serial No": "'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}
				if($scope.import_type == 'logicalnetworks' && key == "name")
				{
					if(!isValidIP(curfieldVal) || curfieldVal =='')
					{
						$scope.errorMsg = 'Please enter valid IP address for target field "IPAddress" : "'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}
				/*if($scope.import_type == 'deviceinterfaces' && key == "name")
				{
					//if(!isValidIP(curfieldVal) || curfieldVal =='')
					if(!curfieldVal || curfieldVal =='')
					{
						$scope.errorMsg = 'Please enter valid IP address or Host name for target field "Address" : "'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}*/
				//var actualFieldKeyObj = $scope.fieldMap[tempMapArray[key].fieldkey];
				//var actualFieldKeyObj = $scope.fieldMap[key].fieldkey;
				var actualFieldKeyObj = $scope.fieldMap[key];
				if (actualFieldKeyObj && actualFieldKeyObj.fieldtype == "integer" || actualFieldKeyObj.datatype == "number") {
					var curfieldVal = (final_Content_Obj[i][key]) ? final_Content_Obj[i][key].trim(): final_Content_Obj[i][key];
					if(isNaN(curfieldVal)){
						$scope.errorMsg = 'Only numeric value allowed for target field "'+actualFieldKeyObj.fieldname+'" :"'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					} else if(parseInt(curfieldVal) > 9223372036854775807){
						$scope.errorMsg = 'Numeric value is allowed within range 0 to 9223372036854775807 for target field "'+actualFieldKeyObj.fieldname+'" :"'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}
				if (actualFieldKeyObj && actualFieldKeyObj.indirectimport == 1 ) {
					var curfieldVal = (final_Content_Obj[i][key]) ? final_Content_Obj[i][key].trim(): final_Content_Obj[i][key];
					if(curfieldVal =='')
					{
						$scope.errorMsg = 'Please enter value for  mandatory field "'+actualFieldKeyObj.fieldname+'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}
				else if ( actualFieldKeyObj && actualFieldKeyObj.fieldtype == "date" ) {
					//var curfieldVal = final_Content_Obj[i][key].trim();
					var curfieldVal = (final_Content_Obj[i][key]) ? final_Content_Obj[i][key].trim(): final_Content_Obj[i][key];
					if(!isValidDate(curfieldVal) && curfieldVal !=='')
					{
						$scope.errorMsg = 'Please enter valid date value in "YYYY-MM-DD" format for target field "'+actualFieldKeyObj.fieldname+'" :"'+ curfieldVal +'" at line Number : '+(i+1);
						document.getElementById('Modal_importError').style.display = "block";
						return false;
					}
				}
				else {
					//console.log("Mapping not found for <"+key+"> and tempMapArray<"+tempMapArray[key]+"><"+$scope.fieldMap[tempMapArray[key].fieldkey]+">");
				}
			}
			jsonValueObj.push(obj);
		}
		return jsonValueObj;
	} // end of csvJSON

	/*Import functionality*/
	/*End::Defect21651*/

	/*CLient Local user flag set*/
	    $http.get('StaticAPI/Authentication.properties').then(function (response) {
	      $rootScope.loginModeValue = response.data.loginMode;
	        console.log('LoginMode is ', response.data.loginMode);
	        //window.alert('Login Mode in LoginController.js ->' + $rootScope.loginModeValue);
	    //$scope.$apply();
	      });
	/*CLient Local user flag set*/

}]);

app.controller('DevCountController', ['$scope', '$http', '$uibModal', '$uibModalInstance',  '$rootScope', '$location', '$window','CountData', function($scope, $http, $uibModal, $uibModalInstance, $rootScope, $location, $window,CountData) {
	$scope.ngShowModalCounts = true;


	$scope.CountTablesData = CountData;

	$scope.dismissPopup = function() {
		$uibModalInstance.dismiss('cancel');
	}


}
])
