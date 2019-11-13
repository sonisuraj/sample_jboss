/**
 * Created by manisha on 5/29/17.
 */
app.controller('configureFieldController', ['$scope', '$http', '$uibModal', '$uibModalInstance', 'deviceType', 'fieldData', '$rootScope', '$location', '$window', function($scope, $http, $uibModal, $uibModalInstance, deviceType, fieldData, $rootScope, $location, $window) {


    //$scope.headerData = [];
    //console.log(JSON.parse($http.defaults.headers.common['sortdetails']));
    //$scope.headerData = JSON.parse($http.defaults.headers.common['sortdetails']);
    //console.log($scope.headerData);

    $scope.dummyJson = [
        {
            "key": "name",
            "fieldname": "Name"
        },
        {
            "key": "backupmethod",
            "fieldname": "Backup Method"
        },
        {
            "key": "backupoffsitelocation",
            "fieldname": "Backup Offsite Location"
        },
        {
            "key": "backupschedule",
            "fieldname": "Backup Schedule"
        },
    ]
    $scope.disableShiftBtn = true;
    $scope.ngShowModalConfigure = true;
    $scope.fieldData1 = fieldData;
    $scope.fieldData = [];
    $scope.deviceType = deviceType;
    //console.log('$scope.deviceType===' +JSON.stringify($scope.deviceType));
    console.log('$scope.fieldData1==>>>' + JSON.stringify($scope.fieldData1));
    /* column mismatch fix starts*/
    for(var i=0;i<$scope.fieldData1.length;i++){
        var fieldDetails = $scope.fieldData1[i];
        if(fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") )){
            $scope.fieldData.push(fieldDetails);
        }


    }
    console.log('$scope.fieldData==>>>' + JSON.stringify($scope.fieldData));
    /* column mismatch fix ends*/
    for(var i=0;i<$scope.fieldData.length;i++){
        if($scope.fieldData[i].fieldname === 'Name'){
            $scope.fieldData[i].Selected = true;
        }
    }

    /*$scope.fieldData = {
        cancel: ".unsortable"
    };*/


    $scope.dismissPopup = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.sortableOptions = {
        cancel: ".unsortable",
        stop: function(e,ui) {
            // what you already had
            console.log(ui.item.index());
        },
        update: function(e, ui) {
           // alert('dsasdsa');
            console.log(ui.item.index());
            if (ui.item.index() == 0) {
                alert('inside index0');
                //$("#sortable").disableSelection();
                //ui.item.disableSelection();
                //ui.item.sortable.cancel();
                //ui.item.sortable().cancel();
            }
        },
        beforeStop: function( event, ui ) {
            console.log(ui.item.index());
            if(ui.item.index()==0)  return false;
        }
    };

    $scope.selectArray = [];
    $scope.model = {
        selectedAll: false
    }
    $scope.selectAll = function(array) {
        console.log('array==>>>' + JSON.stringify(array));
        angular.forEach(array, function(item) {
            item.Selected = $scope.model.selectedAll;

        });
        if ($scope.model.selectedAll === true) {
            $scope.enabledButton = true;
            $scope.disableShiftBtn = false;
        } else {
            console.log('array===>>>' +JSON.stringify(array));
            console.log('array.length===>>>' + JSON.stringify(array.length));
            for(var i=0;i<array.length;i++){
                //alert('array field===name');
                if(array[i].fieldname === 'Name'){
                    array[i].Selected = true;
                }
            }
            $scope.enabledButton = false;
            $scope.disableShiftBtn = true;
        }


    }
    ;

    var inputJson = {

    }




    $scope.checkIfNameSelected =  function(array,fieldval){
        console.log('array==>>>' +JSON.stringify(array));
        console.log('fieldval==>>>' +JSON.stringify(fieldval));
        if(fieldval == 'Name'){
            alert('name selected');
            return item.Selected ==  true;
            $scope.checked = true;

        }
    }

    $scope.checkIfAllSelected = function(array) {
       // alert('checkbox clicked');

        console.log('array==>>>' + JSON.stringify(array));
        $scope.model.selectedAll = array.every(function(item) {
            return item.Selected == true;
        });
        $scope.checked = array.filter(function(item) {
            return item.Selected == true
        }).length;
        if ($scope.checked && $scope.checked > 0) {
            $scope.enabledButton = true;
        } else {
            $scope.enabledButton = false;
        }
        if ($scope.checked && $scope.checked > 2) {
            $scope.disableShiftBtn = false;
        } else {
            $scope.disableShiftBtn = true;
        }
        console.log('$scope.checked===' +$scope.checked);
    };

    //console.log('x.Selected val==>>>>' + $scope.x.Selected);

    /* shifting get api on load bcause we have to push more arrays into it instead of creating inputjson everytime*/
    var associateGetUrl = __env.apiUrl+"/devices/userpreference";
    $http({
        method: 'GET',
        url: associateGetUrl,
        headers: {
            'email': $rootScope.globals.currentUser.username
            //'email' : 'abcd123456@in.ibm.com'
        }
    }).then(function(response) {
        //alert('success of get api');
        $scope.getData = response['data']
        $scope.headerData = response['data'];
        console.log($scope.headerData);
        console.log('$scope.getData initiall===>' + JSON.stringify($scope.getData));
        Object.keys($scope.getData).forEach(function(key, index) {
           //console.log('key of get data===' +key);
            //console.log('data of get data===' +JSON.stringify($scope.getData[key]));

            inputJson[key] = ($scope.getData[key])
            //console.log('inputJson updated===>>>>>' +JSON.stringify(inputJson));


        });
        // show selected rows in a column

        /* showing the selected preference on reopen of modalpopup starts*/
        $scope.FinalArrtoSort = $scope.headerData['list'];
        for(var i=0;i<$scope.FinalArrtoSort.length;i++){
            console.log($scope.FinalArrtoSort[i]);
            Object.keys($scope.FinalArrtoSort[i]).forEach(function(key,index) {
                console.log(key);
                //console.log(value);
                if(key === $scope.deviceType){
                    console.log(JSON.stringify($scope.FinalArrtoSort[i][key]));
                    $scope.RestArr = $scope.FinalArrtoSort[i][key];
                    console.log($scope.RestArr);
                    for(var p=0;p<$scope.fieldData.length;p++){
                        for(var q=0;q<$scope.RestArr.length;q++){
                            if($scope.fieldData[p].key === $scope.RestArr[q]){
                                console.log('matches');
                                console.log(JSON.stringify($scope.fieldData[p].key));
                                $scope.fieldData[p].Selected = true;
                                $scope.x = $scope.fieldData[p];
                                $scope.x.Selected = true;

                                console.log(JSON.stringify($scope.fieldData));
                                $scope.checkIfAllSelected($scope.fieldData);

                            }
                        }
                    }
                }
            });


        }
        /* ends*/
    }).catch(function(response) {
        console.log("Inside error case");
        $scope.statusCode = response.status;
        $scope.statusText = (response.statusText);
        console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
        //Dummy data in case of error
    });
    /* changes ends*/



    $scope.updatefields = function(data) {
        //alert('inside add ,update api');
        var inputObj = {
            "fields" : [

            ]
        }
        $scope.table_loader=true;
        $scope.childObj = {}
        $scope.childArr = [
        ]

        //console.log('$scope.fieldData after==>>>' + JSON.stringify($scope.fieldData));
        for (var p = 0; p < $scope.fieldData.length; p++) {
            if ($scope.fieldData[p].Selected === true) {
                var objpreference = {}
                //alert('selected== true');
                objpreference = $scope.fieldData[p].key;
                //inputObj.fields.push(objpreference);
                console.log($scope.fieldData[p].key);
                $scope.childArr.push($scope.fieldData[p].key);

            }
        }
        //console.log('inputObj===' +JSON.stringify(inputObj));
        //console.log('inputJson before==>>>>' + JSON.stringify(inputJson));
        inputJson[$scope.deviceType] = inputObj;
        $scope.childObj[$scope.deviceType] = $scope.childArr

        console.log(JSON.stringify($scope.childObj));
        $scope.headerData1 = {
            "list":[

            ],
            "sort" : [

            ]
        };


        if($scope.headerData== undefined || $scope.headerData == ''){
            console.log('create new array nd push');
            $scope.headerData1["list"].push($scope.childObj);
            $scope.headerData1["sort"].push("");
        }
        else{
            console.log('header data exists already');
            console.log($scope.headerData);
            console.log($scope.headerData["list"]);
            //$scope.headerData['sort1'].push($scope.parentArray);
            /* logic for removing dupliactes starts*/
            for(var i=0;i<$scope.headerData["list"].length;i++){
                console.log($scope.headerData["list"][i]);
                Object.keys($scope.headerData["list"][i]).forEach(function(key,index) {
                    console.log(key);
                    //console.log(value);
                    if(key === $scope.deviceType){
                        console.log('this object needs to be removed');
                        /*var LDindex = _.findIndex($scope.FinalArrtoSort, function (data) {
                         return data.key === $scope.deviceName;
                         });
                         console.log('LDindex===' + LDindex);*/
                        console.log('index to be removed==' +i);
                        //$scope.DelArr.push(i);
                        $scope.headerData["list"].splice(i,1);
                    }
                });
                console.log('before===>>>' +JSON.stringify($scope.headerData));


            }
            /* logic for removing duplicates ends*/
            $scope.headerData['list'].push($scope.childObj);
            console.log('after===>>>' +JSON.stringify($scope.headerData));
            $scope.headerData1 = $scope.headerData;
            //var tempArr = headerData["sort"]
            //tempArr.push($scope.parentArray);
            //inputjsonFinal = tempArr;


            console.log($scope.headerData["list"]);
        }



        console.log('Refreshed header data===' + JSON.stringify($scope.headerData1));
        var associateurl = __env.apiUrl+"/devices/userpreference/add";
        var associateGetUrl = __env.apiUrl+"/devices/userpreference";
        //var associateurl=__env.apiUrl+"/devices/userpreference/add";

        //console.log('associateurl===' + JSON.stringify(associateurl));

        var config = {
            headers: {
                'Content-Type': 'application/json',
                'email': $rootScope.globals.currentUser.username
                //'email' : 'abcd123456@in.ibm.com'



            }
        }

        var associateJson =
        {
           "logicaldevice": {
               "fields": [{
                   "key": "name",
                   "fieldname": "Name",
                   "maxlength": "255",
                   "minlength": "10",
                   "required": "required",
                   "fieldtype": "text",
                   "group": "mandatory",
                   "datatype": "string",
                   "returntype": "showtouser"
               }, {
                   "key": "businessid",
                   "fieldname": "Service ID",
                   "maxlength": "50",
                   "minlength": "0",
                   "required": "",
                   "fieldtype": "text",
                   "group": "mandatory",
                   "datatype": "number",
                   "returntype": "showtouser",
                   "phase": "1"
               }, {
                   "key": "servicetype",
                   "fieldname": "Service Type",
                   "maxlength": "50",
                   "minlength": "0",
                   "required": "",
                   "fieldtype": "select",
                   "group": "mandatory",
                   "datatype": "string",
                   "returntype": "showtouser",
                   "phase": "1"
               }, {
                   "key": "servicestatus",
                   "fieldname": "Service Status",
                   "maxlength": "50",
                   "minlength": "0",
                   "required": "",
                   "fieldtype": "select",
                   "group": "mandatory",
                   "datatype": "string",
                   "returntype": "showtouser",
                   "phase": "1"
               }, {
                   "key": "servversion",
                   "fieldname": "Service Version",
                   "maxlength": "50",
                   "minlength": "0",
                   "required": "",
                   "fieldtype": "text",
                   "group": "mandatory",
                   "datatype": "string",
                   "returntype": "showtouser",
                   "phase": "1"
               }, {
                   "key": "bunit",
                   "fieldname": "Business Area",
                   "maxlength": "75",
                   "minlength": "0",
                   "required": "",
                   "fieldtype": "select",
                   "group": "mandatory",
                   "datatype": "string",
                   "returntype": "showtouser",
                   "phase": "1"
               }]
           },
            "services": {
                "fields": [{
                    "key": "name",
                    "fieldname": "Name",
                    "maxlength": "255",
                    "minlength": "10",
                    "required": "required",
                    "fieldtype": "text",
                    "group": "mandatory",
                    "datatype": "string",
                    "returntype": "showtouser"
                }, {
                    "key": "businessid",
                    "fieldname": "Service ID",
                    "maxlength": "50",
                    "minlength": "0",
                    "required": "",
                    "fieldtype": "text",
                    "group": "mandatory",
                    "datatype": "number",
                    "returntype": "showtouser",
                    "phase": "1"
                }, {
                    "key": "servicetype",
                    "fieldname": "Service Type",
                    "maxlength": "50",
                    "minlength": "0",
                    "required": "",
                    "fieldtype": "select",
                    "group": "mandatory",
                    "datatype": "string",
                    "returntype": "showtouser",
                    "phase": "1"
                }, {
                    "key": "servicestatus",
                    "fieldname": "Service Status",
                    "maxlength": "50",
                    "minlength": "0",
                    "required": "",
                    "fieldtype": "select",
                    "group": "mandatory",
                    "datatype": "string",
                    "returntype": "showtouser",
                    "phase": "1"
                }, {
                    "key": "servversion",
                    "fieldname": "Service Version",
                    "maxlength": "50",
                    "minlength": "0",
                    "required": "",
                    "fieldtype": "text",
                    "group": "mandatory",
                    "datatype": "string",
                    "returntype": "showtouser",
                    "phase": "1"
                }, {
                    "key": "bunit",
                    "fieldname": "Business Area",
                    "maxlength": "75",
                    "minlength": "0",
                    "required": "",
                    "fieldtype": "select",
                    "group": "mandatory",
                    "datatype": "string",
                    "returntype": "showtouser",
                    "phase": "1"
                }]
            }
        }

        //console.log('associateJson===' + JSON.stringify(associateJson));
        //console.log('inputJson====' + JSON.stringify(inputJson));
        /*var finalInputJson = JSON.stringify(inputJson);*/



        var dummyyyJSon =
        {"list":[{"logicaldevices":["name","backupmethod","backupoffsitelocation"]},{"services":["name","servicetype","servicestatus","servversion"]}],"sort":[{"clusters":{"sortorder":"ASC","sortfields":["name","clustertype"]}},{"services":{"sortorder":"ASC","sortfields":["name","servicetype","servicestatus"]}}]}


        var parsedFinalJSon = JSON.stringify(dummyyyJSon);
        //console.log('dummyyyJSon===' + JSON.stringify(dummyyyJSon));
        for (var s = 0; s < inputJson[$scope.deviceType].fields.length; s++) {
            Object.keys(inputJson[$scope.deviceType].fields[s]).forEach(function(key, index) {
                if (key === 'Selected' || key === '$$hashKey') {
                    console.log('key matches')
                    delete inputJson[$scope.deviceType].fields[s][key];
                }

            });
        }

        //console.log('dummyjson after==>>>' + JSON.stringify(inputJson));
        console.log('associateurl==>>>' +JSON.stringify(associateurl));
        console.log('inputJson==>>>>' +JSON.stringify(inputJson));
        console.log('new preference json===>>>>' +JSON.stringify($scope.headerData1));
        var FinalPreferenceJson = JSON.stringify($scope.headerData1)
        $http.post(associateurl, FinalPreferenceJson, config)
            .success(function(data, status, headers, config) {
                console.log('user preference updatedsuccessfully');
                $http.defaults.headers.common['sortdetails'] = JSON.stringify(FinalPreferenceJson);
                console.log($http.defaults.headers.common['sortdetails']);
                //console.log('user pref update response===' + JSON.stringify(data));
                console.log('status===' + status);
                //$uibModalInstance.dismiss('cancel');
                $http({
                    method: 'GET',
                    url: associateGetUrl,
                    headers: {
                        'email': $rootScope.globals.currentUser.username
                        //'email' : 'abcd123456@in.ibm.com'
                    }
                }).then(function(response) {
                    //alert('success of get api');
                    $scope.getData = response['data']
                    console.log('$scope.getData===>' + JSON.stringify($scope.getData));
                    $uibModalInstance.close($scope.getData);
                    //$location.path('/logicalDeviceListView')
                    //$location.url("/logicalDeviceListView/" + "LogicalDevices/" +"0");
                    window.location.reload();
                }).catch(function(response) {
                    console.log("Inside error case");
                    $scope.statusCode = response.status;
                    $scope.statusText = (response.statusText);
                    console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
                    //Dummy data in case of error
                });


            })
            .error(function(data, status, headers, config) {
                console.log('data===' + data);
                console.log('status===' + status);
                if (status == 409) {
                    alert("Associate failed with <" + $scope.deviceName + "> association already exists with stakeholder:" + stakeholdername);
                } else {
                    alert("Error occurred while associating device<" + $scope.deviceName + "><" + status + ">");
                }
                console.log('headers===' + headers);
                console.log('config===' + config);
            });
    }

    /*$scope.moveDown= function(arr){
     var temp;
     for(var i=0; i<arr.length; i++){
     if(arr[i].Selected){
     temp= arr[i];
     arr[i]=arr[i+1];
     arr[i+1]= temp;
     }
     }
     $scope.fieldData= arr;
     console.log("..................Down...................");
     console.log($scope.fieldData);
     };*/

    $scope.moveTop = function(arr) {
        console.log("......Value........");
        console.log('arr===>>>>' +JSON.stringify(arr));
        var temp, temp1;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Selected && arr[i].fieldname !== 'Name') {
                temp = arr[0];
                arr[0] = arr[i];
                for (var j = 1; j <= i; j++) {
                    if (j % 2 == 0) {
                        temp = arr[j];
                        arr[j] = temp1;

                    } else {
                        temp1 = arr[j];
                        arr[j] = temp;
                    }
                }
            }
        }
        $scope.fieldData = arr;
        console.log(JSON.stringify($scope.fieldData));

    }

    $scope.moveDown = function(arr) {
        console.log("......Value........");
        console.log('arr==>>>>' +JSON.stringify(arr));
        var temp;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Selected && arr[i].fieldname !=='Name') {
                console.log(i+1);
                temp= arr[i+1];
                console.log(temp);
                arr[i+1]= arr[i];
                console.log(arr[i+1]);
                arr[i]= temp;
                console.log(arr[i]);
                break;
            }
        }
        $scope.fieldData = arr;
        console.log(JSON.stringify($scope.fieldData));

    }

    $scope.moveUp = function(arr) {
        console.log("......Value........");
        console.log('arr===>>>>' +JSON.stringify(arr));
        var temp;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].Selected && arr[i].fieldname !=='Name') {
                console.log(i -1);
                temp= arr[i-1];
                console.log(temp);
                arr[i-1]= arr[i];
                console.log(arr[i-1]);
                arr[i]= temp;
                console.log(arr[i]);
                break;
            }
        }
        $scope.fieldData = arr;
        console.log(JSON.stringify($scope.fieldData));

    }

    $scope.moveBottom = function(arr) {
        console.log('arr==>>>>' +JSON.stringify(arr));
        var temp;
       for(var i=0; i<arr.length; i++){
           if(arr[i].Selected && arr[i].fieldname !=='Name'){
               temp= arr[i];
               for(var j=i+1; j<arr.length; j++){
                   arr[j-1]= arr[j];
               }
               arr[j]= temp;
               break;
           }
       }

    }
    /*$scope.moveDown = function(arr2){
     console.log('arr2==' +JSON.stringify(arr2));
     console.log('arr2.length==' +arr2.length);
     var temp2;
     for(var p =0; p<arr2.length;p++){
     if(arr2[p].Selected){
     var temp= arr2[p];
     arr2[p]= arr2[p+1];
     arr2[p+1]= temp;
     }
     }

     $scope.fieldData= arr2;
     console.log("...................Move Down.............");
     console.log($scope.fieldData);
     }*/

    /*$scope.moveBottom = function(arr){

     }

     $scope.moveUp = function(){

     }*/


}
])
