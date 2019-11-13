app.controller('NotesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal) {
  //   $scope.saveDesc = function(){
	// 	console.log('inside save desc');
	// 	$scope.notes_adding();
	// }
	if($scope.globals.currentUser.role !== 'SCOPE+ Admin')
	{
		$scope.roleBasedCanBeAssociated=false;
	}
	else {
		$scope.roleBasedCanBeAssociated=true;
	}
	if($routeParams.deviceID =='setforreview' || $routeParams.deviceID =='unsetforreview'){
			$("#setReviewNotesInput").focus();
				$("#generalNotesSave").hide();
        var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/notes" ;
        $http.get(urlCall)
					.then(function (response) {
						$scope.notes =response['data']['notes'];
						$scope.$parent.notes =response['data']['notes'];
						console.log('post data===' + JSON.stringify(response['data']));
						console.log("DEVICE description got is :"+response['data'].description);
						//console.log('$scope.notes===' +JSON.stringify($scope.notes));
						$scope.generalnotes="";
						$scope.reviewnotes="";
						$scope.table_loader = false;
						$scope.notesSpinner = false;
					}).catch(function (response) {
                        console.log('response===' + response);
                        $scope.table_loader = false;
                    });
	}

/* CMT-631*/
	$scope.showNotes = function(Data){
		console.log('notesData====>>>>>' +JSON.stringify(Data));
		this.shownotesOverlay = true;
		$scope.GeneralnotesData = Data;
	}

	$scope.showOverlayonfocus = function(){
		this.shownotesOverlay = true;
	}

	$scope.hideOverlayoutFocus = function(){
		this.shownotesOverlay = false;
	}



	$scope.hideNotesOverlay = function(){
		this.shownotesOverlay = false;
	}

	$scope.showReviewNotes = function(Data){
		console.log('notesData====>>>>>' +JSON.stringify(Data));
		this.showReviewnotesOverlay = true;
		$scope.ReviewnotesData = Data;
	}

	$scope.hideReviewNotesOverlay = function(){
		this.showReviewnotesOverlay = false;
	}
	$scope.showOverlayonfocusReview = function(){
		this.showReviewnotesOverlay = true;
	}

	$scope.hideOverlayoutFocusReview = function(){
		this.showReviewnotesOverlay = false;
	}
	/**/

	$scope.notes_adding= function(q1){
		var fieldname = $scope.deviceName;
		var callpost = false;
		if(!$scope.description ){
			$scope.description="";
		} else {
			callpost = true;
		}
		if(!$scope.generalnotes ){
			$scope.generalnotes="";
		} else {
			callpost = true;
		}
		if(!$scope.reviewnotes){
			$scope.reviewnotes="";
		} else {
			callpost = true;
		}

		//console.log('$scope.description=====' +JSON.stringify($scope.description));
		//console.log('$scope.generalnotes====' +JSON.stringify($scope.generalnotes));
		//console.log('$scope.reviewnotes===' +JSON.stringify($scope.reviewnotes));
        //console.log('username====' + JSON.stringify($rootScope.globals.currentUser.username));
		var notesdata = {'description' : $scope.description,'generalnotes' : $scope.generalnotes,'reviewnotes' : $scope.reviewnotes , 'createdby':$rootScope.globals.currentUser.username};
		//console.log('notesdata====' +JSON.stringify(notesdata));
		var post_url=__env.apiUrl+"/logicaldevices/"+fieldname+"/notes ";
		var urlCall =__env.apiUrl+"/logicaldevices/"+$scope.deviceName+"/notes" ;
    if(q1 ==1){
      callpost = true;
    }
		if ( callpost ) {
			$scope.table_loader = true;
			$scope.notesSpinner = true;
			$http({
				method: 'POST',
				url: post_url,
				data:notesdata,
			}).success(function (response) {
				$http.get(urlCall)
					.then(function (response) {
						$scope.notes =response['data']['notes'];
						$scope.$parent.notes =response['data']['notes'];
						console.log('post data===' + JSON.stringify(response['data']));
						console.log("DEVICE description got is :"+response['data'].description);
						//console.log('$scope.notes===' +JSON.stringify($scope.notes));
						$scope.generalnotes="";
						$scope.reviewnotes="";
						$scope.table_loader = false;
						$scope.notesSpinner = false;
					}).catch(function (response) {
                        console.log('response===' + response);
                        $scope.table_loader = false;
						$scope.notesSpinner = false;
                    });
				$scope.table_loader = false;
				$scope.notesSpinner = false;

			}).catch(function (response) {
                        console.log('response===' + response);
                        $scope.table_loader = false;
            });
		}
	}

}

]);
