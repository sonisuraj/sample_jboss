/**
 * Created by Manisha on 9/4/2017.
 */
app.controller('SortRecordsController', ['$scope', '$http', '$uibModal', '$uibModalInstance', 'deviceType', 'fieldData', '$rootScope', '$location', '$window','devType','page', function($scope, $http, $uibModal, $uibModalInstance, deviceType, fieldData, $rootScope, $location, $window,devType,page) {

    console.log(page);
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
        }
    ];

    $scope.TempArr = "ASC";
    $scope.Radioname = $scope.TempArr;
   // $('input[type=radio][value="ASC"]').prop('checked',true);
    //$('input[type=radio][value="ASC"]').prop('checked',true);
    $scope.disableShiftBtn = true;
    $scope.ngShowModalSorting = true;
    $scope.fieldData1 = fieldData;
    $scope.fieldData = [];
    $scope.deviceType = deviceType;

    console.log('$scope.fieldData1==>>>' + JSON.stringify($scope.fieldData1));

    console.log($scope.deviceType);
    /* column mismatch fix starts*/
    if($scope.deviceType === 'events'){
        console.log('inside events');
        for(var p=0;p<$scope.fieldData1.length;p++){
            var fieldDetails = $scope.fieldData1[p];
            console.log(JSON.stringify(fieldDetails));
            //var retType = fieldDetails.returntype;
            //var resTemp = retType.slice(2, 4);
            //console.log(resTemp);
            /* if(fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:"))){
             $scope.fieldData.push(fieldDetails);
             }*/
            if((fieldDetails.group && ( fieldDetails.group == "mandatory" || fieldDetails.group == "relevant")) || fieldDetails.key === "minto" || fieldDetails.key === "minfrom"){
                $scope.fieldData.push(fieldDetails);
            }
        }
    }
    else{
        for(var i=0;i<$scope.fieldData1.length;i++){
            var fieldDetails = $scope.fieldData1[i];
            //var retType = fieldDetails.returntype;
            //var resTemp = retType.slice(2, 4);
            //console.log(resTemp);
            /* if(fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:"))){
             $scope.fieldData.push(fieldDetails);
             }*/
            if(fieldDetails.group && ( fieldDetails.group == "mandatory" || fieldDetails.group == "relevant" )){
                $scope.fieldData.push(fieldDetails);
            }
        }
    }

    console.log('$scope.fieldData==>>>' + JSON.stringify($scope.fieldData));
    /* column mismatch fix ends*/
    /*for(var i=0;i<$scope.fieldData.length;i++){
     if($scope.fieldData[i].fieldname === 'Name'){
     $scope.fieldData[i].Selected = true;
     }
     }*/
    //$scope.headerData = [];
    //console.log(JSON.parse($http.defaults.headers.common['sortdetails']));
    //$scope.headerData = JSON.parse($http.defaults.headers.common['sortdetails']);
    //console.log($scope.headerData);
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
        $scope.getData = response['data'];
        $scope.headerData = response['data'];
        console.log(JSON.stringify($scope.headerData));
        /* show the selected preference on reopen of popup starts*/
        $scope.FinalArrtoSort = $scope.headerData['sort'];
        for(var i=0;i<$scope.FinalArrtoSort.length;i++){
            console.log($scope.FinalArrtoSort[i]);
            Object.keys($scope.FinalArrtoSort[i]).forEach(function(key,index) {
                console.log(key);
                //console.log(value);
                console.log($scope.FinalArrtoSort[i][key].sortorder);
                //$('input[type=radio][value="'+$scope.FinalArrtoSort[i][key].sortorder+'"]').prop('checked',true);
                if(key === $scope.deviceType){
                   console.log(JSON.stringify($scope.FinalArrtoSort[i][key]));
                    $scope.RestArr = $scope.FinalArrtoSort[i][key].sortfields;
                    $scope.TempArr = $scope.FinalArrtoSort[i][key].sortorder;
                    console.log($scope.TempArr);
                    $('input[type=radio][value="'+$scope.TempArr+'"]').prop('checked',true);
                    console.log($scope.RestArr);
                    console.log(JSON.stringify($scope.fieldData));
                    $scope.fieldDataTemp = [];
                    $scope.fieldDataTemp1 = [];
                    for(var b=0;b<$scope.RestArr.length;b++){
                    for(var a=0;a<$scope.fieldData.length;a++){
                            if($scope.RestArr[b] === $scope.fieldData[a].key){
                                $scope.fieldDataTemp.push($scope.fieldData[a])
                            }
                            else{
                                $scope.fieldDataTemp1.push($scope.fieldData[a])
                            }
                        }
                    }
                    //concatenate 2 arrays starts
                    Array.prototype.unique = function() {
                        var a = this.concat();
                        for(var i=0; i<a.length; ++i) {
                            for(var j=i+1; j<a.length; ++j) {
                                if(a[i].key === a[j].key)
                                    a.splice(j--, 1);
                            }
                        }

                        return a;
                    };
                    $scope.finalConcatenatedArray = $scope.fieldDataTemp.concat($scope.fieldDataTemp1).unique();
                    console.log('finalArray is===>>>'+JSON.stringify($scope.finalConcatenatedArray));
                    $scope.fieldData = $scope.finalConcatenatedArray;
                    // concatenate 2 arrays ends
                    /*for(var c=0;c<$scope.fieldData.length;c++){
                        for(var d=0;d<$scope.RestArr.length;d++){
                            if($scope.fieldData[c].key != $scope.RestArr[d]){
                                $scope.fieldDataTemp.push($scope.fieldData[c])
                            }
                        }
                    }*/

                    console.log('$scope.fieldDataTemp===>>' +JSON.stringify($scope.fieldDataTemp));
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
                /*else if(!$scope.FinalArrtoSort.hasOwnProperty($scope.deviceType)){
                  console.log('this key is not present');
                    $scope.TempArr = 'ASC';
                    $scope.Radioname = "ASC";
                   // $('input[type=radio][value="ASC"]').prop('checked',true);
                }*/
            });


        }

        //$('input[type=radio]').prop('checked',true);
        /* show the selected preferences on reopen of popup ends*/
    }).catch(function(response) {
        console.log("Inside error case");
        $scope.statusCode = response.status;
        $scope.statusText = (response.statusText);
        console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
        //Dummy data in case of error
    });


    $scope.dismissPopup = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.selectArray = [];
    $scope.model = {
        selectedAll: false
    };
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
            /*for(var i=0;i<array.length;i++){
             //alert('array field===name');
             if(array[i].fieldname === 'Name'){
             array[i].Selected = true;
             }
             }*/
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
        /* if(fieldval == 'Name'){
         alert('name selected');
         return item.Selected ==  true;
         $scope.checked = true;

         }*/
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
        if ($scope.checked && $scope.checked > 1) {
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
        console.log('$scope.getData initiall===>' + JSON.stringify($scope.getData));
        Object.keys($scope.getData).forEach(function(key, index) {
            //console.log('key of get data===' +key);
            //console.log('data of get data===' +JSON.stringify($scope.getData[key]));
            inputJson[key] = ($scope.getData[key]);
            console.log('inputJson updated===>>>>>' +JSON.stringify(inputJson));

        });
    }).catch(function(response) {
        console.log("Inside error case");
        $scope.statusCode = response.status;
        $scope.statusText = (response.statusText);
        console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
        //Dummy data in case of error
    });
    /* changes ends*/


    $scope.getVal = function(val1,val2){
        console.log(val1);
        console.log(val2);
        $scope.sortOrder = val2;
    }

    $scope.updatefields = function(data) {
        console.log(JSON.stringify(data));
        //alert('inside add ,update api');
        var inputObj = {
            "fields" : [

            ]
        }
        $scope.table_loader=true;
        var sorttempArray = [];

        console.log('$scope.fieldData after==>>>' + JSON.stringify($scope.fieldData));
        for (var p = 0; p < $scope.fieldData.length; p++) {
            if ($scope.fieldData[p].Selected === true) {
                sorttempArray.push($scope.fieldData[p].key)
                var objpreference = {}
                objpreference = $scope.fieldData[p];
                inputObj.fields.push(objpreference);
            }
        }
        inputJson[$scope.deviceType] = inputObj;
        var associateurl = __env.apiUrl+"/devices/userpreference/add";
        var associateGetUrl = __env.apiUrl+"/devices/userpreference";
        console.log('sort temp Array====>>>>' +JSON.stringify(sorttempArray));
        //var associateurl = "http://9.193.93.118:9080/SCOPEToolsIntegrationServices/api/devices/userpreference/add";
        //var associateGetUrl = "http://9.193.93.118:9080/SCOPEToolsIntegrationServices/api/devices/userpreference";
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'email': $rootScope.globals.currentUser.username
                //'email' : 'abcd123456@in.ibm.com'



            }
        }








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

        var dummyJsonNew = {
            "list": [

            ],
            "sort": [
                {
                    "logicaldevices": {
                        "fields": ["os","osversion"],
                        "sortorder": "ASC/DESC"
                    }
                },
                {
                    "services": {
                        "fields":[ "os","osversion"],
                        "sortorder": "ASC/DESC"
                    }
                }
            ]
        }

        var inputjsonFinal = {
            "list":[

            ],
            "sort" : [

            ]
        }

        console.log(JSON.stringify(inputjsonFinal));
        $scope.fieldObj = {

        };
        $scope.fieldObj["sortfields"] = sorttempArray;
        console.log($scope.sortOrder);
        if($scope.sortOrder == undefined){
            $scope.sortOrder = 'ASC'
        }
        $scope.fieldObj["sortorder"] = $scope.sortOrder;
        console.log($scope.sortOrder);
        console.log('fieldobje dta===>>>>' +JSON.stringify($scope.fieldObj));

        $scope.parentArray = {};
        $scope.parentArray[$scope.deviceType] = $scope.fieldObj;
        console.log(JSON.stringify($scope.parentArray));
        console.log('create new array nd push');
        //inputjsonFinal["sort"].push($scope.parentArray);

        if( !$scope.headerData ){
            console.log('create new array nd push');
            inputjsonFinal["sort"].push($scope.parentArray);
        }
        else{
            console.log('header data exists already');
            console.log($scope.headerData["sort"]);
            /* logic for removing dupliactes starts*/
            for(var i=0;i<$scope.headerData["sort"].length;i++){
                console.log($scope.headerData["sort"][i]);
                Object.keys($scope.headerData["sort"][i]).forEach(function(key,index) {
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
                        $scope.headerData["sort"].splice(i,1);
                    }
                });


            }
            /* logic for removing duplicates ends*/
            console.log($scope.headerData["list"]);
            console.log($scope.headerData["sort"]);


            if ( !$scope.headerData['sort'] ) {
                $scope.headerData['sort'] = [];
            }
            if ( !$scope.headerData['list'] ) {
                $scope.headerData['list'] = [];
            }
            $scope.headerData['sort'].push($scope.parentArray);
            inputjsonFinal = $scope.headerData;
            //var tempArr = headerData["sort"]
            //tempArr.push($scope.parentArray);
            //inputjsonFinal = tempArr;
        }
        console.log('FInal Array===>>>' + JSON.stringify(inputjsonFinal));
        /* remove duplicates from final json starts*/

        /* remove duplicated from final json ends*/





        $scope.sortOrder = {
            "fields" : "",
            "sortorder" : ""
        }
        //for(var p=0;p<)

        $http.post(associateurl, inputjsonFinal, config)
            .success(function(data, status, headers, config) {
                console.log('user preference updatedsuccessfully');
                console.log('user pref update response===' + JSON.stringify(data));
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

                    $scope.getData = response['data'];
                    console.log(JSON.stringify($http.defaults.headers.common['sortdetails']));
                    $http.defaults.headers.common['sortdetails'] = JSON.stringify($scope.getData);
                    console.log(JSON.stringify($http.defaults.headers.common['sortdetails']));
                    console.log(JSON.stringify($scope.getData));
                   // location.reload()
                    //window.location.reload();
                    console.log($scope.deviceType);
                    console.log(devType);
                    if(page == 'DetailView'){
                        $location.url("/otherDevices/"+devType);
                    }
                    else{
                        $location.url("/logicalDeviceListView/"+$scope.devicetype+"/"+devType+"/");
                    }
                    //$location.url('/otherdevices/'+devType);
                    //$location.url("/otherDevices/"+devType);

                    $uibModalInstance.close($rootScope.getData);
                })
                    .catch(function(response) {
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
    };

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
            if (arr[i].Selected) {
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
            if (arr[i].Selected) {
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
            if (arr[i].Selected) {
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
            if(arr[i].Selected && arr[i]){
                temp= arr[i];
                for(var j=i+1; j<arr.length; j++){
                    arr[j-1]= arr[j];
                }
                arr[j]= temp;
                break;
            }
        }

    };


    $scope.unSortfields = function(){
        $scope.DelArr = [];
        //$http.defaults.headers.common['sortdetails'] = '';
        console.log($scope.deviceType);
        console.log($http.defaults.headers.common['sortdetails']);
        $scope.arrToUnsort = JSON.parse($http.defaults.headers.common['sortdetails']);
        console.log($scope.arrToUnsort);
        console.log(JSON.stringify($scope.arrToUnsort['sort']));
        $scope.FinalArrtoSort = $scope.arrToUnsort['sort'];
        for(var i=0;i<$scope.FinalArrtoSort.length;i++){
            console.log($scope.FinalArrtoSort[i]);
            Object.keys($scope.FinalArrtoSort[i]).forEach(function(key,index) {
                console.log(key);
                //console.log(value);
                if(key === $scope.deviceType){
                    console.log('this object needs to be removed');
                    /*var LDindex = _.findIndex($scope.FinalArrtoSort, function (data) {
                        return data.key === $scope.deviceName;
                    });
                    console.log('LDindex===' + LDindex);*/
                    console.log('index to be removed==' +i);
                    $scope.DelArr.push(i);
                    $scope.FinalArrtoSort.splice(i,1);
                }
            });


        }
        console.log(JSON.stringify($scope.FinalArrtoSort));
        //inputjsonFinal["sort"].push($scope.parentArray);
        $scope.arrToUnsort["sort"] = $scope.FinalArrtoSort;
        console.log(JSON.stringify($scope.arrToUnsort));

        var inputjsonFinal = JSON.stringify($scope.arrToUnsort);
        console.log(inputjsonFinal);
        /*Object.keys($scope.FinalArrtoSort).forEach(function(key,value) {
            console.log(key);
            console.log(value);
        });*/

        var associateurl = __env.apiUrl+"/devices/userpreference/add";
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'email': $rootScope.globals.currentUser.username
                //'email' : 'abcd123456@in.ibm.com'
            }
        };

        $http.post(associateurl, inputjsonFinal, config)
            .success(function(data, status, headers, config) {
                console.log('user preference updatedsuccessfully');
                console.log('user pref update response===' + JSON.stringify(data));
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

                    $scope.getData = response['data'];
                    console.log(JSON.stringify($http.defaults.headers.common['sortdetails']));
                    $http.defaults.headers.common['sortdetails'] = JSON.stringify($scope.getData);
                    console.log(JSON.stringify($http.defaults.headers.common['sortdetails']));
                    console.log(JSON.stringify($scope.getData));
                    // location.reload()
                    //window.location.reload();
                    console.log($scope.deviceType);
                    console.log(devType);
                    if(page == 'DetailView'){
                        $location.url("/otherDevices/"+devType);
                    }
                    else{
                        $location.url("/logicalDeviceListView/"+$scope.devicetype+"/"+devType+"/");
                    }
                    //$location.url('/otherdevices/'+devType);
                    //$location.url("/otherDevices/"+devType);
                    //$location.url("/otherDevices/"+devType);
                    //$location.url("/logicalDeviceListView/"+$scope.devicetype+"/"+devType+"/");
                    $uibModalInstance.close($rootScope.getData);
                })
                    .catch(function(response) {
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

        $uibModalInstance.dismiss('cancel');
    };

    $scope.restorefields = function(){
        //alert('inside restore fields');
        $uibModalInstance.dismiss('cancel');
        $scope.doSorting();
    }
}
]);