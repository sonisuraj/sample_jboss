/**
 * Created by manisha on 5/17/17.
 */
app.controller('deviceDetailController',['$scope','$http','$uibModal','$uibModalInstance','DeviceDetails','FieldNames' , function($scope,$http,$uibModal,$uibModalInstance,DeviceDetails,FieldNames) {

    $scope.showDeviceDetailModal = true;
    console.log('DeviceDetails==>>>>>' +JSON.stringify(DeviceDetails));
    for (var key in DeviceDetails) {
        if(key==='index' || key==='importid'){
            delete DeviceDetails[key];
        }
    }
    console.log('DeviceDetails after==>>>>>' +JSON.stringify(DeviceDetails));
    console.log('FieldNames==>>>' + JSON.stringify(FieldNames));
    $scope.DeviceArray = DeviceDetails;
    $scope.DeviceName = DeviceDetails.name;
    $scope.FieldData = FieldNames;
    $scope.dismissPopup = function(){
        $uibModalInstance.dismiss('cancel');
    }


}])

