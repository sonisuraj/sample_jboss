//Fix ipv6 n ipv4 validation
//Author Nikita Banthiya
//Dated 7/8/2017
function checkIPAddress(ipv6){
	var regExCheck =0;
//Regular expression to check IPv4
var regex = /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/gi;
	if( regex.test(ipv6) ) {
			regExCheck=0;
			return true;
	} else {
		regExCheck=1;
	 }
	 //Regular expression to check IPv6
	 if(regExCheck==1){
		 if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\:){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(ipv6)) {
				regExCheck=0;
				return true;
		 } else {
			 regExCheck=1;
			}
	 }
		if(regExCheck ==1){

			alert("Please Enter Valid IP Address .Either In IPV4 or IPV6 format");
			console.log("D");
			return false;
		}else{
			return true;
		}
}
function setRelatedCounts($scope, relatedCountData,$rootScope) {
	$rootScope.relatedCountShowMark =true;
	for ( var count = 0 ; count < relatedCountData.length ; count++) {
	    var countelement = document.getElementById(relatedCountData[count].nospcaeid);
		if ( countelement  ) {
		    countelement.value = relatedCountData[count].count;
		}
	}
	for ( var count = 0 ; count < relatedCountData.length ; count++) {
			if(relatedCountData[count].count >0){
				$rootScope.relatedCountShowMark =true;
				return;
			}
			else{
				$rootScope.relatedCountShowMark =false;
			}
	}

}
function getLogialDeviceRelatedData($scope,$http,__env,$rootScope) {
	$scope.stakeHolderTble = [];
	$scope.showassociateSpinner = false;
	$scope.logicalDeviceData.servicecount = 0 ;
	$scope.logicalDeviceData.compcount = 0 ;
	$scope.logicalDeviceData.clustercount = 0 ;
	$scope.logicalDeviceData.stakeholdercount = 0 ;
	$scope.logicalDeviceData.documentcount = 0 ;
	if ( $scope.$parent && $scope.$parent.logicalDeviceData ) { // we need parent case when new association is done since assocaition is done inside child controller we need to update parent scope variable
		$scope.$parent.logicalDeviceData.servicecount = 0 ;
		$scope.$parent.logicalDeviceData.compcount = 0 ;
		$scope.$parent.logicalDeviceData.clustercount = 0 ;
		$scope.$parent.logicalDeviceData.stakeholdercount = 0 ;
		$scope.$parent.logicalDeviceData.documentcount = 0 ;
	}
	console.log("Inside getting related counts");
	//Fetch all documents,components,stackholders,services/clusters
	$scope.searchDocumentJson=[];
	$scope.compSearchResult = [];
	$scope.serviceSearchResult = [];
	$scope.clusSearchResult = [];
	$scope.searchResultJson = [];

	$scope.servicedata = [];
	$scope.compdata = [];
	$scope.clusterdata = [];
	$scope.data = [];
	var url ="";
	$scope.document_download_url =__env.apiUrl+"/logicaldevices/downloadDoc";

	//Fetch all documents,components,stackholders,services/clusters

	urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/relatedcounts";
	$http.get(urlCall)
		.then(function (response) {
			angular.forEach(response['data'], function(value, key){
				if(value.id == "Clusters") {
					if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.clustercount = value.count;
					$scope.logicalDeviceData.clustercount = value.count;
					if($scope.logicalDeviceData.clustercount){
						 $rootScope.relatedCountShowMark =true;
					}
				}
				if(value.id == "Services") {
					if ($scope.$parent && $scope.$parent.logicalDeviceData )  $scope.$parent.logicalDeviceData.servicecount = value.count;
					$scope.logicalDeviceData.servicecount = value.count;
					if($scope.logicalDeviceData.servicecount >0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.id == "Components") {
					if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.compcount = value.count;
					$scope.logicalDeviceData.compcount = value.count;
					if($scope.logicalDeviceData.compcount >0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.id == "Stakeholders") {
					if ( $scope.$parent && $scope.$parent.logicalDeviceData) $scope.$parent.logicalDeviceData.stakeholdercount = value.count;
					$scope.logicalDeviceData.stakeholdercount = value.count;
					if($scope.logicalDeviceData.stakeholdercount>0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.id == "Documents") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.documentcount = value.count;
					$scope.logicalDeviceData.documentcount = value.count;
					if($scope.logicalDeviceData.documentcount>0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.nospcaeid == "physicaldevice" || value.nospcaeid == "PhysicalDevice") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.pdcount = value.count;
					$scope.logicalDeviceData.pdcount = value.count;
					if($scope.logicalDeviceData.pdcount>0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.nospcaeid == "logicalnetwork" || value.nospcaeid == "LogicalNetwork") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.lncount = value.count;
					$scope.logicalDeviceData.lncount = value.count;
					if($scope.logicalDeviceData.lncount>0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.nospcaeid == "interface" || value.nospcaeid == "Interface") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.interfacecount = value.count;
					$scope.logicalDeviceData.interfacecount = value.count;
					if($scope.logicalDeviceData.interfacecount>0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.nospcaeid == "filesystem" || value.nospcaeid == "FileSystem") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.fscount = value.count;
					$scope.logicalDeviceData.fscount = value.count;
					if($scope.logicalDeviceData.fscount >0){
						 $rootScope.relatedCountShowMark =true;
						// return;
					}
				}
				if(value.nospcaeid == "inbounddevices" || value.nospcaeid == "InboundDevices") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.inbounddevicescount = value.count;
					$scope.logicalDeviceData.inbounddevicescount = value.count;
					if($scope.logicalDeviceData.inbounddevicescount>0){
						$rootScope.relatedCountShowMark =true;
					}
				}
				if(value.nospcaeid == "outbounddevices" || value.nospcaeid == "OutboundDevices") {
					if (  $scope.$parent && $scope.$parent.logicalDeviceData)  $scope.$parent.logicalDeviceData.outbounddevicescount = value.count;
					$scope.logicalDeviceData.outbounddevicescount = value.count;
					if($scope.logicalDeviceData.outbounddevicescount >0){
						$rootScope.relatedCountShowMark =true;
					}
				}
			});
		});
		if ( $scope.deviceID && $scope.deviceID == "physicaldevices" ) {
			$scope.spinPD = true;
			$scope.table_loader=true;
			var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/physicaldevices";
			$http.get(urlCall).then(function (response) {
				//$scope.PDdata =response['data']['physicaldevices'];
				  $scope.rows =response['data']['physicaldevices'];
				if ( $scope.$parent ) $scope.$parent.rows =response['data']['physicaldevices'];
				$scope.devicesCount		=		$scope.rows.length;
				console.log('$scope.servicedataaa' + JSON.stringify($scope.PDdata));
				$scope.spinPD = false;
				$scope.table_loader= false;
			}).catch(function (response) {
				$scope.rows =[];
				if ( $scope.$parent ) $scope.$parent.rows =[];
				console.log('response===' + response);
				$scope.table_loader = false;
			});
			$scope.otdtable2 =false;
			$scope.otdtable =function(){
				$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
				$("#otd-table-2").addClass('col-md-4');
				$scope.otdtable2 =true;
			}
		}
	if ( $scope.deviceID && $scope.deviceID == "services" ) {
		$scope.spinServices = true;
		$scope.table_loader=true;
		var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/services";
		$http.get(urlCall).then(function (response) {
			$scope.servicedata =response['data']['services'];
			if ( $scope.$parent ) $scope.$parent.servicedata =response['data']['services'];
			$scope.devicesCount		=		$scope.servicedata.length;
			console.log('$scope.servicedataaa' + JSON.stringify($scope.servicedata));
			$scope.spinServices = false;
			$scope.table_loader= false;
		}).catch(function (response) {
			$scope.servicedata =[];
			if ( $scope.$parent ) $scope.$parent.servicedata =[];
			console.log('response===' + response);
			$scope.table_loader = false;
		});
		$scope.otdtable2 =false;
		$scope.otdtable =function(){
			$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
			$("#otd-table-2").addClass('col-md-4');
			$scope.otdtable2 =true;
		}
		/*********
		url =__env.apiUrl+'/services/getall';
		$http.get(url)
			.then(function (response) {
				$scope.serviceSearchResult =response['data']['services'];
				if ( $scope.$parent) $scope.$parent.serviceSearchResult =response['data']['services'];
				$scope.spinServices = false;
				$scope.table_loader= false;
			});
		*******/
	}
	if ( $scope.deviceID && $scope.deviceID == "notes"  || $scope.deviceID == "setforreview" || $scope.deviceID == "unsetforreview" ) {
		$scope.notesSpinner = true;
		$scope.table_loader = true;
		$scope.description=" ";
		var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/notes";
		$http.get(urlCall)
			.then(function (response) {
				console.log('dataaa====>' + JSON.stringify(response['data']));
				$scope.notes =response['data']['notes'];
				if ( $scope.$parent) $scope.$parent.notes =response['data']['notes'];
				$scope.description=response['data'].description;
				if ( $scope.$parent) $scope.$parent.description=response['data'].description;
				console.log("DEVICE description got is :"+response['data'].description);
				$scope.notesSpinner = false;
				$scope.table_loader = false;

			}).catch(function (response) {
				$scope.notes =[];
				if ( $scope.$parent) $scope.$parent.notes =[];
				console.log('response===' + response);
				$scope.table_loader = false;
			});
		$scope.otdtable2 =false;
		$scope.otdtable =function(){
			$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
			$("#otd-table-2").addClass('col-md-4');
			$scope.otdtable2 =true;
		}
	}

	if ( $scope.deviceID && $scope.deviceID == "components" ) {
		$scope.table_loader=true;
		$scope.spinsleft = true;
		var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/components";
		$http.get(urlCall)
			.then(function (response) {
				$scope.compdata =response['data']['components'];
				if ( $scope.$parent) $scope.$parent.compdata =response['data']['components'];
				$scope.devicesCount		=		$scope.compdata.length;
				console.log('$scope.compdataa===' + JSON.stringify($scope.compdata));
				$scope.table_loader=false;
				$scope.spinsleft = false;
			}).catch(function (response) {
				$scope.compdata =[];
				if ( $scope.$parent) $scope.$parent.compdata =[];
				console.log('response===' + response);
				$scope.table_loader = false;
			});
		$scope.otdtable2 =false;
		$scope.otdtable =function(){
			$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
			$("#otd-table-2").addClass('col-md-4');
			$scope.otdtable2 =true;
		}
		/*********
		url = __env.apiUrl+'/components/getall';
		$scope.table_loader=true;
		$scope.spinsRight = true;
		$http.get(url)
			.then(function (response) {
				$scope.compSearchResult =response['data']['components'];
				if ( $scope.$parent) $scope.$parent.compSearchResult =response['data']['components'];
				console.log('$scope.compSearchResultttt===' + JSON.stringify($scope.compSearchResult));
				$scope.table_loader=false;
				$scope.spinsRight = false;
			});
		********/
	}
	if ( $scope.deviceID && $scope.deviceID == "service_cluster" ) {
		$scope.clusterSpinner = true;
		$scope.table_loader = true;

		var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/clusters";
		$http.get(urlCall)
			.then(function (response) {
				$scope.clusterdata =response['data']['clusters'];
				if ( $scope.$parent) $scope.$parent.clusterdata =response['data']['clusters'];
				$scope.devicesCount		=		$scope.clusterdata.length;
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
			}).catch(function (response) {
				$scope.clusterdata =[];
				if ( $scope.$parent) $scope.$parent.clusterdata =[];
				console.log('response===' + response);
				$scope.table_loader = false;
			});
		/********
		url =__env.apiUrl+'/clusters/getall'
		$http.get(url)
			.then(function (response) {
				$scope.clusSearchResult =response['data']['clusters'];
				if ( $scope.$parent) $scope.$parent.clusSearchResult =response['data']['clusters'];
				$scope.clusterSpinner = false;
				$scope.table_loader = false;
			}).catch(function (response) {
				console.log('response===' + response);
				$scope.table_loader = false;
			});
		*******/
	}
	if ( $scope.deviceID && $scope.deviceID == "document" ) {
		$scope.documentSpinner = true;
		$scope.table_loader = true;
		var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/documents";
		$http.get(urlCall)
			.then(function (response) {
				$scope.data =response['data']['documents'];
				if ( $scope.$parent) $scope.$parent.data =response['data']['documents'];
				$scope.devicesCount		=		$scope.data.length;
				$scope.documentSpinner = false;
				$scope.table_loader = false;
			});
		$scope.otdtable2 =false;
		$scope.otdtable =function(){
			$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
			$("#otd-table-2").addClass('col-md-4');
			$scope.otdtable2 =true;
		}
		/****************
		url = __env.apiUrl+ '/documents/getall';
		$scope.documentSpinner = true;
		$scope.table_loader = true;
		$http.get(url)
			.then(function (response) {
				$scope.searchDocumentJson =response['data']['documents'];
				if ( $scope.$parent) $scope.$parent.searchDocumentJson =response['data']['documents'];
				$scope.documentSpinner = false;
				$scope.table_loader = false;
			}).catch(function (response) {
				console.log("Inside error case");
				$scope.searchDocumentJson =[];
				$scope.documentSpinner = false;
				$scope.table_loader = false;
		    });
		************/
	}


	if ( $scope.deviceID && $scope.deviceID == "stakeholder" ) {
		$scope.stakeholderSpinner = true;
		$scope.table_loader = true;
		console.log('$scope.deviceName====' + JSON.stringify($scope.deviceName));
		var urlCall =__env.apiUrl+"/devices/logicaldevices/"+$scope.deviceName+"/stakeholders";
		$http.get(urlCall)
			.then(function (response) {
				$scope.data =response['data']['stakeholders'];
				if ( $scope.$parent) $scope.$parent.data =response['data']['stakeholders'];
				$scope.devicesCount		=		$scope.data.length;
				console.log('$scope.data stakeholders====' + JSON.stringify($scope.data));
				$scope.stakeholderSpinner = false;
				$scope.table_loader = false
			}).catch(function (response) {
				$scope.data =[];
				if ( $scope.$parent) $scope.$parent.data =[];
				console.log('data===' + data);
				console.log('status===' + status);
				$scope.table_loader = false;
			});
		$scope.otdtable2 =false;
		$scope.otdtable =function(){
			$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
			$("#otd-table-2").addClass('col-md-4');
			$scope.otdtable2 =true;
		}
		$scope.stakeholderSpinner = true;
		$scope.table_loader = true;
		/**************
		url =__env.apiUrl+'/stakeholders/getall';
		$http.get(url)
			.then(function (response) {
				$scope.searchResultJson =response['data']['stakeholders'];
				if ( $scope.$parent) $scope.$parent.searchResultJson =response['data']['stakeholders'];
				$scope.stakeholderSpinner = false;
				$scope.table_loader = false;
			}).catch(function (response) {
				console.log('response===' + response);
				$scope.searchResultJson =[];
				if ( $scope.$parent) $scope.$parent.searchResultJson =[];
				$scope.table_loader = false;
			});
		****************/
	} //end of stakeholder case

	if ( $scope.deviceID && $scope.deviceID == "audit" ||  $scope.deviceID == "relationale" ) {
		$scope.table_loader = true;
		var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/audit";
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

		$scope.otdtable2 =false;
		$scope.otdtable =function(){
			$('#otd-table').removeClass('col-md-12').addClass('col-md-8');
			$("#otd-table-2").addClass('col-md-4');
			$scope.otdtable2 =true;
		}
	}
} // end of function
function to_csv(workbook) {
	var X = XLSX;
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName],{FS:",",blankrows:false});
		if(csv.length > 0){
			result.push(csv);
		}
	});
	return result.join("\n");
}

