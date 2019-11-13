/**
 * Created by Manisha on 9/18/2017.
 */
app.controller('frameworkController',['$scope','$http','__env','$location','$filter',function($scope,$http,__env,$location,$filter) {

    console.log('inside framwork controller');
    $scope.FinalDisplayArr1 = [];

   // var urlCall =__env.apiUrl+"/devices/countcommon";
    var newUrlCall = __env.apiUrl+"/devices/customattributes/getentities";
    $http.get(newUrlCall).then(function (response) {
        //$scope.deviceDisplayNames =response['data'];
        $scope.deviceDisplayNames =response['data']['dropdown'];
        console.log("Display Names got is<<"+JSON.stringify($scope.deviceDisplayNames));
        for(var i=0;i<$scope.deviceDisplayNames.length;i++){
           // $scope.displayNameDevices[$scope.deviceDisplayNames[i].id.toLowerCase()] = $scope.deviceDisplayNames[i];
            if($scope.deviceDisplayNames[i].value != 'FRAMEWORK'){
                $scope.FinalDisplayArr1.push($scope.deviceDisplayNames[i]);
            }
        }
        $scope.FinalDisplayArr = $filter('orderBy')($scope.FinalDisplayArr1, 'displayname');

    });

    var urlcall1 = __env.apiUrl+"/devices/dropdown/environment";
    $http.get(urlcall1)
        .then(function (response) {
            $scope.data =response['data'];
            console.log(JSON.stringify($scope.data));
        });

    $scope.openTab = function(val){
        $scope.table_loader = true;
        $scope.data = [];
        console.log(val);
        $scope.FinalVal = val.toLowerCase();
        var urlcall2 = __env.apiUrl+"/devices/dropdown/"+$scope.FinalVal;
        $http.get(urlcall2)
            .then(function (response) {
                $scope.data =response['data'];
                $scope.table_loader = false;
                console.log($scope.data);
            });
    };



    $scope.AddFramework = function(fieldname,fieldvalue,devicetype){
        $scope.table_loader = true;
        console.log(fieldname);
        console.log(fieldvalue);
        console.log(devicetype);
        if(fieldvalue == undefined || fieldvalue == ''){
            //alert('heyy');
            alert('Please Enter a' + ' '  +fieldname);
            $scope.table_loader = false;
            return false
        }
        var url =  __env.apiUrl+"/devices/admindefinedvalues/add";
        var urlcall = __env.apiUrl+"/devices/dropdown/"+fieldname;
        if(devicetype == 'framework'){
            devicetype = devicetype.toUpperCase();
        }
        var inputjson = {
            "fieldname" : fieldname,
            "fieldvalue" : fieldvalue,
            "devicetype" : devicetype
        };
        console.log(JSON.stringify(inputjson));
        /* add api call starts*/
        var config = {
            headers : {
                'Content-Type': 'application/json'
            }
        };


        $http.post(url, inputjson, config)
            .success(function (data, status, headers, config) {
                console.log('data===' + JSON.stringify(data));
               alert(data.Status);
                $http.get(urlcall)
                    .then(function (response) {
                        $scope.data =response['data'];
                        $scope.table_loader=false;
                       console.log($scope.data);
                    });
            })
            .error(function (data, status, headers, config) {
                $scope.stakeholderSpinner = false;
                $scope.table_loader = false;
                console.log('data===' + data);
                console.log('status===' + status);
                if ( status == 409 ) {
                    alert("Duplicate Device Name exists<"+stakeholder+"> Please use unique name");
                    $rootScope.searchResultJson = [];
                } else {
                    alert("Error occurred while creating device<"+stakeholder+"><"+status);
                }
                console.log('headers===' + headers);
                console.log('config===' + config);
            });
        /* add api call ends*/

    }

    $scope.startsWith = function (actual, expected) {
        var lowerStr = (actual + "").toLowerCase().trim();
        //return lowerStr.indexOf(expected.toLowerCase()) === 0;
        return lowerStr.startsWith(expected.toLowerCase());
    }



    $scope.deletionDevices = function(fieldname,fieldvalue,devicetype){
        console.log(fieldname);
        console.log(fieldvalue);
        console.log(devicetype);
        $scope.deviceType = devicetype;
        //$scope.deviceType = $scope.deviceType.replace(" ","");
        /*if(devicetype != 'framework'){
            $scope.deviceType = $scope.deviceType + "s";
        }*/

        if(devicetype == 'framework'){
         $scope.deviceType = $scope.deviceType.toUpperCase();
         }
        console.log($scope.deviceType);
       // http://hostname:port/SCOPEToolsIntegrationServices/api/devices/admindefinedvalues/fieldname/fieldvalue/devicetype/delete
        var deleteUrl =  __env.apiUrl+"/devices/admindefinedvalues/"+fieldname+'/'+fieldvalue+'/'+$scope.deviceType+'/delete';
        console.log(deleteUrl);

        $http({
            method: 'DELETE',
            url: deleteUrl,

        }).success(function (response) {
            console.log(response);
            alert(response.Status);
            var urlcall = __env.apiUrl+"/devices/dropdown/"+fieldname;
            $http.get(urlcall)
                .then(function (response) {
                    $scope.data =response['data'];
                    $scope.table_loader=false;
                    console.log($scope.data);
                });

        }).catch(function(response){
            alert(response.data.errorMsg);
        });

    }
}]);