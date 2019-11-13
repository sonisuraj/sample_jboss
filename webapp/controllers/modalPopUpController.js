app.controller('ModalController',['$scope','$http','$uibModal','DeviceType','Format','$uibModalInstance','$timeout','$rootScope' , function($scope,$http,$uibModal,DeviceType,Format,$uibModalInstance,$timeout,$rootScope) {
    $scope.ngShowModal2 = true;
    $scope.table_loader=true;
    $scope.headerArray = [];
    console.log('Format==>>>' + Format);
    console.log('DeviceType==>>>>' + DeviceType);
    $rootScope.DisplayDevType = DeviceType;

    $scope.compTocomp = [
        {
            "Inbound Component Name" : "CheckComp",
            "Outbound Component Name" : "OUTBOUND",
            "Average Active Connections per second" : "",
            "Average Bits per second" : "",
            "Average Network Round Trip Time" : "",
            "Average Packets per second" : "",
            "Communication Type" : "http",
            "Description" : "",
            "Discovery Status" : "",
            "Hardcoded IP Addresses" : "",
            "Hardcoded Server Names" : "",
            "Port Numbers" : "",
            "Protocol" : "http",
            "id" : "97C73E3E-AA6F-004B-BBFE-8A7BFBEB1D61",
            "Custom Attributes" : "",
            "Notes" : ""
        },

        {
            "Inbound Component Name" : "inbound",
            "Outbound Component Name" : "CheckComp",
            "Average Active Connections per second" : "",
            "Average Bits per second" : "",
            "Average Network Round Trip Time" : "",
            "Average Packets per second" : "",
            "Communication Type" : "ftp",
            "Description" : "",
            "Discovery Status" : "",
            "Hardcoded IP Addresses" : "",
            "Hardcoded Server Names" : "",
            "Port Numbers" : "",
            "Protocol" : "ftp",
            "id" : "DF1535A7-F677-C34C-BB17-CE3E201C9163",
            "Custom Attributes" : "",
            "Notes" : ""
        }

    ]
    $scope.componentToSerList = [
        {
            "Component Name" : "CheckComp",
            "Service Name" : "WAS"
        },
        {
            "Component Name" : "defg",
            "Service Name" : "ABCD"
        },
        {
            "Component Name" : "defg",
            "Service Name" : ""
        }

    ]
    $scope.otherDeviceHeaderArray = [

    ]

    $scope.componentToLDList = [
        {
            "Component Name" : "CheckComp",
            "Device Name" : "-[867312X]-",
            "Environment" : "Windows"
        },
        {
            "Component Name" : "defg",
            "Device Name" : "-71483RG-",
            "Environment" : "Windows"
        },
        {
            "Component Name" : "defg",
            "Device Name" : "AMSVPADC101",
            "Environment" : ""
        }

    ]

    $scope.LdToPd = [
        {
            "Logical Device Name" : "-71483RG-",
            "Physical Device Name" : "TESTPHYSICALDEVICE",
            "Serial Number" : "TEST1",
            "id_LD" : "AEB9624B-B672-3F46-8B78-7BF27955DBFB",
            "id_PD" : "654E3BBE-1490-9D47-AB7A-BCE58BACF1B3"
        },
        {
            "Logical Device Name" : "-7870B4G-",
            "Physical Device Name" : "TESTPHYSICALDEVICE",
            "Serial Number" : "",
            "id_LD" : "DA94C8A6-A09D-1243-BC7E-1D8FD12DD426",
            "id_PD" : "654E3BBE-1490-9D47-AB7A-BCE58BACF1B3"
        },
        {
            "Logical Device Name" : "-867312X-",
            "Physical Device Name" : "TESTPHYSICALDEVICE",
            "Serial Number" : "",
            "id_LD" : "25290FE5-7808-AB44-917E-3D678675CEBB",
            "id_PD" : "654E3BBE-1490-9D47-AB7A-BCE58BACF1B3"
        }

    ]
    $scope.itemsPD = [
        {
            "Child Physical Device" : "TESTPHYSICALDEVICE",
            "Parent Physical Device" : "TEST3"
        },
        {
            "Child Physical Device" : "TEST3",
            "Parent Physical Device" : "asdasdsdsd"
        }
    ]

    $scope.LdtoClusterList = [
        {
            "Device Name" : "-867312X-",
            "Cluster Name" : "TESTSERVICE",
            "id_LD" : "25290FE5-7808-AB44-917E-3D678675CEBB",
            "id_Cluster" : "6953C0D0-5EC2-1B4D-B43B-71064CA384A9"
        },
        {
            "Device Name" : "AMSVPADC101",
            "Cluster Name" : "TESTSERVICE",
            "id_LD" : "25290FE5-7808-AB44-917E-3D678675CEBB",
            "id_Cluster" : "6953C0D0-5EC2-1B4D-B43B-71064CA384A9"
        },
        {
            "Device Name" : "AMSVPCOL101",
            "Cluster Name" : "TESTSERVICE",
            "id_LD" : "70A31F19-34F0-7E4C-84BE-41FF8EA5F33D",
            "id_Cluster" : "6953C0D0-5EC2-1B4D-B43B-71064CA384A9"
        },
        {
            "Device Name" : "-[867312X]-",
            "Cluster Name" : "TESTSERVICE",
            "id_LD" : "4DB0DD91-3878-BF4D-B5D8-F1C2D8F89BB4",
            "id_Cluster" : "6953C0D0-5EC2-1B4D-B43B-71064CA384A9"
        }

    ]

    $scope.clusterResourcs = [
        {
            "Device Name" : "-[867312X]-",
            "Logical Device Host" : "TESTSERVICE"
        },
        {
            "Device Name" : "[Intel(R) Pentium(R) III Xeon processor, Intel(R) Pentium(R) III processor]",
            "Logical Device Host" : " "
        },
        {
            "Device Name" : "-71483RG-",
            "Logical Device Host" : "TESTSERVICE"
        },
        {
            "Device Name" : "7870B4G-",
            "Logical Device Host" : "TESTSERVICE"
        },
        {
            "Device Name" : "-867312X-",
            "Logical Device Host" : "TESTSERVICE"
        }
    ]
    $scope.serviceToStakeholderList = [
        {
            "Service Name" : "WAS",
            "Stakeholder" : "ALL",
            "Role" : "TEST"
        },
        {
            "Service Name" : "WAS",
            "Stakeholder" : "asdsdasdsdd",
            "Role" : "asdsdd"
        }
    ]

    $scope.compToStakeholer = [
        {
            "ABB" : "CheckComp",
            "Stakeholder" : "COMPSTAKE",
            "Role" : "asdsdsd"
        }
    ]

    $scope.PdToStakeholderList = [
        {
            "Physical Device" : "TEST3",
            "Stakeholder" : "TTESTSDSD",
            "Role" : "asdsdsdsd"
        },
        {
            "Physical Device" : "TEST3",
            "Stakeholder" : "fshgdafsdasd",
            "Role" : "asdsdsd"
        }
    ]

    $scope.itemsInterface = [
        {
            "Source Device" : "-71483RG-",
            "Source Device Interface Address" : "9.10.1022.3",
            "Target Device" : "Unknown Device",
            "Target Device Interface Address": "9.1.2.4"
        },
        {
            "Source Device" : "Unknown Device",
            "Source Device Interface Address" : "9.1.2.4",
            "Target Device" : "-71483RG-",
            "Target Device Interface Address": "9.10.1022.3"
        },
        {
            "Source Device" : "-71483RG-",
            "Source Device Interface Address" : "9.10.1022.3",
            "Target Device" : "Unknown Device",
            "Target Device Interface Address": "9.1.2.4"
        },
        {
            "Source Device" : "-71483RG-",
            "Source Device Interface Address" : "9.10.1022.3",
            "Target Device" : "Unknown Device",
            "Target Device Interface Address": "9.1.2.3"
        }

    ]
    $scope.LdtoStakeholder = [
        {
            "Admin~Compare::_FC" : "0"
        }
    ]

    $scope.serviceAliases = [
        {
            "Service Name" : "TESTSERVICEADD",
            "Alias" : "ALIASFORTEST"
        },
        {
            "Service Name" : "TESTSERVICEADD",
            "Alias" : "ALIASFORTEST1"
        },
        {
            "Service Name" : "WAS",
            "Alias" : "ALIASFORTEST3"
        },
        {
            "Service Name" : "WAS",
            "Alias" : "ALIASFORTEST4"
        },
        {
            "Service Name" : "ABCD",
            "Alias" : "hajsdhjashdshd"
        },
        {
            "Service Name" : "TESTSERVICEADD",
            "Alias" : "hajsdhjashdshd222"
        },
        {
            "Service Name" : "asdasdsdsdsdsdsd",
            "Alias" : "hajsdhjashdshd22233"
        }
    ]

    /*if(DeviceType === 'Component to Component') {
        $scope.exportLgData = $scope.compTocomp;
        console.log('$scope.exportLgData===>>>>' +JSON.stringify($scope.exportLgData));

        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }*/
    if(DeviceType === 'Component to Service'){

        $scope.exportLgData = $scope.componentToSerList;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Component to Logical Device'){
        $scope.exportLgData = $scope.componentToLDList;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Logical Device To Physical Device'){
        $scope.exportLgData = $scope.LdToPd;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Physical Device to Physical Device'){
        $scope.exportLgData = $scope.itemsPD;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Logical Device To Cluster'){
        $scope.exportLgData = $scope.LdtoClusterList;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Cluster Resources'){
        $scope.exportLgData = $scope.clusterResourcs;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Stakeholder to Service'){
        $scope.exportLgData = $scope.serviceToStakeholderList;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }

    if(DeviceType === 'Stakeholder to Component'){
        $scope.exportLgData = $scope.compToStakeholer;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Stakeholder to Logical Device'){
        $scope.exportLgData = $scope.LdtoStakeholder;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }
    if(DeviceType === 'Stakeholder to Physical Device'){
        $scope.exportLgData = $scope.PdToStakeholderList;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }

    /*if(DeviceType === 'Device Interface'){
        $scope.exportLgData = $scope.itemsInterface;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }*/

    if(DeviceType === 'service aliases'){
        $scope.exportLgData = $scope.serviceAliases;
        console.log('$scope.exportLgData==>>>>' +JSON.stringify($scope.exportLgData));
        Object.keys($scope.exportLgData[0]).forEach(function (key, index) {
            var temp1 = {}
            temp1.key = key;
            temp1.fieldname = key;
            $scope.otherDeviceHeaderArray.push(temp1)
        })
        console.log('$scope.otherDeviceHeaderArray===' +JSON.stringify($scope.otherDeviceHeaderArray));
        $scope.headerArray = $scope.otherDeviceHeaderArray;
        $scope.table_loader=false;
    }


    else{

    $http.get(__env.apiUrl+'/devices/'+DeviceType+'/getall').then(function (response) {
        console.log('response.data===>>>>' + JSON.stringify(response.data));
        $scope.exportLgData = response.data;
        console.log('$scope.exportLgData=====' +JSON.stringify($scope.exportLgData));
        $http.get(__env.apiUrl+'/devices/fields/'+DeviceType+'').then(function (response) {
            $scope.table_loader=false;
            $scope.headerArrayBefore = response.data.fields;
            console.log('$scope.headerArrayBefore==>>>' + JSON.stringify($scope.headerArrayBefore));

            /* removing fields in export for which returntype is not "showtouser"*/
            for(var i=0;i<$scope.headerArrayBefore.length;i++){
                var fieldDetails = $scope.headerArrayBefore[i];
                if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") || fieldDetails.key ==='entityname' ) ) {
                    $scope.headerArray.push($scope.headerArrayBefore[i]);
                }
            }
            /* removal code changes ends*/
            console.log('$scope.headerArrays after of '+DeviceType+'====' + JSON.stringify($scope.headerArray));
        });
    });
    }
    $scope.selectArray =[];
    $scope.model = {
        selectedAll: false
    }
    $scope.selectAll = function(array) {
        //console.log(JSON.stringify(array));
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
        //console.log(JSON.stringify(array));
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

    $scope.dismissModalPopup = function(){
        $uibModalInstance.dismiss('cancel');
    }

    $scope.exportLD = function(devicetype){
        //alert('inside export LD June28');
        $scope.ArrayToBeExported = [];
        for(var j=0;j<$scope.headerArray.length;j++){
            //if ( $scope.headerArray[j].Selected && $scope.headerArray[j].returntype == "showtouser") {
           if ( $scope.headerArray[j].Selected ) {
                $scope.selectArray.push($scope.headerArray[j].key);
            }
        }
        for(var i=0;i<$scope.exportLgData.length;i++){
            var objExport = {};
            for(var j=0;j<$scope.selectArray.length;j++){
                    var selectKey = $scope.selectArray[j];
                    var selectkey2 = $scope.exportLgData[i][selectKey];
                    if(selectkey2)
                    {
                    objExport[selectKey] = selectkey2;
                  }else{  objExport[selectKey] = '';}
            }
            $scope.ArrayToBeExported.push(objExport);
            //console.log('$scope.ArrayToBeExported====' + JSON.stringify($scope.ArrayToBeExported));
        }
        $scope.filename = DeviceType + '.' +Format;
        $scope.FinalArrayToExport = [];
        console.log('filename====' + $scope.filename);

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
        console.log('$scope.modifedHeaderArray===' +JSON.stringify($scope.modifedHeaderArray));
        console.log('$scope.headerArray===' +JSON.stringify($scope.headerArray));
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
        //console.log(JSON.stringify($scope.tempstr))
        /* logic ends*/
        var mystyle = {
            headers:true,
            separator:","
        }
        var formatType = Format.toUpperCase();


        alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
        //alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", {headers:true,separator:","}) FROM ?',[$scope.ArrayToBeExported]);

        $uibModalInstance.dismiss('cancel');
    }
}])