function to_csv(workbook) {
	var X = XLSX;
	var result = [];
	workbook.SheetNames.forEach(function(sheetName) {
		var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName],{FS:",",blankrows:false});
		if(csv.length > 0){
			result.push(csv);
		}
	});
	return result.join("\n");
}
function to_json(workbook) {
	var sheet_name_list = workbook.SheetNames;
	var result = [];
	sheet_name_list.forEach(function (y) { /* iterate through sheets */
      //Convert the cell value to Json
      var roa = XLSX.utils.sheet_to_json(workbook.Sheets[y],{blankRows: false});
      if (roa.length > 0) {
          //result = roa;
					result.push({"sheet":y,"sheetContent":roa});
      }
});
	return result;
}

/*Code for left Right scrolling div content*/
function scrollArrowShow() {
	var maxScroll = ($('#inner-wrap').width() - $('#slide-wrap').scrollLeft()) - $('#slide-wrap').width();
	if ( 0 == $('#slide-wrap').scrollLeft()) {
		$('#scroll_L_Arrow').css({visibility: 'visible'});
	}else{
		$('#scroll_L_Arrow').css({visibility: 'visible'});
	}
	if ( 0 == maxScroll) {
		$('#scroll_R_Arrow').css({visibility: 'visible'});
	}else{
		$('#scroll_R_Arrow').css({visibility: 'visible'});
	}
}
function scrollFull(direction)
{
	var maxScroll = ($('#inner-wrap').width() - $('#slide-wrap').scrollLeft()) - $('#slide-wrap').width();
	if (direction=='Go_L') {
		$('#slide-wrap').animate({
			scrollLeft: "+=" + maxScroll-maxScroll + "px"
		}, function(){
			// createCookie('scrollPos', $('#slide-wrap').scrollLeft());
			scrollArrowShow();
		});
	}
	else if(direction=='Go_R')
	{
		$('#slide-wrap').animate({
			scrollLeft: "-=" + maxScroll*4 + "px"
		}, function(){
			// createCookie('scrollPos', $('#slide-wrap').scrollLeft());
			scrollArrowShow();
		});
	}
}
function scrollThumb(direction) {
	if (direction=='Go_L') {
		$('#slide-wrap').animate({
			scrollLeft: "-=" + 250 + "px"
		}, function(){
			// createCookie('scrollPos', $('#slide-wrap').scrollLeft());
			scrollArrowShow();
		});
	}else
	if (direction=='Go_R') {
		$('#slide-wrap').animate({
			scrollLeft: "+=" + 250 + "px"
		}, function(){
			// createCookie('scrollPos', $('#slide-wrap').scrollLeft());
			scrollArrowShow();
		});
	}
}
/*Code for left Right scrolling div content*/
/*function for import name field validation*/
function checkValidName(inputName)
{
	//var regExp = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9]*$/);
	var regExp = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9 '!@#$%^&*-_=+~`()]*$/);
	if( !inputName  || inputName ==''||  inputName.length <= 0 )
		{
			return false;
		}else{return true;}

}
/*function for import name field validation*/
/*function for import date field validation*/
function isValidDate(date)
{    //var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
		var matches = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/.exec(date);
    if (matches == null) return false;
    var y = matches[2];
    var m = matches[1] - 1;
    var d = matches[3];
    var composedDate = new Date(y, m, d);
    //return true;
		  return (composedDate !== "Invalid Date" && !isNaN(composedDate)) ? true : false;
}
function isValidIP(ipVal)
{
	if(ipVal != '0.0.0.0' && ipVal.match(/\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/))
	{
		return true;
	}else{return false;}
}
/*function for import date field validation*/
function splitCSVwithQuotes(str){
  var result = [];
  var strBuf = '';
  var start = 0 ;
  var marker = false;
  for (var i = 0; i< str.length; i++){

    if (str[i] === '"'){
      marker = !marker;
    }
    if (str[i] === ',' && !marker){
      result.push(str.substr(start, i - start));
      start = i+1;
    }
  }
  if (start <= str.length){
    result.push(str.substr(start, i - start));
  }
  return result;

}
 function setHeadingAssociationTitle($scope,associationName) {
	 if ( !$scope.headingAssociation || $scope.headingAssociation.length <= 0 ) {
		 return false;
	 }
    if ( $scope.deviceDisplayNames ) {
        $scope.headingAssociationTitle = $scope.deviceDisplayNames[$scope.headingAssociation.replace(/-/g, "").toLowerCase()];
    } else {
        $scope.deviceDisplayNames = $scope.$parent.deviceDisplayNames ;
    }

    if ( $scope.$parent.deviceDisplayNames ) {
        $scope.headingAssociationTitle = $scope.$parent.deviceDisplayNames[$scope.headingAssociation.replace(/-/g, "").toLowerCase()];
    }
 }
 function setColumnHeader($scope,associationName,$http,__env,stakeholderHeading) {
    $scope.cols = [];
	if ( stakeholderHeading ) {
		if ( !$scope.headingAssociation  || associationName.indexOf( $scope.headingAssociation ) == -1 ) {
			if ( associationName.startsWith('stakeholders') ) {
				$scope.headingAssociation = 'stakeholders';
			}
			if ( associationName.startsWith('clusters') ) {
				$scope.headingAssociation = 'clusters';
			}
		}
	}
    setHeadingAssociationTitle($scope);
    if ( !$scope.headingAssociationTitle ) {
        $scope.headingAssociationTitle = $scope.headingAssociation;
    }
    var relateddevicename = associationName;
    console.log('relateddevicename===>>>>' + relateddevicename);

    if ( associationName && associationName.toLowerCase() == "networks" ) {
        relateddevicename = "logicalnetworks";
    }
    // code to get 2nd level string... so that  corresponding columns can be fetched
    var remainingtitle = "";
    var prefixcases = [{"key" : "child","display" : "Child" },{"key" : "parent", "display" : "Parent"},{"key" : "dependent", "display" : "Dependent"},{"key" : "related", "display" : "Related"},{"key" : "indirect" , "display" : "Indirect"},{"key" : "inbound" , "display" : "Inbound"},{"key" : "outbound" , "display" : "Outbound"}];
    var found =  false;
    for ( var j = 0 ; j < prefixcases.length ; j++  ) {
        if ( $scope.LowerOtherDeviceName && $scope.LowerOtherDeviceName == "components" ) {
        	var prefixpart = relateddevicename.substring(0,relateddevicename.indexOf("components"));
            if ( prefixpart == "inbound") {
                $scope.associateLowerTitle = "Inbound Components";
                found = true;
                break;
            }
            if ( prefixpart == "outbound"  ) {
                $scope.associateLowerTitle = "Outbound Components";
                found = true;
                break;
            }
        }
        if ( associationName.startsWith(prefixcases[j].key) )  {
            $scope.associateLowerTitle = prefixcases[j].display;
            relateddevicename = associationName.substr(prefixcases[j].key.length );
            var displayname  = $scope.deviceDisplayNames[relateddevicename];
            if ( displayname  ) $scope.associateLowerTitle =  $scope.associateLowerTitle+" " + displayname;
            found = true;
			if ( associationName == $scope.headingAssociationTitle ) {
			    $scope.headingAssociationTitle  =  displayname;
			}
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
            $scope.associateLowerTitle = $scope.deviceDisplayNames[relateddevicename]+" "+remainingtitle;
        }
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
            $scope.associateLowerTitle = "Component to Device";
        }
        if(relateddevicename == 'toservice' || relateddevicename == 'componenttoservice'){
            relateddevicename = 'componenttoservice';
            $scope.associateLowerTitle = "Component to Service";
        }
        if(relateddevicename == 'tocomponent' || relateddevicename == 'componenttocomponent'){
            relateddevicename = 'componenttocomponent';
            $scope.associateLowerTitle = "Component to Component";
        }
        if(relateddevicename == 'resourcesservices'){
            $scope.headingAssociationTitle = $scope.deviceDisplayNames['services'];
            $scope.associateLowerTitle = "Clusters Resources Services";

        }

        if(relateddevicename == 'resources'){
            $scope.headingAssociationTitle = $scope.deviceDisplayNames['logicaldevices'];
            $scope.associateLowerTitle = "Resources";

        }
		if ( $scope.relatedkeys && $scope.relatedkeys['displayname'] ) {
			$scope.relatedkeys['displayname'][associationName] = $scope.associateLowerTitle;
		}
        console.log(__env.apiUrl+'/devices/fields/'+relateddevicename+'?main=yes');
        console.log('relateddevicename===>>>' + relateddevicename);
        $http.get(__env.apiUrl+'/devices/fields/'+relateddevicename+'?main=yes').then(function (response) {
            $scope.currentfielddata = response.data.fields;
            $scope.cols = [];
            for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
					console.log($scope.currentfielddata[currentindex].key);
					if(stakeholderHeading ==1 && $scope.currentfielddata[currentindex].key !='primarycontact'){
						$scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
						console.log("S");
					}else{
						$scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
					}
                }
            }
            if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("stakeholders") && $scope.mainAssociationName.length > 13 ) {
                $scope.cols.push({"key":"entityname","fieldname": "Entity Name"});
				console.log($scope.cols);
				if(stakeholderHeading ==1){
					for (var i =0; i < $scope.cols.length; i++)
					if ( $scope.cols[i].key === "primarycontact") {
					$scope.cols.splice(i,1);
					}
				}
				$scope.cols =$scope.cols;
			}
            if ( $scope.LowerOtherDeviceName == "physicaldevices" && $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase() =="clusters" )  {
                $scope.cols.push({"key":"resources","fieldname": "Resources"});
                $scope.cols.push({"key":"devices","fieldname": "Devices"});
                $scope.cols.push({"key":"services","fieldname": "Services"});
            }
            var relateddevicestypes = "components,services,physicaldevices,datasources"; // does not need LD here as ld already has a role field
            if ( $scope.LowerOtherDeviceName == "stakeholders" && $scope.mainAssociationName && relateddevicestypes.indexOf($scope.mainAssociationName.toLowerCase()) != -1 )  {
                $scope.cols.push({"key":"role","fieldname": "Role"});
            }
			console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
			if ( $scope.relatedkeys && $scope.relatedkeys['fields'] ) {
				$scope.relatedkeys['fields'][associationName] = $scope.cols;
			}
        });
    }
    $scope.associateLowerTitle = $scope.deviceDisplayNames[$scope.associateLowerTitle] ? $scope.deviceDisplayNames[$scope.associateLowerTitle]  : $scope.associateLowerTitle;
    if ( !$scope.associateLowerTitle || $scope.associateLowerTitle == "undefined") {
        if ( relateddevicename == "clustered" ) {
			$scope.relatedkeys['displayname'][associationName] = $scope.associateLowerTitle;
            relateddevicename = "Clusters";
			$scope.associateLowerTitle = "Clusters";
        }
    }
}
function test1(e) {
    var element1 = $(this).next('ul.dropdown-menu');
    if ( element1 ) {
        element1.toggle();
    }

	e.preventDefault();
}
function test(e) {
	e.preventDefault();
}
function check() {
    return true;
}


