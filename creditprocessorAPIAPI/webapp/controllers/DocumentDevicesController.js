app.controller('DocumentDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.roleBasedCanBeAssociated=false;
	}
	else {
		$scope.roleBasedCanBeAssociated=true;
	}
	//UploadDocument
	$scope.navigationOther =function(name,pkid,otherdevicename){
		console.log(__env.apiUrl+"/devices/"+otherdevicename+"/"+pkid+"/rownum");
			$http.get(__env.apiUrl+"/devices/"+otherdevicename+"/"+pkid+"/rownum").success(function (response) {
				var no =response.ROWNUM;
				var redirectUrl = "/otherDevices/"+otherdevicename+"/first/"+no+"/"+pkid +"/undefined/undefined";
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
	$scope.showAddBtn = false;
	$scope.uploadPic = function(file,NameDoc,doctype) {
		console.log(file);
		console.log(doctype);
		console.log('NameDoc==>>>' + NameDoc);
		/*if(!file || !$scope.doclinkVal || docname || !$scope.doclinkdescVal){
			alert("Please Enter all the Fields");
			return;
		}*/

		if(!file){
			alert("Please Enter all the Fields");
			return;
		}
		if(file.size > 1000000){
			alert("Please choose filesize less than 1MB");
			$scope.picFile = '';
			return;
		}
		$scope.maxUploadSize =__env.maxFileSizeUpload;
		var docname = $("#documenttypeVal").val();
		console.log($scope.doclinkVal+docname+$scope.doclinkdescVal+$scope.doctype);
		console.log('link==>>>>' + $scope.doclinkVal);
		console.log('docname==>>>' + docname);
		console.log('description==>>>' + $scope.doclinkdescVal);
		console.log('doctype==>>>' + file.type);
		console.log(file);
		console.log('upload doc url==>>' +__env.apiUrl+'/documents/upload');
		console.log('link value==>>>' +$scope.doclinkVal);
		console.log('desc value===>>>' +$scope.doclinkdescVal);
		if($scope.doclinkVal === undefined){
			$scope.doclinkVal = '';
		}
		if($scope.doclinkdescVal === undefined){
			$scope.doclinkdescVal = '';
		}
		var params = {'link':$scope.doclinkVal,'docname':NameDoc,'description':$scope.doclinkdescVal,'doctype':doctype, 'file': file}

		console.log('params==>>>' +JSON.stringify(params));
		file.upload = Upload.upload({
			url:   __env.apiUrl+'/documents/upload',
			data: {'link':$scope.doclinkVal,'docname':NameDoc,'description':$scope.doclinkdescVal,'doctype':doctype, 'file': file},
		});

		file.upload.then(function (response) {
			//alert('successfully uploaded the file');
			$timeout(function () {
				file.result = response.data;
				console.log('successful insert===' + JSON.stringify(file.result));
				var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
				console.log('post_url==' + post_url);
				$http.post(post_url,{"devicetype":"documents","devicename":file.result.id})
					.success(function (response){
						alert('Successfully associated sample document '+ NameDoc + ' with '+$scope.deviceName);
						$scope.filterTextNew.name = '';
						$('.collapse').collapse('hide');
						console.log('successfully associated');
						//$scope.showRightTable = true;
						var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/documents";



						$http.get(urlCall)
							.then(function (response) {
								console.log('success of get doc api refresh');
								$scope.data =response['data']['documents'];
								$rootScope.relatedCountShowMark =true;
								$scope.$parent.data =response['data']['documents'];
								//$scope.devicesCount = response['data']['documents'].size();
								$scope.devicesCount = response['data']['documents'].length;
								console.log('$scope.data after uploading===>>>' + JSON.stringify($scope.data));
								$scope.documentSpinner = false;
								$scope.table_loader = false;
							});
						getLogialDeviceRelatedData($scope,$http,__env);
						/*if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;
						 $scope.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;*/
					})
					.catch(function (response) {
						if ( status == 409 ) {
							alert('Document '+ compName + ' already associated with '+$scope.deviceName);
							$scope.documentSpinner = false;
							$scope.table_loader = false;
							$rootScope.searchDocumentJson =[];
						} else {
							alert('Error11 occurred while updating document '+ NameDoc + '');
							/*alert('Error occurred while updating document '+ NameDoc + ' for '+$scope.deviceName);*/
							$scope.documentSpinner = false;
							$scope.table_loader = false;
						}

						console.log("Inside error case");
						$scope.statusCode = response.status;
						$scope.statusText = (response.statusText);
						console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

					});

			});
		}, function (response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ': ' + response.data;
		}, function (evt) {
			// Math.min is to fix IE which reports 200% sometimes
			file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
			if(file.progress ==100){
				$scope.docSpin = true;
				$scope.table_loader = true;
				/*adding associate api call once file is uploaded starts*/
				console.log('$scope.deviceName==>>>>' + $scope.deviceName);

				/* adding associate api call ends*/
				var allGetDocument = __env.apiUrl+'/documents/getall';
				$http.get(allGetDocument)
					.then(function (response) {
						$scope.docSpin = false;
						$scope.table_loader = false;
						$rootScope.searchDocumentJson =response['data']['documents'];
						console.log('$rootScope.searchDocumentJson===>>>>' + JSON.stringify($rootScope.searchDocumentJson));
						document.getElementById('Modal_doc').style.display = "none";
						//$scope.close_Modal('Modal_linkInput');
						$scope.showAddBtn = false;

						$scope.doclinkVal="";
						$scope.doclinkdescVal="";
						$("#documenttypeVal").val("");
						file.progress ==0;
						$scope.picFile= '';
						window.scrollTo(0,document.body.scrollHeight);
					});


			}
		});
	}
	//Upload Document End

	/*Start:: Documents related code here*/
	$scope.checkforEmpty = function(){
		$scope.showadd = false;
		$scope.showRightTable = false;
		console.log('$scope.filterTextNew.name===' + $scope.filterTextNew.name);
		if($scope.filterTextNew.name === ''){
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

	$scope.searchDocument = function(documentname){
		$rootScope.searchDocumentJson =[];
		$scope.documentSpinner = true;
		$scope.table_loader = true;
		//$scope.showRightTable = true;
		if(!documentname || documentname ==''){
			alert('Please enter valid document name');
			$scope.table_loader = false;
			return false;
		}
		if(documentname === ''){
			//alert('value===empty');
			$scope.showRightTable = false;
		}
		console.log('inside search documentname');
		console.log('documentname===' + documentname);
		var searchURL = __env.apiUrl+"/devices/search";
		var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}
		var searchDocumentData = { "devicetype" : "documents",
			"search":[{ "fieldname" : "name" , "fieldvalue" :documentname}]
		}
		//alert(searchURL);
		$http.post(searchURL, searchDocumentData, config)
			.success(function (data, status, headers, config) {
				console.log('Document search  data===' + JSON.stringify(data));
				$rootScope.searchDocumentJson = data;
				$scope.$parent.searchDocumentJson = data;

				console.log('$scope.searchDocumentJson===' + JSON.stringify($rootScope.searchDocumentJson));
				console.log('inside search api');
				console.log("Document<"+documentname+"> updated successfully");
				$scope.documentSpinner = false;
				$scope.table_loader = false;
				console.log('$rootScope.searchDocumentJson.length===' + $rootScope.searchDocumentJson.length);

				$scope.showRightTable = true;
				if($rootScope.searchDocumentJson.length === 0){
					$scope.showAddBtn = true;
				}
				else{
					$scope.showAddBtn = false;
				}
				if(documentname == '*'){
					$scope.showAddBtn = false;
					//$scope.showRightTable = true;
					console.log('$rootScope.searchDocumentJson==' +JSON.stringify($rootScope.searchDocumentJson));
				}

			})
			.error(function (data, status, headers, config) {
				console.log('data===' + data);
				console.log('status===' + status);
				$scope.documentSpinner = false;
				$scope.table_loader = false;
				if ( status == 409 ) {
					alert("Duplicate Document Name exists<"+documentname+"> Please use unique name");
					$rootScope.searchDocumentJson =[];
				} else {
					alert("Error occurred while updating < "+documentname+" >< "+status);
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
			});

		if(documentname === '*'){
			//alert('value===empty');
			$scope.showRightTable = true;
			console.log('$rootScope.searchDocumentJson==' +JSON.stringify($rootScope.searchDocumentJson));
			//$scope.showadd = false;
		}

	}
	$scope.documentChange = function(documentName){
		$scope.documentName = documentName;
		angular.element('#documentnameVal').val(documentName);
	}

	$scope.disassociateDevicesToDevices = function(compName,pkid){
		$scope.documentSpinner = true;
		$scope.table_loader = true;
		console.log('compName==>>>' + compName);

		var post_url=__env.apiUrl+"/devices/logicaldevices/disassociate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"documents","devicename":pkid})
			.success(function (response){
				alert('Successfully disassociated document '+ compName + ' with '+$scope.deviceName);
				$('.collapse').collapse('hide');
				var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/documents";
				console.log(urlCall);
				$http.get(urlCall)
					.then(function (response) {
						$scope.data =response['data']['documents'];
						$scope.$parent.data =response['data']['documents'];
						$scope.documentSpinner = false;
						//$scope.showRightTable = true;
						$scope.table_loader = false;
					}).catch(function(response){
						console.log(response);
						if(response.status == 404){
							$scope.data = "";
							$scope.$parent.data ="";
							$scope.documentSpinner = false;
							$scope.table_loader = false;
						}
					});
					})
			.catch(function (response) {
				console.log('response.status==>>>' + response.status);

					alert('Error occurred while updating document '+ compName + ' for '+$scope.deviceName);
					$scope.documentSpinner = false;
					$scope.table_loader = false;


				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);


			});
	}

	$scope.associateDocToLD = function(compName,docname,pkid){
		$scope.documentSpinner = true;
		$scope.table_loader = true;
		console.log('docname==>>>' + docname);

		var post_url=__env.apiUrl+"/devices/logicaldevices/associate/"+$scope.deviceName;
		$http.post(post_url,{"devicetype":"documents","devicename":pkid})
			.success(function (response){
				alert('Successfully associated document '+ docname + ' with '+$scope.deviceName);
				$scope.filterTextNew.name = '';
				$('.collapse').collapse('hide');
				var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/documents";
				$http.get(urlCall)
					.then(function (response) {
						$scope.data =response['data']['documents'];
						$scope.$parent.data =response['data']['documents'];
						$scope.documentSpinner = false;
						//$scope.showRightTable = true;
						$scope.table_loader = false;
					});
				getLogialDeviceRelatedData($scope,$http,__env);
				/*if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;
				$scope.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;*/
			})
			.catch(function (response) {
				console.log('response.status==>>>' + response.status);
				if(response.status === 400){
					alert('Document '+ docname + ' already associated with '+$scope.deviceName);
					$scope.table_loader = false;
					//$rootScope.searchDocumentJson =[];
				}
				else if ( status == 409 ) {
					alert('Document '+ compName + ' already associated with '+$scope.deviceName);
					$scope.documentSpinner = false;
					$scope.table_loader = false;
					$rootScope.searchDocumentJson =[];
				}


				else {
					alert('Error occurred while updating document '+ compName + ' for '+$scope.deviceName);
					$scope.documentSpinner = false;
					$scope.table_loader = false;
				}

				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                if(response.status == 404){
					alert('Document '+ docname + ' already associated with '+$scope.deviceName);
				}

			});
	}




	$scope.doc_changed = function() {
		var file = $scope.fileinput;
		console.log('file is ' );
		console.dir(file);
		/*var uploadUrl = "/fileUpload";
		 fileUpload.uploadFileToUrl(file, uploadUrl);*/

		//alert(JSON.stringify(fileArr));
		document.getElementById('Modal_link').style.display = "block";
	} //$scope.clicked = true;


	$scope.docUploadTrue = function() {
		$scope.docUploadFlag = 1;
		setTimeout(function() {
			document.getElementById('Modal_doc').style.display = "none";
			document.getElementById('fileinput').click()
			//$scope.clicked = true;

		}, 0);
	}
	$scope.docUpdateSumit = function() {
		$scope.table_loader = true;
		$scope.docSpin = true;
		var formData = new FormData(document.getElementById('docForm'));
		alert(formData);
		console.log('formData==>>>>' + formData);
		//  alert($scope.docForm);return false;
		/*if((!$scope.doclinkVal && !$scope.doclinkdescVal) || ($scope.doclinkVal=='' && $scope.doclinkdescVal==''))
		 {
		 document.getElementById('err_msg').innerHTML ='Please enter Link value and Description!';
		 return false;
		 }
		 */
		var url = __env.apiUrl+'/documents/upload';
		//$scope.fileinput = $scope.fileArr;
		//$scope.fileinput.src = "";
		/*  var formData = {
		 "docname": $scope.filterTextNew.name,
		 "doctype": $scope.documentType,
		 "link": $scope.doclinkVal,
		 "description":$scope.doclinkdescVal,
		 "file":$scope.fileinput
		 }*/

		var config = {
			headers : {
				'Content-Type': 'multipart/form-data',
				'mimeType'    : 'multipart/form-data',
			}
		}
		alert(JSON.stringify(formData));

		$http.post(url, formData, config)
			.success(function (data, status, headers, config) {
				console.log('success data===' + JSON.stringify(data));
				console.log('added logical device successfully');
				$scope.table_loader = false;
				$scope.docSpin = false;

			})
			.error(function (data, status, headers, config) {
				console.log('data===' + data);
				console.log('status===' + status);
				if ( status == 409 ) {
					alert("Duplicate record exists<"+$scope.deviceName+"> Please use unique name");
					$scope.table_loader = false;
					$scope.docSpin = false;
					$rootScope.searchDocumentJson =[];
					/*$scope.showErrorAlert = true;*/
					/*angular.element(document.getElementById('submit'))[0].disabled = true;*/
				} else {
					alert("Error occurred while updating device<"+$scope.deviceName+"><"+status);
					$scope.table_loader = false;
					$scope.docSpin = false;
				}
				console.log('headers===' + headers);
				console.log('config===' + config);
			});
	}

	$scope.docLinkTrue = function()
	{
		document.getElementById('Modal_link').style.display = "none";
		document.getElementById('Modal_linkInput').style.display = "block";
	}
	$scope.docUpdateFalse = function(modalID)
	{
		/*if(modalID ==='Modal_doc')
		{
			$scope.docUploadFlag = 0;
			document.getElementById('Modal_link').style.display = "block";
		}
		else if(modalID ==='Modal_link')
		{
			$scope.docLinkFlag = 0;
			if($scope.docUploadFlag == 0){
				document.getElementById('Modal_msg').style.display = "block";
			}

		}*/

		document.getElementById(modalID).style.display = "none";
	}

	$scope.close_Modal = function(modalID)
	{
		document.getElementById(modalID).style.display = "none";
		if(modalID =='Modal_msg'){
			document.getElementById('Modal_doc').style.display = "block";
		}

	}

	$scope.addNewDocument = function(Filename,documentname,documenttype){
	    if ( !documenttype  ) {
		    alert ("Please enter document type");
			document.getElementById("documenttypeVal").focus();
			return false;
		}
	    if ( !Filename  ) {
		    alert ("Please enter document name");
			document.getElementById("documentnameVal").focus();
			return false;
		}
		$scope.otdtable2 =true;
		console.log('Filename==>>>' + Filename);
		console.log('$scope.document===' +JSON.stringify(documentname));
		console.log('inside add new document');
		//var element = angular.element(document.getElementById('fileinput'));
		document.getElementById('Modal_doc').style.display = "block";
		//return false;
		var documentname = angular.element('#documentnameVal').val();

		console.log('documentname===' + documentname);

	} // end of function

	/*End:: Documents related code here*/

	$scope.otdtable2 =false;

	$scope.otdtable12 =function(){
		$('.change_col').removeClass('col-md-12').addClass('col-md-8');
		$("#otd-table-2").addClass('col-md-4');
		$scope.otdtable2 =true;
		$scope.showRightTable = false;
		console.log('$scope.showRightTable===>>>' +$scope.showRightTable);

	}

	$scope.showInfo = function(info){
		//alert('show info');
		console.log('info===' + JSON.stringify(info));
		Object.keys(info).forEach(function(key,index) {
			//console.log('key===' + key);
			//console.log('index==' + index);
			if(key==='id'){
				delete info[key];
			}

		});
		$scope.deviceInfo = info;

	}

	$scope.DocTypeNames = [];
	$http.get(__env.apiUrl+'/devices/dropdown/doctype').then(function (response) {
		for ( var j = 0 ; j < response.data.length ; j++  ) {
			$scope.DocTypeNames.push(response.data[j].value);
		}
	}).catch(function(response){
		$scope.StakeHolderNames = ["Developer","Lead","Role1" , "Role2" , "Role3"];
	});
} //end controller

]);
