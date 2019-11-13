/**
 * Created by Manisha on 9/1/2017.
 */
app.controller('transactionManagerController', ['$scope', '$http', '$uibModal', '$uibModalInstance',  '$rootScope', '$location', '$window','$timeout','$filter', function($scope, $http, $uibModal, $uibModalInstance, $rootScope, $location, $window,$timeout,$filter) {
    $scope.ngShowModalTM = true;
    $scope.FinalDisplayArr1 = [];
    $scope.displayNameDevices = {};
    $scope.headerArray = [];

    /* api call to get display names*/
    var urlCall =__env.apiUrl+"/devices/countcommon";
    $http.get(urlCall).then(function (response) {
        $scope.deviceDisplayNames =response['data'];
        console.log("Display Names got is<<"+JSON.stringify($scope.deviceDisplayNames));
        for(var i=0;i<$scope.deviceDisplayNames.length;i++){
            $scope.displayNameDevices[$scope.deviceDisplayNames[i].id.toLowerCase()] = $scope.deviceDisplayNames[i];
            if($scope.deviceDisplayNames[i].scope >= 0){
                $scope.FinalDisplayArr1.push($scope.deviceDisplayNames[i]);
            }
        }
        $scope.FinalDisplayArr = $filter('orderBy')($scope.FinalDisplayArr1, 'displayname');

    });

    $scope.dismissModalPopup = function() {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.model = {
        selectedAll: false
    };
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
            return item.Selected == true;
        }).length;
        if ( $scope.checked && $scope.checked > 0 ) {
            $scope.enabledButton = true;
        } else {
            $scope.enabledButton = false;
        }


    };
    // array inside array 
    $scope.generateTMFinal = function(){
        $scope.table_loader =true;
        var selectedDevices = '';
        var selectedDevicesArr = [];
        for(var j=0;j<$scope.FinalDisplayArr.length;j++){
            //if ( $scope.headerArray[j].Selected && $scope.headerArray[j].returntype == "showtouser") {
            if ( $scope.FinalDisplayArr[j].Selected ) {
            	selectedDevicesArr.push($scope.FinalDisplayArr[j].id.toLowerCase());
            	if ( selectedDevices == '' || selectedDevices.length <=0 ) {
            		selectedDevices = $scope.FinalDisplayArr[j].id.toLowerCase();	
            	} else {
            		selectedDevices = selectedDevices+","+$scope.FinalDisplayArr[j].id.toLowerCase(); 	
            	}
            	 
            }
        }
        console.log('Selected Devices====' +JSON.stringify(selectedDevices));
        $http.get(__env.apiUrl+'/devices/'+selectedDevices+'/getall?export=true').then(function (response) {
            $scope.exportedData = response.data;
            var opts = [];
            var arrayTobeExported = [];
            for ( var i = 0 ; i < $scope.exportedData.length ; i++ ) {
                var optObject = {};
                optObject.sheetid = $scope.exportedData[i].displayname;
                opts.push(optObject);
                arrayTobeExported.push($scope.exportedData[i][selectedDevicesArr[i]]);
            }
            $scope.table_loader = false;
            var res = alasql('SELECT  INTO XLSX("Transaction_Manager.xlsx",?) FROM ?',[opts,arrayTobeExported]);
            $uibModalInstance.dismiss('cancel');
            console.log("Return value of export is<"+res+">");
        }).catch(function(response){
        	console.log("Error occurred while calling getall<"+response+">")
        });// end of get all
    };
    
}
]);