function getDeviceDetails($rootScope,$scope,$http) {
	var idtobeused = $scope.device_add.name;
	if( $scope.LowerOtherDeviceName==='filesystems'  || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
		//idtobeused = $scope.device_add.id;
		idtobeused = $scope.device_add.PKID;
	}
	// get associations
	if ( $scope.associationDevices && $scope.associationDevices == true ) {
		var associationName = $scope.associationSubHeading;
		var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+idtobeused+'/'+associationName;
		$http.get(get_url).success(function(response,status,headers){
			console.log("Response got for query<"+associationName +"> is<<"+response[associationName])
			$rootScope.rows = response[associationName];
			console.log('AssociationArray--responsedata==>>>>' + JSON.stringify($rootScope.rows));
		}).catch(function (response) {
			// use field API to get columns names
			$rootScope.rows = [];

		});
	}
	console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
	$http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
		$scope.relatedCount = response.data;
		console.log('$scope.relatedCount response====' +JSON.stringify($scope.relatedCount));
		//$scope.$parent.relatedCount = response.data;
		setRelatedCounts($scope,response.data,$rootScope);
	}).catch(function(response){
$scope.table_loader_search =false;
		//$scope.$parent.relatedCount = [];
		$scope.relatedCount = [];
	});
	if (  $scope.showCustomAttribute == "true" ) {
		$http.get(__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+idtobeused+"/customattributes")
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
	}
}
    function setFrameworkColorCode($scope,target) {
		if (    !$scope.LowerOtherDeviceName || $scope.LowerOtherDeviceName == 'logicaldevices' ) {
		    var currentArrayObject = $scope.logicalDeviceData[$scope.currentIndex];
		} else {
		    var currentArrayObject = $scope.otherDeviceData[$scope.currentIndex];
		}
		if ( !currentArrayObject || currentArrayObject == "undefined" ) {
		    // current value is not set so no point checking
			return false;
		}
	    if ( target ) {
			for ( var indexc2 = 0; $scope[target] && indexc2  < $scope[target].length ; indexc2++ ){
				if ( currentArrayObject[target] && currentArrayObject[target].toLowerCase() == $scope[target][indexc2].value.toLowerCase() ) {
					console.log('values matches');
					$scope[target].myDynamicClass = 'colorchange1';
					return;
				} else {
					console.log('values does not match');
					$scope[target].myDynamicClass = 'colorchange';
				}
			}
		}
		for ( var indexc1 = 0; indexc1  < $scope.dropdownfields.length ; indexc1++ ){
			for ( var indexc2 = 0; $scope[$scope.dropdownfields[indexc1].name] && indexc2  < $scope[$scope.dropdownfields[indexc1].name].length ; indexc2++ ){

				if ( currentArrayObject[$scope.dropdownfields[indexc1].name ] && currentArrayObject[$scope.dropdownfields[indexc1].name ].toLowerCase() == $scope[$scope.dropdownfields[indexc1].name][indexc2].value.toLowerCase() ) {
					console.log('values matches');
					$scope[$scope.dropdownfields[indexc1].name].myDynamicClass = 'colorchange1';
					break;
				} else {
					console.log('values does not match');
					$scope[$scope.dropdownfields[indexc1].name].myDynamicClass = 'colorchange';
				}
			}
		}
	}


	function setRecordsPP($scope,__env) {
		if ( !$scope.recordsPP || !angular.isNumber($scope.recordsPP) ) {
		    $scope.recordsPP = __env.recordsPP;
		}
		if ( !$scope.currentPage || !angular.isNumber($scope.currentPage) ) {
			$scope.currentPage = 1;
		}
	}

	function exportData ($scope){
		var Exportstyle = {
			headers:true,
			separator:","
		}
	    $scope.currentfielddata = $scope.devicedata;
        /* export search results in csv or xls file code change starts*/
        console.log('$scope.otherDeviceData===>>>>' + JSON.stringify($scope.otherDeviceData1));
        console.log('$scope.currentfielddata====' + JSON.stringify($scope.currentfielddata));
        console.log('type===' + $scope.exportType);
        /* columns in csv/excel should come from field api code starts*/
        arrayToBeExported = [];
        selectArray = [];
        for(var j=0;j<$scope.currentfielddata.length;j++){
            if ( $scope.currentfielddata[j].returntype && ( $scope.currentfielddata[j].returntype == "showtouser" || $scope.currentfielddata[j].returntype.startsWith("1:") ) ) {
                selectArray.push($scope.currentfielddata[j].key);
            }
        }
        for(var i=0;i<$scope.otherDeviceData1.length;i++){
            var objExport = {};
            for(var j=0;j<selectArray.length;j++){
                var selectKey = selectArray[j];
                console.log(selectKey);
                var selectkey2 = $scope.otherDeviceData1[i][selectKey];
                objExport[selectKey] = selectkey2;
            }
            arrayToBeExported.push(objExport);
            console.log('arrayToBeExported====' + JSON.stringify(arrayToBeExported));
        }


        modifedHeaderArray = [];
        for(var p =0;p<$scope.currentfielddata.length;p++){
            for(var q =0;q<selectArray.length;q++){
                //console.log('$scope.selectArray[q]===' +JSON.stringify($scope.selectArray[q]));
                //console.log('$scope.headerArray[p].key===' +$scope.headerArray[p].key);
                if(selectArray[q] == $scope.currentfielddata[p].key){
                    //console.log('value matches');
                    modifedHeaderArray.push($scope.currentfielddata[p]);
                }
            }
        }

        /* logic starts*/
        tempstr = "";
        for(var i=0;i<modifedHeaderArray.length;i++) {
            if ( i < modifedHeaderArray.length-1 ) {
                tempstr += "["+modifedHeaderArray[i].key +"] as [" + modifedHeaderArray[i].fieldname +"]," ;
            } else {
                tempstr += "["+modifedHeaderArray[i].key +"] as [" + modifedHeaderArray[i].fieldname +"]";
            }
        }
        // logic ends
        // columns in csv/excel should come from field api code change ends
        var filename = $scope.devicetype + 'ExportResults_LIST'+ '.'  +$scope.exportType;
        //alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
        alasql('SELECT '+tempstr+' INTO '+$scope.exportType+' ("'+ filename+'", ?) FROM ?',[Exportstyle,$scope.otherDeviceData1]);
        // export search results in csv or xls file code change ends
    }
	
	function setDeviceInterfacesMenu($scope,$location) {
	    
		if($scope.LowerOtherDeviceName == 'deviceinterfaces'){
		    if ( $scope.deviceID && ( $scope.deviceID.toLowerCase() != "logicaldevices" || $scope.deviceID.toLowerCase() != "physicaldevices" ) ) {
			    console.log("DEVICEID is not physicaldevices or logicaldevices so no need to change menu options<"+$scope.deviceID+">");
			    return false;
			}
		    var associationName = "logicaldevices";
			var associateLowerTitle = "Logical-Devices";
		    if ( $scope.device_add && $scope.device_add.pdname && $scope.device_add.pdname.length > 0 && $scope.device_add.pdname != "*" ) {
		        associationName = "physicaldevices";
			    associateLowerTitle = "Physical-Devices";
			}
			if (  $scope.LowerOtherDeviceName && $scope.deviceName ) {
			    var deviceName = $scope.deviceName;
			    if ( $scope.devicePKID && $scope.devicePKID.length > 0 ) {
				    var deviceName = $scope.devicePKID ;
				} 
                $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+associationName+"/"+$scope.recordID +"/"+deviceName+"/"+associateLowerTitle+"/"+$scope.canbeAssociated);
			}
		}
	}