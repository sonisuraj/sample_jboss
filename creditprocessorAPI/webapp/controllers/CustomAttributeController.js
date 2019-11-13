/*Start::Custom Attribute Controller*/
	app.controller('customAttributeController',['$scope','$http','$routeParams','__env','$location','orderByFilter',function($scope,$http,$routeParams,__env,$location,orderBy) {
//This function will be usefule for dashboard updating in data model
//Author Nikita Banthiya
//Dated 7/8/2017
//dashboardUpdate start here
if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
{
	$location.url("/");
}

$scope.subSection = ($routeParams.subSection) ? $routeParams.subSection.trim().toLowerCase() : $routeParams.subSection;
$scope.navigateSubSection = function()
{
	$location.url('/custom_attribute/'+$scope.subSection);
}
$scope.navigateCA = function(act)
{
	if(act == 'ca')
	{
	$location.url('/custom_attribute/');
	}
	else if(act == 'hm')
	{
	$location.url('/custom_attribute/heatmap/');
	}
}
$scope.table_loader = false;
		$scope.dashboardUpdate =function(param,entity,attribute){
			console.log(entity);
			if(entity == undefined){
				alert("Please select Entity Filter. The checkbox that you clicked won't be valid until you select Entity.");
				return;
			}
			//param =param.toLowerCase();
			$http.get(__env.apiUrl+'/devices/customattributes/getentities')
			.then(function (response) {
		    $scope.customEntity =response['data']['dropdown'];
				for ( var i = 0 ; $scope.customEntity && i < $scope.customEntity.length ; i++) {
					console.log($scope.customEntity[i].value);
		      if ( $scope.customEntity[i].value == entity) {
		         var entityName =  $scope.customEntity[i].key;
						 var url =  __env.apiUrl+'/devices/datamodel/update';
			 			var t ={"attribute": attribute, "entity":entityName,"dashboard":param};
			 			console.log(t);
			 			$http({
			 					method: 'PUT',
			 					url: url,
			 					data:t
			 			}).success(function (response) {
			 					console.log(response);
			 			}).catch(function(response){
			 					console.log(response);
			 			});
		      }

		    }

		  }).catch(function (response) {

		  });

		}
		//dashboardUpdate function ends here
		$scope.table_loader = true;
		$http.get(__env.apiUrl+'/devices/customattributes/getall')
		.then(function (response) {
	    console.log("Response got is:"+response);

	    $scope.customAttribute =response['data'].reverse();
			$scope.customAttribute = orderBy($scope.customAttribute, 'displayname', false);
			$scope.table_loader = false;
	  }).catch(function (response) {
	      console.log("Inside error case");
	      $scope.statusCode = response.status;
		    $scope.statusText = (response.statusText);
	      console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
        //Dummy data in case of error
        $scope.customAttribute =[
        {"attribute":"DATA_Column3","value":"Value1"},
        {"attribute":"DATA_Column2","value":"Value2"},
        {"attribute":"WINNEW","value":"Value3"}
      ];
$scope.table_loader = true;
	  });

		$http.get(__env.apiUrl+'/devices/customattributes/getentities')
		.then(function (response) {
	    console.log("Response got is:"+response);

	    $scope.customEntity =response['data']['dropdown'];
	  }).catch(function (response) {
	      console.log("Inside error case");
	      $scope.statusCode = response.status;
		  $scope.statusText = (response.statusText);
	      console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
	  });

$scope.addcustomArr = [];
		$scope.addCustomAtt = function(){

		    //var regExp = new RegExp(/^[a-zA-Z][a-zA-Z0-9]*$/);
				var regExp = new RegExp("^[a-zA-Z]+$");
			//if( !$scope.custom.name || $scope.custom.name ==''||  regExp.test($scope.custom.name) == false || $scope.custom.entity=='' )

			if( !$scope.custom.name || $scope.custom.name ==''|| regExp.test($scope.custom.name.substring(0, 1)) == false )
			{
//				alert("Please enter required attribute details. Alphanumeric Custom Attribute name with no special character and select Valid Entity");
 					alert('Please enter valid Custom Attribute');
					return false;
			}
			//$scope.addcustomArr.push({"id": "1","name": $scope.custom.name,"entity":$scope.custom.entity,"dashboard":"PARTIAL2","custom":"NEW","rename":"NEW_ENTITY_PROCESS"});

				window.console.log("Custom Attribute Post  API called  from customAttributeController!");
				var post_url=__env.apiUrl+"/devices/customattributes/add";
				var entityName = $scope.custom.entity;

				if(!$scope.custom.entity){
					alert("Please Select Entity Type");
					return;
				}
				else if($scope.custom.name.indexOf(';') !==-1 || $scope.custom.name.indexOf('=') !==-1)
				{
						alert('Please enter valid Custom Attribute - Neither an " = " is allowed or a " ; "');
						return;
				}
				/*if ( $scope.custom.entity.toLowerCase().startsWith("component")) {
				    entityName = "COMPONENT";
				}
				if ( $scope.custom.entity.toLowerCase().startsWith("service")) {
				    entityName = "SERVICE";
				}*/
				$scope.table_loader = true;
				$http.post(post_url,{"attribute":$scope.custom.name,"entity":entityName}).success(function(data){
					window.console.log("Custom Attribute Post  API called  from customAttributeControllerxxx!");
					//$scope.addcustomArr.push({"attribute": $scope.custom.name,"entity":entityName,"dashboard":"","iscustattr":"Y"});
					$scope.refreshCAdata();
					$scope.table_loader = false;
				}).catch(function(response){
					if(response.data.errorMessage){
							$scope.table_loader = false;
							alert("Custom attribute add failed because "+response.data.errorMessage);

					}

				});


		}
var oldeditElement = "";
$scope.allowEdit = function(attr,entity)
{
	var conf = confirm('Really wants to rename Custom Attribute "'+attr+'" for entity '+entity+'?');
	if(conf == true){
	var eid = attr+'_'+entity;
	document.getElementById('allowedit_'+eid).style.display="none";
  document.getElementById('editmode_'+eid).style.display="";

	if(oldeditElement !=='')
	{
		document.getElementById('allowedit_'+oldeditElement).style.display="";
    document.getElementById('editmode_'+oldeditElement).style.display="none";
		document.getElementById('input_'+oldeditElement).value="";
	}
	oldeditElement = eid;
}
}

$scope.update_CA = function(attr,entity,action)
{
$scope.table_loader = true;
	if(action == 'delete')
	{
		var conf = confirm('Really remove the "'+entity+'" based Custom Attribute "'+attr+'" ?\nThis will delete ALL data associated with this Custom Attribute.');
		if(conf == true){
			$http.delete(__env.apiUrl+'/devices/'+attr+'/'+entity+'/delete')
		 .then(function (response) {
			 console.log("Response got is:"+response);
			 $scope.refreshCAdata();
			 $scope.table_loader = true;
		 }).catch(function (response){
			 $scope.statusCode = response.status;
			 $scope.statusText = (response.statusText);
			 console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
			 $scope.table_loader = false;
			 alert('Error occurred while deleting '+ attr +' ,please try again!');

		 });
		} else {
//nothing in case of cacel confirm
		}
	}
  else if(action == 'rename')
	{
			var eid = attr+'_'+entity;
			var inputVal = document.getElementById('input_'+eid).value;
			inputVal = (inputVal) ? inputVal.trim() : inputVal;
			 var regExp = new RegExp("^[a-zA-Z]+$");
			 if(!inputVal || inputVal =='' || inputVal.indexOf(';') !==-1 || inputVal.indexOf('=') !==-1)
			 {
					 alert('Please enter valid Custom Attribute name - blank, " = " and " ; " are not allowed');
					 $scope.table_loader = false;
					 return;
			 }
			 else if(regExp.test(inputVal.substring(0, 1)) == false)
			 {
				 alert('Please enter valid Custom Attribute starting with Alphabet character');
				 $scope.table_loader = false;
				 return;
			 }
			 else{
				$scope.table_loader = true;
				$http.put(__env.apiUrl+'/devices/'+inputVal+'/'+entity+'/'+attr+'/rename')
			.then(function (response) {
				console.log("Response got is:"+response);
				document.getElementById('allowedit_'+eid).style.display="";
			  document.getElementById('editmode_'+eid).style.display="none";
				alert('Successfully renamed Custom Attribute "'+attr+'" to "'+inputVal+'" for entity "'+entity+'!');
				$scope.refreshCAdata();
				$scope.table_loader = false;
			}).catch(function (response){
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
				//alert('Error occurred while deleting '+ attr +' ,please try again!');
				$scope.table_loader = false;
				//alert("Error received while updating Custom Attribute "+attr+" : "+response.statusText +" : "+"Request failed"+" : "+response.status);
				 alert(response['data'].errorMessage+', '+response['data'].userAction);
				return false;
			});
	}
	}
$scope.table_loader = false;
}
/*$scope.filterStartWith*/
$scope.startsWith = function (actual, expected) {
    var lowerStr = (actual + "").toLowerCase().trim();
    //return lowerStr.indexOf(expected.toLowerCase()) === 0;
		return lowerStr.startsWith(expected.toLowerCase());
}

/*$scope.filterStartWith*/
$scope.entitySelection = function()
{
	if($scope.hmChangeSet.length > 0 && $scope.subSection == 'heatmap')
	{
		var conf = confirm('There is unsaved heat map change set, would you like to save changes ?');
		if(conf == true){
			//$scope.custom.entity ='';
			$scope.saveHeatMap();
			$scope.hmChangeSet = [];
			$scope.hmChangeArr = [];
		}
		else {
			$scope.hmChangeSet = [];
			$scope.hmChangeArr = [];
		}
	}

return;
}

$scope.refreshCAdata = function()
{
	$scope.table_loader = true;
	/*Refreshing content after action*/
			$http.get(__env.apiUrl+'/devices/customattributes/getall')
			.then(function (response) {
				console.log("Response got is:"+response);
				$scope.customAttribute =response['data'].reverse();
				$scope.customAttribute = orderBy($scope.customAttribute, 'displayname', false);
				$scope.table_loader = false;
			}).catch(function (response) {
					console.log("Inside error case");
					$scope.statusCode = response.status;
					$scope.statusText = (response.statusText);
					console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
					//Dummy data in case of error
					$scope.customAttribute =[
					{"attribute":"DATA_Column3","value":"Value1"},
					{"attribute":"DATA_Column2","value":"Value2"},
					{"attribute":"WINNEW","value":"Value3"}
				];
				$scope.table_loader = false;
			});
	/*Refreshing content after action*/
	$scope.table_loader = false;
}

$scope.getNumberRange = function(num)
{
	var range = [];
	for(var i=1;i<=num;i++) {
	  range.push(i);
	}
	return range;
}

$scope.hmChangeArr = [];
$scope.hmChangeSet = [];
$scope.changeHeatMap = function(attr,entity)
{
	var idelement=attr+'_'+entity;
	if($scope.hmChangeSet.indexOf(idelement) == -1)
	{
		$scope.hmChangeSet.push(idelement);
		$scope.hmChangeArr.push({"attribute":attr,"entity":entity});
		return false;
	}else{return false;}
}
$scope.saveHeatMap = function()
{

if($scope.hmChangeArr.length > 0)
{
//$scope.table_loader = (action !=='input')? true:false;

$scope.hmPostVal = [];
$scope.hmPostValTemp = [];
for (var i=0; i < $scope.hmChangeArr.length;i++)
{
	var idelement=$scope.hmChangeArr[i]["attribute"]+'_'+$scope.hmChangeArr[i]["entity"];
	$scope.columnno = (document.getElementById(idelement+'_columnno'))?document.getElementById(idelement+'_columnno').value:'';
	$scope.rowno = (document.getElementById(idelement+'_rowno'))?document.getElementById(idelement+'_rowno').value:'';
	$scope.hotspottitle = (document.getElementById(idelement+'_hotspottitle'))?document.getElementById(idelement+'_hotspottitle').value:'';
	$scope.hmPostValTemp.push({"entityName":$scope.hmChangeArr[i]["entity"],"fieldName":$scope.hmChangeArr[i]["attribute"],"columnNo":$scope.columnno,"rowNo":$scope.rowno,"hotSpotTitle":$scope.hotspottitle});
	}
	var postTemp = '"heatMapArray":'+JSON.stringify($scope.hmPostValTemp);
	$scope.hmPostVal.push(postTemp);
	var config = {
			headers : {
				'Content-Type': 'application/json',
			}
		}
		$http.put(__env.apiUrl+'/devices/heatmap/update','{'+postTemp+'}', config).success(function(data){
			console.log("Response got is:"+data);
			//$scope.refreshCAdata();
			alert('Successfully saved heat map!');

			$http.get(__env.apiUrl+'/devices/customattributes/getall')
				.then(function (response) {
					console.log("Response got is:"+response);
					$scope.customAttribute =response['data'].reverse();
					$scope.customAttribute = orderBy($scope.customAttribute, 'displayname', false);
					/*Visualization*/
					//$scope.rangeRowno = $scope.getNumberRange($scope.rowno);
					//$scope.rangeColumnno = $scope.getNumberRange($scope.columnno);
					$scope.rangeRowno = $scope.getNumberRange(Math.max.apply(Math, $scope.customAttribute.map( function (q ) {return q.rowno;})));
					$scope.rangeColumnno = $scope.getNumberRange(Math.max.apply(Math, $scope.customAttribute.map(function (q ) {return q.columnno;})));
					/*Visualization*/
					$("#contentDiv").removeClass('col-md-12').addClass('col-md-8');
					$("#previewDiv").addClass('col-md-4');
					$('document').ready(function() {
					$(window).scrollTop(0);
						});

				}).catch(function (response) {
						console.log("Inside error case");
						$scope.statusCode = response.status;
						$scope.statusText = (response.statusText);
						console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
			});


		}).catch(function (response){
			$scope.statusCode = response.status;
			$scope.statusText = (response.statusText);
			console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
			//alert('Error occurred while deleting '+ attr +' ,please try again!');
			alert("Error received while updating Custom Attribute "+attribute+" : "+response.statusText +" : "+"Request failed"+" : "+response.status);

		});
}
else{
	$http.get(__env.apiUrl+'/devices/customattributes/getall')
		.then(function (response) {
			console.log("Response got is:"+response);
			$scope.customAttribute =response['data'].reverse();
			$scope.customAttribute = orderBy($scope.customAttribute, 'displayname', false);
			/*Visualization*/
			$scope.rangeRowno = $scope.getNumberRange(Math.max.apply(Math, $scope.customAttribute.map(function (q ) {return q.rowno;})));
			$scope.rangeColumnno = $scope.getNumberRange(Math.max.apply(Math, $scope.customAttribute.map(function (q ) {return q.columnno;})));
			/*Visualization*/
			$("#contentDiv").removeClass('col-md-12').addClass('col-md-8');
			$("#previewDiv").addClass('col-md-4');
			$('document').ready(function() {
			$(window).scrollTop(0);
				});
				//$scope.table_loader = false;
		}).catch(function (response) {
				console.log("Inside error case");
				$scope.statusCode = response.status;
				$scope.statusText = (response.statusText);
				console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
	});

	$scope.hmChangeSet = [];
	$scope.hmChangeArr = [];

}

}

/*Heat map row and column values display*/

$scope.getMapValDisplay = function(row,col)
{
	$scope.table_loader = true;
	var elementID = document.getElementById("display_"+row+'_'+col);
	var textdeviceType = '<br/>';
	var textVal = '';
	var cntNo = 0;
	var heatMapDT=[];
	var colorErr='';
	for(var i=0;i < $scope.customAttribute.length;i++)
	{
		if($scope.customAttribute[i]["rowno"] !=='' && $scope.customAttribute[i]["columnno"] !=='')
		{
			if($scope.customAttribute[i]["rowno"] ==row && $scope.customAttribute[i]["columnno"] == col)
			{
				//textVal = textVal + $scope.customAttribute[i]["hotspottitle"]+'::'+$scope.customAttribute[i]["displayname"]+'::'+$scope.customAttribute[i]["entity"]+'\n\n';
				if(heatMapDT.indexOf($scope.customAttribute[i]["hotspottitle"]) == -1)
				{
					textdeviceType = textdeviceType + '<span style="color:blue">'+$scope.customAttribute[i]["hotspottitle"]+'</span><br/>';
					heatMapDT.push($scope.customAttribute[i]["hotspottitle"]);
				}
				  textVal = textVal+$scope.customAttribute[i]["entity"]+'::'+$scope.customAttribute[i]["displayname"]+'<br/>';
					cntNo++;
			}
		}
	}
	if(elementID)
	{
	colorErr = (cntNo > 1) ? 'red':'';
	elementID.innerHTML = textdeviceType+'<br/>'+'<span style="color:'+colorErr+'">'+textVal+'</span>';
  }
$scope.table_loader = false;
	return ;

}
/*Heat map row and column values display*/

		$scope.next_pre_ca = function(){
			alert('Records are moving now');
		}

	    $scope.navigateListView = function(){
			$location.url('/logicalDeviceListView');
		}

		/*Start::Column sorting function */
		$scope.reverse = true;
		$scope.sortbyColumn = function(sortby,sortaction)
		{
		  $scope.sortby = sortby;
			if($scope.presortaction === sortaction && $scope.presortby === sortby){return false;}
			$scope.reverse = (sortby !== null && $scope.sortby === sortby)? !$scope.reverse : false;
		    $scope.customAttribute = orderBy($scope.customAttribute, sortby, $scope.reverse);
			$scope.presortaction = sortaction;
			$scope.presortby = sortby;
		}
		/*End::Column sorting function */
}]);

/*End::Custom Attribute Controller*/
