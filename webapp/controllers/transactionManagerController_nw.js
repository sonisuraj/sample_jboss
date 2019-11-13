/**
 * Created by Manisha on 9/1/2017.
 */
app.controller('transactionManagerController', ['$scope', '$http', '$uibModal', '$uibModalInstance',  '$rootScope', '$location', '$window','DisplayNameData','$timeout','$filter', function($scope, $http, $uibModal, $uibModalInstance, $rootScope, $location, $window,DisplayNameData,$timeout,$filter) {
    $scope.ngShowModalTM = true;
    $scope.FinalDisplayArr1 = [];
    $scope.displayNameDevices = {};
    /* api call to get display names*/
    var urlCall =__env.apiUrl+"/devices/countcommon";
    $http.get(urlCall).then(function (response) {
        $scope.deviceDisplayNames =response['data'];
        console.log(JSON.stringify($scope.deviceDisplayNames));
        for(var i=0;i<$scope.deviceDisplayNames.length;i++){
			$scope.displayNameDevices[$scope.deviceDisplayNames[i].id.toLowerCase()] = $scope.deviceDisplayNames[i];
            if($scope.deviceDisplayNames[i].scope >= 0){
                console.log('val>0');
                $scope.FinalDisplayArr1.push($scope.deviceDisplayNames[i])
                }
        }
        $scope.FinalDisplayArr = $filter('orderBy')($scope.FinalDisplayArr1, 'displayname');

    });
    $scope.CountTablesData = DisplayNameData;
    console.log(JSON.stringify($scope.CountTablesData));

    $scope.dismissModalPopup = function() {
        $uibModalInstance.dismiss('cancel');
    }
    $scope.model = {
        selectedAll: false
    }
    $scope.selectAll = function(array) {
        console.log(JSON.stringify(array));
        angular.forEach(array, function(item) {
            item.Selected = $scope.model.selectedAll;

        });
        if ( $scope.model.selectedAll === true ) {
            $scope.enabledButton = true;
        } else {
            $scope.enabledButton = false;
        }
    };

    $scope.checkIfAllSelected = function(array) {
        console.log(JSON.stringify(array));
        $scope.model.selectedAll = array.every(function(item) {
            return item.Selected == true;
        });
        $scope.checked = array.filter(function(item) {
            return item.Selected == true
        }).length;
        if ( $scope.checked && $scope.checked > 0 ) {
            $scope.enabledButton = true;
        } else {
            $scope.enabledButton = false;
        }


    };


    $scope.generateTMFinal = function(){
        $scope.table_loader =true;
        $scope.selectArray = []
        for(var j=0;j<$scope.FinalDisplayArr.length;j++){
            //if ( $scope.headerArray[j].Selected && $scope.headerArray[j].returntype == "showtouser") {
            if ( $scope.FinalDisplayArr[j].Selected ) {

                $scope.selectArray.push($scope.FinalDisplayArr[j].id.toLowerCase());
            }
        }

        console.log('$scope.selectArray====' +JSON.stringify($scope.selectArray));
        //$scope.selectArray.sort();
        $scope.generateFinalArrayTM = []
        /* call getallcommon api for all selected devices*/
        for(var p=0;p<$scope.selectArray.length;p++){
            (function(p){  // i will now become available for the someMethod to call
                $timeout(function() {
                    //someMethod(i);
                    $scope.newfuncGenerateTM($scope.selectArray[p],p,$scope.selectArray.length)
                    /*if(p == ($scope.selectArray.length -1)){
                     alert('inside last iteration');
                     console.log('data in last iteration==='+p +JSON.stringify($scope.generateFinalArrayTM))

                     }*/
                }, p * 2000);
            })(p);



        }






    }


    $scope.newfuncGenerateTM = function(selectedArr,iteration,len){
        console.log(len);
        console.log(iteration);
        $http.get(__env.apiUrl+'/devices/'+selectedArr+'/getallcommon?offset=1&limit=20000').then(function (response) {
            $scope.exportLgData = response.data;
            $http.get(__env.apiUrl+'/devices/fields/'+selectedArr).then(function (response) {
				$scope.headerArrayBefore = response.data.fields;
				/* removing fields in export for which returntype is not "showtouser"*/
			    $scope.modifedHeaderArray = [];
			    $scope.tempstrArr = [];
				for(var i=0;i<$scope.headerArrayBefore.length;i++){
					var fieldDetails = $scope.headerArrayBefore[i];
					if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
						$scope.modifedHeaderArray.push($scope.headerArrayBefore[i]);
					    $scope.tempstrArr.push({'columnid' : fieldDetails.key , 'title' : fieldDetails.fieldname});

					}
				}
				$scope.tempstrArr
			    $scope.tempstr = "";
				
				for(var i=0;i<$scope.modifedHeaderArray.length;i++) {
					    if (!$scope.tempstr  || $scope.tempstr.length < 1 ) {
						    $scope.tempstr += "["+$scope.modifedHeaderArray[i].key +"] as [" + $scope.modifedHeaderArray[i].fieldname +"]" ;
					    } else {
					    	$scope.tempstr += ",["+$scope.modifedHeaderArray[i].key +"] as [" + $scope.modifedHeaderArray[i].fieldname +"]" ;
					    }
				}

				//console.log(JSON.stringify($scope.exportLgData));
				// get fields , anyway one device type can be selected once only...
				var tempObj = {};
				var key2 = selectedArr;
				tempObj[key2] = $scope.exportLgData;
				$scope.generateFinalArrayTM.push(tempObj)
				if(iteration == len-1){
					console.log('inside last iteration');
					console.log('data in last iteration==='+iteration +$scope.generateFinalArrayTM)
					//$scope.table_loader = false;
					var data3 = $scope.generateFinalArrayTM;
					var opts = [];
					var arrayTobeExported = [];
					/* generate excel with multiple sheets logic starts*/
					for(var p = 0 ;p< data3.length;p++){
						var optObject = {
							"sheetid":' ',
							"headers" : "true"
						}

						Object.keys(data3[p]).forEach(function(key,index) {
							console.log(key);
							if(data3[p][key].length != 0){
								console.log('field url---' + __env.apiUrl+'/devices/fields/'+key);
								optObject.sheetid = $scope.displayNameDevices[key.toLowerCase()].displayname;
								optObject.columns = 
								opts.push(optObject);
								var urlvar = 'data_' +key;
								urlvar=data3[p][key];
								arrayTobeExported.push(urlvar);
							}
						});
					}
					/* generate excel with multiple sheets logic ends*/

					$timeout(function () {


						//var opts = [{sheetid:'Custom_Attributes',header:true},{sheetid:'Related_Counts',header:false},{sheetid:'Attributes',header:false}];
						$scope.table_loader = false;
						
						var res = alasql('SELECT '+$scope.tempstr+' INTO XLSX("Transaction_Manager.xlsx",?) FROM ?',
							[opts,arrayTobeExported]);
						$uibModalInstance.dismiss('cancel');

					}, 3000);


				}
			});	
            //console.log(JSON.stringify($scope.generateFinalArrayTM))

        });
    }

}
])