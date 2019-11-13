app.controller('importLogController', ['$scope','$http','$window','$routeParams','$rootScope','$location',function($scope, $http,$window,$routeParams,$rootScope,$location) {
$scope.pageHeading = 'Imported Log';
$scope.table_loader=true;
$scope.importType = $routeParams.importType.toLowerCase();
$scope.importID = $routeParams.importID;
$scope.importTitle = $routeParams.importTitle;
$scope.pageUrl = $location.url();
$scope.indirectImport = false;
$scope.indirectReqFields=[];

$scope.offset=($scope.offset) ? $scope.offset : 1;
$scope.offsetPage = 400;
   $scope.navigateImportlog = function(){ 
		$location.url('/importDetails'+'/'+$scope.importType+'/'+$scope.importID+'/'+$scope.importTitle);
	}

  $scope.staticColumnName =
  		[
  		{"name":"Entity Name","key":"entityname"},
  		{"name":"Field Name","key":"fieldname"},
  		{"name":"Import Value","key":"importvalue"},
  		{"name":"Current Value","key":"bbvalue"},
  		{"name":"Import TL","key":"importtrustlevel"},
  		{"name":"Current TL","key":"bbtrustlevel"},
  		{"name":"Audit By","key":"auditby"},
  		{"name":"Current Data Source","key":"bbdatasource"},
  		{"name":"Match","key":"match"},
  		{"name":"Commit","key":"commit"},
  		{"name":"Commited","key":"commited"},
      {"name":"Summary","key":"summary"},
  		];
$http.get(__env.apiUrl+'/devices/fields/' +$scope.importType)
    .then(function (response) {
      console.log("Response got is:"+response);
      $scope.fieldKeyObj =response['data']['fields'];
      $scope.arrfields = [];
    //  for (var key in $scope.fieldKeyObj) {
    for (var i = 0;i<$scope.fieldKeyObj.length;i++){
    $scope.arrfields.push({"key":$scope.fieldKeyObj[i]['key'],"fieldname":$scope.fieldKeyObj[i]['fieldname']});
    /*Start::Code to check indirect import*/
    if($scope.fieldKeyObj[i]['indirectimport'] == 1)
    {
      $scope.indirectImport = true;
      $scope.indirectReqFields.push({"key":$scope.fieldKeyObj[i]['key'],"fieldname":$scope.fieldKeyObj[i]['fieldname']});
    }
    /*End::Code to check indirect import*/
      }
          /*Code for displaying records and count*/
        $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/showlog/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
        		.then(function (response) {
            window.console.log("success!");
            $scope.restData =  response.data["importfielddetails"];
            $scope.totalrestDataCount = response.data["importfielddetails"].length;
            $scope.totalrestDataImported=$scope.getImportCounts(response.data["otherCounts"],'total_count');
            if($scope.totalrestDataCount < $scope.totalrestDataImported)
            {
              $scope.offsetPage = $scope.totalrestDataCount;
            }


            //$scope.otherCounts = $scope.getImportCounts(response.data["otherCounts"]);
            /*Count variables Starts*/
            $scope.recordImport = $scope.totalrestDataImported;
            $scope.recordCreated = $scope.getImportCounts(response.data["otherCounts"],'CREATE');
            $scope.recordUpdated = $scope.getImportCounts(response.data["otherCounts"],'UPDATE');
            $scope.recordFiltered = $scope.getImportCounts(response.data["otherCounts"],'FILTERED');
            $scope.recordNotUpdated = $scope.getImportCounts(response.data["otherCounts"],'NO UPDATE');
            $scope.trustLevelUpdated = $scope.getImportCounts(response.data["otherCounts"],'TLUPDATE');
            /*Count variables Starts*/
            $scope.restData_filter = $scope.restData;

            /*Removing indirect import commit-not-allowed fields*/
            $scope.restData =  $scope.restData.filter(function(item) {
             return item.indirect !== 1;
          });
          if($scope.restData.length <= 0)
          {
            $scope.table_loader=false;
            $scope.errorMsg = "There is no field data to be displayed.";
            return false;
          }
          /*Removing indirect import commit-not-allowed fields*/
        	//$scope.responsedevice = 'importid'+':'+$routeParams.importID;
          //$scope.restData = response.data[$scope.responsedevice];
        /*  $scope.recordImport = 0;
          $scope.recordUpdated = 0;
          $scope.recordCreated = 0;
          $scope.recordFiltered = 0;
          $scope.recordNotUpdated = 0;
          $scope.trustLevelUpdated = 0;
          $scope.oldTempName = '';
          for(var i = 0; i < $scope.restData.length; ++i){
          if($scope.restData[i]["entityname"] !==$scope.oldTempName)
          {
            $scope.recordImport++;

            if($scope.restData[i]["filter"] == 'CREATE')
            {
                    $scope.recordCreated++;
            }
            if($scope.restData[i]["filter"] == 'UPDATE')
            {
                    $scope.recordUpdated++;
            }
            if($scope.restData[i]["filter"] !== '')
            {
                    $scope.recordFiltered++;
            }
            if($scope.restData[i]["filter"] == 'NO UPDATE')
            {
                    $scope.recordNotUpdated++;
            }
            if($scope.restData[i]["importtrustlevel"] !== 999)
            {
                    $scope.trustLevelUpdated++;
            }
            $scope.oldTempName = $scope.restData[i]["entityname"];
          }
        }
*/


        	$scope.keys =  Object.keys($scope.restData[0]);
        	$scope.tempkeys = [];
        	for (var p in $scope.restData[0]) {
            if( $scope.restData[0].hasOwnProperty(p) ) {
        	  if ( p != "index" && p != "fieldkey" && p != "filter") {
                 $scope.tempkeys.push(p);
        	   } else {
                    console.log("not pushing :"+p);
               }
            }
          }
          $scope.columnName = [];
				for(var j=0;j<$scope.staticColumnName.length;j++)
				{
                  var indexcount = 0;
        	      for ( p in $scope.tempkeys) {
                    var fflag = false;
                      if($scope.tempkeys[p] == $scope.staticColumnName[j].key)
                      {
                        $scope.columnName.push ({'key' : $scope.staticColumnName[j].key, 'name' :  $scope.staticColumnName[j].name}) ;
						break;
                      }
                  }
                }// end of main for loop

        	$scope.currentRowIndex = 0;
        	$scope.table_loader=false;

        		if ( $scope.restData && $scope.restData.length > 0 ) {
                    console.log( $scope.restData[0].name);
        		}

                //console.log('$scope.restData.length===' + $scope.restData);
                var arrayLength = $scope.restData ? $scope.restData.length : 0 ;
                console.log('arrayLength===' + arrayLength);
                $scope.currentPage = 1; //current page
                $scope.maxSize = 5; //pagination max size
                $scope.entryLimit = 5; //max rows for data table
                $scope.itemsPerPage = 5;
                /* init pagination with $scope.list */
                $scope.noOfPages = Math.ceil(arrayLength/$scope.entryLimit);
        				console.log("Noof pages got is:"+$scope.noOfPages);
                $scope.setPage = function(pageNo) {
        		    console.log("Inside setPage page no got is:"+pageNo);
                    $scope.currentPage = pageNo;
                };


            });
          /*Code for displaying records and count*/

      //alert(arrfields['backupschedule']);
    }).catch(function (response) {
      console.log("Inside error case");
      $scope.statusCode = response.status;
      $scope.statusText = (response.statusText );
      console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
    });

    $scope.getImportCounts = function(arr,fltr)
    {
      var returnCount = 0;
      var tempArr = [];
      var tlCount = 0;
      var filterCount=0;
      if(arr)
      {
      var arr = arr.split(';');
      var tempStr='';
      for(var i=0; i<arr.length;i++)
      {
        var key = arr[i].split('=')[0];
        if(fltr =='FILTERED')
        {
          var tempVal = (arr[i].split('=')[1]) ? arr[i].split('=')[1] : 0;
          returnCount = parseInt(returnCount) + parseInt(tempVal);
        }
        else if(fltr =='TLUPDATE')
        {
          if(key.split('-')[0] == 'Trust Level Modification')
          {
            var tempVal = (arr[i].split('=')[1]) ? arr[i].split('=')[1] : 0;
            returnCount = parseInt(returnCount)+parseInt(key.split('-')[1]);
          }
        }
        else if(key == fltr){
          var tempVal = (arr[i].split('=')[1]) ? arr[i].split('=')[1] : 0;
          returnCount = parseInt(returnCount)+parseInt(tempVal);
        }
      }
    }
          return parseInt(returnCount);

    }

$scope.openimporAction = function(){
    console.log('inside open import action');
    $scope.showimportaction = true;
    $scope.showimportfilteraction = false;
};
$scope.showimportfilterAction = function(){
    console.log('inside open import action');
    $scope.showimportaction = false;
    $scope.showimportfilteraction = true;
};
		$scope.commitFieldArr = [];
		$scope.entityArr = [];
		$scope.fieldArr = []
		$scope.commitFieldChange = function(commitName,fieldkey,commitRowData){
      $scope.toggleFlag = false;
      var nameID = $scope.getUniqueName(commitName+'_',commitRowData);
			var addToArray=true;
			var remIndex = '';
			for(var i=0;i<$scope.commitFieldArr.length;i++){
		    if($scope.commitFieldArr[i].nameID == nameID && $scope.commitFieldArr[i].fields == fieldkey){
						addToArray = false;
						remIndex = i;
		    }
			}
      if($scope.indirectImport)
      {
        if(addToArray){
        var obj={};
        for(var i = 0;i<$scope.indirectReqFields.length;i++)
        {
          if(commitRowData[$scope.indirectReqFields[i]['key']])
           {
          obj[$scope.indirectReqFields[i]['key']] = commitRowData[$scope.indirectReqFields[i]['key']].trim();
           }
           else{
          obj[$scope.indirectReqFields[i]['key']] = "";
          //obj[$scope.indirectReqFields[i]['fields']] = "";
           }
        }
        obj['fields'] = fieldkey;
        obj['nameID'] = nameID;
        $scope.commitFieldArr.push(obj);
      }
      else{$scope.commitFieldArr.splice(remIndex,1);}
    }
    else if(!$scope.indirectImport)
    {
    if(addToArray){
    	$scope.commitFieldArr.push({"nameID":nameID,"name":commitName,"fields":fieldkey});
    	//alert(JSON.stringify($scope.commitFieldArr));
      }
      else
      {
        $scope.commitFieldArr.splice(remIndex,1);
      }
    } //end else if
}

$scope.commitField = function()
		{
      if($scope.commitFieldArr.length > 0)
			{
        if($scope.toggleFlag && !$scope.filterFlag)
        {
          $scope.commitAll();
        }
        else
        {
        var uniqueNameKey = ($scope.indirectImport) ? "nameID" : "name";
				  $scope.uniqueNames = $scope.commitFieldArr.map(function (item ) {return item[uniqueNameKey];})
				  .filter(   function (value, index, self) { return self.indexOf(value) === index  ;} );
					$scope.postInfoTemp = [];


					for(var i=0;i<$scope.uniqueNames.length;i++){
					$scope.curNameVal = $scope.uniqueNames[i];
					$scope.fieldStrTemp = '';

						for(var j=0;j<$scope.commitFieldArr.length;j++){
              if($scope.commitFieldArr[j][uniqueNameKey] == $scope.curNameVal){
               $scope.fieldStrTemp = $scope.fieldStrTemp+$scope.commitFieldArr[j].fields+',';
                }
							}//inner for loop
                $scope.fieldStrTemp = $scope.fieldStrTemp.substring(0,$scope.fieldStrTemp.length-1);
                /*Indirect import mandatory field login*/
                   if($scope.indirectImport)
                   {
                     var obj={};
                     for(var k=0;k<$scope.commitFieldArr.length;k++){
                       if($scope.commitFieldArr[k][uniqueNameKey] == $scope.curNameVal){
                           for(var x = 0;x<$scope.indirectReqFields.length;x++)
                           {
                             obj[$scope.indirectReqFields[x]['key']]=$scope.commitFieldArr[k][$scope.indirectReqFields[x]['key']];
                           }
                           obj["fields"]=$scope.fieldStrTemp;
                         }
                       }
                         $scope.postInfoTemp.push(obj);
                   }
                 /*Indirect import mandatory field login*/
                else
                {
                  $scope.postInfoTemp.push({"name":$scope.curNameVal,"fields":$scope.fieldStrTemp});
                }


						} //outer for loop
				/*Call to Commit API*/
				$scope.table_loader=true;
				//var post_url = __env.apiUrl+"/import/commit/"+$scope.importID;


        if($scope.indirectImport)
  			{
  				 var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commitcommon/"+$scope.importID;
  				 var postData = '{"recordcommit" :"false","records":'+JSON.stringify($scope.postInfoTemp).replace(/"nameID[^,}]+,/g,'')+'}';
  			}else{
          var post_url = __env.apiUrl+"/importall/"+$scope.importType+"/commit/"+$scope.importID;
          var postData = '{"recordcommit" :false,"records":'+JSON.stringify($scope.postInfoTemp)+'}';
  		}
				var config = {
					headers : {'Content-Type': 'application/json',}
				}

				$http.post(post_url, postData, config)
					.success(function (data, status, headers, config) {
						$scope.table_loader=false;
						console.log('Commit field level data===' + JSON.stringify(data));
						/*Get API call to refresh data after commit*/
                $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/showlog/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
								.then(function (response) {
									//$scope.restData = response.data[$scope.responsedevice];
                  $scope.restData = response.data["importfielddetails"];
								})
						/*Get API call to refresh data after commit*/
						alert('Successfully commited selected field(s) for import ID '+$scope.importID+' ');

					})
					.error(function (response,data, status, headers, config) {
						//alert("Commit error occurred while updating import ID <"+$routeParams.importID+"><"+status+">");
            alert(response.errorMessage+' , '+response.userAction);
					});
				/*Call to Commit API*/
			}
      }
			else{alert('No records to commit!');}

		}
    /*Commit all action code*/
    $scope.commitAll = function()
    {
    	$scope.table_loader=true;
    	$http.post(__env.apiUrl+'/importall/'+$scope.importType+'/commitall/'+$scope.importID)
    	.success(function (response) {
    		alert('Successfully commited all record(s) for import ID '+$scope.importID+' ');
        /*Get API call to refresh data after commit*/
            $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/showlog/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
            .then(function (response) {
              //$scope.restData = response.data[$scope.responsedevice];
              $scope.restData = response.data["importfielddetails"];
            })
        /*Get API call to refresh data after commit*/
    		$scope.table_loader=false;
    	})
    	.error(function (response) {
    		//alert("Commit error occurred while updating import ID < "+$routeParams.importID+". "+response.status);
        alert(response.errorMessage+' , '+response.userAction);
    		$scope.table_loader=false;
    	});
    }
    /*Commit all action code*/

		/*Filter actions from API*/
		//$http.get(__env.apiUrl+'/import/filters/'+$routeParams.importID).then(function(response){
    $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/filters/'+$routeParams.importID).then(function(response){
			$scope.filteractions =  response.data;
			//$scope.filteractions =  [{"filter":"CREATE"},{"filter":"UPDATE"},{"filter":"NONE"}];
			//alert($scope.filteractions);
		})
		/*Filter actions from API*/
    $scope.filterByObj = [];
		$scope.filterBy= function(fltBy)
		{
      $scope.filterFlag = true;
    	$("#sortMenu").addClass('open');
    	$scope.table_loader=true;
      if($scope.filterByObj.indexOf(fltBy) !== -1){
     		$scope.filterByObj.splice($scope.filterByObj.indexOf(fltBy),1);
     	}else
     	{
     		$scope.filterByObj.push(fltBy);
     	}

      $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/showlog/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
      			.then(function (response) {
      				$scope.restData =  response.data["importfielddetails"];

              if($scope.filterByObj.length !== 0)
              {
              $scope.filterNode = $scope.restData[0].hasOwnProperty('filterTL') ? 'filterTL': 'filter';
      				$scope.resTempData = [];
              for(var i = 0; i < $scope.restData.length; i++)
              {
                  for(var j = 0; j < $scope.filterByObj.length; j++)
            			{
            			if ($scope.restData[i][$scope.filterNode] == $scope.filterByObj[j] && fltBy !=='NONE') {
                  //if ($scope.restData_filter[i][$scope.filterNode] == fltBy && fltBy !=='NONE') {
                    $scope.resTempData.push($scope.restData[i]);
                  }
                  else if (fltBy =='NONE') {
                    $scope.resTempData.push($scope.restData[i]);
                  }
                }
              }
      			 $scope.restData = JSON.parse(JSON.stringify($scope.resTempData));
             }
              $scope.table_loader=false;
      		})

      /*CP improvement for quick filtering
      $scope.filterNode = $scope.restData_filter[0].hasOwnProperty('filterTL') ? 'filterTL': 'filter';
      $scope.table_loader=true;
      $scope.resTempData = [];
      for(var i = 0; i < $scope.restData_filter.length; i++)
      {
        for(var j = 0; j < $scope.filterByObj.length; j++)
  			{
  			if ($scope.restData_filter[i][$scope.filterNode] == $scope.filterByObj[j] && fltBy !=='NONE') {
        //if ($scope.restData_filter[i][$scope.filterNode] == fltBy && fltBy !=='NONE') {
          $scope.resTempData.push($scope.restData_filter[i]);
        }
        else if (fltBy =='NONE') {
          $scope.resTempData.push($scope.restData_filter[i]);
        }
      }
      $scope.restData = JSON.parse(JSON.stringify($scope.resTempData));
      $scope.table_loader=false;
    }*/



/*CP improvement for quick filtering*/
  }
		/*Filter record code here*/
    /*Function to create unique name for both direct and indirect import case*/
    $scope.getUniqueName=function(commitName,commitRowData)
    {	var tempName = '';
    	if($scope.indirectImport && $scope.indirectImport !='undefined')
    	{
    		for(var i = 0;i<$scope.indirectReqFields.length;i++)
    		{
    			tempName= tempName+'_'+commitRowData[$scope.indirectReqFields[i].key];
    		}
    		return commitName+'_'+tempName;
    	}
    	else{return commitName;}
    }
    /*Function to create unique name for both direct and indirect import case*/

    /*toggle Records*/
    $scope.toggleRecords = function()
    {
    for(var i=0;i<$scope.restData.length;i++){
      //var currentElement = document.getElementById('commit_'+$scope.restData[i].entityname+'_'+$scope.restData[i].fieldkey);
      var currentElement = document.getElementById('commit_'+$scope.restData[i].entityname+'_'+$scope.restData[i].fieldkey+'_'+$scope.getUniqueName($scope.restData[i].entityname+'_'+$scope.restData[i].fieldkey,$scope.restData[i]));
    	if(currentElement && currentElement.checked && currentElement.disabled == false){
    		  currentElement.checked = false;
    	//}else {
        }else if(currentElement) {
    		{
    			currentElement.checked = true;
    		}
    	}
      //if(currentElement && currentElement.disabled == false)
    if(currentElement && currentElement.disabled == false)
      {
      $scope.commitFieldChange($scope.restData[i].entityname,$scope.restData[i].fieldkey,$scope.restData[i]);
      }
    }
    $scope.toggleFlag = true; //flag for offset page, toggle commit;
    }
    /*toggle Records*/
    /*Export Log records*/
      $scope.exportLDLogXLS = function(){
        $scope.table_loader=true;
              $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/showlog/'+$routeParams.importID+'?offset='+$scope.offset).then(function (response) {
                  console.log('response.data===' +JSON.stringify(response.data));
                  console.log('response.data[devicetype]===' + JSON.stringify(response.data[$scope.importType]));
                  $scope.items = response.data["importfielddetails"];
    							$scope.items = JSON.stringify($scope.items).replace(/null/g, '""');
    							$scope.items2 = JSON.parse($scope.items);
                  //$scope.responsedevice = 'importid'+':'+$routeParams.importID;
                  //$scope.restData =  response.data[$scope.responsedevice];
                  console.log('$scope.items===' +JSON.stringify($scope.items));
                  var filename = $scope.importType + '.xlsx'
                  //alasql('SELECT * INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items]);
                //  alasql('SELECT [entityname] AS [Entity Name],[fieldname] AS [Field Name],[importvalue] AS [Import Value],[bbvalue] AS [BB Value],[importtrustlevel] AS [Import Trust Level],[bbtrustlevel] AS [BB Trust Level],[auditby] AS [Audit By],[commit] AS [Commit],[commited] AS [Commited],[bbdatasource] AS [BB Data Source],[match] AS [Match],[filter] AS [Summary] INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items]);
                alasql('SELECT * INTO XLSX("'+ filename+'", {headers:true}) FROM ?',[$scope.items2]);
                $scope.table_loader=false;
              })
          }
      /*Export Log Records*/
      $scope.customSearchFilter = function()
      {
            var result = {};
            result[$scope.searchby] = $scope.filterText;
            return result;
      }
      angular.element($window).bind("scroll", function(e) {
        var totalScrollPage =Math.ceil($scope.totalrestDataCount/$scope.offsetPage);
        if(angular.element(document.querySelector('#slide-wrap'))[0])
        {
        var totalHeight = angular.element(document.querySelector('#slide-wrap'))[0].offsetHeight;
        }
        else{var totalHeight = 1200;}
        window.console.log(totalHeight);
        $scope.posY = this.pageYOffset;

        //var actionHeight = Math.ceil($scope.offset * (totalHeight/totalScrollPage));
        var downActionHeight = totalHeight-1200;
        var upActionHeight = 200;
        if(this.pageYOffset == 0 && $scope.offset !==1)
        {
          window.console.log('User Requested first page:'+$scope.posY);
          $scope.offset = 1;
          $scope.scrollAction();
        }
        else if($scope.posY > downActionHeight && !$scope.pendingRequest && $scope.totalrestDataCount >= $scope.offset*$scope.offsetPage && $scope.totalrestDataCount !=0)
        {
         $window.scrollTo(0, 500);
          $scope.offset = $scope.offset+1;
          $scope.scrollAction();
        }
        else if($scope.posY < upActionHeight && !$scope.pendingRequest && $scope.offset != 1){
          $scope.offset = $scope.offset-1;
          $scope.scrollAction();
        }

      });

      $scope.scrollAction = function()
      {
        $scope.pendingRequest= true;
      /*  if(angular.element(document.querySelector('#slide-wrap'))[0])
        {
        angular.element(document.querySelector('#slide-wrap'))[0].style.cursor = "wait";
        }
      */
        document.getElementById("waiting_overlay").style.display = "block";
        $http.get(__env.apiUrl+'/importall/'+$scope.importType+'/showlog/'+$routeParams.importID+'?offset='+$scope.offset+'&filters='+$scope.filterByObj.toString())
          .then(function (response) {
          document.getElementById("waiting_overlay").style.display = "none";
          //angular.extend($scope.restData, response.data["importfielddetails"]);

          if(response.data["importfielddetails"].length > 0)
          {
            $scope.restData = response.data["importfielddetails"];

          }

          /*if(angular.element(document.querySelector('#slide-wrap'))[0])
          {
          angular.element(document.querySelector('#slide-wrap'))[0].style.cursor = "pointer";
          }*/
          if($scope.offset ==1)
          {
            $window.scrollTo(0, 0);
          }else{$window.scrollTo(0, 500);}

          $scope.pendingRequest= false;
          $scope.lastPosY = $scope.posY;
        })
        .catch(function (response) {
          console.log("Inside error case");
          $scope.statusCode = response.status;
          $scope.statusText = (response.statusText );
          console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
        });
      }
}]);
