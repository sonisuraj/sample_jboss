//to make first letter capital Filter
app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
app.controller('otherDevicesController', ['$scope','$http','$routeParams','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal','$filter','$window','$route',function($scope,$http,$routeParams,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal,$filter,$window,$route) {
//SP9_DI_5 Issue fixed
//Author Nikita Banthiya
//Dated 7/8/2017
//typehead focus call

    $scope.populateDependentFields = function(dependentFields,key) {
        console.log("Dependent Fields got is<"+dependentFields+">");
        if ( !dependentFields || dependentFields =="") {
            console.log("Nothing to do as dependentfields value is blank or not defined");
            return false;
        }
        var fields = dependentFields.split(",");
        for ( var i = 0; i < fields.length ; i++) {
            var splitfields = fields[i].split(':');
            var rightvalue = document.getElementById(splitfields[2]).value;
            var leftvalue = ( eval(splitfields[1]).toFixed(20) * rightvalue );
            document.getElementById(splitfields[0]).value = leftvalue ;
            $scope.otherDeviceListing.deviceCollector[splitfields[0]] =leftvalue;
        }
    }
    $scope.onFocus = function (e) {
        console.log("D");
        $timeout(function () {
            $(e.target).trigger('input');
            $(e.target).trigger('change'); // for IE
        });
    };
    $scope.inboundOutbound =function(param){

        $scope.inboundoutboundShow =param;
        $scope.showcomponenttocomponentsSearch =true;
        if(param =='Inbound'){
            $scope.inboundOutboundSearchSelector='inboundcomponents';
        }else{
            $scope.inboundOutboundSearchSelector ='outboundcomponents '
        }
    }
    $scope.deletionDevices =function(){
        var nameid =$rootScope.PkidData;
        //api/devices/<devicetype>/<pkid>
        var url = __env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+nameid;
        console.log(url);
        $http({
            method: 'DELETE',
            url: url,

        }).success(function (response) {
            console.log(response);
            if(response == true){
                alert('Devices Deleted Successfully');
                $location.url('/otherDevices/'+$routeParams.objid);
            }
        }).catch(function(response){
            alert(response.data.errorMessage);
        });
    }
    var urlCall =__env.apiUrl+"/devices/count";
    console.log(urlCall);
    $scope.showEnableUserIdName =false;
    $http.get(urlCall)
        .success(function (response) {
            console.log(response);
            var countdata = response.result;
            var idname = $routeParams.objid.toLowerCase();
            for ( var i = 0 ; countdata && i < countdata.length ; i++) {
                countdata[i].id =countdata[i].id.toLowerCase();
                if ( countdata[i].id == idname) {
                    console.log(countdata[i].useid);
                    var checkUserId = countdata[i].useid;
                    console.log(checkUserId);
                    if(checkUserId == "true"){
                        $scope.showEnableUserIdName =true;
                        return;
                    }
                }

            }

        });
//SP9_DI_5 Issue fixed

    $scope.hideExportDoc = false;
    $scope.navigationOther =function(name,pkid,headingAssociation,otherdevicename){
        console.log(name+pkid+otherdevicename);
        var no ="";
        otherdevicename =otherdevicename.toLowerCase();
        var rownum =name;
        if(otherdevicename == 'events' || otherdevicename=='documents'|| otherdevicename=='logicalnetworks' || otherdevicename == 'interfacegroups' || otherdevicename=='deviceinterfaces' || otherdevicename == 'componenttocomponents'){
            rownum =pkid;
        }else{
            rownum =name;
        }
        console.log(otherdevicename);
        //http://9.17.237.107:9082/SCOPEToolsIntegrationServices/api/devices/services/0/rownum
        if(otherdevicename =='logicaldevices' ||otherdevicename =='resources' || otherdevicename =='logical-devices' || otherdevicename =='Logical-Devices' || otherdevicename =='inbound-logical-devices'||otherdevicename =='outbound-logical-devices'){
            otherdevicename ='logicaldevices';
        }
        otherdevicename =otherdevicename.replace(/-/g, "");
        if(otherdevicename == 'inboundservices' || otherdevicename =='outboundservices' || otherdevicename =='resourcesservices'){
            otherdevicename ='services';
        }
        console.log(__env.apiUrl+"/devices/"+otherdevicename+"/"+rownum+"/rownum");
        $http.get(__env.apiUrl+"/devices/"+otherdevicename+"/"+rownum+"/rownum").success(function (response) {
            console.log(response)
            console.log(response.ROWNUM);
            no =response.ROWNUM;
            if(otherdevicename =='logicaldevices' || otherdevicename =='logical-devices' || otherdevicename =='Logical-Devices' || otherdevicename =='resources'){
                var redirectUrl ="/logicalDevices/LIST/"+no+"/"+name;
            }
            else if(otherdevicename == 'events' || otherdevicename=='documents'|| otherdevicename=='logicalnetworks' || otherdevicename == 'interfacegroups' || otherdevicename=='deviceinterfaces' || otherdevicename == 'componenttocomponents'){
                var redirectUrl ="/otherDevices/"+otherdevicename+"/first/"+no+"/"+pkid +"/undefined/undefined";
            }else{
                var redirectUrl = "/otherDevices/"+otherdevicename+"/first/"+no+"/"+name +"/undefined/undefined"
            }
            console.log(redirectUrl);
            $location.url(redirectUrl);
        }).error(function(response){
            console.log(response);
            if(response.errorMessage){
                alert(response.errorMessage);
                return;
            }
        });
    }
    $rootScope.showScheduleDiv = false;
    var Exportstyle = {
        headers:true,
        separator:","
    }

    $scope.reloadPage = function(){
        $route.reload()
    }
    if($routeParams.objid === 'Events' ||$routeParams.objid === 'events' ){
        $rootScope.showScheduleDiv = true;
    }
    else{
        $rootScope.showScheduleDiv = false;
    }
    $scope.canbeAssociated=$routeParams.canbeAssociated;
    $scope.EditDisabled =true;
    $scope.EditDisabledVlan=true;
    $scope.emptyOrNullG = function(item) {
        if ( !item.generalnotes ) return false;
        return !(item.generalnotes == null || item.generalnotes.trim().length === 0);
    }
    $scope.emptyOrNullR = function(item){
        if ( !item.reviewnotes ) return false;
        return !(item.reviewnotes == null || item.reviewnotes.trim().length === 0);
    }
    $scope.downloadOpen =function(pkid){
        var downloadURL = __env.apiUrl+"/devices/downloaddoc/"+pkid;
        console.log(downloadURL);
        $http.get(downloadURL).success(function (response) {
            $window.open(__env.apiUrl+"/devices/downloaddoc/"+pkid, '_blank');

        }).error(function(response){
            console.log(response);
            if(response.errorMessage){
                alert(response.errorMessage);
                return;
            }
        });
    }
    $scope.showNotes = function(Data){
        console.log('notesData====>>>>>' +JSON.stringify(Data));
        this.shownotesOverlay = true;
        $scope.GeneralnotesData = Data;
    }

    $scope.MonthNamesLeft = ["January","February","March","April","May","June"]
    $scope.MonthNamesRight = ["July","August","September","October","November","December"]
    $scope.DayNames = ["Monday" ,"Tuesday" ,"Wednesday","Thursday" ,"Friday" ,"Saturday","Sunday"]
    $scope.eventNames = ["First","Second","Third","Fourth" ,"Last"]

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
    $scope.downloadURL = __env.apiUrl+"/devices/downloaddoc/";
    $scope.AddAssociationShowHide =true;
    if($routeParams.objid =='physicaldevices' && $routeParams.deviceID=='services'){
        $scope.AddAssociationShowHide =false;
    }

    $scope.LowerOtherDeviceName=$routeParams.objid.toLowerCase();
    console.log("Route Params got is:"+JSON.stringify($routeParams));
    $scope.showCustomAttribute ="";
    var url =__env.apiUrl+"/devices/customattributes/getentities";
    $http({
        method: 'GET',
        url: url,
    }).success(function (response) {
        $scope.showCustomAttribute = "false";
        console.log(response.dropdown);
        // for ( var indexc = 0 ; $scope.devicedata && indexc < $scope.devicedata.length ; indexc++) {
        //     if ( $scope.devicedata[indexc].group == "relevant" ) {
        //         $scope.showRelevant = true;
        //         break;
        //     }
        // }
        for ( var indexc = 0 ; response.dropdown && indexc < response.dropdown.length; indexc++) {
            if ( response.dropdown[indexc].key == $scope.LowerOtherDeviceName ) {
                $scope.showCustomAttribute = "true";
                break;
            }
        }
    }).catch(function(response){
        console.log("d");
    });
    $scope.associationDevices=false;
    $scope.setSelectionButton = "normaView";
    $scope.open_Audit = function(pkid,fieldname) {
        $scope.pkidCollector =pkid;
        $scope.fieldnameCollector =fieldname;
        if(!(pkid))
        {
            $scope.errorMsg = "Import IDs not loaded, please try after few seconds!";
            document.getElementById('Modal_importError').style.display = "block";
        }
        else{
            document.getElementById('Modal_audit').style.display = "block";
            //$scope.import_type=import_type.toLowerCase();
        }
    }

    $scope.saveRationale=function(pkid,desc){
        var url =  __env.apiUrl+'/devices/rationale/update';
        var t = {
            "pkid":pkid,
            "rationaleDesc":desc
        };
        console.log(t);
        $http({
            method: 'PUT',
            url: url,
            data:t
        }).success(function (response) {
            $("#"+pkid).html(desc);
            alert("Successfully Done !!");
            document.getElementById('Modal_audit').style.display = "none";
        }).catch(function(response){
            console.log("In error scenario response got is:"+response)
            alert("Error ,please try in sometime");
        });

    }
    $scope.StakeHolderNames = ["Developer","Lead","Role1" , "Role2" , "Role3"];
    $scope.LowerOtherDeviceName=$routeParams.objid.toLowerCase();
    var urlCall =__env.apiUrl+"/devices/displaynames";
    $http.get(urlCall).then(function (response) {
        $scope.deviceDisplayNames =response['data'];
        $scope.deviceDisplayName=$scope.deviceDisplayNames[$routeParams.objid.toLowerCase()];
        $scope.showSelectionDiv = false;
        console.log('routeparams===>>>>' +JSON.stringify($routeParams));
        console.log('$routeParams.associationHeading===' + $routeParams.associationHeading);
        console.log('$routeParams.deviceID====>>>>' + $routeParams.deviceID);
        if( $routeParams.deviceID && $routeParams.associationHeading && $routeParams.associationHeading != "undefined" && $routeParams.associationHeading !='first' ){
            if($routeParams.deviceID !='LIST' && $routeParams.associationHeading != 'Audit'  && $routeParams.associationHeading != 'Notes' && $routeParams.deviceID !='SetReviewNotes' && $routeParams.deviceID !='UnSetReviewNotes' && $routeParams.associationHeading !='RelationalAudit'){
                console.log('place code for get related data here');
                $scope.associationDevices=true;
                $scope.showSelectionDiv = true;
                $scope.headingAssociation =   $routeParams.associationHeading;
                if ( $scope.deviceDisplayNames && $scope.headingAssociation) {
                    $scope.headingAssociationTitle = $scope.deviceDisplayNames[$scope.headingAssociation.replace(/-/g, "").toLowerCase()];
                }
                if ( !$scope.headingAssociationTitle ) {
                    $scope.headingAssociationTitle = $scope.headingAssociation;
                }

                $scope.associateLowerTitle = $routeParams.subHeading;
                console.log('$scope.headingAssociation===>>>>' + $scope.headingAssociation+"><$scope.associateLowerTitle:"+$scope.associateLowerTitle);
                /* adding assocatelowedata func. get related data api -- manisha code change starts*/
                var a = $routeParams.associationHeading;
                var a1 = $routeParams.deviceID;
                console.log('a(associationHeading) and a1(deviceID)===' + a +'and' + a1);
                if($routeParams.objid === 'stakeholders' || $routeParams.deviceID === 'stakeholders'){
                    $scope.setSelectionButton = "StaketoOtherView";
                }
                if(a=='Stakeholders'){
                    //alert('a== stakeholders');
                    if(a1 == 'stakeholders'){
                        $scope.associationMainHeading = 'stakeholders';
                        $scope.associationSubHeading='stakeholders'
                    }
                    else if(a1 == 'stakeholderscomponents'){
                        $scope.associationMainHeading = 'stakeholderscomponents';
                        $scope.associationSubHeading='stakeholderscomponents'
                    }
                    else if(a1 == 'stakeholderslogicaldevices'){
                        $scope.associationMainHeading = 'stakeholderslogicaldevices';
                        $scope.associationSubHeading='stakeholderslogicaldevices'
                    }
                    else if(a1 == 'stakeholdersphysicaldevices'){
                        $scope.associationMainHeading = 'stakeholdersphysicaldevices';
                        $scope.associationSubHeading='stakeholdersphysicaldevices'
                    }  else if(a1 == 'stakeholdersservices' || a1 == "stakeholdersservices" ){
                        $scope.associationMainHeading = 'stakeholdersservices';
                        $scope.associationSubHeading='stakeholdersservices';
                    }
                }
                else{
                    $scope.associationMainHeading=a;
                    $scope.associationSubHeading=a1;
                }
                $scope.associationDevices=true;
                var association ="";
                if($scope.associationMainHeading =='Documents'){
                    associationName ="Documents";
                }
                if($scope.associationMainHeading =='Notes'){
                    associationName ="Notes";
                }
                if($scope.associationMainHeading =='Documents'){
                    associationName = "documents"
                }

                if($scope.associationMainHeading !='Notes' && $scope.associationMainHeading !='Documents'){
                    var associationName = "";
                    if ( $scope.associationSubHeading ) associationName = $scope.associationSubHeading.toLowerCase();;
                    if($scope.associationSubHeading ==0){
                        associationName = $scope.associationMainHeading.toLowerCase();
                    }
                }
                associationName =associationName.replace(/-/g, "");

                ///otherDevices/services/direct1/0000000000000000000
                /* get related data api manisha code change starts*/
                console.log('associationNameAfyter==>>>' +associationName);
                console.log('$scope.LowerOtherDeviceName==>>>' + $scope.LowerOtherDeviceName);
                console.log('$scope.globalDeviceName===>>>>' + $scope.globalDeviceName);
                console.log('globalDeviceName===>>>>' + $rootScope.globalDeviceName);
                console.log('routeparams.deviceName==>>>>' + $routeParams.deviceName);

                if($routeParams.objid === 'clusters'){
                    $scope.setSelectionButton = "clusterView";
                }


                if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups' ||$scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                    //$scope.otherDeviceData[0].PKID
                    console.log('$scope.otherDeviceData====' +JSON.stringify($scope.otherDeviceData));
                    console.log($rootScope.PkidData);
                    var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+associationName;
                }
                /* event api integration starts*/
                if($scope.LowerOtherDeviceName === 'events'){
                    //$scope.otherDeviceData[0].PKID
                    $scope.setSelectionButton = "eventView";
                    $scope.eventSelectionButton = associationName;
                    console.log('$scope.otherDeviceData====' +JSON.stringify($scope.otherDeviceData));
                    console.log($rootScope.PkidData);

                    var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+associationName;
                    /* calling the get schedule api data */
                    var get_url = __env.apiUrl+'/devices/schedule/'+$rootScope.PkidData
                    //console.log('get_url==>>>>' + get_url);
                    $http.get(get_url).success(function(response){
                        console.log('response==>>>>' + JSON.stringify(response));
                        //alert('inside get schedule api success')
                        $rootScope.ScheduleChangeData = response.schedule;
                    });
                    /* */
                }
                /* event api integration ends*/
                else{
                    var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceName+'/'+associationName;
                    console.log('get_url===>>>>' + get_url);
                }
                var stakeholderHeading =0
                if(associationName == 'stakeholderscomponents' || associationName =='stakeholderslogicaldevices' || associationName =='stakeholdersphysicaldevices' || associationName =='stakeholdersservices'){
                    stakeholderHeading=1;
                }

                setColumnHeader($scope,associationName,$http,__env,stakeholderHeading);
                console.log('get_url===>>>' + get_url);
                if($routeParams.associationHeading == "Entities"){
                    //http://9.109.123.149:9081/SCOPEToolsIntegrationServices/api/devices/events/141/services
                    var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+$routeParams.deviceID;
                }
                $http.get(get_url).success(function(response,status,headers){
                    console.log("Response got for query<"+associationName +"> is<<"+response[associationName])
                    $scope.rows =response[associationName];
                    console.log('$scope.rows--responsedata==>>>>' + JSON.stringify($scope.rows));
                }).catch(function (response) {
                    // use field API to get columns names
                    $scope.rows =[];

                });
                /* get related data api manisha code change ends*/
                $scope.associationDevices=true;
                console.log("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+associationName+"/"+$scope.recordID +"/"+$scope.globalDeviceName);
                console.log('a===>>' +JSON.stringify(a));
                /* manisha code changes ends*/

            }

            /* nikita code changes starts*/

            if($routeParams.deviceID !='LIST' && $routeParams.associationHeading =='Audit' ||  $routeParams.associationHeading =='RelationalAudit'){
                $scope.associationDevices=true;
                if ( !$scope.associationSubHeading ) $scope.associationSubHeading = $routeParams.subHeading;
                if ( $scope.associationSubHeading ) {
                    $scope.associationSubHeading = $scope.associationSubHeading.replace(/-/g," ");
                }
                if ( !$scope.associationSubHeading || $scope.associationSubHeading.trim().length == 0 ) {
                    $scope.associationSubHeading = $routeParams.deviceID.substr(0,$routeParams.deviceID.indexOf("audit"));
                    if ( $scope.associationSubHeading.length > 0 ) $scope.associationSubHeading.charAt(0).toUpperCase();
                }
                var url =__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$routeParams.deviceName+'/'+"audit";
                if($routeParams.associationHeading =='RelationalAudit'){
                    var url = __env.apiUrl+'/devices/getrelationalaudit/'+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceID+"/"+$routeParams.deviceName;
                    //var url ='http://9.17.237.107:9082/SCOPEToolsIntegrationServices/api/devices/getrelationalaudit/services/components/API_RA_TEST_SERVICE_SCOPEDEV';
                }
                console.log(url);
                $http.get(url).then(function (response) {
                    $scope.headingAssociation =   $routeParams.associationHeading;
                    if($routeParams.associationHeading =='RelationalAudit'){
                        $scope.audit_data =response.data;
                        $scope.$parent.audit_data =response.data;
                        console.log($scope.audit_data);

                    }else{
                        $scope.audit_data =response.data.auditdetails;
                        $scope.$parent.audit_data =response.data.auditdetails;
                        console.log($scope.audit_data);
                        $scope.headingAssociation =   $routeParams.associationHeading;
                    }

                }).catch(function(response){
                    console.log("ddd");
                    $scope.audit_data ="";
                    $scope.$parent.audit_data ="";
                    $scope.headingAssociation =   $routeParams.associationHeading;
                });
            }
            if($routeParams.deviceID =='documents'){

            }
            if($routeParams.deviceID =='Notes' || $routeParams.deviceID =='SetReviewNotes' || $routeParams.deviceID =='UnSetReviewNotes'){

                if($routeParams.deviceID =='SetReviewNotes' || $routeParams.deviceID =='UnSetReviewNotes'){
                    $("#generalNotesSave").hide();
                    $("#setReviewNotesInput").focus();

                }
                $scope.associationDevices=true;
                $scope.LowerOtherDeviceName=$routeParams.objid.toLowerCase();
                $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$routeParams.deviceName+'/notes ').then(function (response) {
                    $scope.notesDateCollector =[];
                    for ( var currentindex = 0 ; currentindex < response.data.notes.length ; currentindex++ ) {
                        console.log(response.data.notes[currentindex].createddate);
                        var localTime  = moment.utc(response.data.notes[currentindex].createddate).toDate();
                        localTime = moment(localTime).format('YYYY-MM-DD HH:mm');
                        $scope.notesDateCollector.push({"createddate":localTime,"generalnotes":response.data.notes[currentindex].generalnotes,"reviewnotes":response.data.notes[currentindex].reviewnotes,"createdby":response.data.notes[currentindex].createdby});

                    }
                    //console.log($scope.notesDateCollector);
                    $scope.notes_display = $scope.notesDateCollector;
                    $scope.notes_description=response.data.description;

                });
            }
            /* nikita code change ends*/
        }
    });

    $scope.otherDeviceListing=[];

    $scope.searchRelatedCount=[];
    $scope.searchCustomAttribute=[];
    $scope.searchManRel =[];
    $scope.searchService=[];
    $scope.searchComponent=[];
    $scope.searchCluster=[];
    $scope.searchStakeholder =[];
    $scope.searchDocument =[];
    $scope.searchPhysicalDevice=[];
    $scope.searchDeviceInterface=[];
    $scope.searchFileSystem=[];
    $scope.searchStakeholder=[];
    $scope.searchLogicalDevice=[];
    $scope.searchLogicalNetwork =[];
    $scope.searchDataSource =[];
    $scope.searchEvent=[];
    $scope.searchComponentToComponent=[];
    $scope.searchInterfaceGroup=[];
    $scope.otherDeviceName=$routeParams.objid;
//var dummysearch = [];
// searchServiceCollector=[];
    var searchServiceCollector =$scope.searchService;
    var searchComponentCollector = $scope.searchComponent;
    var searchClusterCollector = $scope.searchCluster;
    var searchDocumentCollector = $scope.searchDocument;
    var searchPhysicalDeviceCollector =$scope.searchPhysicalDevice;
    var searchDeviceInterfaceCollector =$scope.searchDeviceInterface;
    var searchFileSystemCollector =$scope.searchFileSystem;
    var searchStakeholderCollector=$scope.searchStakeholder;
    var searchLogicalDeviceCollector =$scope.searchLogicalDevice;
    var searchLogicalNetworkCollector=$scope.searchLogicalNetwork;
    var searchDataSourceCollector =$scope.searchDataSource;
    var searchEventCollector =$scope.searchEvent;
    var searchComponentToComponentCollector=$scope.searchComponentToComponent;
    var searchInterfaceGroupCollector =$scope.searchInterfaceGroup;
    var mainSearchName="";

    if($scope.LowerOtherDeviceName == 'Services'.toLowerCase()){
        searchServiceCollector =$scope.searchManRel ;
        mainSearchName ="services";
    }
    if($scope.LowerOtherDeviceName == 'Components'.toLowerCase()){
        searchComponentCollector =$scope.searchManRel ;
        mainSearchName="components";
    }if($scope.LowerOtherDeviceName == 'Clusters'.toLowerCase()){
        searchClusterCollector =$scope.searchManRel ;
        mainSearchName ="clusters";
    }
    if($scope.LowerOtherDeviceName == 'Documents'.toLowerCase()){
        searchDocumentCollector =$scope.searchManRel ;
        mainSearchName ="documents";
    }
    if($scope.LowerOtherDeviceName == 'PhysicalDevices'.toLowerCase()){
        searchPhysicalDeviceCollector =$scope.searchManRel ;
        mainSearchName="physicaldevices";
    }
    if($scope.LowerOtherDeviceName == 'DeviceInterfaces'.toLowerCase()){
        searchDeviceInterfaceCollector =$scope.searchManRel ;
        mainSearchName="deviceinterface";
    }
    if($scope.LowerOtherDeviceName == 'FileSystems'.toLowerCase()){
        searchFileSystemCollector =$scope.searchManRel ;
    }
    if($scope.LowerOtherDeviceName == 'LogicalNetworks'.toLowerCase()){
        searchLogicalNetworkCollector =$scope.searchManRel ;
    }
    if($scope.LowerOtherDeviceName == 'DataSources'.toLowerCase()){
        searchDataSourceCollector =$scope.searchManRel ;
    }
    if($scope.LowerOtherDeviceName == 'Stakeholders'.toLowerCase()){
        searchStakeholderCollector =$scope.searchManRel ;
    }
    if($scope.LowerOtherDeviceName == 'ComponenttoComponents'.toLowerCase()){
        searchComponentToComponentCollector =$scope.searchManRel ;

    }if($scope.LowerOtherDeviceName == 'Events'.toLowerCase()){
        searchEventCollector =$scope.searchManRel ;

    }
    if($scope.LowerOtherDeviceName == 'InterfaceGroups'.toLowerCase()){
        searchInterfaceGroupCollector =$scope.searchManRel ;

    }
    if ( $scope.LowerOtherDeviceName && $scope.LowerOtherDeviceName !='first' && $scope.LowerOtherDeviceName != 'undefined') {
        $http.get(__env.apiUrl+'/devices/fields/'+$scope.LowerOtherDeviceName).then(function (response) {
            $scope.currentfielddata = response.data.fields;
            /*for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
             $scope.searchManRel[$scope.currentfielddata[ currentindex].key] = $scope.LowerOtherDeviceName+"___"+$scope.currentfielddata[ currentindex].key;
             }*/

        });
    }
//Search call for each device to display on ui
    $http.get(__env.apiUrl+'/devices/displaynames').then(function (response) {
        angular.forEach(response.data, function(value, key) {
            console.log(key + ': ' + value);
            $http.get(__env.apiUrl+'/devices/fields/'+key).then(function (response) {
                $scope[key+'Data'] = response.data.fields;
            });
        });
    });
    if($scope.otherDeviceName =='Components'  || $scope.otherDeviceName.toLowerCase() =='components'){

        $http.get(__env.apiUrl+'/devices/fields/outboundcomponents').then(function (response) {
            $scope.outboundInboundData = response.data.fields;
        });
    }

    $scope.markForDeletion =function(name,param){
//http://9.17.237.197:9082/SCOPEToolsIntegrationServices/api/devices/services/TEST4/markfordeletion?mark=NON-CANDIDATE
//0 Delete
        var nameid = name ;
        if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
            var nameid =$rootScope.PkidData;
        }
        var url = __env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+nameid+"/markfordeletion?mark="+param;
        console.log(url);
        $http({
            method: 'PUT',
            url: url,

        }).success(function (response) {
            console.log($scope.setMarkDeletion);
            if($scope.setMarkDeletion == true){
                $scope.setMarkDeletion=false;
            }else{
                $scope.setMarkDeletion=true;
            }

        }).catch(function(response){
            alert("Error ,please try in sometime");
        });
    }
    $scope.reviewSetUnset =function(name,param){
        var nameid = name ;
        console.log($scope.LowerOtherDeviceName);
        if($scope.LowerOtherDeviceName =='events' || $scope.LowerOtherDeviceName == 'logicalnetworks' || $scope.LowerOtherDeviceName == 'deviceinterfaces' || $scope.LowerOtherDeviceName == 'documents' || $scope.LowerOtherDeviceName == 'interfacegroups' || $scope.LowerOtherDeviceName == 'componenttocomponents'){
            var nameid =$rootScope.PkidData;
            console.log(nameid);
            console.log("ddd");
        }
        console.log(nameid);
        var url = __env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+nameid+"/setforreview?setreview="+param;
        console.log(url);
        $http({
            method: 'PUT',
            url: url,

        }).success(function (response) {
            console.log(response);
            $scope.device_add.setreview =param;
            if(param =='Yes'){
                var url ='SetReviewNotes';
            }else{
                url ='UnSetReviewNotes';
            }
            $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+url+"/"+$scope.recordID +"/"+nameid+"/Notes");

        }).catch(function(response){
            alert("Error ,please try in sometime");
        });
    }

    $scope.containerHolder =[];
    //ui to show entity for search
    $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu').then(function (response) {
        $scope.association = response.data.devicemenu;

        for ( var i = 0 ; $scope.association && i <$scope.association.length ; i++) {
            var key = $scope.association[i].key;
            key = key.replace(/-/g, "").toLowerCase();
            console.log(key+$scope.association[i].canbeadded);
            if($scope.association[i].canbeadded ==true){
                $scope['show'+key+"Search"]=true;
            }else{
                for ( var j = 0 ; $scope.association[i].submenu && j <$scope.association[i].submenu.length ; j++) {
                    console.log($scope.association[i].submenu[j].canbeadded);
                    if($scope.association[i].submenu[j].canbeadded ==true){
                        $scope['show'+key+"Search"]=true;
                        if($scope.LowerOtherDeviceName =='components' || $scope.otherDeviceName.toLowerCase() =='componenttocomponents'){
                            $scope.showcomponenttocomponentsSearch =false;
                        }
                    }
                }
            }

        }
    });

    $scope.submitSearch =function(){
        $rootScope.searchFlag = 1;
        var dummyservice = [];
        var dummycomponent=[];
        var dummycluster=[];
        var dummystakeholder =[];
        var dummydocument =[];
        var dummydeviceinterface=[];
        var dummyphysicaldevice =[];
        var dummyfilesystem =[];
        var dummylogicaldevice =[];
        var dummylogicalnetwork=[];
        var dummydatasource =[];
        var dummyevents =[];
        var dummycomponenttocomponents=[];
        var dummyinterfacegroups =[];
        var dummyrelatedCount =[];
        var dummycustomAttribute=[];

        for (var k in $scope.searchRelatedCount){
            dummyrelatedCount.push({ "fieldname" : k , "fieldvalue" : $scope.searchRelatedCount[k], "devicetype" :"relatedCount"});
        }
        for (var k in $scope.searchCustomAttribute){
            dummycustomAttribute.push({ "fieldname" : k , "fieldvalue" : $scope.searchCustomAttribute[k], "devicetype" :$scope.LowerOtherDeviceName});
        }

        for (var k in searchServiceCollector){
            dummyservice.push({ "fieldname" : k , "fieldvalue" : searchServiceCollector[k], "devicetype" :"services"});
        }

        for (var k in searchComponentCollector){
            dummycomponent.push({ "fieldname" : k , "fieldvalue" : searchComponentCollector[k], "devicetype" :"components"});
        }

        for (var k in searchClusterCollector){
            dummycluster.push({ "fieldname" : k , "fieldvalue" : searchClusterCollector[k], "devicetype" :"clusters"});
        }

        for (var k in searchStakeholderCollector){
            dummystakeholder.push({ "fieldname" : k , "fieldvalue" : searchStakeholderCollector[k], "devicetype" :"stakeholders"});
        }

        for (var k in searchDocumentCollector){
            dummydocument.push({ "fieldname" : k , "fieldvalue" : searchDocumentCollector[k], "devicetype" :"documents"});
        }
        for (var k in searchPhysicalDeviceCollector){
            dummyphysicaldevice.push({ "fieldname" : k , "fieldvalue" : searchPhysicalDeviceCollector[k], "devicetype" :"physicaldevices"});
        }
        for (var k in searchDeviceInterfaceCollector){
            dummydeviceinterface.push({ "fieldname" : k , "fieldvalue" : searchDeviceInterfaceCollector[k], "devicetype" :"deviceinterfaces"});
        }
        for (var k in searchFileSystemCollector){
            dummyfilesystem.push({ "fieldname" : k , "fieldvalue" : searchFileSystemCollector[k], "devicetype" :"filesystems"});
        }
        for (var k in searchLogicalDeviceCollector){
            dummylogicaldevice.push({ "fieldname" : k , "fieldvalue" : searchLogicalDeviceCollector[k], "devicetype" :"logicaldevices"});
        }
        for (var k in searchLogicalNetworkCollector){
            dummylogicalnetwork.push({ "fieldname" : k , "fieldvalue" : searchLogicalNetworkCollector[k], "devicetype" :"logicalnetworks"});
        }
        for (var k in searchDataSourceCollector){
            dummydatasource.push({ "fieldname" : k , "fieldvalue" : searchDataSourceCollector[k], "devicetype" :"datasources"});
        }
        for (var k in searchEventCollector){
            dummyevents.push({ "fieldname" : k , "fieldvalue" : searchEventCollector[k], "devicetype" :"events"});
        }
        for (var k in searchComponentToComponentCollector){
            selectionComptoComp='componenttocomponents';
            if($scope.otherDeviceName =='components' || $scope.otherDeviceName.toLowerCase() =='components'){
                var selectionComptoComp =  $scope.inboundOutboundSearchSelector;
            }
            dummycomponenttocomponents.push({ "fieldname" : k , "fieldvalue" : searchComponentToComponentCollector[k], "devicetype" :selectionComptoComp});
        }
        //console.log(dummycomponenttocomponents);
        for (var k in searchInterfaceGroupCollector){
            dummyinterfacegroups.push({ "fieldname" : k , "fieldvalue" : searchInterfaceGroupCollector[k], "devicetype" :"interfacegroups"});
        }

        if($scope.otherDeviceName == 'Services' || $scope.otherDeviceName.toLowerCase() =='services'){
            mainJsonCollector = dummyservice.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummycomponent).concat(dummylogicaldevice).concat(dummydocument).concat(dummystakeholder).concat(dummyevents);

        }
        if($scope.otherDeviceName == 'Components' || $scope.otherDeviceName.toLowerCase() =='components'){
            mainJsonCollector = dummycomponent.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummylogicaldevice).concat(dummydocument).concat(dummyservice).concat(dummystakeholder).concat(dummyevents).concat(dummycomponenttocomponents);

        }
        if($scope.otherDeviceName == 'Clusters' || $scope.otherDeviceName.toLowerCase() =='clusters'){
            var mainJsonCollector = dummycluster.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummylogicaldevice).concat(dummyfilesystem);

        }
        if($scope.otherDeviceName == 'Documents' || $scope.otherDeviceName.toLowerCase() =='documents'){
            var mainJsonCollector = dummydocument.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummycomponent).concat(dummylogicaldevice).concat(dummyservice).concat(dummyphysicaldevice);
        }
        if($scope.otherDeviceName == 'PhysicalDevices' || $scope.otherDeviceName.toLowerCase() =='physicaldevices'){
            var mainJsonCollector = dummyphysicaldevice.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummydocument).concat(dummystakeholder).concat(dummylogicaldevice).concat(dummyevents).concat(dummydeviceinterface);
        }
        if($scope.otherDeviceName == 'DeviceInterfaces' || $scope.otherDeviceName.toLowerCase() =='deviceinterfaces'){
            var mainJsonCollector = dummydeviceinterface.concat(dummyrelatedCount).concat(dummycustomAttribute);
        }
        if($scope.otherDeviceName == 'FileSystems' || $scope.otherDeviceName.toLowerCase() =='filesystems'){
            var mainJsonCollector = dummyfilesystem.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummylogicaldevice);
        }
        if($scope.otherDeviceName == 'LogicalNetworks' || $scope.otherDeviceName.toLowerCase() =='logicalnetworks'){
            var mainJsonCollector = dummylogicalnetwork.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummylogicaldevice);
        }

        if($scope.otherDeviceName == 'DataSources' || $scope.otherDeviceName.toLowerCase() =='datasources'){
            var mainJsonCollector = dummydatasource.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummystakeholder);
        }
        if($scope.otherDeviceName == 'Stakeholders' || $scope.otherDeviceName.toLowerCase() =='stakeholders'){
            var mainJsonCollector = dummystakeholder.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummylogicaldevice).concat(dummyservice).concat(dummycomponent).concat(dummyphysicaldevice);
        }
        if($scope.otherDeviceName == 'Events' || $scope.otherDeviceName.toLowerCase() =='events'){
            var mainJsonCollector = dummyevents.concat(dummyrelatedCount).concat(dummycustomAttribute);
        }
        console.log($scope.otherDeviceName.toLowerCase());
        if($scope.otherDeviceName == 'ComponenttoComponents' || $scope.otherDeviceName.toLowerCase() =='componenttocomponents'){
            var mainJsonCollector = dummycomponenttocomponents.concat(dummyrelatedCount).concat(dummycustomAttribute);
        }
        if($scope.otherDeviceName == 'InterfaceGroups' || $scope.otherDeviceName.toLowerCase() =='interfacegroups'){
            var mainJsonCollector = dummyinterfacegroups.concat(dummyrelatedCount).concat(dummycustomAttribute).concat(dummydeviceinterface);
        }
        console.log("mainJsonCollector  got is :"+mainJsonCollector)
        var post_url=__env.apiUrl+"/devices/search";
        console.log(post_url);
        //var mainJsonCollector=[];
        if ( $scope.searchdevicename && $scope.searchdevicename.length > 0) {
            mainJsonCollector.push({"fieldname": "name", "fieldvalue": $scope.searchdevicename,"devicetype": ""});
        }

        console.log(post_url);
        var t ={"devicetype":$scope.LowerOtherDeviceName,"search":mainJsonCollector};
        t = JSON.stringify(t)
        console.log(t);
        console.log({"devicetype":$scope.LowerOtherDeviceName,"search":mainJsonCollector
        });
        //return;
        $http.post(post_url,{"devicetype":$scope.LowerOtherDeviceName,"search":mainJsonCollector
        }).success(function(data){
            /*Search refresh related count for device*/
            var idtobeused = $scope.device_add.name;
            if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                //idtobeused = $scope.device_add.id;
                idtobeused = $scope.device_add.PKID;
            }
            console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
            console.log(data);
            $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                $scope.relatedCount = response.data;
                console.log('$scope.relatedCount response====' +JSON.stringify($scope.relatedCount));
                //$scope.$parent.relatedCount = response.data;
                setRelatedCounts($scope,response.data,$rootScope);
            }).catch(function(response){
                //$scope.$parent.relatedCount = [];
                $scope.relatedCount = [];
            });
            /*Search refresh related count for device*/
            //console.log(mainJsonCollector);
            console.log("fff");
            if ( !data || data.length == 0 ) {

                alert("No result found for given criteria<"+mainJsonCollector+">");
                return false;
            }
            $("#demo12").removeClass('in');
            $scope.otherDeviceData = data;

            $scope.totalLDcount = data.length;
            console.log($scope.totalLDcount);


            $scope.currentRecord = 1;
            $scope.recordID = 1;
            $scope.otherDeviceData.servicecount = 0 ;
            $scope.otherDeviceData.compcount = 0 ;
            $scope.otherDeviceData.clustercount = 0 ;
            $scope.otherDeviceData.stakeholdercount = 0 ;
            $scope.currentIndex = 0;
            $scope.deviceName = $scope.otherDeviceData[$scope.currentIndex].name;
            $scope.globalDeviceName = ($scope.deviceName) ? $scope.deviceName.trim(): $scope.deviceName;
            //console.log($scope.deviceName);
            //alert(currentIndex);
            $scope.device_add = $scope.otherDeviceData[$scope.currentIndex];
            $scope.otherDeviceListing.deviceCollector=$scope.device_add ;
            var checkMarkDeletion =$scope.device_add.sconstate;
            if($scope.device_add.sconstate =='NON-CANDIDATE' || $scope.device_add.sconstate =='YES' || $scope.device_add.sconstate =='yes' || $scope.device_add.sconstate=='Yes'){
                $scope.setMarkDeletion =true;
            }else{
                $scope.setMarkDeletion=false;
            }
            console.log(  $scope.setMarkDeletion);
            if ( !data || data.length == 0 ) {
            }
        }).catch(function(data){
            console.log(data);
        });
    }


    $scope.exportSearch = function(type){
        console.log('exportsearch data====='+JSON.stringify($scope.otherDeviceData));
        /* export search results in csv or xls file code change starts*/
        console.log('$scope.otherDeviceData===>>>>' + JSON.stringify($scope.otherDeviceData));
        console.log('$scope.currentfielddata====' + JSON.stringify($scope.currentfielddata));
        console.log('type===' + type);
        /* columns in csv/excel should come from field api code starts*/
        $scope.ArrayToBeExported = [];
        $scope.selectArray = [];
        for(var j=0;j<$scope.currentfielddata.length;j++){
            if ($scope.currentfielddata[j].returntype == "showtouser") {
                //if ( $scope.headerArray[j].Selected ) {
                $scope.selectArray.push($scope.currentfielddata[j].key);
            }
        }
        for(var i=0;i<$scope.otherDeviceData.length;i++){
            var objExport = {};
            for(var j=0;j<$scope.selectArray.length;j++){
                var selectKey = $scope.selectArray[j];
                console.log(selectKey);
                var selectkey2 = $scope.otherDeviceData[i][selectKey];
                objExport[selectKey] = selectkey2;
            }
            $scope.ArrayToBeExported.push(objExport);
            console.log('$scope.ArrayToBeExported====' + JSON.stringify($scope.ArrayToBeExported));
        }


        $scope.modifedHeaderArray = [];
        console.log('$scope.currentfielddata==>>>>' +JSON.stringify($scope.currentfielddata));
        for(var p =0;p<$scope.currentfielddata.length;p++){
            for(var q =0;q<$scope.selectArray.length;q++){
                //console.log('$scope.selectArray[q]===' +JSON.stringify($scope.selectArray[q]));
                //console.log('$scope.headerArray[p].key===' +$scope.headerArray[p].key);
                if($scope.selectArray[q] == $scope.currentfielddata[p].key){
                    //console.log('value matches');
                    $scope.modifedHeaderArray.push($scope.currentfielddata[p]);
                }
            }
        }

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
        /* logic ends*/
        /* columns in csv/excel should come from field api code change ends*/
        var devicetype = 'ExportResults';
        var formatType = type.toUpperCase();
        var filename = devicetype + '.'  +type;
        //alasql('SELECT '+$scope.tempstr+' INTO '+formatType+'("'+ $scope.filename+'", ?) FROM ?',[mystyle,$scope.ArrayToBeExported]);
        alasql('SELECT '+$scope.tempstr+' INTO '+formatType+' ("'+ filename+'", ?) FROM ?',[Exportstyle,$scope.otherDeviceData]);
        /* export search results in csv or xls file code change ends */
    }

    $scope.showListView = function(){

        if($scope.otherDeviceName =='Services'){
            var redirectNumber =1;
        }
        else if($scope.otherDeviceName =='Components'){
            var redirectNumber =2;
        }
        else if($scope.otherDeviceName =='Clusters'){
            var redirectNumber =3;
        }
        else if($scope.otherDeviceName =='Stakeholders'){
            var redirectNumber =4;
        }
        else if($scope.otherDeviceName =='FileSystems'){
            var redirectNumber =5;
        }
        else if($scope.otherDeviceName =='PhysicalDevices'){
            var redirectNumber =6;
        }
        else if($scope.otherDeviceName =='LogicalNetworks'){
            var redirectNumber =7;
        }
        else if($scope.otherDeviceName =='DeviceInterfaces'){
            var redirectNumber =8;
        }else if($scope.otherDeviceName =='Interfacegroups'){
            var redirectNumber =9;
        }
        else if($scope.otherDeviceName =='Documents'){
            var redirectNumber =10;
        }
        else if($scope.otherDeviceName =='Events'){
            var redirectNumber =11;
        }
        else if($scope.otherDeviceName =='ComponenttoComponents'){
            var redirectNumber =12;
        }
        $location.url("/logicalDeviceListView/"+$scope.otherDeviceName+"/"+redirectNumber);

    }

    if ( $routeParams.objid && $routeParams.objid != 'first' ) {
        $http.get(__env.apiUrl+'/devices/fields/'+$routeParams.objid.toLowerCase()).then(function (response) {
            $scope.devicedata = response.data.fields;
            $scope.devicedataAdd=[];
            for ( var i = 0 ; $scope.devicedata && i < $scope.devicedata.length ; i++) {

                if ( $scope.devicedata[i].returntype != "showtouser") {
                    if($scope.devicedata[i].returntype.split(":")[1] ==1){
                        $scope.devicedataAdd.push($scope.devicedata[i]);
                    }

                }else{
                    $scope.devicedataAdd.push($scope.devicedata[i]);
                }

            }
            console.log($scope.devicedataAdd);
            $scope.devicedata =$scope.devicedataAdd;


        });
    }


    if($scope.LowerOtherDeviceName == 'deviceinterfaces' && $routeParams.deviceName && $routeParams.deviceName!= "undefined"){

        console.log(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$routeParams.deviceName+'');
        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$routeParams.deviceName+'').then(function (response) {
            $rootScope.association = response.data.devicemenu;
            console.log('$scope.association==>>>' + JSON.stringify($scope.association));
        });
    }
    else{
        console.log('menu api url====>>>>' + __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu');

        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu').then(function (response) {
            $scope.association = response.data.devicemenu;
            console.log('$scope.association==>>>' + JSON.stringify($scope.association));
        });
    }




    $scope.otherDeviceName=$routeParams.objid;

    $scope.spinsleft = false;
    $scope.spinsRight = false;
//Service end for total Count
    /*API call for recent record count*/
    $scope.next_rev= false;
    $scope.navigateViewList = function(){
        $location.url('/logicalDeviceListView');
    }

    $scope.filterFnMenu = function(menudata)  {
        if ( menudata.key != 'Planning' && menudata.key !='Target' && menudata.key != "Custom-Attributes") {
            return true;
        }
        return false; // otherwise it won't be within the results
    };
    $scope.filterFn = function(auditdata)  {
        console.log("AuditData got is:"+auditdata);
        if ( auditdata.createdby && auditdata.createdby.length> 0 && auditdata.createdby != "DB2ADMIN" ) {
            return true;
        }
        return false; // otherwise it won't be within the results
    };


    console.log("Total count got for device type<"+$routeParams.objid+"> is <"+$scope.totalLDcount+">");

    if ( !$scope.totalLDcount ) {
//alert($routeParams.objid);
        var urlCall =__env.apiUrl+"/devices/count";
        $http.get(urlCall)
            .then(function (response) {
                $scope.deviceDisplayNamesNew = {};
                $scope.relatedVersions =response['data']['result'];
                for ( var index = 0 ; index < $scope.relatedVersions.length ; index++) {
                    if ($routeParams.objid.toLowerCase() === $scope.relatedVersions[index]["id"].toLowerCase()) {
                        $scope.totalLDcount = $scope.relatedVersions[index]['count'];
                    }
                    $scope.deviceDisplayNamesNew[$scope.relatedVersions[index]["id"]] = $scope.relatedVersions[index]["displayname"];
                }
                console.log("Final Total count got for device type<"+$routeParams.objid+"> is <"+$scope.totalLDcount+">");
            });
    }
    if ( $scope.deviceName ) {
        $scope.deviceName = $scope.deviceName.toUpperCase();
    }

    if ($routeParams.deviceID && $routeParams.deviceID != "NONE" ) {
        $scope.deviceID=$routeParams.deviceID;
    }
    if($routeParams.recordID){$scope.recordID=$routeParams.recordID;}else{$scope.recordID=1;}
    if($routeParams.deviceName){$scope.deviceName=$routeParams.deviceName;}else{$scope.deviceName="first";} // hardcoding to first device
    if ( $scope.deviceName && $scope.deviceName != "first" ) {
        $scope.deviceName = $scope.deviceName.toUpperCase();
        $scope.deviceName = ($scope.deviceName) ? $scope.deviceName.trim(): $scope.deviceName;
    }



    if ( $rootScope.searchFlag != 1 || $rootScope.searchFlag == 1) {
        console.log("final Route Parameters got is:"+$routeParams.deviceID+":"+$routeParams.recordID+":"+$routeParams.deviceName+":"+$scope.deviceName);
        $scope.customAttributes = [];
        $scope.otherDeviceData = [];


        console.log(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$scope.deviceName);

        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$scope.deviceName).then(function (response) {


            $scope.otherDeviceData = response.data;


            if($scope.deviceName == 'first'){
                $rootScope.PkidData = $scope.otherDeviceData[0].PKID;
                console.log('$scope.otherDeviceData----' +JSON.stringify($scope.otherDeviceData[0].PKID));
                if($scope.LowerOtherDeviceName == 'deviceinterfaces'){
                    console.log($routeParams.deviceName);
                    console.log(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$rootScope.PkidData+'');
                    $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$rootScope.PkidData+'').then(function (response) {
                        $scope.association = response.data.devicemenu;
                        console.log('$scope.association==>>>' + JSON.stringify($scope.association));
                    });
                }
            }
            else if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                /* finding correct index of current PKID*/
                console.log('$scope.otherDeviceData----' +JSON.stringify($scope.otherDeviceData));
                console.log('$scope.deviceName===' +$scope.deviceName);
                var LDindex = _.findIndex($scope.otherDeviceData, function (data) {
                    return data.PKID === $scope.deviceName;
                });
                console.log('LDindex===' +LDindex);
                /* change ends*/
                $rootScope.PkidData = $scope.otherDeviceData[LDindex].PKID;
                console.log('$scope.otherDeviceData----' +JSON.stringify($scope.otherDeviceData[LDindex].PKID));
            }

            else{
                $rootScope.PkidData = $scope.otherDeviceData[0].PKID;
                console.log('$scope.otherDeviceData----' +JSON.stringify($scope.otherDeviceData[0].PKID));
            }



            //$scope.device_add=[];
            $scope.otherDeviceListing=[];

            $scope.firstIndex = $scope.otherDeviceData[0]["index"];
            if ( $scope.otherDeviceData && $scope.otherDeviceData.length > 1 ) {
                $scope.lastIndex = $scope.otherDeviceData[1]["index"];
            }

            $scope.otherDeviceData.servicecount = 0 ;
            $scope.otherDeviceData.compcount = 0 ;
            $scope.otherDeviceData.clustercount = 0 ;
            $scope.otherDeviceData.stakeholdercount = 0 ;

            if($scope.firstIndex ===0)
            {
                $scope.previousIndex = '';
                $scope.currentIndex = 0;
                $scope.nextIndex = 1;
            }
            else if($scope.lastIndex ===0){
                $scope.previousIndex = 0;
                $scope.currentIndex = 1;
                $scope.nextIndex = '';
            }
            else {
                $scope.previousIndex = 0;
                $scope.currentIndex = 1;
                $scope.nextIndex = 2;
            }

            //  alert($scope.currentIndex);
            //  alert($scope.currentIndex+"h");
            $scope.device_add = $scope.otherDeviceData[$scope.currentIndex];
            var checkMarkDeletion =$scope.device_add.sconstate;
            if($scope.device_add.sconstate =='NON-CANDIDATE' || $scope.device_add.sconstate =='YES' || $scope.device_add.sconstate =='yes' || $scope.device_add.sconstate=='Yes'){
                $scope.setMarkDeletion =true;
            }else{
                $scope.setMarkDeletion=false;
            }
            if ( $scope.deviceName == "first" ) {
                if ( $scope.otherDeviceData[$scope.currentIndex].ROWNUMBER == "undefined" || !$scope.otherDeviceData[$scope.currentIndex].ROWNUMBER) {
                    $scope.recordID = 1;
                } else {
                    $scope.recordID =  $scope.otherDeviceData[$scope.currentIndex].ROWNUMBER ;
                }
            }
            if ( !$scope.recordID || isNaN($scope.recordID) ) { // this is needed for Add scenario when user is coming from ADD
                $scope.recordID = ( $scope.otherDeviceData[$scope.currentIndex].ROWNUMBER ?$scope.otherDeviceData[$scope.currentIndex].ROWNUMBER : $scope.totalLDcount) ;
            }
            $scope.currentRecord = $scope.recordID;
            $scope.otherDeviceListing.deviceCollector=$scope.device_add ;
            $scope.globalDeviceName =$scope.otherDeviceListing.deviceCollector.name;
            $scope.globalDeviceName = ($scope.globalDeviceName) ? $scope.globalDeviceName.trim(): $scope.globalDeviceName;
            var idtobeused = $scope.device_add.name;
            if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                //idtobeused = $scope.device_add.id;
                idtobeused = $scope.device_add.PKID;
            }
            console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');

            $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                $scope.relatedCount = response.data;
                setRelatedCounts($scope,response.data,$rootScope);
            }).catch(function(response){
                $scope.relatedCount = response.data;
                //$scope.$parent.relatedCount = [];
            });

            if($scope.LowerOtherDeviceName === 'events'){
                /* adding get schedule api call starts*/
                var get_url = __env.apiUrl+'/devices/schedule/'+$rootScope.PkidData
                //console.log('get_url==>>>>' + get_url);
                $http.get(get_url).success(function(response){
                    console.log('response==>>>>' + JSON.stringify(response));
                    //alert('inside get schedule api success')
                    $rootScope.ScheduleChangeData = response.schedule;
                });
                /* adding get schedule api call ends*/
            }

            if ( $scope.showCustomAttribute == "" ) {
                var url =__env.apiUrl+"/devices/customattributes/getentities";
                $http({
                    method: 'GET',
                    url: url,
                }).success(function (response) {
                    $scope.showCustomAttribute = "false";
                    console.log(response.dropdown);
                    // for ( var indexc = 0 ; $scope.devicedata && indexc < $scope.devicedata.length ; indexc++) {
                    //     if ( $scope.devicedata[indexc].group == "relevant" ) {
                    //         $scope.showRelevant = true;
                    //         break;
                    //     }
                    // }
                    for ( var indexc = 0 ; response.dropdown && indexc < response.dropdown.length; indexc++) {
                        if ( response.dropdown[indexc].key == $scope.LowerOtherDeviceName ) {
                            $scope.showCustomAttribute = "true";
                            break;
                        }
                    }
                    if (  $scope.showCustomAttribute == "true" ) {
                        $http.get(__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+idtobeused+"/customattributes")
                            .then(function (response) {
                                $scope.customAttributes =response['data']['customattr'];
                                console.log('$scope.customAttributes===>' + JSON.stringify($scope.customAttributes));
                            }).catch(function (response) {
                                console.log("Inside error case");
                                $scope.statusCode = response.status;
                                $scope.statusText = (response.statusText);
                                console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                                //Dummy data in case of error
                            });
                    }
                }).catch(function(response){
                    console.log("d");
                });
            } else if (  $scope.showCustomAttribute == "true" ) {
                $http.get(__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+idtobeused+"/customattributes")
                    .then(function (response) {
                        $scope.customAttributes =response['data']['customattr'];
                        console.log('$scope.customAttributes===>' + JSON.stringify($scope.customAttributes));
                    }).catch(function (response) {
                        console.log("Inside error case");
                        $scope.statusCode = response.status;
                        $scope.statusText = (response.statusText);
                        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                        //Dummy data in case of error
                    });
            }
            $scope.associationParm ="";

            $scope.assocationLowerpart =function(a,a1,a3,a4,a5){
                //alert('inside asscocation lowerpart');
                console.log($rootScope.searchFlag);
                if($rootScope.searchFlag == 1 && a==='servicedocumentation' || $rootScope.searchFlag == 1 && a==='physicaldevicedocumentation'){
                    console.log('$scope.otherDeviceData----' +JSON.stringify($scope.otherDeviceData));
                    /*open modalpopup for exporting all doc or only one*/
                    $scope.ExportWordDoc('searchMode');
                    return;
                }

                console.log(a+a1+a3+a4+a5);
                $rootScope.searchFlag = 0;
                if(a === 'servicedocumentation' || a==='physicaldevicedocumentation'){
                    $scope.ExportWordDoc('normalMode');
                    return;
                    //break;
                }
                var a4new =a4;
                if ( a4 && a4 != "undefined" ) {
                    a4new = a4.replace(/\s/g, '');
                    a4new = a4new.toLowerCase();
                }
                if(a === 'Edit-This-Schedule'){
                    //alert('inside edit this schedule');
                    $scope.setSelectionButton = '';
                    $rootScope.showScheduleDiv = true;
                }


                console.log("Ddd");
                //  return;
                $scope.setSelectionButton = "normaView";
                /* associattin of Other devices to stakeholders starts*/
                if($scope.LowerOtherDeviceName == 'stakeholders' || $routeParams.deviceID == 'stakeholders'){
                    $scope.setSelectionButton = "StaketoOtherView";
                }
                /* association of other devices to stakeholder ends*/
                $("#collapse1").removeClass('in');
                //alert(a+"with"+a1);
                console.log('a(associationHeading) and a1(deviceID)===' + a +'and' + a1);

                $scope.associationDevices=true;
                if(a=='Stakeholders'){
                    //alert('a== stakeholders');
                    $scope.setSelectionButton = 'stakeholders';
                    if(a1 == 'Stakeholders' || a1 == 'Direct' || a1 == 'stakeholders'){
                        $scope.associationMainHeading = 'stakeholders';
                        $scope.associationSubHeading='stakeholders';
                    }
                    else if(a1 == 'Components' || a1 == 'components' ){
                        $scope.associationMainHeading = 'stakeholderscomponents';
                        $scope.associationSubHeading='stakeholderscomponents';
                    }
                    else if(a1 == 'Logical-Devices' || a1 == "logical-devices"){
                        $scope.associationMainHeading = 'stakeholderslogicaldevices';
                        $scope.associationSubHeading='stakeholderslogicaldevices';
                    }
                    else if(a1 == 'Physical-Devices' || a1 == "physicaldevices" ){
                        $scope.associationMainHeading = 'stakeholdersphysicaldevices';
                        $scope.associationSubHeading='stakeholdersphysicaldevices';
                    }
                    else if(a1 == 'Services' || a1 == "services" ){
                        $scope.associationMainHeading = 'stakeholdersservices';
                        $scope.associationSubHeading='stakeholdersservices';
                    }
                }
                else{
                    $scope.associationMainHeading=a;
                    $scope.associationSubHeading=a1;
                }
                $scope.associateLowerTitle = a1;
                var associationName =a;
                if($scope.associationMainHeading =='Documents'){
                    associationName ="Documents";
                }
                if($scope.associationMainHeading =='Notes'){
                    associationName ="Notes";
                }
                if($scope.associationMainHeading !='Notes' && $scope.associationMainHeading !='Documents'){
                    if ( $scope.associationSubHeading )  associationName = $scope.associationSubHeading.toLowerCase();;
                    if($scope.associationSubHeading ==0){
                        associationName = $scope.associationMainHeading.toLowerCase();
                    }
                }
                associationName =associationName.replace(/-/g, "");
                associationName = (associationName) ? associationName.trim(): associationName;
                ///otherDevices/services/direct1/0000000000000000000
                /* get related data api manisha code change starts*/
                console.log('associationNameAfyter==>>>' +associationName);
                console.log('$scope.LowerOtherDeviceName==>>>' + $scope.LowerOtherDeviceName);
                console.log('$scope.globalDeviceName===>>>>' + $scope.globalDeviceName);
                if($scope.LowerOtherDeviceName === 'events'){
                    $rootScope.showScheduleDiv =  true;
                }

                /* get related data api manisha code change ends*/
                $scope.associationDevices=true;
                if(a3 =='Relational Audit'){
                    a ="RelationalAudit";
                }
                if ( !$scope.associateLowerTitle || $scope.associateLowerTitle == "undefined") {
                    $scope.associateLowerTitle = a;
                }
                ///otherDevices/logicalnetworks/true/rationale/1/1.1.1.1
                console.log("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+a5+"/"+associationName+"/"+$scope.recordID +"/"+$scope.globalDeviceName);
                console.log('a===>>' +JSON.stringify(a));
                if ( $scope.LowerOtherDeviceName == "documents" || $scope.LowerOtherDeviceName == "events" || $scope.LowerOtherDeviceName == 'deviceinterfaces' || $scope.LowerOtherDeviceName == 'logicalnetworks' || $scope.LowerOtherDeviceName == 'interfacegroups' || $scope.LowerOtherDeviceName == 'componenttocomponents') {
                    if(a3 =='Relational Audit' && ($scope.LowerOtherDeviceName == 'documents' || $scope.LowerOtherDeviceName == 'logicalnetworks' || $scope.LowerOtherDeviceName =='deviceinterfaces')){
                        $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+a4new+"/"+$scope.recordID +"/"+$scope.otherDeviceData[$scope.currentIndex].PKID+"/RelationalAudit"+"/"+$scope.associateLowerTitle+"/"+a5);

                    }else{
                        console.log("q");
                        $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+associationName+"/"+$scope.recordID +"/"+$scope.otherDeviceData[$scope.currentIndex].PKID+"/"+a+"/"+$scope.associateLowerTitle+"/"+a5);
                    }
                } else {
                    console.log("aaax");
                    $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+associationName+"/"+$scope.recordID +"/"+$scope.globalDeviceName+"/"+a+"/"+$scope.associateLowerTitle+"/"+a5);
                }

            }
            $scope.relatedCountAssociation =function(key,displayname){
                $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu').then(function (response) {
                    $scope.association = response.data.devicemenu;
                });
                for ( var i = 0 ; $scope.association && i <$scope.association.length ; i++) {
                    if ( $scope.association[i].key == key) {
                        //Logical-DeviceslogicaldevicesLogical DevicesDirecttrue
                      $scope.assocationLowerpart($scope.association[i].key,$scope.association[i].subkey,$scope.association[i].displayname,$scope.association[i].displayname,$scope.association[i].canbeadded);
                    }else{
                    }

                }
            }

            $scope.ExportWordDoc = function(mode){
                $scope.table_loader = true;
                console.log('inside export doc');
                if(mode === 'searchMode'){
                    var modalInstance =  $uibModal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'ProfileDocumentSearchMode.html',
                        controller: 'multipleProfileDocController',
                        size: 'lg',
                        windowClass: 'app-modal-window-selectpro',
                        resolve: {
                            deviceType: function(){
                                return $scope.devicetype;
                            },
                            fieldData : function(){
                                return $scope.FieldData;
                            },
                            SearchData :function(){
                                return $scope.otherDeviceData;
                            }
                        }

                    });

                    modalInstance.result.then(function (selectedMode) {
                        $scope.selectedData = selectedMode;
                        console.log('$scope.selectedData==>>>' +JSON.stringify($scope.selectedData))
                        if(selectedMode === 'single'){
                            $scope.ExportWordDoc('normalMode');
                        }
                        else{
                            $scope.ExportWordDoc('ExportAll')
                        }
                    }, function () {
                        console.log('Modal dismissed at: ' + new Date());
                    });
                }
                else if(mode === 'normalMode'){
                    console.log('$rootScope.searchFlag====' +$rootScope.searchFlag);
                    $scope.table_loader = true;
                    /* calling detail api*/
                    if($scope.deviceName === 'first'){
                        $scope.deviceName = $scope.otherDeviceData[0].name;
                    }
                    else{
                        console.log('do nothing');
                    }

                    //console.log($scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);
                    if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups'  || $scope.LowerOtherDeviceName === 'componenttocomponents' ){
                        var export_url = __env.apiUrl+'/devices/details/'+$scope.LowerOtherDeviceName +'/' + $rootScope.PkidData;
                    }
                    else{
                        var export_url = __env.apiUrl+'/devices/details/'+$scope.LowerOtherDeviceName +'/' + $scope.deviceName;
                    }
                    console.log(export_url);
                    $http.get(export_url)
                        .then(function (response) {
                            $scope.exportDetailsData = response.data;
                            console.log('$scope.exportDetailsData export doc====' +JSON.stringify($scope.exportDetailsData));
                            $rootScope.attrData = $scope.exportDetailsData.attributes;
                            $rootScope.attrDataNew1 = {
                                "Service Name" : $rootScope.attrData.name,
                                "Total Users" : $rootScope.attrData.totuser,
                                "Service Alias Name/s" : "",
                                "User Access Method" : $rootScope.attrData.useraccessmethod,
                                "Business Hours" : $rootScope.attrData.availability,
                                "Recovery Time Objective" : "",
                                "Recovery Point Objective" : "",
                                "Business Area" : $rootScope.attrData.bunit,
                                "Environments" : $rootScope.attrData.environment,
                                "SLA" : $rootScope.attrData.compliance,
                                "Criticality" : $rootScope.attrData.criticality,
                                "Service Vendor" : "",
                                "Maintenance Window" : $rootScope.attrData.maintwindow,
                                "DR Exists" : $rootScope.attrData.recovery,
                                "DR Description" : $rootScope.attrData.description,
                                "Migration Approach" : $rootScope.attrData.migrationapproach,
                                "Infrastructure Issues Risks" : $rootScope.attrData.infraissue,
                                "Service Support Issues Risks" : $rootScope.attrData.sigitissue
                            }
                            $rootScope.attrDataNew2 = {
                                "Device Name" : $rootScope.attrData.name,
                                "Serial No" : $rootScope.attrData.serialNo,
                                "Asset Tag" : $rootScope.attrData.assetTag,
                                "Business Unit" :$rootScope.attrData.businessUnit,
                                "Managed By" : $rootScope.attrData.managedBy,
                                "Owner" : $rootScope.attrData.owner,
                                "Memory GB" : $rootScope.attrData.memoryGB,
                                "CPU Type" : $rootScope.attrData.cpuType,
                                "Device Type" : $rootScope.attrData.deviceType,
                                "Processor Architecture" :$rootScope.attrData.processorArchitecture,
                                "Processors" : $rootScope.attrData.processors,
                                "Cores Per Processor" : $rootScope.attrData.coresPerProcessor,
                                "Processor Speed" : $rootScope.attrData.processorSpeed,
                                "Count of Processor Sockets" : $rootScope.attrData.countofProcessorSockets,
                                "Environment" : $rootScope.attrData.environment,
                                "Manufacturer" : $rootScope.attrData.manufacturer,
                                "Model" : $rootScope.attrData.model,
                                "Migration Approach" :$rootScope.attrData.migrationApproach,
                                "Site" : $rootScope.attrData.site,
                                "Building" :$rootScope.attrData.building ,
                                "Floor" : $rootScope.attrData.floor,
                                "Floor Location" :$rootScope.attrData.floorLocation,
                                "Room" : $rootScope.attrData.room,
                                "Rack" : $rootScope.attrData.rack,
                                "Rack U Position" : $rootScope.attrData.rackuPosition,
                                "Height in U" : $rootScope.attrData.heightinU,
                                "Discovery Status" : $rootScope.attrData.discoveryStatus,
                                "Power Connections" : $rootScope.attrData.powerConnections,
                                "Power Connection Type" :$rootScope.attrData.powerConnectionType,
                                "UTP Network Ports" : $rootScope.attrData.utpNetworkPorts,
                                "FC Network Ports" : $rootScope.attrData.fcNetworkPorts,
                                "DRAC Console Ports" : $rootScope.attrData.dracConsolePorts,
                                "Dedicated Backup Network":$rootScope.attrData.dedicatedBackupNetwork,
                                "Tape Drives" : $rootScope.attrData.tapeDrives,
                                "Warranty Expiration" : $rootScope.attrData.warrantyExpiration,
                                "Purchase Date" : $rootScope.attrData.purchaseDate,
                                "Maximum Power" : $rootScope.attrData.maximumPower,
                                "Average Power":$rootScope.attrData.averagePower,
                                "Thermal Output" : $rootScope.attrData.thermalOutput,
                                "Status" : $rootScope.attrData.status,
                                "In Scope" : $rootScope.attrData.inScope,
                                "Description" : $rootScope.attrData.description
                            }
                            $rootScope.NameofDevice = $scope.exportDetailsData.attributes.name;
                            $scope.IdofDevice = $scope.exportDetailsData.attributes.PKID;
                            $scope.ServDescription = $scope.exportDetailsData.attributes.servicedescription;
                            var data3 = $scope.exportDetailsData.relateddata;
                            console.log(JSON.stringify(data3));
                            $scope.dummyArray = [];
                            for(var i=0;i<data3.length;i++){

                                Object.keys(data3[i]).forEach(function(key,index) {
                                    console.log(key);
                                    if(key === 'stakeholders'){
                                        console.log(key);
                                        console.log(JSON.stringify(data3[i][key]));
                                        $rootScope.StakeholderData = data3[i][key];
                                        console.log(JSON.stringify($rootScope.StakeholderData));
                                    }
                                    if(key === 'components'){
                                        console.log(key);
                                        console.log(JSON.stringify(data3[i][key]));
                                        $rootScope.Section3Data = data3[i][key];
                                        console.log(JSON.stringify($rootScope.Section3Data));
                                    }
                                    if(key === 'componentstodevice'){
                                        console.log(key);
                                        console.log(JSON.stringify(data3[i][key]));
                                        $rootScope.Section31Data = data3[i][key];
                                        console.log(JSON.stringify($rootScope.Section31Data));
                                    }
                                    if(key === 'interfaces_componenttocomponents'){
                                        console.log(key);
                                        console.log(JSON.stringify(data3[i][key]));
                                        $rootScope.Section4Data = data3[i][key];
                                        console.log(JSON.stringify($rootScope.Section4Data));
                                    }
                                    if(key === 'logicaldevices_logicalnetworks'){
                                        console.log(key);
                                        console.log(JSON.stringify(data3[i][key]));
                                        $rootScope.Section5Data = data3[i][key];
                                        console.log(JSON.stringify($rootScope.Section5Data));
                                    }
                                    if(key === 'logicaldevices_filesystems'){
                                        console.log(key);
                                        console.log(JSON.stringify(data3[i][key]));
                                        $rootScope.Section6Data = data3[i][key];
                                        console.log(JSON.stringify($rootScope.Section6Data));
                                    }
                                    if(data3[i][key].length != 0){
                                        $scope.dummyArray.push(data3[i]);


                                    }



                                });

                            }

                            console.log('dummyArray===>>>>' +JSON.stringify($scope.dummyArray));
                            /* section 2 association data manipulation starts*/
                            /*Object.keys(data3[p]).forEach(function(key,index) {
                             console.log(key);
                             if(data3[p][key].length != 0){
                             console.log('field url---' + __env.apiUrl+'/devices/fields/'+key);
                             /!* $http.get(__env.apiUrl+'/devices/fields/'+key).then(function(response){
                             console.log('success!!!');
                             //console.log('response.dataaaaa===' + JSON.stringify(response.data));
                             // $scope.getFieldResponse = response.data;
                             $scope.FieldData = response.data.fields;
                             console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
                             })*!/
                             /!*$scope.headingAssociation = "";
                             setColumnHeader($scope,key,$http,__env);
                             $scope.headerArray = []
                             console.log(JSON.stringify($scope.currentfielddata));
                             /!* getting fields from feild api nd details from othr api*!/
                             for(var i=0;i<$scope.currentfielddata.length;i++){
                             var fieldDetails = $scope.currentfielddata[i];
                             if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
                             $scope.headerArray.push($scope.currentfielddata[i]);
                             }
                             }
                             console.log(JSON.stringify($scope.headerArray));


                             /!* getting fields from field api *!/!*!/

                             optObject.sheetid = key;
                             opts.push(optObject);
                             var urlvar = 'data_' +key;
                             urlvar=data3[p][key]
                             arrayTobeExported.push(urlvar);
                             }


                             });*/
                            /* section 2 ends*/
                            console.log($rootScope.NameofDevice);
                            $scope.hideExportDoc = true;
                            /* write the logic to export into word starts*/
                            $timeout(function () {
                                $scope.nameOffile = 'Profile_Document_'+$rootScope.NameofDevice;
                                $("#page-content").wordExport($scope.nameOffile);
                                $scope.table_loader = false;
                            }, 1000);

                            /* logic ends*/
                        })
                        .catch(function(response){
                            alert('failure')
                            console.log(response);
                            /*$scope.errorData = response.data;
                             alert($scope.errorData);*/

                        });
                }

                else{
                    console.log('Export in case of search mode');
                    console.log(JSON.stringify($scope.otherDeviceData));

                    /* export in case of search mode starts*/
                    for( var i=0;i<$scope.otherDeviceData.length;i++){
                        /*try1 starts*/
                        (function(i){  // i will now become available for the someMethod to call
                            $timeout(function() {
                                //someMethod(i);
                                $scope.newfuncGenerateDoc($scope.otherDeviceData[i])
                            }, i * 2000);
                        })(i);
                        /* try2 ends*/
                        /*$timeout(function() {
                         $scope.devName = $scope.logicalDeviceData[i].name
                         console.log($scope.devName)
                         var export_url = __env.apiUrl+'/devices/details/logicaldevices' +'/' + $scope.logicalDeviceData[i].name;
                         //}
                         console.log(export_url);
                         $http.get(export_url)
                         .then(function (response) {
                         $scope.exportDetailsData = response.data;
                         console.log('$scope.exportDetailsData export doc====' +JSON.stringify($scope.exportDetailsData));
                         $rootScope.attrData = $scope.exportDetailsData.attributes
                         $rootScope.attrDataNew = {
                         "Device Name" : $rootScope.attrData.name,
                         "Device Type" : $rootScope.attrData.devicetype,
                         "In Scope" : $rootScope.attrData.inscope,
                         "Description":"",
                         "Status" : $rootScope.attrData.status,
                         "Discovery Status" : $rootScope.attrData.discoverystatus,
                         "Migration Approach" : $rootScope.attrData.migrationapproach,
                         "Environment" : $rootScope.attrData.environment,
                         "Role" : $rootScope.attrData.role,
                         "Backup Method" : $rootScope.attrData.backupmethod,
                         "Backup offsite location" : $rootScope.attrData.backupoffsitelocation,
                         "Backup Schedule" : $rootScope.attrData.backupschedule,
                         "DR Physical Device Name" : $rootScope.attrData.drphysicalserver,
                         "DR Process" : $rootScope.attrData.drprocess,
                         "DR Required" : $rootScope.attrData.drrequired,
                         "Is Virtual" : $rootScope.attrData.isvirtual,
                         "Logical CPU" : $rootScope.attrData.logicalcpu,
                         "Memory" : $rootScope.attrData.memory,
                         "Monitoring System" : $rootScope.attrData.monitoringsystem,
                         "OS" : $rootScope.attrData.os,
                         "OS Patch Level" : $rootScope.attrData.ospatchlevel,
                         "OS Version" : $rootScope.attrData.osversion,
                         "Windows Domain" : $rootScope.attrData.windowsdomain,
                         "Logical Device Host":$rootScope.attrData.logicaldevicehost,
                         "Host Type" : $rootScope.attrData.hosttype,
                         "Site" : $rootScope.attrData.sites,
                         "Review Note" : ""
                         }
                         $rootScope.NameofDevice = $scope.exportDetailsData.attributes.name;
                         $scope.IdofDevice = $scope.exportDetailsData.attributes.PKID;
                         $scope.ServDescription = $scope.exportDetailsData.attributes.servicedescription;
                         var data3 = $scope.exportDetailsData.relateddata;
                         console.log(JSON.stringify(data3));
                         $scope.dummyArray = [];
                         for(var i=0;i<data3.length;i++){
                         $scope.dummyArray.push(data3[i]);
                         }
                         console.log('dummyArray===>>>>' +JSON.stringify($scope.dummyArray))
                         console.log($scope.devName);
                         /!* section 2 association data manipulation starts*!/
                         /!*Object.keys(data3[p]).forEach(function(key,index) {
                         console.log(key);
                         if(data3[p][key].length != 0){
                         console.log('field url---' + __env.apiUrl+'/devices/fields/'+key);
                         /!* $http.get(__env.apiUrl+'/devices/fields/'+key).then(function(response){
                         console.log('success!!!');
                         //console.log('response.dataaaaa===' + JSON.stringify(response.data));
                         // $scope.getFieldResponse = response.data;
                         $scope.FieldData = response.data.fields;
                         console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
                         })*!/
                         /!*$scope.headingAssociation = "";
                         setColumnHeader($scope,key,$http,__env);
                         $scope.headerArray = []
                         console.log(JSON.stringify($scope.currentfielddata));
                         /!* getting fields from feild api nd details from othr api*!/
                         for(var i=0;i<$scope.currentfielddata.length;i++){
                         var fieldDetails = $scope.currentfielddata[i];
                         if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
                         $scope.headerArray.push($scope.currentfielddata[i]);
                         }
                         }
                         console.log(JSON.stringify($scope.headerArray));


                         /!* getting fields from field api *!/!*!/

                         optObject.sheetid = key;
                         opts.push(optObject);
                         var urlvar = 'data_' +key;
                         urlvar=data3[p][key]
                         arrayTobeExported.push(urlvar);
                         }


                         });*!/
                         /!* section 2 ends*!/
                         console.log($rootScope.NameofDevice);
                         $scope.hideExportDoc = true;
                         /!* write the logic to export into word starts*!/
                         //$timeout(function () {
                         $scope.nameOffile = 'Profile_Document_'+$scope.devName;
                         console.log($scope.nameOffile)
                         $("#page-content").wordExport($scope.nameOffile);
                         $scope.table_loader = false;
                         //}, 1000);

                         /!* logic ends*!/
                         })
                         .catch(function(response){
                         alert('failure')
                         console.log(response);
                         /!*$scope.errorData = response.data;
                         alert($scope.errorData);*!/

                         });
                         /!* code ends*!/
                         }, 4000);*/
                    }
                    /* export in case of search mode ends*/

                }

            }

            $scope.newfuncGenerateDoc = function(searchData){
                console.log(searchData.name);

                var export_url = __env.apiUrl+'/devices/details/'+$scope.LowerOtherDeviceName +'/' + searchData.name;

                console.log(export_url);
                $http.get(export_url)
                    .then(function (response) {
                        $scope.exportDetailsData = response.data;
                        console.log('$scope.exportDetailsData export doc====' +JSON.stringify($scope.exportDetailsData));
                        $rootScope.attrData = $scope.exportDetailsData.attributes;
                        $rootScope.attrDataNew1 = {
                            "Service Name" : $rootScope.attrData.name,
                            "Total Users" : $rootScope.attrData.totuser,
                            "Service Alias Name/s" : "",
                            "User Access Method" : $rootScope.attrData.useraccessmethod,
                            "Business Hours" : $rootScope.attrData.availability,
                            "Recovery Time Objective" : "",
                            "Recovery Point Objective" : "",
                            "Business Area" : $rootScope.attrData.bunit,
                            "Environments" : $rootScope.attrData.environment,
                            "SLA" : $rootScope.attrData.compliance,
                            "Criticality" : $rootScope.attrData.criticality,
                            "Service Vendor" : "",
                            "Maintenance Window" : $rootScope.attrData.maintwindow,
                            "DR Exists" : $rootScope.attrData.recovery,
                            "DR Description" : $rootScope.attrData.description,
                            "Migration Approach" : $rootScope.attrData.migrationapproach,
                            "Infrastructure Issues Risks" : $rootScope.attrData.infraissue,
                            "Service Support Issues Risks" : $rootScope.attrData.sigitissue
                        }
                        $rootScope.attrDataNew2 = {
                            "Device Name" : $rootScope.attrData.name,
                            "Serial No" : $rootScope.attrData.serialNo,
                            "Asset Tag" : $rootScope.attrData.assetTag,
                            "Business Unit" :$rootScope.attrData.businessUnit,
                            "Managed By" : $rootScope.attrData.managedBy,
                            "Owner" : $rootScope.attrData.owner,
                            "Memory GB" : $rootScope.attrData.memoryGB,
                            "CPU Type" : $rootScope.attrData.cpuType,
                            "Device Type" : $rootScope.attrData.deviceType,
                            "Processor Architecture" :$rootScope.attrData.processorArchitecture,
                            "Processors" : $rootScope.attrData.processors,
                            "Cores Per Processor" : $rootScope.attrData.coresPerProcessor,
                            "Processor Speed" : $rootScope.attrData.processorSpeed,
                            "Count of Processor Sockets" : $rootScope.attrData.countofProcessorSockets,
                            "Environment" : $rootScope.attrData.environment,
                            "Manufacturer" : $rootScope.attrData.manufacturer,
                            "Model" : $rootScope.attrData.model,
                            "Migration Approach" :$rootScope.attrData.migrationApproach,
                            "Site" : $rootScope.attrData.site,
                            "Building" :$rootScope.attrData.building ,
                            "Floor" : $rootScope.attrData.floor,
                            "Floor Location" :$rootScope.attrData.floorLocation,
                            "Room" : $rootScope.attrData.room,
                            "Rack" : $rootScope.attrData.rack,
                            "Rack U Position" : $rootScope.attrData.rackuPosition,
                            "Height in U" : $rootScope.attrData.heightinU,
                            "Discovery Status" : $rootScope.attrData.discoveryStatus,
                            "Power Connections" : $rootScope.attrData.powerConnections,
                            "Power Connection Type" :$rootScope.attrData.powerConnectionType,
                            "UTP Network Ports" : $rootScope.attrData.utpNetworkPorts,
                            "FC Network Ports" : $rootScope.attrData.fcNetworkPorts,
                            "DRAC Console Ports" : $rootScope.attrData.dracConsolePorts,
                            "Dedicated Backup Network":$rootScope.attrData.dedicatedBackupNetwork,
                            "Tape Drives" : $rootScope.attrData.tapeDrives,
                            "Warranty Expiration" : $rootScope.attrData.warrantyExpiration,
                            "Purchase Date" : $rootScope.attrData.purchaseDate,
                            "Maximum Power" : $rootScope.attrData.maximumPower,
                            "Average Power":$rootScope.attrData.averagePower,
                            "Thermal Output" : $rootScope.attrData.thermalOutput,
                            "Status" : $rootScope.attrData.status,
                            "In Scope" : $rootScope.attrData.inScope,
                            "Description" : $rootScope.attrData.description
                        }
                        $rootScope.NameofDevice = $scope.exportDetailsData.attributes.name;
                        $scope.IdofDevice = $scope.exportDetailsData.attributes.PKID;
                        $scope.ServDescription = $scope.exportDetailsData.attributes.servicedescription;
                        var data3 = $scope.exportDetailsData.relateddata;
                        console.log(JSON.stringify(data3));
                        $scope.dummyArray = [];
                        for(var i=0;i<data3.length;i++){

                            Object.keys(data3[i]).forEach(function(key,index) {
                                if(key === 'stakeholders'){
                                    console.log(key);
                                    console.log(JSON.stringify(data3[i][key]));
                                    $rootScope.StakeholderData = data3[i][key];
                                    console.log(JSON.stringify($rootScope.StakeholderData));
                                }
                                if(key === 'components'){
                                    console.log(key);
                                    console.log(JSON.stringify(data3[i][key]));
                                    $rootScope.Section3Data = data3[i][key];
                                    console.log(JSON.stringify($rootScope.Section3Data));
                                }
                                if(key === 'componentstodevice'){
                                    console.log(key);
                                    console.log(JSON.stringify(data3[i][key]));
                                    $rootScope.Section31Data = data3[i][key];
                                    console.log(JSON.stringify($rootScope.Section31Data));
                                }
                                if(key === 'interfaces_componenttocomponents'){
                                    console.log(key);
                                    console.log(JSON.stringify(data3[i][key]));
                                    $rootScope.Section4Data = data3[i][key];
                                    console.log(JSON.stringify($rootScope.Section4Data));
                                }
                                if(key === 'logicaldevices_logicalnetworks'){
                                    console.log(key);
                                    console.log(JSON.stringify(data3[i][key]));
                                    $rootScope.Section5Data = data3[i][key];
                                    console.log(JSON.stringify($rootScope.Section5Data));
                                }
                                if(key === 'logicaldevices_filesystems'){
                                    console.log(key);
                                    console.log(JSON.stringify(data3[i][key]));
                                    $rootScope.Section6Data = data3[i][key];
                                    console.log(JSON.stringify($rootScope.Section6Data));
                                }
                                if(data3[i][key].length != 0){
                                    $scope.dummyArray.push(data3[i]);

                                }


                            });

                        }
                        console.log('dummyArray===>>>>' +JSON.stringify($scope.dummyArray));
                        /* section 2 association data manipulation starts*/
                        /*Object.keys(data3[p]).forEach(function(key,index) {
                         console.log(key);
                         if(data3[p][key].length != 0){
                         console.log('field url---' + __env.apiUrl+'/devices/fields/'+key);
                         /!* $http.get(__env.apiUrl+'/devices/fields/'+key).then(function(response){
                         console.log('success!!!');
                         //console.log('response.dataaaaa===' + JSON.stringify(response.data));
                         // $scope.getFieldResponse = response.data;
                         $scope.FieldData = response.data.fields;
                         console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
                         })*!/
                         /!*$scope.headingAssociation = "";
                         setColumnHeader($scope,key,$http,__env);
                         $scope.headerArray = []
                         console.log(JSON.stringify($scope.currentfielddata));
                         /!* getting fields from feild api nd details from othr api*!/
                         for(var i=0;i<$scope.currentfielddata.length;i++){
                         var fieldDetails = $scope.currentfielddata[i];
                         if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
                         $scope.headerArray.push($scope.currentfielddata[i]);
                         }
                         }
                         console.log(JSON.stringify($scope.headerArray));


                         /!* getting fields from field api *!/!*!/

                         optObject.sheetid = key;
                         opts.push(optObject);
                         var urlvar = 'data_' +key;
                         urlvar=data3[p][key]
                         arrayTobeExported.push(urlvar);
                         }


                         });*/
                        /* section 2 ends*/
                        console.log($rootScope.NameofDevice);
                        $scope.hideExportDoc = true;
                        /* write the logic to export into word starts*/
                        $timeout(function () {
                            $scope.nameOffile = 'Profile_Document_'+$rootScope.NameofDevice;
                            $("#page-content").wordExport($scope.nameOffile);
                            $scope.table_loader = false;
                        }, 1000);

                        /* logic ends*/
                    })
                    .catch(function(response){
                        alert('failure')
                        console.log(response);
                        /*$scope.errorData = response.data;
                         alert($scope.errorData);*/

                    });
                /* code ends*/
                //}, 4000);
            }
            $scope.getRowDevice =function(rownum){
                var urlCall=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/row/"+rownum;
                $http.get(urlCall)
                    .then(function (response) {
                        $scope.recordID=rownum;
                        var idvalue = response.data[0].name;
                        if ( $scope.LowerOtherDeviceName != "documents" && $scope.LowerOtherDeviceName != 'interfacegroups' && $scope.LowerOtherDeviceName != 'events' && $scope.LowerOtherDeviceName != 'logicalnetworks' && $scope.LowerOtherDeviceName != 'deviceinterfaces' && $scope.LowerOtherDeviceName != 'componenttocomponents') {
                            idvalue = response.data[0].name;
                        } else {
                            idvalue = response.data[0].PKID;
                        }
                        console.log("ID to be passed to API is <"+idvalue+">");
                        $location.url("/otherDevices/"+$scope.deviceID+"/"+$scope.recordID +"/"+idvalue+"/"+$scope.LowerOtherDeviceName);
                    });


            }
            $scope.notes_add= function(q,q1,q2){
                console.log($scope.otherDeviceListing.deviceCollector.PKID);
                $scope.otherDeviceListing.deviceCollector.name =$scope.otherDeviceListing.deviceCollector.name;
                if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName == 'events' || $scope.LowerOtherDeviceName == 'deviceinterfaces' || $scope.LowerOtherDeviceName == 'logicalnetworks' || $scope.LowerOtherDeviceName == 'interfacegroups' ||  $scope.LowerOtherDeviceName == 'componenttocomponents'){
                    $scope.otherDeviceListing.deviceCollector.name =$scope.otherDeviceListing.deviceCollector.PKID;
                }

                if($scope.deviceID =='SetReviewNotes' || $scope.deviceID =='UnSetReviewNotes'){
                    if($scope.reviewnotes.length ==0){
                        alert("Please enter Review Notes");
                        return;
                    }else{
                        $scope.reviewnotes =$scope.deviceID+":  " +$scope.reviewnotes;
                    }
                }
                var callpost = false;
                if(!$scope.notes_description ){
                    $scope.notes_description="";
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
                if($scope.deviceID =='SetReviewNotes' || $scope.deviceID =='UnSetReviewNotes'){
                    var mark="No";
                    if($scope.deviceID =='SetReviewNotes'){
                        var mark="Yes";
                    }
                    var url = __env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+$scope.otherDeviceListing.deviceCollector.name+"/setforreview?setreview="+mark;
                    console.log(url);
                    $http({
                        method: 'PUT',
                        url: url,
                    }).success(function (response) {
                        console.log(response);
                        //http://localhost:8080/nikita/Bluebench/#/otherDevices/services/first/2/001/undefined


                    }).catch(function(response){
                        console.log(response);
                        alert("Error ,please try in sometime");
                    });

                }
                if(q2 ==1){
                    callpost = true;
                }
                var notesdata = {'description' : $scope.notes_description,'generalnotes' : $scope.generalnotes,'reviewnotes' : $scope.reviewnotes };
                console.log(notesdata);
                var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+$scope.otherDeviceListing.deviceCollector.name+"/notes/add";
                console.log(post_url);
                if ( callpost ) {
                    $scope.table_loader =  true;
                    $scope.notesSpinner =  true;
                    var urlCall =__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$scope.otherDeviceListing.deviceCollector.name+'/notes ' ;
                    $http({
                        method: 'POST',
                        url: post_url,
                        data:notesdata,
                    }).success(function (response) {
                        console.log(response);
                        console.log(notesdata);
                        $scope.table_loader =  true;
                        $scope.notesSpinner =  true;

                        $http.get(urlCall)
                            .then(function (response) {
                                $scope.notesDateCollector =[];
                                for ( var currentindex = 0 ; currentindex < response.data.notes.length ; currentindex++ ) {
                                    console.log(response.data.notes[currentindex].createddate);
                                    var localTime  = moment.utc(response.data.notes[currentindex].createddate).toDate();
                                    localTime = moment(localTime).format('YYYY-MM-DD HH:mm');
                                    $scope.notesDateCollector.push({"createddate":localTime,"generalnotes":response.data.notes[currentindex].generalnotes,"reviewnotes":response.data.notes[currentindex].reviewnotes,"createdby":response.data.notes[currentindex].createdby});

                                }
                                $scope.notes_display =$scope.notesDateCollector;

                                $scope.generalnotes="";
                                $scope.reviewnotes="";
                                $scope.table_loader = false;
                                $scope.notesSpinner = false;
                            });
                        $scope.table_loader =  false;
                        $scope.notesSpinner =  false;

                    }).catch(function(response){
                        $scope.table_loader =  false;
                        $scope.notesSpinner =  false;
                        console.log(response);
                        console.log("sssssssssss")
                    });
                }
            }




            /* ,manisha code changes starts*/
            $scope.showRightTable = false;
            $scope.showadd = false;

            /* search code for documents starts*/
            $scope.document_download_url =__env.apiUrl+"/devices/downloaddoc";
            console.log('$scope.document_download_url===>>>>' + $scope.document_download_url)

            $scope.searchDocument = function(documentname){
                $rootScope.searchDocumentJson =[];
                $scope.documentSpinner = true;
                $scope.table_loader = true;
                //$scope.showRightTable = true;
                if(documentname === ''){
                    //alert('value===empty');
                    $scope.showRightTable = false;
                }
                console.log('inside search documentname');
                console.log('documentname===' + documentname);
                var searchURL = __env.apiUrl+"/devices/search";
                var config = {
                    headers : {
                        'Content-Type': 'application/json',
                    }
                }
                var searchDocumentData = { "devicetype" : "documents",
                    "search":[{ "fieldname" : "name" , "fieldvalue" :documentname}]
                }
                //alert(searchURL);
                $http.post(searchURL, searchDocumentData, config)
                    .success(function (data, status, headers, config) {
                        console.log('Document search  data===' + JSON.stringify(data));
                        $rootScope.searchDocumentJson = data;
                        console.log('$scope.searchDocumentJson===' + JSON.stringify($rootScope.searchDocumentJson));
                        console.log('inside search api');
                        console.log("Document<"+documentname+"> updated successfully");
                        $scope.documentSpinner = false;
                        $scope.table_loader = false;
                        console.log('$rootScope.searchDocumentJson.length===' + $rootScope.searchDocumentJson.length);

                        $scope.showRightTable = true;
                        if($rootScope.searchDocumentJson.length === 0){
                            $scope.showAddBtn = true;
                        }
                        else{
                            $scope.showAddBtn = false;
                        }
                        if(documentname == '*'){
                            $scope.showAddBtn = false;
                            //$scope.showRightTable = true;
                            console.log('$rootScope.searchDocumentJson==' +JSON.stringify($rootScope.searchDocumentJson));
                        }
                    })
                    .error(function (data, status, headers, config) {
                        console.log('data===' + data);
                        console.log('status===' + status);
                        $scope.documentSpinner = false;
                        $scope.table_loader = false;
                        if ( status == 409 ) {
                            alert("Duplicate Document Name exists<"+documentname+"> Please use unique name");
                            $rootScope.searchDocumentJson =[];
                        } else {
                            alert("Error occurred while updating < "+documentname+" >< "+status);
                        }
                        console.log('headers===' + headers);
                        console.log('config===' + config);
                    });

                if(documentname === '*'){
                    //alert('value===empty');
                    $scope.showRightTable = true;
                    console.log('$rootScope.searchDocumentJson==' +JSON.stringify($rootScope.searchDocumentJson));
                    //$scope.showadd = false;
                }
            }
            /* search code for documents ends*/
            /* document association code starts*/
            $scope.uploadPic = function(file,NameDoc) {
                console.log(file);
                console.log('NameDoc==>>>' + NameDoc);
                if(!file || !$scope.doclinkVal || docname || !$scope.doclinkdescVal){
                    alert("Please Enter all the Fields");
                    return;
                }
                $scope.maxUploadSize =__env.maxFileSizeUpload;
                var docname = $("#documenttypeVal").val();
                console.log($scope.doclinkVal+docname+$scope.doclinkdescVal+$scope.doctype);
                console.log('link==>>>>' + $scope.doclinkVal);
                console.log('docname==>>>' + docname);
                console.log('description==>>>' + $scope.doclinkdescVal);
                console.log('doctype==>>>' + file.type);
                console.log(file);
                console.log('upload doc url==>>' +__env.apiUrl+'/documents/upload');
                var params = {'link':$scope.doclinkVal,'docname':NameDoc,'description':$scope.doclinkdescVal,'doctype':file.type, 'file': file}

                console.log('params==>>>' +JSON.stringify(params));
                file.upload = Upload.upload({
                    url:   __env.apiUrl+'/documents/upload',
                    data: {'link':$scope.doclinkVal,'docname':NameDoc,'description':$scope.doclinkdescVal,'doctype':file.type, 'file': file},
                });

                file.upload.then(function (response) {
                    //alert('successfully uploaded the file');
                    $timeout(function () {
                        file.result = response.data;
                        console.log('successful insert===' + JSON.stringify(file.result));
                        //var post_url=__env.apiUrl+"/devices/services/associate/"+$scope.deviceName;
                        var post_url=__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/associate/'+$scope.deviceName;
                        console.log('post_url==' + post_url);
                        //CMT-1069 $http.post(post_url,{"devicetype":"documents","pkid":NameDoc})
                        $http.post(post_url,{"devicetype":"documents","devicename":file.result.id})
                            .success(function (response){
                                alert('Successfully associated sample document '+ NameDoc + ' with '+$scope.deviceName);
                                $scope.filterTextNew.name = '';
                                $('.collapse').collapse('hide');
                                console.log('successfully associated');
                                //$scope.showRightTable = true;
                                //var urlCall =__env.apiUrl+"/devices/services/"+$scope.deviceName+"/documents";
                                var urlCall =__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+ '/' +$scope.deviceName+'/documents';
                                console.log('url call after associate===>>>>' + urlCall);



                                $http.get(urlCall)
                                    .then(function (response) {
                                        console.log('success of get doc api refresh');
                                        $scope.rows =response['data']['documents'];
                                        //$scope.$parent.rows =response['data']['documents'];
                                        $scope.devicesCount = response['data']['documents'].size();
                                        console.log('$scope.data after uploading===>>>' + JSON.stringify($scope.data));
                                        $scope.documentSpinner = false;
                                        $scope.table_loader = false;
                                    });
                                //getLogialDeviceRelatedData($scope,$http,__env);
                                /*if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;
                                 $scope.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;*/
                            })
                            .catch(function (response) {
                                if ( status == 409 ) {
                                    alert('Document '+ compName + ' already associated with '+$scope.deviceName);
                                    $scope.documentSpinner = false;
                                    $scope.table_loader = false;
                                    $rootScope.searchDocumentJson =[];
                                } else {
                                    alert('Error11 occurred while updating document '+ NameDoc + '');
                                    /*alert('Error occurred while updating document '+ NameDoc + ' for '+$scope.deviceName);*/
                                    $scope.documentSpinner = false;
                                    $scope.table_loader = false;
                                }

                                console.log("Inside error case");
                                $scope.statusCode = response.status;
                                $scope.statusText = (response.statusText);
                                console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

                            });

                    });
                }, function (response) {
                    if (response.status > 0)
                        $scope.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    // Math.min is to fix IE which reports 200% sometimes
                    file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    if(file.progress ==100){
                        $scope.docSpin = true;
                        $scope.table_loader = true;
                        /*adding associate api call once file is uploaded starts*/
                        console.log('$scope.deviceName==>>>>' + $scope.deviceName);

                        /* adding associate api call ends*/
                        var allGetDocument = __env.apiUrl+'/documents/getall';
                        $http.get(allGetDocument)
                            .then(function (response) {
                                $scope.docSpin = false;
                                $scope.table_loader = false;
                                $rootScope.searchDocumentJson =response['data']['documents'];
                                console.log('$rootScope.searchDocumentJson===>>>>' + JSON.stringify($rootScope.searchDocumentJson));
                                document.getElementById('Modal_doc').style.display = "none";
                                //$scope.close_Modal('Modal_linkInput');
                                $scope.showAddBtn = false;

                                $scope.doclinkVal="";
                                $scope.doclinkdescVal="";
                                $("#documenttypeVal").val("");
                                file.progress ==0;
                                $scope.picFile=" ";
                                window.scrollTo(0,document.body.scrollHeight);
                            });


                    }
                });
            }

            $scope.documentChange = function(documentName){
                $scope.documentName = documentName;
                angular.element('#documentnameVal').val(documentName);
            }

            $scope.associateDocToLD = function(compName,docname,pkid){
                $scope.documentSpinner = true;
                $scope.table_loader = true;
                console.log('docname==>>>' + docname);
                if(!pkid){pkid=compName;}
                //var post_url=__env.apiUrl+"/devices/services/associate/"+$scope.deviceName;
                var post_url=__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/associate/'+$scope.deviceName;
                $http.post(post_url,{"devicetype":"documents","devicename":pkid})
                    .success(function (response){
                        alert('Successfully associated document '+ docname + ' with '+$scope.deviceName);
                        $scope.filterTextNew.name = '';
                        $('.collapse').collapse('hide');
                        //var urlCall =__env.apiUrl+"/devices/services/"+$scope.deviceName+"/documents";
                        var urlCall =__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$scope.deviceName+"/documents";
                        $http.get(urlCall)
                            .then(function (response) {
                                $scope.rows =response['data']['documents'];
                                $scope.$parent.rows =response['data']['documents'];
                                $scope.documentSpinner = false;
                                //$scope.showRightTable = true;
                                $scope.table_loader = false;
                            });
                        //getLogialDeviceRelatedData($scope,$http,__env);
                        /*if ( $scope.$parent && $scope.$parent.logicalDeviceData ) $scope.$parent.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;
                         $scope.logicalDeviceData.documentcount = $scope.$parent.documentcount.length;*/
                    })
                    .catch(function (response) {
                        console.log('response.status==>>>' + response.status);
                        if(response.status === 400){
                            alert('Document '+ docname + ' already associated with '+$scope.deviceName);
                            $scope.table_loader = false;
                            //$rootScope.searchDocumentJson =[];
                        }
                        else if ( status == 409 ) {
                            alert('Document '+ compName + ' already associated with '+$scope.deviceName);
                            $scope.documentSpinner = false;
                            $scope.table_loader = false;
                            $rootScope.searchDocumentJson =[];
                        }


                        else {
                            alert('Error occurred while updating document '+ compName + ' for '+$scope.deviceName);
                            $scope.documentSpinner = false;
                            $scope.table_loader = false;
                        }

                        console.log("Inside error case");
                        $scope.statusCode = response.status;
                        $scope.statusText = (response.statusText);
                        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                        if(response.status == 404){
                            alert('Document '+ docname + ' already associated with '+$scope.deviceName);
                        }

                    });
            }




            $scope.doc_changed = function() {
                var file = $scope.fileinput;
                console.log('file is ' );
                console.dir(file);
                /*var uploadUrl = "/fileUpload";
                 fileUpload.uploadFileToUrl(file, uploadUrl);*/

                //alert(JSON.stringify(fileArr));
                document.getElementById('Modal_link').style.display = "block";
            } //$scope.clicked = true;


            $scope.docUploadTrue = function() {
                $scope.docUploadFlag = 1;
                setTimeout(function() {
                    document.getElementById('Modal_doc').style.display = "none";
                    document.getElementById('fileinput').click()
                    //$scope.clicked = true;

                }, 0);
            }
            $scope.docUpdateSumit = function() {
                $scope.table_loader = true;
                $scope.docSpin = true;
                var formData = new FormData(document.getElementById('docForm'));
                alert(formData);
                console.log('formData==>>>>' + formData);
                //  alert($scope.docForm);return false;
                /*if((!$scope.doclinkVal && !$scope.doclinkdescVal) || ($scope.doclinkVal=='' && $scope.doclinkdescVal==''))
                 {
                 document.getElementById('err_msg').innerHTML ='Please enter Link value and Description!';
                 return false;
                 }
                 */
                var url = __env.apiUrl+'/documents/upload';
                //$scope.fileinput = $scope.fileArr;
                //$scope.fileinput.src = "";
                /*  var formData = {
                 "docname": $scope.filterTextNew.name,
                 "doctype": $scope.documentType,
                 "link": $scope.doclinkVal,
                 "description":$scope.doclinkdescVal,
                 "file":$scope.fileinput
                 }*/

                var config = {
                    headers : {
                        'Content-Type': 'multipart/form-data',
                        'mimeType'    : 'multipart/form-data',
                    }
                }
                alert(JSON.stringify(formData));

                $http.post(url, formData, config)
                    .success(function (data, status, headers, config) {
                        console.log('success data===' + JSON.stringify(data));
                        console.log('added logical device successfully');
                        $scope.table_loader = false;
                        $scope.docSpin = false;

                    })
                    .error(function (data, status, headers, config) {
                        console.log('data===' + data);
                        console.log('status===' + status);
                        if ( status == 409 ) {
                            alert("Duplicate record exists<"+$scope.deviceName+"> Please use unique name");
                            $scope.table_loader = false;
                            $scope.docSpin = false;
                            $rootScope.searchDocumentJson =[];
                            /*$scope.showErrorAlert = true;*/
                            /*angular.element(document.getElementById('submit'))[0].disabled = true;*/
                        } else {
                            alert("Error occurred while updating device<"+$scope.deviceName+"><"+status);
                            $scope.table_loader = false;
                            $scope.docSpin = false;
                        }
                        console.log('headers===' + headers);
                        console.log('config===' + config);
                    });
            }

            $scope.docLinkTrue = function()
            {
                document.getElementById('Modal_link').style.display = "none";
                document.getElementById('Modal_linkInput').style.display = "block";
            }
            $scope.docUpdateFalse = function(modalID)
            {
                if(modalID ==='Modal_doc')
                {
                    $scope.docUploadFlag = 0;
                    document.getElementById('Modal_link').style.display = "block";
                }
                else if(modalID ==='Modal_link')
                {
                    $scope.docLinkFlag = 0;
                    if($scope.docUploadFlag == 0){
                        document.getElementById('Modal_msg').style.display = "block";
                    }

                }

                document.getElementById(modalID).style.display = "none";
            }

            $scope.close_Modal = function(modalID)
            {
                document.getElementById(modalID).style.display = "none";
                if(modalID =='Modal_msg'){
                    document.getElementById('Modal_doc').style.display = "block";
                }

            }

            $scope.addNewDocument = function(Filename,documentname,documenttype){
                if ( !documenttype  ) {
                    alert ("Please enter document type");
                    document.getElementById("documenttypeVal").focus();
                    return false;
                }
                if ( !Filename  ) {
                    alert ("Please enter document name");
                    document.getElementById("documentnameVal").focus();
                    return false;
                }
                $scope.otdtable2 =true;
                console.log('Filename==>>>' + Filename);
                console.log('$scope.document===' +JSON.stringify(documentname));
                console.log('inside add new document');
                //var element = angular.element(document.getElementById('fileinput'));
                document.getElementById('Modal_doc').style.display = "block";
                //return false;
                var documentname = angular.element('#documentnameVal').val();

                console.log('documentname===' + documentname);

            }

            /* document association code ends*/

            $scope.checkforEmpty = function(){
                $scope.showadd = false;
                $scope.showRightTable = false;
                console.log('$scope.searchClusName===' + $scope.searchClusName);
                if($scope.searchCompName === ''){
                    //alert('value===empty');
                    $scope.showRightTable = false;
                }

                if($scope.searchCompName === '*'){
                    //alert('value===empty');
                    //$scope.showRightTable = true;
                    //console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.compSearchResult));
                    //$scope.showadd = false;
                }
            }
            /* manisha code change ends*/

            /* search for stakeholder starts*/
            $scope.searchStakeHolder = function(stakeholdername,q,q1){
                $rootScope.searchResultJson = [];
                $scope.stakeholderSpinner = true;
                $scope.table_loader = true;
                $scope.showRightTable = false;
                $scope.showRightTableStakeholder =  true;
                console.log('inside search stakeholder');
                console.log('stakeholdername===' + stakeholdername);
                $scope.headingAssociationFinal =$scope.headingAssociation.toLowerCase().replace(/-/g, "");
                console.log('$scope.headingAssociationFinal==>>>>' + $scope.headingAssociationFinal);
                if(stakeholdername === ''){
                    //alert('value===empty');
                    $scope.showRightTable = false;
                    $scope.showRightTableStakeholder =  true;
                }
                var searchURL = __env.apiUrl+"/devices/search"
                var config = {
                    headers : {
                        'Content-Type': 'application/json',
                    }
                }
                var searchStakeholderData = { "devicetype" : "stakeholders",
                    "search":[{ "fieldname" : "name" , "fieldvalue" :stakeholdername}]
                }
                var t ={"devicetype":$scope.headingAssociationFinal,"search":[{"fieldname":"name","fieldvalue":stakeholdername}]};
                $http.post(searchURL, t, config)
                    .success(function (data, status, headers, config) {
                        console.log('stakeholder search  data===' + JSON.stringify(data));
                        $scope.searchResultJson = data;
                        $scope.$parent.searchResultJson = data;
                        console.log('$scope.searchResultJson===' + JSON.stringify($scope.searchResultJson));
                        console.log('$scope.searchResultJson.length===' + JSON.stringify($scope.searchResultJson.length));
                        console.log('inside search api');
                        console.log("Stakeholder<"+stakeholdername+"> searched successfully");
                        if($rootScope.searchResultJson.length === 0){
                            if(stakeholdername === '*'){
                                //alert('value===empty');
                                $scope.showadd = false;
                            }
                            else{
                                $scope.showadd = true;
                            }
                        }
                        else{
                            $scope.showadd = false;
                        }
                        $scope.stakeholderSpinner = false;
                        $scope.table_loader = false;
                    })
                    .error(function (data, status, headers, config) {
                        console.log('data===' + data);
                        console.log('status===' + status);
                        if ( status == 409 ) {
                            alert("Stakeholder <"+stakeholder+"> already exists Please use unique name");
                            $rootScope.searchResultJson = [];
                        } else {
                            alert("Error occurred while searching stakeholder<"+stakeholder+"><"+status+">");
                        }
                        console.log('headers===' + headers);
                        console.log('config===' + config);
                        $scope.stakeholderSpinner = false;
                        $scope.table_loader = false;
                    });
                if(stakeholdername === '*'){
                    //alert('value===empty');
                    $scope.showRightTable = false;
                    //$scope.showRightTableStakeholder = true;
                    console.log('$scope.serviceSearchResult==' +JSON.stringify($rootScope.searchResultJson));
                    //$scope.showadd = false;
                }
            }
            /* search for stakeholder ends*/

            /* code change for search func starts--manisha*/
            $scope.searchOtherForLD = function(q,q1){
                console.log(q);
                console.log(q1);
                $scope.otherSearchResult = [];
                $scope.$parent.otherSearchResult = [];
                $scope.showRightTable = true;
                //$scope.normalAdd = 1;
                $scope.compAdd = 3;
                $("#otd-table").removeClass('col-md-12').addClass('col-md-8');
                $("#otd-table2").addClass('col-md-4');
                console.log('$routeParams===' + $routeParams.objid);
                if($scope.searchCompName === ''){
                    $scope.showRightTable = false;
                }
                var associationName = q1;
                if(q1 ==0){
                    var associationName = q;
                }

                //associationName = associationName.toLowerCase()+"s";
                console.log('associationName===>>>' + associationName);
                console.log('$scope.searchCompName==>>>' + $scope.searchCompName);
                console.log('$routeParams.objid===' + $routeParams.objid);
                $scope.showSpinnerSearch = true;
                $scope.table_loader = true;
                console.log('$scope.headingAssociation===>>>>' + $scope.headingAssociation);

                $scope.headingAssociationFinal =$scope.headingAssociation.toLowerCase().replace(/-/g, "");
                console.log('$scope.headingAssociationFinal==>>>>' + $scope.headingAssociationFinal);
                var post_url=__env.apiUrl+"/devices/search";
                console.log('post_url==>>>' + post_url);
                if(q == 'Entities'){
                    $scope.headingAssociationFinal = associationName;
                }
                if($scope.headingAssociationFinal === 'componenttocomponents'){
                    $scope.headingAssociationFinal = "components"
                }
                else if($scope.headingAssociationFinal == 'interfacegroupstodeviceinterfaces'){
                    $scope.headingAssociationFinal = 'deviceinterfaces';
                }
                else{
                    console.log('no change');
                }
                if($scope.headingAssociationFinal === 'deviceinterfaces'){
                    var t ={"devicetype":$scope.headingAssociationFinal,"search":[{"fieldname":"name","fieldvalue":$scope.searchCompName,"devicetype": $scope.headingAssociationFinal}]};
                }
                else{
                    var t ={"devicetype":$scope.headingAssociationFinal,"search":[{"fieldname":"name","fieldvalue":$scope.searchCompName}]};
                }
                //var t ={"devicetype":$scope.headingAssociationFinal,"search":[{"fieldname":"name","fieldvalue":$scope.searchCompName}]};
                console.log(JSON.stringify(t));
                $http.post(post_url,t)
                    .then(function (response){
                        //console.log(response);
                        $scope.$parent.otherSearchResult =response['data'];
                        $scope.otherSearchResult = response['data'];
                        console.log('result of seargch api===' +JSON.stringify($scope.otherSearchResult));
                        //$scope.compAdd = 0;
                        if($scope.headingAssociation === 'component-to-components'){
                            //alert('comptocomp');
                            $scope.compAdd = 4;
                        }
                        else{
                            $scope.compAdd = 3;
                        }
                        //$scope.normalAdd = 1;
                        $scope.showSpinnerSearch = false;
                        $scope.table_loader = false;
                        if($scope.otherSearchResult.length === 0){
                            if($scope.searchCompName === '*'){
                                $scope.showadd = false;
                                //$scope.compAdd = 0;
                                if($scope.headingAssociation === 'component-to-components'){

                                    $scope.compAdd = 4;
                                }
                                else{
                                    $scope.compAdd = 3;
                                }
                                //$scope.normalAdd = 1;
                            }
                            else{
                                if($scope.headingAssociationFinal == 'interfacegroups'){
                                    $scope.setAddIGFlag = 1;
                                }
                                if($scope.headingAssociationFinal == 'deviceinterfaces'){
                                    $scope.setAddDIFlag = 1;
                                }
                                if($scope.headingAssociationFinal == 'events'){
                                    $scope.setAddEventFlag =1;
                                }
                                $scope.showadd = true;

                            }
                        }
                        else{
                            $scope.showadd = false;
                        }
                        // $scope.searchCompName = ''
                    }).catch(function (response) {
                        console.log("Inside error case");
                        $scope.statusCode = response.status;
                        $scope.statusText = (response.statusText);
                        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                        $scope.showSpinnerSearch = false;
                        $scope.table_loader = false;
                    });

                /* if($scope.searchCompName === '*'){
                 $scope.showRightTable = true;
                 console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.clusSearchResult));
                 //$scope.showadd = false;
                 }*/
            }
            /* code change for search func ends--manisha*/
            /* code change for association starts-manisha*/
            $scope.addDevicesToLD = function(n,q,q1,pkid){
                //alert('inside add devices to LD');
                /* if type = component then allow user to select a component before asssociation*/
                console.log('pkid-----' + pkid);
                console.log('comp name ===>>>' +n);
                console.log(q);
                console.log(q1);
                console.log(JSON.stringify($scope.otherSearchResult.length));
                if($scope.otherSearchResult.length === 0){
                    //alert('inside new add for IG or DI');
                    if($scope.setAddDIFlag == '1' && q1=='deviceinterfaces' || $scope.setAddIGFlag == '1' && q1=='interfacegroups' || $scope.setAddEventFlag == '1' && q1=='events'){

                        $scope.addDINew(n,q,q1);
                        return false;
                    }
                }

                if(q === 'Logical-Devices' && $routeParams.objid === 'services'){
                    alert('Please select a component in order to associate service to logical device');
                    $scope.setSelectionButton = "associateSerToLg";
                    $('.collapse').collapse('hide');
                    $scope.showRightTable = false;
                    $rootScope.setServName = n;
                    console.log('$rootScope.setServName==>>>' + $rootScope.setServName);

                }
                /*code ends*/
                /* CMT-1012 change starts*/
                else if(q === 'File-Systems' && $routeParams.objid === 'clusters'){
                    alert('Please select Logical device in order to assciate File system to cluster');
                    $scope.setSelectionButton = 'associateFStoClusters';
                    $('.collapse').collapse('hide');
                    $scope.showRightTable = false;
                    $rootScope.setServName = n;
                }
                /* CMT-1012 change ends*/
                else{
                    $scope.devToBeAssociated = n;

                    var associationName = q1.toLowerCase();
                    if(q1 ==0){
                        var associationName = q.toLowerCase();
                    }

                    console.log('inside add comp to LD');
                    $scope.showaddSpinner = true;
                    $scope.table_loader=true;
                    $scope.spinsleft = false;
                    $scope.showSpinnerSearch = false;
                    $scope.spinsRight = false;
                    $scope.showassociateSpinner = false;
                    if(!$scope.devToBeAssociated || $scope.devToBeAssociated ==''){alert('Please enter valid component name'); return false;}
                    console.log('associationName==>>>' +associationName);
                    console.log('$scope.LowerOtherDeviceName service==>>>' + $scope.LowerOtherDeviceName);
                    console.log('$scope.globalDeviceName name==>>>' + $scope.globalDeviceName);
                    /* manisha's code changes associate api starts*/
                    if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName == 'events' || $scope.LowerOtherDeviceName == 'deviceinterfaces' || $scope.LowerOtherDeviceName == 'logicalnetworks' || $scope.LowerOtherDeviceName == 'interfacegroups' || $scope.LowerOtherDeviceName == 'componenttocomponents'){

                        var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$rootScope.PkidData;

                    }
                    else{

                        var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$scope.globalDeviceName;
                    }

                    if(associationName === 'inboundcomponents' || associationName === 'outboundcomponents'){
                        //alert('navigate to other func');
                        $scope.associateInboundToComp(n,q,q1);
                        $scope.table_loader = false;
                        return
                    }


                    console.log('post_url===>>>>>>>' + post_url);

                    if(associationName === 'direct' ||associationName === 'clustered' ){
                        var paramObj={
                            "devicetype":"logicaldevices",
                            "devicename":$scope.devToBeAssociated,
                            "componentname" : "TRIGGERTEST"
                        }
                    }
                    else if(associationName === 'deviceinterfaces'){
                        var paramObj = {
                            "devicetype":associationName,
                            "devicename":pkid
                        }
                    }
                    else if(associationName === 'componentstodevice'){
                        var paramObj={
                            "devicetype":"components",
                            "devicename":$scope.devToBeAssociated
                        }
                    }
                    else if(associationName === 'stakeholders'){
                        var paramObj={
                            "devicetype":"stakeholders",
                            "devicename":$scope.devToBeAssociated,
                            "role":"admin",
                            "email":$rootScope.globals.currentUser.username
                        }
                    }else if (associationName ==='events'){
                        var paramObj={
                            "devicetype":associationName,
                            "devicename":pkid
                        }
                    }
                    else{
                        var paramObj={
                            "devicetype":associationName,
                            "devicename":$scope.devToBeAssociated
                        }
                    }

                    console.log('paramObj===' + JSON.stringify(paramObj));
                    //console.log("f");
                    //console.log("url" +post_url);
                    /*if($scope.LowerOtherDeviceName === 'logicalnetworks'){
                     alert('open modal popup');
                     $uibModal.open({
                     animation: $scope.animationsEnabled,
                     templateUrl: 'swapLDinLN.html',
                     controller: 'SwapAssociationCtrl',
                     size: 'lg',
                     windowClass: 'app-modal-window-selectpro',
                     resolve: {
                     DevTobe: function() {
                     return $scope.deviceDisplayNames
                     },
                     DevName : function(){
                     return $scope.devToBeAssociated
                     }
                     }

                     });
                     }*/
                    //else{
                    $http.post(post_url,paramObj).success(function(data){

                        var compName = $scope.newCompName;
                        alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);
                        /* menu refresh in case of association for DI*/
                        if($scope.LowerOtherDeviceName == 'deviceinterfaces'){
                            //alert('inside DI');
                            console.log(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$routeParams.deviceName+'');
                            $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$routeParams.deviceName+'').then(function (response) {
                                $rootScope.association = response.data.devicemenu;
                                console.log('menu refreshed after association==>>>' + JSON.stringify( $rootScope.association));
                            });
                        }
                        /* menu refresh in case of association for DI ends*/
                        $scope.table_loader=false;
                        $scope.newCompName = '';

                        console.log('associationName==>>>' + associationName);
                        if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                            var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+associationName;
                        }
                        else{
                            var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceName+'/'+associationName;
                        }
                        var idtobeused = $scope.device_add.name;
                        if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                            idtobeused = $scope.device_add.PKID;
                        }
                        console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
                        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                            $scope.relatedCount = response.data;
                            //$scope.$parent.relatedCount = response.data;
                            setRelatedCounts($scope,response.data,$rootScope);
                        }).catch(function(response){
                            $scope.relatedCount = [];
                            //$scope.$parent.relatedCount = [];
                        });
                        console.log(  $scope.relatedCount );

                        console.log('get_url==>>>>' + get_url);
                        $http.get(get_url).success(function(response){
                            $scope.rows =response[associationName];
                            console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));

                            /* column heading change starts*/
                            $scope.cols = [];
                            var relateddevicename = associationName;

                            if ( associationName && associationName.toLowerCase() == "networks" ) {
                                relateddevicename = "logicalnetworks";
                            }
                            // code to get 2nd level string... so that  corresponding columns can be fetched
                            var remainingtitle = "";
                            var prefixcases = [{"key" : "child","display" : "Child" },{"key" : "parent", "display" : "Parent"},{"key" : "indirect" , "display" : "Indirect"}];
                            var found =  false;
                            for ( var j = 0 ; j < prefixcases.length ; j++  ) {
                                if ( associationName.startsWith(prefixcases[j].key) )  {
                                    $scope.associateLowerTitle = prefixcases[j].display;
                                    relateddevicename = associationName.substr(prefixcases[j].key.length );
                                    var displayname  = $scope.deviceDisplayNames[relateddevicename];
                                    if ( displayname  ) $scope.associateLowerTitle =  $scope.associateLowerTitle+" " + displayname;
                                    found = true;
                                }
                            }
                            if (  found === false ) {
                                if ( $scope.headingAssociation && (relateddevicename.indexOf($scope.headingAssociation.toLowerCase()) > -1 ) && (relateddevicename.length > $scope.headingAssociation.length) ) {
                                    relateddevicename = relateddevicename.substring($scope.headingAssociation.length);
                                    var indexvalue = relateddevicename.indexOf("_");
                                    if (  indexvalue != -1 ) {
                                        var temp = relateddevicename.substring(0,indexvalue);
                                        remainingtitle = relateddevicename.substring(indexvalue+1);
                                        relateddevicename = temp;
                                    }
                                }
                                $scope.associateLowerTitle = $scope.deviceDisplayNames[relateddevicename]+" "+remainingtitle;
                                if ( associationName.toLowerCase().startsWith("stakeholders") ) { // if stakeholders then always stakeholders has to be shown
                                    relateddevicename = "stakeholders";
                                }
                            }
                            $scope.mainAssociationName = associationName;
                            if ( relateddevicename == "filesystemslogicaldevices"   ) {
                                $scope.cols = JSON.parse(headers()["customheaders"]);
                                $scope.associateLowerTitle = "Filesystems To Logical Devices";
                            } else if (   relateddevicename == "aliases" ) {
                                $scope.associateLowerTitle = "Aliases";
                                $scope.cols.push({"key":"aliasname","fieldname": "Aliases"});

                            } else {
                                if(relateddevicename == 'todevice'){
                                    relateddevicename = 'componentstodevice';
                                }
                                console.log(__env.apiUrl+'/devices/fields/'+relateddevicename);
                                console.log('relateddevicename===>>>' + relateddevicename);

                                $http.get(__env.apiUrl+'/devices/fields/'+relateddevicename).then(function (response) {
                                    $scope.currentfielddata = response.data.fields;
                                    $scope.cols = [];
                                    for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                                        if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
                                            $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
                                        }
                                    }
                                    if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("stakeholders") && $scope.mainAssociationName.length > 13 ) {
                                        $scope.cols.push({"key":"entityname","fieldname": "Entity Name"});
                                    }
                                    if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("clusters") && $scope.mainAssociationName.length > 13 ) {
                                        $scope.cols.push({"key":"resources","fieldname": "Resources"});
                                        $scope.cols.push({"key":"devices","fieldname": "Devices"});
                                        $scope.cols.push({"key":"services","fieldname": "Services"});
                                    }
                                });
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));

                            $scope.associateLowerTitle = $scope.deviceDisplayNames[$scope.associateLowerTitle] ? $scope.deviceDisplayNames[$scope.associateLowerTitle]  : $scope.associateLowerTitle;
                            /* column heading change ends*/

                        });


                    }).error(function(data){
                        console.log(data);
                        $scope.table_loader=false;
                        if(data.errorMessage){
                            $scope.newCompName = '';
                            alert(data.errorMessage+" "+ data.userAction);
                        }
                    });
                    //}



                }



            }


            /* adding a new DI or IG and then associating it code starts*/
            $scope.addDINew = function(n,q,q1){
                console.log(n);
                console.log(q);
                console.log(q1);
                $scope.devToBeAssociated = n;
                var associationName = q1.toLowerCase();
                if(!$scope.devToBeAssociated || $scope.devToBeAssociated ==''){alert('Please enter valid name'); return false;}
                if($scope.LowerOtherDeviceName == 'deviceinterfaces'|| $scope.LowerOtherDeviceName == 'interfacegroups'){

                    var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$rootScope.PkidData;

                }
                else{
                    var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$scope.globalDeviceName;
                }

                var post_add_url = __env.apiUrl+"/devices/"+q1+"/add";
                console.log(post_add_url);
                console.log(post_url);
                var paramObjAdd = {
                    "name" : n
                }

                console.log(JSON.stringify(paramObjAdd));
                $http.post(post_add_url,paramObjAdd).success(function (data) {
                    console.log('pkid generated===' +JSON.stringify(data));
                    $scope.newPkid  = data.id;
                    /* failing here .. just change name if name is device interfaces make it as interface grps.. just do in morning */
                    if($scope.LowerOtherDeviceName === 'interfacegroups'){
                        $scope.LowerOtherDeviceNameparam = 'deviceinterfaces';
                        var paramObj = {
                            "devicetype":$scope.LowerOtherDeviceNameparam,
                            "devicename" : $scope.newPkid
                        }
                    }
                    /* CMT-1296 fix starts by Manisha just changed the device type from LowerOtherDeviceName to q1 */
                    /* Date : Aug 7*/
                    else{
                        var paramObj = {
                            "devicetype":q1,
                            "devicename" : $scope.newPkid
                        }
                    }
                    /* CMT-1296 fix starts by Manisha */

                    console.log(JSON.stringify(paramObj));
                    $http.post(post_url,paramObj).success(function(data){

                        var compName = $scope.newCompName;
                        alert("<" +$scope.devToBeAssociated+ '> is Associated Successfully to '+ $scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);
                        $scope.table_loader=false;
                        $scope.newCompName = '';

                        console.log('associationName==>>>' + associationName);
                        if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                            var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+associationName;
                        }
                        else{
                            var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceName+'/'+associationName;
                        }
                        var idtobeused = $scope.device_add.name;
                        if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                            idtobeused = $scope.device_add.PKID;
                        }
                        console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
                        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                            $scope.relatedCount = response.data;
                            //$scope.$parent.relatedCount = response.data;
                            setRelatedCounts($scope,response.data,$rootScope);
                        }).catch(function(response){
                            $scope.relatedCount = [];
                            //$scope.$parent.relatedCount = [];
                        });
                        console.log(  $scope.relatedCount );

                        console.log('get_url==>>>>' + get_url);
                        $http.get(get_url).success(function(response){
                            $scope.rows =response[associationName];
                            console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));

                            /* column heading change starts*/
                            $scope.cols = [];
                            var relateddevicename = associationName;

                            if ( associationName && associationName.toLowerCase() == "networks" ) {
                                relateddevicename = "logicalnetworks";
                            }
                            // code to get 2nd level string... so that  corresponding columns can be fetched
                            var remainingtitle = "";
                            var prefixcases = [{"key" : "child","display" : "Child" },{"key" : "parent", "display" : "Parent"},{"key" : "indirect" , "display" : "Indirect"}];
                            var found =  false;
                            for ( var j = 0 ; j < prefixcases.length ; j++  ) {
                                if ( associationName.startsWith(prefixcases[j].key) )  {
                                    $scope.associateLowerTitle = prefixcases[j].display;
                                    relateddevicename = associationName.substr(prefixcases[j].key.length );
                                    var displayname  = $scope.deviceDisplayNames[relateddevicename];
                                    if ( displayname  ) $scope.associateLowerTitle =  $scope.associateLowerTitle+" " + displayname;
                                    found = true;
                                }
                            }
                            if (  found === false ) {
                                if ( $scope.headingAssociation && (relateddevicename.indexOf($scope.headingAssociation.toLowerCase()) > -1 ) && (relateddevicename.length > $scope.headingAssociation.length) ) {
                                    relateddevicename = relateddevicename.substring($scope.headingAssociation.length);
                                    var indexvalue = relateddevicename.indexOf("_");
                                    if (  indexvalue != -1 ) {
                                        var temp = relateddevicename.substring(0,indexvalue);
                                        remainingtitle = relateddevicename.substring(indexvalue+1);
                                        relateddevicename = temp;
                                    }
                                }
                                $scope.associateLowerTitle = $scope.deviceDisplayNames[relateddevicename]+" "+remainingtitle;
                                if ( associationName.toLowerCase().startsWith("stakeholders") ) { // if stakeholders then always stakeholders has to be shown
                                    relateddevicename = "stakeholders";
                                }
                            }
                            $scope.mainAssociationName = associationName;
                            if ( relateddevicename == "filesystemslogicaldevices"   ) {
                                $scope.cols = JSON.parse(headers()["customheaders"]);
                                $scope.associateLowerTitle = "Filesystems To Logical Devices";
                            } else if (   relateddevicename == "aliases" ) {
                                $scope.associateLowerTitle = "Aliases";
                                $scope.cols.push({"key":"aliasname","fieldname": "Aliases"});

                            } else {
                                if(relateddevicename == 'todevice'){
                                    relateddevicename = 'componentstodevice';
                                }
                                console.log(__env.apiUrl+'/devices/fields/'+relateddevicename);
                                console.log('relateddevicename===>>>' + relateddevicename);

                                $http.get(__env.apiUrl+'/devices/fields/'+relateddevicename).then(function (response) {
                                    $scope.currentfielddata = response.data.fields;
                                    $scope.cols = [];
                                    for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                                        if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
                                            $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
                                        }
                                    }
                                    if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("stakeholders") && $scope.mainAssociationName.length > 13 ) {
                                        $scope.cols.push({"key":"entityname","fieldname": "Entity Name"});
                                    }
                                    if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("clusters") && $scope.mainAssociationName.length > 13 ) {
                                        $scope.cols.push({"key":"resources","fieldname": "Resources"});
                                        $scope.cols.push({"key":"devices","fieldname": "Devices"});
                                        $scope.cols.push({"key":"services","fieldname": "Services"});
                                    }
                                });
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));

                            $scope.associateLowerTitle = $scope.deviceDisplayNames[$scope.associateLowerTitle] ? $scope.deviceDisplayNames[$scope.associateLowerTitle]  : $scope.associateLowerTitle;
                            /* column heading change ends*/

                        });


                    }).error(function(data){
                        console.log(data);
                        $scope.table_loader=false;
                        if(data.errorMessage){
                            $scope.newCompName = '';
                            alert(data.errorMessage+" "+ data.userAction);
                        }
                    });
                })

                //http://localhost:9080/SCOPEToolsIntegrationServices/api/devices/deviceinterfaces/add
                // {"name":"DI212121"}
            }
            /* adding a new DI or IG and then associating the code ends*/

            /* association of Stakeholder to Other devices starts*/
            $scope.StakeHolderNames = ["Developer","Lead","Role1" , "Role2" , "Role3"];

            $scope.stakeChange = function(stakeName){
                $scope.stakeholdername = stakeName;
                angular.element('#stakeholdernameVal').val(stakeName);

            }

            // selectedName is Role
            // stakeholdername is actually the related device name i.e Component, Service , LD
            // q is the related devicetype and q1 is subtype,
            // input is the search text and should be used when no result is found during search
            $scope.associateStakeholder = function(selectedName,stakeholdername,q,q1,input){
                console.log(selectedName);
                console.log(stakeholdername);
                console.log(q);
                console.log(q1);
                console.log(input);
                console.log($scope.stakeholdername);
                var val1 = document.getElementById('stakeholdernameVal').value;
                console.log("Associated Value got is:"+val1);
                if ( !val1 || val1.length <=0) {
                    val1 = input;// case where no search is found and need to create a new device
                }
                $scope.stakeholderSpinner = true;
                $scope.table_loader = true;
                console.log('selected role===' + JSON.stringify(selectedName));
                console.log('stakeholdername===' + JSON.stringify(stakeholdername));
                console.log('Main entity $scope.deviceName====' + JSON.stringify($scope.deviceName));
                //var associateurl = __env.apiUrl+"/devices/stakeholders/associate/"+$scope.deviceName;
                var associateurl = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/associate/'+$scope.deviceName;
                console.log('associateurl===' + JSON.stringify(associateurl));

                var config = {
                    headers : {
                        'Content-Type': 'application/json',
                    }
                }

                var associateJson = {
                    "devicetype":q1,
                    "devicename":val1,
                    "role":selectedName,
                    "email" : $rootScope.globals.currentUser.username
                }
                console.log('associateJson===' + JSON.stringify(associateJson));

                $http.post(associateurl, associateJson, config)
                    .success(function (data, status, headers, config) {
                        console.log('associate stakeholder response===' + JSON.stringify(data));
                        console.log('new stakeholder associated successfully');
                        alert("<"+val1+">  associated successfully to stakeholder <"+$scope.deviceName+">");
                        $scope.stakeholderSpinner = false;
                        $scope.table_loader = false;
                        /* related count api and get api startrs*/


                        var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceName+'/'+q1;

                        var idtobeused = $scope.device_add.name;

                        console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
                        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                            $scope.relatedCount = response.data;
                            //$scope.$parent.relatedCount = response.data;
                            setRelatedCounts($scope,response.data,$rootScope);
                            console.log(  $scope.relatedCount );
                        }).catch(function(response){
                            $scope.relatedCount = [];
                            //$scope.$parent.relatedCount = [];
                        });
                        console.log('get_url==>>>>' + get_url);
                        setColumnHeader($scope,q1,$http,__env) ;
                        $http.get(get_url).success(function(response){
                            $scope.rows =response[q1];
                            console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
                        }).error(function(data){
                            console.log(data);
                            $scope.table_loader=false;
                            if(data.errorMessage){
                                $scope.newCompName = '';
                                alert(data.errorMessage+" "+ data.userAction);
                            }
                        });

                    }).error(function (data, status, headers, config) {
                        console.log('data===' + data);
                        console.log('status===' + status);
                        if ( status == 409 ) {
                            alert("Associate failed with <"+$scope.deviceName+"> association already exists with stakeholder:"+stakeholdername);
                            $rootScope.searchResultJson =[];
                        } else {
                            alert("Error occurred while associating device<"+$scope.deviceName+"><"+status+">");
                        }
                        console.log('headers===' + headers);
                        console.log('config===' + config);
                        $scope.stakeholderSpinner = false;
                        $scope.table_loader = false;
                    });
            }// end of association call

            /*association of Stakeholder to Other devices ends*/


            ///Suruchi Start: Dis association ///
            $scope.disassociateDevicesToDevices = function(srcdevicetype,srcdevicename){
                // alert('Suruchi inside disasscociateDevicesToDevices '+srcdevicetype+' '+srcdevicename);
                console.log('srcdevicetype==>'+srcdevicetype);
                console.log('srcdevicename==>' +JSON.stringify(srcdevicename));
                //alert('JSON.stringify(paramObj)'+JSON.stringify(srcdevicename));
                var disassociateName='';
                var disassociateNameForMessage='';
                var disassociateCommunicationType='';
                if(srcdevicetype=='aliases'){
                    disassociateName = srcdevicename.aliasname;
                }else if(srcdevicetype=='inboundcomponents' || srcdevicetype=='outboundcomponents'){
                    disassociateName = srcdevicename.componentname;
                    disassociateCommunicationType = srcdevicename.communicationtype;
                }else if(srcdevicetype === 'Documents' || srcdevicetype === 'documents' || srcdevicetype == 'events' || srcdevicetype == 'deviceinterfaces' || srcdevicetype == 'logicalnetworks' || srcdevicetype == 'interfacegroups'){
                    disassociateName = srcdevicename.id;
                    disassociateNameForMessage=srcdevicename.name;
                }else{
                    disassociateName = srcdevicename.name;
                }
                //alert('disassociateName '+disassociateName);

                var associationName = srcdevicetype.toLowerCase();
                console.log('inside disassociateDevicesToDevices ');

                $scope.showaddSpinner = true;
                $scope.table_loader=true;
                $scope.spinsleft = false;
                $scope.showSpinnerSearch = false;
                $scope.spinsRight = false;
                $scope.showassociateSpinner = false;
                console.log('disassociateName==>>>' +disassociateName);
                console.log('associationName==>>>' +associationName);
                console.log('$scope.LowerOtherDeviceName service==>>>' + $scope.LowerOtherDeviceName);
                console.log('$scope.globalDeviceName name==>>>' + $scope.globalDeviceName);
                /* Suruchi's code changes Disassociate api starts*/
                var post_url='';
                if($scope.LowerOtherDeviceName === 'Documents' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName == 'events' || $scope.LowerOtherDeviceName == 'deviceinterfaces' || $scope.LowerOtherDeviceName == 'logicalnetworks' || $scope.LowerOtherDeviceName == 'interfacegroups'){

                    post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/disassociate/"+$rootScope.PkidData;

                }
                else{

                    post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/disassociate/"+$scope.globalDeviceName;
                }
                // alert('post_url '+post_url);

                console.log('post_url===>>>>>>>' + post_url);
                if(associationName === 'inboundcomponents' || associationName === 'outboundcomponents'){
                    var paramObj={
                        "devicetype":associationName,
                        "devicename":disassociateName,
                        "communicationtype":disassociateCommunicationType
                    }
                }else{
                    var paramObj={
                        "devicetype":associationName,
                        "devicename":disassociateName
                    }
                }

                //alert('paramObj===' + JSON.stringify(paramObj));
                console.log('paramObj===' + JSON.stringify(paramObj));
                if(disassociateName!=undefined){
                    $http.post(post_url,paramObj).success(function(data){
                        var compName = $scope.newCompName;
                        if(associationName === 'Documents' || associationName === 'documents' || associationName == 'events' || associationName == 'deviceinterfaces' || associationName == 'logicalnetworks' || associationName == 'interfacegroups'){
                            alert("<" +disassociateNameForMessage+ '> disassociated successfully to '+ $scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);
                        }else{
                            alert("<" +disassociateName+ '> disassociated successfully to '+ $scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);
                        }
                        /* TC-35 menu refrsh issue fixed -- manisha*/
                        if($scope.LowerOtherDeviceName == 'deviceinterfaces'){

                            console.log(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$routeParams.deviceName+'');
                            $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/menu?pkid='+$routeParams.deviceName+'').then(function (response) {
                                $rootScope.association = response.data.devicemenu;
                                console.log('menu refreshed after disaccoiation==>>>' + JSON.stringify($rootScope.association));
                            });
                        }
                        /* TC-35 code changes ends*/
                        $scope.table_loader=false;
                        $scope.newCompName = '';

                        console.log('DisassociationName==>>>' + associationName);
                        var get_url ='';
                        if($scope.LowerOtherDeviceName === 'Documents' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups'){
                            get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$rootScope.PkidData+'/'+associationName;
                        }
                        else{
                            get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceName+'/'+associationName;
                        }
                        //alert('get_url'+get_url);
                        console.log('get_url'+get_url);
                        var idtobeused = $scope.device_add.name;
                        if($scope.LowerOtherDeviceName === 'Documents' ||$scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'interfacegroups'){
                            idtobeused = $scope.device_add.PKID;
                        }
                        console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');
                        //alert('get related count url is:'+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');


                        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                            $scope.relatedCount = response.data;
                            //$scope.$parent.relatedCount = response.data;
                            setRelatedCounts($scope,response.data,$rootScope);
                        }).catch(function(response){
                            $scope.relatedCount = [];
                            //$scope.$parent.relatedCount = [];
                        });
                        console.log(  $scope.relatedCount );

                        console.log('get_url==>>>>' + get_url);
                        $http.get(get_url).success(function(response){
                            $scope.rows =response[associationName];
                            console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));

                            /* column heading change starts*/
                            $scope.cols = [];
                            var relateddevicename = associationName;

                            if ( associationName && associationName.toLowerCase() == "networks" ) {
                                relateddevicename = "logicalnetworks";
                            }
                            // code to get 2nd level string... so that  corresponding columns can be fetched
                            var remainingtitle = "";
                            var prefixcases = [{"key" : "child","display" : "Child" },{"key" : "parent", "display" : "Parent"},{"key" : "indirect" , "display" : "Indirect"}];
                            var found =  false;
                            for ( var j = 0 ; j < prefixcases.length ; j++  ) {
                                if ( associationName.startsWith(prefixcases[j].key) )  {
                                    $scope.associateLowerTitle = prefixcases[j].display;
                                    relateddevicename = associationName.substr(prefixcases[j].key.length );
                                    var displayname  = $scope.deviceDisplayNames[relateddevicename];
                                    if ( displayname  ) $scope.associateLowerTitle =  $scope.associateLowerTitle+" " + displayname;
                                    found = true;
                                }
                            }
                            if (  found === false ) {
                                if ( $scope.headingAssociation && (relateddevicename.indexOf($scope.headingAssociation.toLowerCase()) > -1 ) && (relateddevicename.length > $scope.headingAssociation.length) ) {
                                    relateddevicename = relateddevicename.substring($scope.headingAssociation.length);
                                    var indexvalue = relateddevicename.indexOf("_");
                                    if (  indexvalue != -1 ) {
                                        var temp = relateddevicename.substring(0,indexvalue);
                                        remainingtitle = relateddevicename.substring(indexvalue+1);
                                        relateddevicename = temp;
                                    }
                                }
                                $scope.associateLowerTitle = $scope.deviceDisplayNames[relateddevicename]+" "+remainingtitle;
                                if ( associationName.toLowerCase().startsWith("stakeholders") ) { // if stakeholders then always stakeholders has to be shown
                                    relateddevicename = "stakeholders";
                                }
                            }
                            $scope.mainAssociationName = associationName;
                            if ( relateddevicename == "filesystemslogicaldevices"   ) {
                                $scope.cols = JSON.parse(headers()["customheaders"]);
                                $scope.associateLowerTitle = "Filesystems To Logical Devices";
                            } else if (   relateddevicename == "aliases" ) {
                                $scope.associateLowerTitle = "Aliases";
                                $scope.cols.push({"key":"aliasname","fieldname": "Aliases"});

                            } else {
                                if(relateddevicename == 'todevice'){
                                    relateddevicename = 'componentstodevice';
                                }
                                console.log(__env.apiUrl+'/devices/fields/'+relateddevicename);
                                console.log('relateddevicename===>>>' + relateddevicename);

                                $http.get(__env.apiUrl+'/devices/fields/'+relateddevicename).then(function (response) {
                                    $scope.currentfielddata = response.data.fields;
                                    $scope.cols = [];
                                    for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                                        if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
                                            $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
                                        }
                                    }
                                    if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("stakeholders") && $scope.mainAssociationName.length > 13 ) {
                                        $scope.cols.push({"key":"entityname","fieldname": "Entity Name"});
                                    }
                                    if ( $scope.mainAssociationName && $scope.mainAssociationName.toLowerCase().startsWith("clusters") && $scope.mainAssociationName.length > 13 ) {
                                        $scope.cols.push({"key":"resources","fieldname": "Resources"});
                                        $scope.cols.push({"key":"devices","fieldname": "Devices"});
                                        $scope.cols.push({"key":"services","fieldname": "Services"});
                                    }
                                });
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));

                            $scope.associateLowerTitle = $scope.deviceDisplayNames[$scope.associateLowerTitle] ? $scope.deviceDisplayNames[$scope.associateLowerTitle]  : $scope.associateLowerTitle;
                            /* column heading change ends*/

                        });


                    }).error(function(data){
                        console.log(data);
                        $scope.table_loader=false;
                        if(data.errorMessage){
                            $scope.newCompName = '';
                            alert(data.errorMessage+" "+ data.userAction);
                        }
                    });
                }else{

                    alert('disassociateName is undefined'+disassociateName);
                }
            }
            //Suruchi End: Dis association////

            /* cmt 1012 change starts*/
            $scope.associateFSToClus = function(n,q,q1){
                //alert('inside LG selection while associating fs to cluster');
                console.log(q);
                console.log(q1);
                console.log('$rootScope.setServName------' +$rootScope.setServName);
                $scope.devToBeAssociated = n;

                var associationName = q1.toLowerCase();
                if(q1 ==0){
                    var associationName = q.toLowerCase();
                }

                console.log('inside add comp to LD');
                $scope.showaddSpinner = true;
                $scope.table_loader=true;
                $scope.spinsleft = false;
                $scope.showSpinnerSearch = false;
                $scope.spinsRight = false;
                $scope.showassociateSpinner = false;
                if(!$scope.devToBeAssociated || $scope.devToBeAssociated ==''){alert('Please enter valid LG name'); return false;}
                console.log('associationName==>>>' +associationName);
                console.log('$scope.LowerOtherDeviceName service==>>>' + $scope.LowerOtherDeviceName);
                console.log('$scope.globalDeviceName name==>>>' + $scope.globalDeviceName);
                /* manisha's code changes associate api starts*/
                var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$scope.globalDeviceName;
                console.log('post_url------' + post_url);

                var paramObj={
                    "devicetype":"filesystems",
                    "devicename":$rootScope.setServName,
                    "ldname" : $scope.devToBeAssociated
                }



                console.log('paramObj===' + JSON.stringify(paramObj));
                $http.post(post_url,paramObj).success(function(data){
                    var compName = $scope.newCompName;
                    console.log(data);
                    console.log("ssssss");
                    alert("<<" +$rootScope.setServName+ '>> is Associated Successfully to '+ associationName);
                    $scope.table_loader=false;
                    $scope.newCompName = '';
                    /* refreshing left table code starts */
                    console.log('associationName==>>>' + associationName);
                    var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$scope.globalDeviceName+'/'+associationName
                    console.log('get_url==>>>>' + get_url);
                    $http.get(get_url).success(function(response){
                        //console.log(response.services);
                        console.log("ddaaa");
                        $scope.cols = [];
                        console.log(response.direct);
                        /*$scope.rows =response[associationName];
                         console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
                         $scope.cols = Object.keys($scope.rows[0]);
                         console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));*/
                        /* column heading change starts*/
                        $scope.rows =response[associationName];
                        console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
                        $http.get(__env.apiUrl+'/devices/fields/'+associationName).then(function (response) {
                            $scope.currentfielddata = response.data.fields;
                            for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                                if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
                                    $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
                                }
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
                            if ( !$scope.cols ) {
                                $scope.cols = Object.keys($scope.rows[0]);
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
                        }).catch( function(response) {
                            $scope.cols = Object.keys($scope.rows[0]);
                        });
                        /* column heading change ends*/
                        $scope.setSelectionButton = "normaView";
                        $('.collapse').collapse('hide');
                        $scope.showRightTable = false;
                        //$scope.searchCompNameFSassociateToCluster = '';
                        $scope.searchCompName = '';

                    }).catch(function (response) {

                        $scope.rows = [
                            {
                                "Name":"Test "+associationName+"name",
                                "Type":associationName+" Type",
                                "Discoverystatus":associationName+" Discovery Status",
                                "Businessarea":associationName+" Business Area",
                                "Criticality":associationName+" Criticality",
                                "Migrationapproach":associationName+" Migrationapproach"
                            },
                            {
                                "Name":"Test "+associationName+" name1",
                                "Type":associationName+" Type1",
                                "Discoverystatus":associationName+" Discovery Status1",
                                "Businessarea":associationName+" Business Area1",
                                "Criticality":associationName+" Criticality1",
                                "Migrationapproach":associationName+" Migrationapproach1"
                            },{
                                "Name":"Test"+associationName+" name2",
                                "Type":associationName+" Type2",
                                "Discoverystatus":associationName+" Discovery Status2",
                                "Businessarea":associationName+" Business Area2",
                                "Criticality":associationName+" Criticality2",
                                "Migrationapproach":associationName+" Migrationapproach2"
                            },{
                                "Name":"Test"+associationName+" name3",
                                "Type":associationName+" Type3",
                                "Discoverystatus":associationName+" Discovery Status3",
                                "Businessarea":associationName+" Business Area3",
                                "Criticality":associationName+" Criticality3",
                                "Migrationapproach":associationName+" Migrationapproach3"
                            }];

                        $scope.cols = Object.keys($scope.rows[0]);

                    });
                    /* refreshing left table code ends*/
                    /* adding associate api call starts here*/
                    /* var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$scope.globalDeviceName;
                     $http.post(post_url,{"devicetype":$scope.LowerOtherDeviceName,"devicename":$scope.globalDeviceName})
                     .success(function (response){
                     alert('Component '+compName+' successfully added and associated with '+$scope.deviceName);

                     //getLogialDeviceRelatedData($scope,$http,__env);
                     })*/
                    /*.catch(function (response) {

                     $scope.showaddSpinner = false;
                     $scope.table_loader=false;
                     console.log("Inside error case");
                     $scope.statusCode = response.status;
                     $scope.statusText = (response.statusText);
                     console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                     if($scope.statusCode ==409){
                     alert('Component '+ compName + ' already associated with '+$scope.deviceName);
                     $scope.compSearchResult =[];
                     $scope.$parent.compSearchResult = [];
                     return false;
                     }
                     else{
                     alert('Error occurred, Please try again!'+response.status);
                     }

                     });*/
                    /* adding associate api call ends here*/
                })

                    /* cmt-1012 adding error case for 409 conflict*/
                    .error(function (data, status, headers, config) {
                        console.log('data===' + data);
                        console.log('status===' + status);
                        $scope.disableFields = false;
                        $scope.disableSave = false;
                        $scope.saveSpinner = false;
                        $scope.table_loader = false;
                        if ( status == 409 ) {
                            alert("Duplicate Device Name exists<"+$rootScope.setServName+"> Please use unique name");
                            $scope.setSelectionButton = "normaView";
                            $('.collapse').collapse('hide');
                            $scope.showRightTable = false;
                        } else {
                            alert("Error occurred while updating device<"+$rootScope.setServName+">Status is<"+status+">");
                        }
                        console.log('headers===' + headers);
                        console.log('config===' + config);
                    });
                /* cmt-1012 adding error case for 409 conflict ends*/
                /* manisha's code changes associate api ends*/
                //}


            }
            /* cmt 1012 change ends*/

            /*cmt-1066  change starts*/
            $scope.associateInboundToComp = function(n,q,q1){
                // alert('inside associate inbound outbound');
                console.log(q);
                console.log(q1);
                //console.log('$rootScope.setServName------' +$rootScope.setServName);
                $scope.devToBeAssociated = n;
                var associationName = q1;
                console.log('associationName==>>>' + associationName);
                console.log('$scope.devToBeAssociated==>>>>' + $scope.devToBeAssociated);
                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'InboundParams.html',
                    controller: 'InboundOutboundController',
                    size: 'lg',
                    windowClass: 'app-modal-window-selectpro',
                    resolve: {
                        DeviceToAssociate: function(){
                            return $scope.devToBeAssociated;
                        },
                        associationName : function(){
                            return associationName;
                        },
                        Devname :  function(){
                            return $scope.globalDeviceName
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.rows = selectedItem;
                    console.log('$scope.selectedData==>>>' +JSON.stringify($scope.rows))
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }
            /* cmt-1066 change ends*/

            /* associate service to LD (component selection mandatory)*/
            $scope.associateSerToLD = function(n,q,q1){
                // alert('do comp selection');
                console.log('comp name ===>>>' +n);
                console.log(q);
                console.log(q1);
                console.log('$rootScope.setServName------' +$rootScope.setServName);

                /*code ends*/
                //else{
                $scope.devToBeAssociated = n;

                var associationName = q1.toLowerCase();
                if(q1 ==0){
                    var associationName = q.toLowerCase();
                }

                console.log('inside add comp to LD');
                $scope.showaddSpinner = true;
                $scope.table_loader=true;
                $scope.spinsleft = false;
                $scope.showSpinnerSearch = false;
                $scope.spinsRight = false;
                $scope.showassociateSpinner = false;
                if(!$scope.devToBeAssociated || $scope.devToBeAssociated ==''){alert('Please enter valid component name'); return false;}
                console.log('associationName==>>>' +associationName);
                console.log('$scope.LowerOtherDeviceName service==>>>' + $scope.LowerOtherDeviceName);
                console.log('$scope.globalDeviceName name==>>>' + $scope.globalDeviceName);
                /* manisha's code changes associate api starts*/
                var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$scope.globalDeviceName;

                var paramObj={
                    "devicetype":"logicaldevices",
                    "devicename":$rootScope.setServName,
                    "componentname" : $scope.devToBeAssociated
                }



                console.log('paramObj===' + JSON.stringify(paramObj));
                $http.post(post_url,paramObj).success(function(data){
                    var compName = $scope.newCompName;
                    console.log(data);
                    console.log("ssssss");
                    alert( ' '+$rootScope.setServName +' '  +'with Component' + ' ' +$scope.devToBeAssociated+ ' is Associated Successfully to '+ associationName);
                    $scope.table_loader=false;
                    $scope.newCompName = '';
                    $('.collapse').collapse('hide');
                    $scope.searchCompNameServAssociation = '';
                    $scope.searchCompName = '';
                    $scope.setSelectionButton = 'normaView';
                    $scope.showRightTable = false;
                    console.log('associationName==>>>' + associationName);
                    /* refreshing the related count - CMT-1519*/
                    $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                        $scope.relatedCount = response.data;
                        console.log('$scope.relatedCount response====' +JSON.stringify($scope.relatedCount));
                        //$scope.$parent.relatedCount = response.data;
                        setRelatedCounts($scope,response.data,$rootScope);
                    }).catch(function(response){
                        //$scope.$parent.relatedCount = [];
                        $scope.relatedCount = [];
                    });
                    /* CMT-1519 changes ends*/
                    var get_url = __env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+"/"+$scope.globalDeviceName+'/'+associationName
                    console.log('get_url==>>>>' + get_url);
                    $http.get(get_url).success(function(response){
                        //console.log(response.services);
                        console.log("ddaaa");
                        $scope.cols = [];
                        console.log(response.direct);
                        /*$scope.rows =response[associationName];
                         console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
                         $scope.cols = Object.keys($scope.rows[0]);
                         console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));*/
                        /* column change starts*/
                        $scope.rows =response[associationName];
                        console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
                        $http.get(__env.apiUrl+'/devices/fields/'+associationName).then(function (response) {
                            $scope.currentfielddata = response.data.fields;
                            for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                                if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
                                    $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
                                }
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
                            if ( !$scope.cols ) {
                                $scope.cols = Object.keys($scope.rows[0]);
                            }
                            console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
                        }).catch( function(response) {
                            $scope.cols = Object.keys($scope.rows[0]);
                        });
                        /* column change ends*/

                    }).catch(function (response) {

                        $scope.rows = [
                            {
                                "Name":"Test "+associationName+"name",
                                "Type":associationName+" Type",
                                "Discoverystatus":associationName+" Discovery Status",
                                "Businessarea":associationName+" Business Area",
                                "Criticality":associationName+" Criticality",
                                "Migrationapproach":associationName+" Migrationapproach"
                            },
                            {
                                "Name":"Test "+associationName+" name1",
                                "Type":associationName+" Type1",
                                "Discoverystatus":associationName+" Discovery Status1",
                                "Businessarea":associationName+" Business Area1",
                                "Criticality":associationName+" Criticality1",
                                "Migrationapproach":associationName+" Migrationapproach1"
                            },{
                                "Name":"Test"+associationName+" name2",
                                "Type":associationName+" Type2",
                                "Discoverystatus":associationName+" Discovery Status2",
                                "Businessarea":associationName+" Business Area2",
                                "Criticality":associationName+" Criticality2",
                                "Migrationapproach":associationName+" Migrationapproach2"
                            },{
                                "Name":"Test"+associationName+" name3",
                                "Type":associationName+" Type3",
                                "Discoverystatus":associationName+" Discovery Status3",
                                "Businessarea":associationName+" Business Area3",
                                "Criticality":associationName+" Criticality3",
                                "Migrationapproach":associationName+" Migrationapproach3"
                            }];

                        $scope.cols = Object.keys($scope.rows[0]);

                    });
                    /* refreshing left table code ends*/
                    /* adding associate api call starts here*/
                    /* var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/associate/"+$scope.globalDeviceName;
                     $http.post(post_url,{"devicetype":$scope.LowerOtherDeviceName,"devicename":$scope.globalDeviceName})
                     .success(function (response){
                     alert('Component '+compName+' successfully added and associated with '+$scope.deviceName);

                     //getLogialDeviceRelatedData($scope,$http,__env);
                     })*/
                    /*.catch(function (response) {

                     $scope.showaddSpinner = false;
                     $scope.table_loader=false;
                     console.log("Inside error case");
                     $scope.statusCode = response.status;
                     $scope.statusText = (response.statusText);
                     console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                     if($scope.statusCode ==409){
                     alert('Component '+ compName + ' already associated with '+$scope.deviceName);
                     $scope.compSearchResult =[];
                     $scope.$parent.compSearchResult = [];
                     return false;
                     }
                     else{
                     alert('Error occurred, Please try again!'+response.status);
                     }

                     });*/
                    /* adding associate api call ends here*/
                })

                /* manisha's code changes associate api ends*/
                //}



            }
            /* associate service to LD code change ends (com selection mandatory)*/

            /* association of service to lg where user searches for components after lg selection code starts*/
            $scope.searchOtherCompForLD = function(q,q1,nameComp){
                $scope.otherSearchResult = [];
                $scope.$parent.otherSearchResult = [];
                $scope.showRightTable = true;
                console.log('nameComp===' + nameComp);
                $("#otd-table").removeClass('col-md-12').addClass('col-md-8');
                $("#otd-table2").addClass('col-md-4');
                console.log('$routeParams===' + $routeParams.objid);
                if($scope.searchCompName === ''){
                    $scope.showRightTable = false;
                }
                var associationName = q1;
                if(q1 ==0){
                    var associationName = q;
                }

                //associationName = associationName.toLowerCase()+"s";
                console.log('associationName===>>>' + associationName);
                console.log('$scope.searchCompName==>>>' + $scope.searchCompName);
                console.log('$routeParams.objid===' + $routeParams.objid);
                $scope.showSpinnerSearch = true;
                $scope.table_loader = true;
                console.log('$scope.headingAssociation===>>>>' + $scope.headingAssociation);

                $scope.headingAssociationFinal =$scope.headingAssociation.toLowerCase().replace(/-/g, "");
                console.log('$scope.headingAssociationFinal==>>>>' + $scope.headingAssociationFinal);
                var post_url=__env.apiUrl+"/devices/search";
                console.log('post_url==>>>' + post_url);
                if($scope.headingAssociationFinal == 'interfacegroupstodeviceinterfaces'){
                    $scope.headingAssociationFinal = 'deviceinterfaces';
                }
                var t ={"devicetype":$scope.headingAssociationFinal,"search":[{"fieldname":"name","fieldvalue":$scope.searchCompName}]};
                console.log(JSON.stringify(t));
                $http.post(post_url,{"devicetype":"components","search":[{"fieldname":"name","fieldvalue":nameComp}]})
                    .then(function (response){
                        //console.log(response);
                        $scope.$parent.otherSearchResult =response['data'];
                        $scope.otherSearchResult = response['data'];
                        console.log('result of seargch api===' +JSON.stringify($scope.otherSearchResult));
                        $scope.compAdd = 1;
                        //$scope.normalAdd = 0;
                        $scope.showSpinnerSearch = false;
                        $scope.table_loader = false;
                        if($scope.otherSearchResult.length === 0){
                            if($scope.searchCompName === '*'){
                                $scope.showadd = false;
                                $scope.compAdd = 1;
                                //$scope.normalAdd = 0;
                            }
                            else{
                                $scope.showadd = true;
                            }
                        }
                        else{
                            $scope.showadd = false;
                        }
                    }).catch(function (response) {
                        console.log("Inside error case");
                        $scope.statusCode = response.status;
                        $scope.statusText = (response.statusText);
                        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                        $scope.showSpinnerSearch = false;
                        $scope.table_loader = false;
                    });

                if($scope.searchCompName === '*'){
                    $scope.showRightTable = true;
                    console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.clusSearchResult));
                    //$scope.showadd = false;
                }
            }
            /* code change ends*/

            /* cmt 1012 code change starts*/
            $scope.searchOtherLDForClus = function(q,q1,nameComp){
                $scope.otherSearchResult = [];
                $scope.$parent.otherSearchResult = [];
                $scope.showRightTable = true;
                //$scope.searchCompName = '';
                console.log('nameComp===' + nameComp);
                $("#otd-table").removeClass('col-md-12').addClass('col-md-8');
                $("#otd-table2").addClass('col-md-4');
                console.log('$routeParams===' + $routeParams.objid);
                if($scope.searchCompNameFSassociateToCluster === ''){
                    $scope.showRightTable = false;
                }
                var associationName = q1;
                if(q1 ==0){
                    var associationName = q;
                }

                //associationName = associationName.toLowerCase()+"s";
                console.log('associationName===>>>' + associationName);
                //console.log('$scope.searchCompName==>>>' + $scope.searchCompName);
                console.log('$routeParams.objid===' + $routeParams.objid);
                $scope.showSpinnerSearch = true;
                $scope.table_loader = true;
                console.log('$scope.headingAssociation===>>>>' + $scope.headingAssociation);

                $scope.headingAssociationFinal =$scope.headingAssociation.toLowerCase().replace(/-/g, "");
                console.log('$scope.headingAssociationFinal==>>>>' + $scope.headingAssociationFinal);
                var post_url=__env.apiUrl+"/devices/search";
                console.log('post_url==>>>' + post_url);
                if($scope.headingAssociationFinal == 'interfacegroupstodeviceinterfaces'){
                    $scope.headingAssociationFinal = 'deviceinterfaces';
                }
                var t ={"devicetype":$scope.headingAssociationFinal,"search":[{"fieldname":"name","fieldvalue":$scope.searchCompName}]};
                console.log(JSON.stringify(t));
                $http.post(post_url,{"devicetype":"logicaldevices","search":[{"fieldname":"name","fieldvalue":nameComp}]})
                    .then(function (response){
                        //console.log(response);
                        $scope.$parent.otherSearchResult =response['data'];
                        //$scope.otherSearchResult = response['data'];
                        console.log('result of seargch api===' +JSON.stringify($scope.otherSearchResult));
                        $scope.compAdd = 2;
                        //$scope.normalAdd = 0;
                        $scope.showSpinnerSearch = false;
                        $scope.table_loader = false;
                        $scope.showRightTable = true;
                        if($scope.otherSearchResult.length === 0){
                            if($scope.searchCompNameFSassociateToCluster === '*'){
                                $scope.showadd = false;
                                $scope.compAdd = 2;
                                //$scope.normalAdd = 0;
                            }
                            else{
                                $scope.showadd = true;
                            }
                        }
                        else{
                            $scope.showadd = false;
                        }
                    }).catch(function (response) {
                        console.log("Inside error case");
                        $scope.statusCode = response.status;
                        $scope.statusText = (response.statusText);
                        console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                        $scope.showSpinnerSearch = false;
                        $scope.table_loader = false;
                    });

                if($scope.searchCompNameFSassociateToCluster === '*'){
                    $scope.showRightTable = true;
                    console.log('$scope.serviceSearchResult==' +JSON.stringify($scope.clusSearchResult));
                    //$scope.showadd = false;
                }

            }
            /* cmt 1012 code change ends*/


            $scope.associateDevicesToLD = function(){
                // alert('inside associate devices to LD');
            }
            /* code change for association ends--manisha*/
            $scope.notes_adding= function(q,q1){
                $scope.table_loader = true;
                $scope.notesSpinner = true;
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
                var notesdata = {'description' : $scope.description,'generalnotes' : $scope.generalnotes,'reviewnotes' : $scope.reviewnotes , 'createdby':$rootScope.globals.currentUser.username};
            }

            $scope.changeClassMand ='col-md-3';
            $http.get(__env.apiUrl+'/devices/fields/'+$scope.LowerOtherDeviceName).then(function (response) {
                $scope.devicedata = response.data.fields;
                $scope.showRelevant = false;
                for ( var indexc = 0 ; $scope.devicedata && indexc < $scope.devicedata.length ; indexc++) {
                    if ( $scope.devicedata[indexc].group == "relevant" ) {
                        $scope.showRelevant = true;
                        break;
                    }
                }
                if ( $scope.showRelevant == false ) {
                    $scope.changeClassMand ='col-md-6';
                }
                for ( var indexc1 = 0 ; $scope.devicedata && indexc1 < $scope.devicedata.length ; indexc1++) {
                    if ( $scope.devicedata[indexc1].fieldtype == "select" && $scope.devicedata[indexc1].key != "vlan" ) {
                        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/dropdown/'+$scope.devicedata[indexc1].key).then(function (response) {
                            $scope[response.data.name] = response.data.dropdown;
                        });
                    }
                }

            });
            $scope.getDropDowns = function(val) {
                console.log("Getting dropdown value for :"+val);
                console.log("Value got is :"+$scope[val]);
                return $scope[val];
            }

            if(!$scope.deviceID){
                $scope.deviceID= $scope.deviceName;
            }
        });   // End of then
    }

    $scope.preFieldName = '';
    $scope.allowEdit = function(fieldName){
        angular.element('#'+fieldName)[0].style.backgroundColor = "white";
        if($scope.preFieldName !=='' && $scope.preFieldName !=fieldName){angular.element('#'+$scope.preFieldName)[0].style.backgroundColor = "#e1e1e1";}
        $scope.preFieldName = fieldName;
        /*
         if($scope.preFieldName !=='' && $scope.preFieldName !=fieldName){angular.element('#'+$scope.preFieldName)[0].disabled = true;}
         */

    }
    $scope.caValueChange = function(att){

        window.console.log("Custom Attribute update Value Post  API called  from logicalDevicesController!");
        var idtobeused = $scope.otherDeviceListing.deviceCollector.name;
        if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups'){
            idtobeused = $scope.otherDeviceListing.deviceCollector.id;
        }
        var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+idtobeused+"/customattributes/update";
        $http.post(post_url,{"customattr":[{"attribute":att,"value":angular.element('#'+att).val()}]}).success(function(data){
            // angular.element('#'+att)[0].disabled = true;
        });


    }



    $scope.next_previous_data=function(adata,prevNext){
        console.log($routeParams);
        console.log(adata);
        if(!adata){
            return;
        }
        if($routeParams.deviceID == "UnSetReviewNotes" || $routeParams.deviceID == "SetReviewNotes") {
            //$location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+$scope.deviceID+"/"+$scope.recordID +"/"+adata+"/"+$routeParams.associationHeading+"/"+$scope.canbeAssociated);
            $location.url('/otherDevices/' + $scope.LowerOtherDeviceName + '/first/' + $scope.recordID + '/' + adata + '/undefined/undefined/')
            return;
        }
        $scope.customAttributes = [];
        console.log("RecordID and total record got is:"+$scope.recordID +":"+$scope.totalLDcount+":and deviceid is"+$scope.deviceID+": and search flag is "+$rootScope.searchFlag+":And prevNext  is :"+prevNext );
        if ( $scope.recordID == 1 && prevNext == -1 ) { // for prev case
            return false;
        }
        if ( $scope.recordID == $scope.totalLDcount && prevNext == 1 ) { // for next case
            return false;
        }

        if (  $rootScope.searchFlag != 1 && !adata || adata =='' ) {
            return;
        }
        $scope.recordID = Number($scope.recordID) + Number(prevNext);
        if ( !$scope.deviceID) $scope.deviceID = "LIST";
        if ( $rootScope.searchFlag == 1 ) {
            $scope.currentIndex = Number($scope.currentIndex) + Number(prevNext);
            $scope.deviceName = $scope.otherDeviceData[$scope.currentIndex].name;
            $scope.globalDeviceName =  $scope.deviceName;
            //console.log($scope.deviceName);
            //alert(currentIndex);
            $scope.device_add = $scope.otherDeviceData[$scope.currentIndex];
            $scope.otherDeviceListing.deviceCollector=$scope.device_add ;
            var idtobeused = $scope.otherDeviceListing.deviceCollector.name;
            if (  $scope.showCustomAttribute == "true") {
                $scope.LowerOtherDeviceName = $scope.otherDeviceName;
                if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                    idtobeused = $scope.otherDeviceListing.deviceCollector.id;
                }
                var urlCall =__env.apiUrl+"/devices/"+$scope.otherDeviceName+"/"+idtobeused+"/customattributes";
                $http.get(urlCall)
                    .then(function (response) {
                        $scope.customAttributes =response['data']['customattr'];
                        console.log($scope.customAttributes);
                    }).catch(function (response) {

                        $scope.statusCode = response.status;
                        $scope.statusText = (response.statusText);

                        //Dummy data in case of error
                    });
            }
            //getLogialDeviceRelatedData($scope,$http,__env);

        } else {
            if(adata){
                adata = adata.toUpperCase();
                $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+$scope.deviceID+"/"+$scope.recordID +"/"+adata+"/"+$routeParams.associationHeading+"/"+$scope.canbeAssociated);

            }

        }
    } //end of next_previous_data


    $scope.editContent = function(){
        if($scope.LowerOtherDeviceName =='logicalnetworks'){
            var urlCall =__env.apiUrl+"/devices/vlandropdown/"+$scope.otherDeviceData[$scope.currentIndex].PKID;
            console.log('urlcall==>>>>' +urlCall);
            $http.get(urlCall).then(function (response) {
                console.log('$scope.vlanArray===>>>>' +JSON.stringify(response.data.dropdown));
                //console.log((response.data.dropdown.length);
                $scope[response.data.name] = response.data.dropdown;
                if(response.data.dropdown ==""){
                    $scope.EditDisabledVlan = true;
                }else{
                    $scope.EditDisabledVlan = false;
                }
            });
        }
        console.log('inside edit content function');
        $scope.disableFields = false;
        $scope.disableSave = false;
        $scope.EditDisabled=false;
        $('#myForms .col-md-12 .form-group input').removeClass('hide_input_box');
        $('#myForms .col-md-12 .form-group .input-group input').addClass('input_right_border');
        $('#myForms select').removeClass('select_remove_arrow');
        $('#myFormRel .col-md-12 .form-group input').removeClass('hide_input_box');
        $('#myFormRel .col-md-12 .form-group .input-group input').addClass('input_right_border');
        $('#myFormRel select').removeClass('select_remove_arrow');
        $('#myFormCounts .col-md-12 .form-group input').removeClass('hide_input_box_extended');
        $('#myForms .col-md-12 .form-group .input-group span').removeClass('select_typehead');
        $('#myFormRel .col-md-12 .form-group .input-group span').removeClass('select_typehead');

    }
    $scope.disableFields = true;
    /*$scope.logicalDeviceData = [] ;*/
    $scope.disableSave = true;

    $scope.exportContent = function(){
        $scope.table_loader = true;
        if($scope.deviceName === 'first'){
            $scope.deviceName = $scope.otherDeviceData[0].name;
        }
        else{
            console.log('do nothing');
        }

        //console.log($scope.deviceDisplayNames[$routeParams.objid.toLowerCase()]);
        if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups'  || $scope.LowerOtherDeviceName === 'componenttocomponents' ){
            var export_url = __env.apiUrl+'/devices/details/'+$scope.LowerOtherDeviceName +'/' + $rootScope.PkidData;
        }
        else{
            var export_url = __env.apiUrl+'/devices/details/'+$scope.LowerOtherDeviceName +'/' + $scope.deviceName;
        }

        $http.get(export_url)
            .then(function (response) {
                $scope.exportDetailsData = response.data;
                console.log('$scope.exportDetailsData====' +JSON.stringify($scope.exportDetailsData));
                console.log('field api response===' +JSON.stringify($scope.devicedata));
                var data1 = $scope.exportDetailsData['custom attributes']
                var data2 = $scope.exportDetailsData['related counts']
                var data3 = $scope.exportDetailsData['relateddata']
                var data4 = $scope.exportDetailsData.attributes
                var exportArray2 = {

                }

                exportArray2["attributes"] = $scope.exportDetailsData.attributes;
                if($scope.exportDetailsData['related counts']){
                    exportArray2["related counts"] = data2;
                }

                exportArray2["relateddata"] = data3;
                if($scope.exportDetailsData['custom attributes']){
                    exportArray2["custom attributes"] = data1 ;
                }


                console.log(JSON.stringify(exportArray2));
                var opts = []
                var arrayTobeExported = []
                Object.keys(exportArray2).forEach(function(key,index){
                    console.log(key);

                    if(key === 'attributes'){

                        $scope.headerArray = []
                        console.log($scope.LowerOtherDeviceName);
                        var optObject1 = {
                            "sheetid":' ',
                            "headers" : "true"
                        }
                        optObject1.sheetid = 'Attributes'
                        opts.push(optObject1);

                        for(var i=0;i<$scope.devicedata.length;i++){
                            var fieldDetails = $scope.devicedata[i];
                            if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
                                $scope.headerArray.push($scope.devicedata[i]);
                            }
                        }
                        console.log('$scope.headerArray----' + JSON.stringify($scope.headerArray));
                        /* take fields from field api nd values from detail api starts*/
                        var attributeobj = {}
                        var oldobject = $scope.exportDetailsData.attributes
                        Object.keys(oldobject).forEach(function(key,index){
                            console.log(key);
                            for(var q=0;q<$scope.headerArray.length;q++){
                                if (key === $scope.headerArray[q].key){
                                    console.log('key matched');
                                    var selectkey1 = $scope.headerArray[q].fieldname;
                                    attributeobj[selectkey1] = oldobject[key];
                                }
                            }
                        })
                        console.log(JSON.stringify(attributeobj));

                        var attData = [];
                        attData.push(attributeobj)
                        console.log(JSON.stringify(attData));
                        arrayTobeExported.push(attData);
                        console.log('array exported after attributes==' +JSON.stringify(arrayTobeExported))


                    }
                    else if(key === 'relateddata'){
                        for(var p = 0 ;p< data3.length;p++){
                            var optObject = {
                                "sheetid":' ',
                                "headers" : "true"
                            }

                            Object.keys(data3[p]).forEach(function(key,index) {
                                console.log(key);
                                if(data3[p][key].length != 0){
                                    console.log('field url---' + __env.apiUrl+'/devices/fields/'+key);
                                    /* $http.get(__env.apiUrl+'/devices/fields/'+key).then(function(response){
                                     console.log('success!!!');
                                     //console.log('response.dataaaaa===' + JSON.stringify(response.data));
                                     // $scope.getFieldResponse = response.data;
                                     $scope.FieldData = response.data.fields;
                                     console.log('$scope.FieldData====' + JSON.stringify($scope.FieldData));
                                     })*/
                                    /*$scope.headingAssociation = "";
                                     setColumnHeader($scope,key,$http,__env);
                                     $scope.headerArray = []
                                     console.log(JSON.stringify($scope.currentfielddata));
                                     /!* getting fields from feild api nd details from othr api*!/
                                     for(var i=0;i<$scope.currentfielddata.length;i++){
                                     var fieldDetails = $scope.currentfielddata[i];
                                     if ( fieldDetails.returntype && ( fieldDetails.returntype == "showtouser" || fieldDetails.returntype.startsWith("1:") ) ) {
                                     $scope.headerArray.push($scope.currentfielddata[i]);
                                     }
                                     }
                                     console.log(JSON.stringify($scope.headerArray));


                                     /!* getting fields from field api *!/*/

									 if(key === 'interfaces_componenttocomponents'){
                                        optObject.sheetid = 'interfaces_C2C';
                                    }
                                    else{
                                        optObject.sheetid = key;
                                    }
                                    //optObject.sheetid = key;
                                    opts.push(optObject);
                                    var urlvar = 'data_' +key;
                                    urlvar=data3[p][key]
                                    arrayTobeExported.push(urlvar);
                                }


                            });
                        }
                    }
                    else if(key === 'custom attributes' && data1.length != 0){
                        var optObject1 = {
                            "sheetid":' ',
                            "headers" : "true"
                        }
                        optObject1.sheetid = 'Custom_Attributes'
                        opts.push(optObject1);
                        arrayTobeExported.push(data1);
                    }

                    else if(key === 'related counts' && data2.length != 0){
                        var optObject1 = {
                            "sheetid":' ',
                            "headers" : "true"
                        }

                        optObject1.sheetid = 'Related_counts'
                        opts.push(optObject1);
                        arrayTobeExported.push(data2);
                    }
                    else{
                        console.log('do nothing')
                    }
                })

                console.log(JSON.stringify(opts));
                console.log(JSON.stringify(arrayTobeExported));
                /* export sample starts*/
                $timeout(function () {
                    if($scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'events' ||$scope.LowerOtherDeviceName === 'componenttocomponents'){
                        //var opts = [{sheetid:'Custom_Attributes',header:true},{sheetid:'Attributes',header:false}];
                        $scope.table_loader = false;
                        var res = alasql('SELECT INTO XLSX("exportDetails.xlsx",?) FROM ?',
                            [opts,arrayTobeExported]);
                    }
                    else{
                        //var opts = [{sheetid:'Custom_Attributes',header:true},{sheetid:'Related_Counts',header:false},{sheetid:'Attributes',header:false}];
                        $scope.table_loader = false;
                        var res = alasql('SELECT INTO XLSX("exportDetails.xlsx",?) FROM ?',
                            [opts,arrayTobeExported]);
                    }
                }, 1000);
                /* export sample ends*/

            })
            .catch(function(response){
                alert('failure')
                console.log(response);
                /*$scope.errorData = response.data;
                 alert($scope.errorData);*/

            });

        //http://9.17.237.107:9082/SCOPEToolsIntegrationServices/api/devices/details/{devicetype}/{devicename}



    }
    $scope.submitEditedData = function(devname){
        $scope.saveSpinner = true;
        $scope.table_loader = true;
        $scope.disableFields = true;
        $scope.disableSave = true;
        console.log($routeParams.objid);
        if($routeParams.objid =='LogicalNetworks'){
            console.log($routeParams.objid);
            var ipv6 = $scope.otherDeviceListing.deviceCollector.name;
            var checkAddress = checkIPAddress(ipv6);
            if(checkAddress ==false || checkAddress ==undefined){
                $scope.saveSpinner = false;
                $scope.disableSave =false;
                return;
            }
        }
        $scope.caUpdatedval = [];
        for (i=0; ( $scope.customAttributes &&  i <= $scope.customAttributes.length) ;i++){
            if($scope.customAttributes[i]){

                $scope.att = $scope.customAttributes[i].attribute;
                // $scope.attval =angular.element('#custAttributeInput_'+$scope.customAttributes[i].attribute).val();
                $scope.attval =document.getElementById('custAttributeInput_'+$scope.customAttributes[i].attribute).value;
                if( $scope.attval.length != 0 ) {
                    $scope.caUpdatedval.push({"attribute":$scope.att,"value":$scope.attval});
                }

            }
        }

        $scope.caUpdatedvalSubmit = {"customattr":$scope.caUpdatedval};
        //  $scope.otherDeviceListing.deviceCollector =$scope.otherDeviceListing.deviceCollector.push({"name":$scope.globalDeviceName});
        var tempname = $scope.otherDeviceListing.deviceCollector["name"];
        if ( !tempname || tempname.length <= 0 ) {
            $scope.otherDeviceListing.deviceCollector["name"] = $scope.globalDeviceName;
        }
        var valuedata = $scope.otherDeviceListing.deviceCollector;
        //valuedata.push({"name":$scope.globalDeviceName});
        console.log('edittedData===' +JSON.stringify(valuedata));

        var url = __env.apiUrl+'/devices/'+'update/'+$scope.LowerOtherDeviceName;
        console.log('url===' +JSON.stringify(url));
        var config = {
            headers : {
                'Content-Type': 'application/json',
            }
        }
        $http.put(url, valuedata, config)
            .success(function (data, status, headers, config) {
                console.log('success data===' + JSON.stringify(data));
                console.log('editted logical device successfully');
                $scope.disableFields = true;
                $scope.disableSave = true;

                /*Update Custom Attributes*/
                console.log($scope.caUpdatedvalSubmit);
                console.log("tetetet");
                var idtobeused = $scope.globalDeviceName;
                if($scope.LowerOtherDeviceName==='events' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'interfacegroups'  || $scope.LowerOtherDeviceName === 'componenttocomponents' ){
                    idtobeused = $scope.otherDeviceListing.deviceCollector.id;
                }
                var post_url=__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+idtobeused+"/customattributes/update";
                console.log(post_url);

                $http.post(post_url,JSON.stringify($scope.caUpdatedvalSubmit)).success(function(data){
                    $scope.saveSpinner = false;
                    $scope.table_loader = false;
                    var nametobeused =$scope.deviceName;
                    if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                        nametobeused = $scope.device_add.PKID;
                    }
                    if ( $rootScope.searchFlag != 1  ) {
                        $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+nametobeused).then(function (response) {
                            $scope.otherDeviceData = response.data;
                            $scope.otherDeviceListing=[];

                            $scope.firstIndex = $scope.otherDeviceData[0]["index"];
                            if ( $scope.otherDeviceData.length > 1 ) {
                                $scope.lastIndex = $scope.otherDeviceData[1]["index"];
                            }
                            $scope.currentRecord = $scope.recordID;
                            $scope.otherDeviceData.servicecount = 0 ;
                            $scope.otherDeviceData.compcount = 0 ;
                            $scope.otherDeviceData.clustercount = 0 ;
                            $scope.otherDeviceData.stakeholdercount = 0 ;

                            if($scope.firstIndex ===0)
                            {
                                $scope.previousIndex = '';
                                $scope.currentIndex = 0;
                                $scope.nextIndex = 1;
                            }
                            else if($scope.lastIndex ===0){
                                $scope.previousIndex = 0;
                                $scope.currentIndex = 1;
                                $scope.nextIndex = '';
                            }
                            else {
                                $scope.previousIndex = 0;
                                $scope.currentIndex = 1;
                                $scope.nextIndex = 2;
                            }

                            $scope.device_add = $scope.otherDeviceData[$scope.currentIndex];
                            $scope.otherDeviceListing.deviceCollector=$scope.device_add ;
                            $scope.globalDeviceName =$scope.otherDeviceListing.deviceCollector.name;
                            var idtobeused = $scope.device_add.name;
                            if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                                idtobeused = $scope.device_add.PKID;
                            }
                            console.log("get related count url is:"+__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts');

                            $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+idtobeused+'/relatedcounts').then(function (response) {
                                $scope.relatedCount = response.data;
                                //$scope.$parent.relatedCount = response.data;
                                setRelatedCounts($scope,response.data,$rootScope);
                            }).catch(function(response){
                                //$scope.$parent.relatedCount = [];
                                $scope.relatedCount = [];
                            });

                            $http.get(__env.apiUrl+"/devices/"+$scope.LowerOtherDeviceName+"/"+idtobeused+"/customattributes")
                                .then(function (response) {
                                    $scope.customAttributes =response['data']['customattr'];
                                    console.log('$scope.customAttributes===>' + JSON.stringify($scope.customAttributes));
                                }).catch(function (response) {
                                    $scope.statusCode = response.status;
                                    $scope.statusText = (response.statusText);
                                    console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                                    //Dummy data in case of error
                                });
                        });
                    }
                    alert("<"+$scope.globalDeviceName+ "> is edited successfully!!");
                    if ( $rootScope.searchFlag != 1  ) {
                        if($routeParams.associationHeading  && $routeParams.associationHeading != "undefined"){
                            $http.get(__env.apiUrl+'/devices/'+$scope.LowerOtherDeviceName+'/'+$routeParams.deviceName+'/'+$routeParams.associationHeading.toLowerCase()).then(function (response) {

                                if ( $routeParams.associationHeading == "Audit" ) {
                                    $scope.audit_data =response.data.auditdetails;
                                    $scope.$parent.audit_data =response.data.auditdetails;
                                    console.log("Audit Data got is :"+$scope.audit_data);
                                    $scope.headingAssociation =   $routeParams.associationHeading;
                                }
                                var nametobeused =$scope.globalDeviceName;
                                if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'logicalnetworks'){
                                    nametobeused = $scope.device_add.PKID;
                                }
                                $location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+$scope.deviceID+"/"+$scope.recordID +"/"+nametobeused+"/"+$routeParams.associationHeading+"/"+$scope.canbeAssociated);

                            }).catch(function(response){
                                $scope.headingAssociation =   $routeParams.associationHeading;
                            });
                            //$location.url("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceID+"/"+$routeParams.recordID +"/"+$scope.globalDeviceName);

                            //console.log("/otherDevices/"+$scope.LowerOtherDeviceName+"/"+$routeParams.deviceID+"/"+$routeParams.recordID +"/"+$scope.globalDeviceName+"/"+$routeParams.associationHeading);
                        } else {
                            //$location.url('/otherDevices/LIST/NULL/'+$scope.device_add.otherDevice.name+'/'+$scope.deviceIdName);
                            var nametobeused =$scope.deviceName;
                            if($scope.LowerOtherDeviceName === 'documents' || $scope.LowerOtherDeviceName === 'events' || $scope.LowerOtherDeviceName === 'deviceinterfaces' || $scope.LowerOtherDeviceName === 'interfacegroups' || $scope.LowerOtherDeviceName === 'logicalnetworks' || $scope.LowerOtherDeviceName === 'componenttocomponents'){
                                nametobeused = $scope.device_add.PKID;
                            }
                            $location.url("/otherDevices/LIST"+"/"+$scope.recordID +"/"+nametobeused+"/"+$scope.LowerOtherDeviceName);
                        }
                    }
                }).catch(function (response) {
                    $scope.disableFields = false;
                    $scope.disableSave = false;
                    $scope.saveSpinner = false;
                    $scope.table_loader = false;
                    alert("Error received while saving data: "+response.statusText +" : "+"Request failed "+" : "+response.status);
                    console.log("Inside error case");
                    $scope.statusCode = response.status;
                    $scope.statusText = (response.statusText);
                    console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);

                });

                /*Update Custom Attributes*/
                //$location.path('/logicalDeviceListView')
                if ( $rootScope.searchFlag != 1 ) {
                    //alert("done")
                    //$location.url('/logicalDevices/LIST/'+$scope.currentRecord+'/'+devname);
                }
                $scope.disableFields = true;
                $scope.disableSave = true;
            })
            .error(function (data, status, headers, config) {
                console.log('data===' + data);
                console.log('status===' + status);
                $scope.disableFields = false;
                $scope.disableSave = false;
                $scope.saveSpinner = false;
                $scope.table_loader = false;
                if ( status == 409 ) {
                    alert("Duplicate Device Name exists<"+devname+"> Please use unique name");
                } else {
                    alert("Error occurred while updating device<"+devname+">Status is<"+status+">");
                }
                console.log('headers===' + headers);
                console.log('config===' + config);
            });


    }
    $scope.getAssociatedDeviceDetail = function(deviceid){
        console.log("Inside getAssociatedDeviceDetail for :"+deviceid);
        $scope.deviceID = deviceid;
        $scope.table_loader=true;
        $scope.spinsleft = true;

        getLogialDeviceRelatedData($scope,$http,__env);
    }

    /*code change for right table UI -manisha*/
    $scope.otdtable =function(){
        //alert('inside otdtable');
        $('.change_col').removeClass('col-md-12').addClass('col-md-8');
        $("#otd-table-2").addClass('col-md-4');
        $scope.otdtable2 =true;
    }


    $scope.otdtable12 =function(){
        $('.change_col').removeClass('col-md-12').addClass('col-md-8');
        $("#otd-table-2").addClass('col-md-4');
        $scope.otdtable2 =true;
        $scope.showRightTable = false;
        console.log('$scope.showRightTable===>>>' +$scope.showRightTable);

    }

    $scope.showInfo = function(info){
        console.log('show info===' + JSON.stringify(info));
        $scope.AssociationDevInfo = info;
    }


    $scope.showAddoption = function(lodn,deviceID)
    {
        if(lodn == 'physicaldevices')
        {
            if(deviceID =='logicaldevices' || deviceID =='deviceinterfaces' || deviceID =='Documents' || deviceID =='childphysicaldevices' || deviceID =='parentphysicaldevices' || deviceID =='stakeholders' || deviceID =='events')
            {
                return true;
            }
            else{return false;}
        }
        else if(lodn == 'services' && (deviceID == 'physicaldevices' || deviceID == 'componentstodevice' || deviceID == 'stakeholderscomponents' || deviceID == 'stakeholderslogicaldevices' || deviceID == 'stakeholdersphysicaldevices' || deviceID == 'dependentdevices'  || deviceID == 'dependentcomponents' || deviceID == 'relatedcomponents'  || deviceID == 'inboundservices' || deviceID == 'outboundservices' || deviceID == 'customattributes' || deviceID == 'clustered'))
        {
            return false;
        }
        else{return true;}
    }
    /*code to show hide search and add options*/
    $scope.UpdateScheduleWeekly = function(schdArr){
        $scope.table_loader = true;
        console.log(JSON.stringify(schdArr));
        var schArr1 = {
            "id" : $rootScope.PkidData,
            "schedule":[]
        }
        schArr1.schedule = schdArr;
        console.log(JSON.stringify(schArr1));
        //var urlCall =__env.apiUrl+'/devices/update/schedule/'+$rootScope.PkidData ;
        var urlCall =__env.apiUrl+'/devices/update/events';

        $http.put(urlCall,schArr1)
            .success(function(data){
                console.log(data);
                alert('schedule updated successfully');

                var get_url = __env.apiUrl+'/devices/schedule/'+$rootScope.PkidData
                //console.log('get_url==>>>>' + get_url);
                $http.get(get_url).success(function(response){

                    console.log('response==>>>>' + JSON.stringify(response));
                    $rootScope.ScheduleChangeData = response.schedule;
                    $scope.table_loader = false;
                    window.scrollTo(0, 0);

                });
                /* column change ends*/


            })
            .error(function (data, status, headers, config) {
                console.log('data===' + data);
                console.log('status===' + status);
                $scope.documentSpinner = false;
                $scope.table_loader = false;
                if ( status == 409 ) {
                    alert("Duplicate Document Name exists. Please use unique name");
                    //$rootScope.searchDocumentJson =[];
                } else {
                    alert("Error occurred while updating < "+status);
                }
                console.log('headers===' + headers);
                console.log('config===' + config);

            });

    }
    $scope.UpdateSchedule =  function(fromDate,toDate){
        $scope.table_loader = true;
        console.log('inside update schedule');
        console.log(fromDate);
        console.log(toDate);
        var datArray = [];

        var scheduleArray = {
            "id" : $rootScope.PkidData,
            "schedule":[]
        }
        datArray.push(fromDate + ' ' + 'to' + ' ' + toDate);
        scheduleArray.schedule = datArray;
        console.log('scheduleArray---' +JSON.stringify(scheduleArray));
        console.log($rootScope.PkidData);
        //var urlCall =__env.apiUrl+'/devices/update/schedule/'+$rootScope.PkidData ;
        var urlCall =__env.apiUrl+'/devices/update/events';

        $http.put(urlCall,scheduleArray)
            .success(function(data){
                console.log(data);
                console.log('success of update event api');
                alert('Schedule updated Successfully');

                var get_url = __env.apiUrl+'/devices/schedule/'+$rootScope.PkidData
                //console.log('get_url==>>>>' + get_url);
                $http.get(get_url).success(function(response){

                    console.log('response==>>>>' + JSON.stringify(response));
                    $rootScope.ScheduleChangeData = response.schedule;
                    $scope.table_loader = false;
                    window.scrollTo(0, 0);

                });
                /* column change ends*/


            })
            .error(function (data, status, headers, config) {
                console.log('data===' + data);
                console.log('status===' + status);
                $scope.documentSpinner = false;
                $scope.table_loader = false;
                if ( status == 409 ) {
                    alert("Duplicate Document Name exists. Please use unique name");
                    //$rootScope.searchDocumentJson =[];
                } else {
                    alert("Error occurred while updating < "+status);
                }
                console.log('headers===' + headers);
                console.log('config===' + config);

            });
    }
//$scope.FinalScheduleArray =[]
    var val1Array = [];
    $scope.LeftArray = [];
    $scope.RightArray = [];

    /* new algo for Edit schedule starts*/
    $scope.checkboxModel = {
        value2:{}
    }
    $scope.checkboxModel = {
        value1: {}
    }
    $scope.disablevalEveryday = false;
    $scope.disablevalEveryonly = false;
    $scope.disableEveryMonth = false;
    $scope.disableSelectthese = false;
    $scope.disableleftMonths = true;
    $scope.UpdateDaysWeeklyScheduleNew = function(a1,b1,type,c1){
        console.log(JSON.stringify($scope.FinalScheduleArray));
        console.log(a1);
        console.log(b1);
        console.log(type);
        console.log(c1);
        if(b1 === 'Select these Months'){
            $scope.disableEveryMonth = true;
            $scope.disableleftMonths = false;

        }
        if(a1 === true){
            if(type === 'Day' && c1 === 'Every'){
                $scope.disablevalEveryday = true;

                var str11 = c1 + ' ' + b1 + ' ' + 'in';
                console.log(str11);

                $scope.LeftArray.push(str11);

            }
            else if(type === 'Day' && c1 === 'Everyday'){
                $scope.disablevalEveryonly = true;
                var str11 = c1  + ' ' + 'in';
                console.log(str11);
                $scope.LeftArray.push(str11);
            }
            else if(type === 'Month'){
                if(c1 == 'EveryMonth'){
                    $scope.RightArray.push(c1)
                    $scope.disableSelectthese = true;

                }
                else{

                    $scope.RightArray.push(b1);


                }


            }
            else {
                console.log('c1 is not equal to every');
                console.log(c1);
                if(c1 != 'Every'){
                    console.log('write the logic to replace the everyday woith first ,seconf in dropdoen')
                    for(var i=0;i<$scope.LeftArray.length;i++){
                        if($scope.LeftArray[i].indexOf(b1) != -1){
                            $scope.LeftArray[i] = $scope.LeftArray[i].replace("Every",c1)
                            console.log($scope.LeftArray[i]);
                            //console.log(str);
                        }
                        else if($scope.LeftArray[i].indexOf(b1) == -1){
                            console.log('day doesnt exist ,can add a new record');
                            var str12 = c1 + ' ' + b1 + ' ' + 'in';
                            //$scope.RightArray.push(b1);
                        }
                    }
                }
            }
        }
        else{


            console.log('a1 is false');
            console.log(b1);
            console.log(type);
            if(type === 'Day'){
                $scope.disablevalEveryday = false;
                $scope.disablevalEveryonly = false;
            }
            else if(type === 'Month'){
                $scope.disableEveryMonth = false;
                $scope.disableSelectthese = false;
                //$scope.disableleftMonths = true;
            }
            else{
                console.log('do nothing');
            }
            console.log(JSON.stringify($scope.FinalScheduleArray.length));
            console.log(JSON.stringify($scope.LeftArray));
            console.log(JSON.stringify($scope.RightArray));


            /* alternative for splicing starts*/

            var s = $scope.FinalScheduleArray.length;
            var s1 = $scope.LeftArray.length;
            var s2 = $scope.RightArray.length;
            while (s--) {
                if ($scope.FinalScheduleArray[s].indexOf(b1) != -1) {
                    $scope.FinalScheduleArray.splice(s, 1);
                }
            }
            /* splicing the right array starts*/
            while (s1--) {
                if ($scope.LeftArray[s1].indexOf(b1) != -1) {
                    $scope.LeftArray.splice(s1, 1);
                }
            }
            /* splicing the right array ends*/

            /* splicing the left array starts*/
            while (s2--) {
                if ($scope.RightArray[s2].indexOf(b1) != -1) {
                    $scope.RightArray.splice(s2, 1);
                }
            }
            /* splicing the left array ends*/
            /* alternative for splicing ends*/
        }

        console.log($scope.LeftArray);
        console.log($scope.RightArray);
        if($scope.LeftArray.length >0 && $scope.RightArray.length>0 && a1 != false){
            console.log('concatenate the arrays');
            for(var w = 0;w<$scope.RightArray.length;w++){
                if($scope.RightArray[w].indexOf("Select these Months") != -1){
                    $scope.RightArray.splice(i,1)
                }
            }
            $scope.FinalScheduleArray = [];
            for(var p =0 ;p<$scope.LeftArray.length;p++){
                for(var q =0;q<$scope.RightArray.length;q++){
                    var newStr = $scope.LeftArray[p] + ' ' + $scope.RightArray[q];
                    $scope.FinalScheduleArray.push(newStr);

                }
            }
            console.log(JSON.stringify($scope.FinalScheduleArray));

        }


    }
    /* new algo for Edit Schedule ends*/

    /* code for monthly edit the schedule strats*/
    $scope.disableLeftMonthsEditMonth = true;
    $scope.disableMonthEvery = false;
    $scope.disableMonthselective = false;
    $scope.UpdateDaysMonthlyScheduleNew = function(a1,type,b1){
        //console.log(JSON.stringify($scope.FinalScheduleArray));
        console.log(a1);
        console.log(type);
        console.log(b1);

        if(b1 === 'Select these Months'){
            //$scope.disableEveryMonth = true;
            //$scope.disableleftMonths = false;
            $scope.disableLeftMonthsEditMonth = false;
            $scope.disableMonthEvery = true;
        }

        if(a1 === true){
            if(type === 'Day' && b1 === 'Last Day'){
                // $scope.disablevalEveryday = true;
                var str11 =  b1 + ' ' + 'of';
                console.log(str11);
                $scope.LeftArray.push(str11);
            }
            else if(type === 'Day' && b1 === 'Last Working'){
                $scope.disablevalEveryonly = true;
                $scope.disableLeftMonthsEditMonth = true;
                var str11 = b1 + ' ' +'Day'+ ' '+ 'of';
                console.log(str11);
                $scope.LeftArray.push(str11);
            }
            else if(type === 'Month'){
                if(b1 == 'Every Month'){
                    // alert('aaaaa');
                    $scope.RightArray.push(b1)
                    $scope.disableMonthselective = true;

                    //$scope.disableSelectthese = true;
                }
                else{
                    $scope.RightArray.push(b1);
                }


            }
            else {
                console.log('c1 is not equal to every');
                console.log(c1);
                if(c1 != 'Every'){
                    console.log('write the logic to replace the everyday woith first ,seconf in dropdoen')
                    for(var i=0;i<$scope.LeftArray.length;i++){
                        if($scope.LeftArray[i].indexOf(b1) != -1){
                            $scope.LeftArray[i] = $scope.LeftArray[i].replace("Every",c1)
                            console.log($scope.LeftArray[i]);
                            //console.log(str);
                        }
                        else if($scope.LeftArray[i].indexOf(b1) == -1){
                            console.log('day doesnt exist ,can add a new record');
                            var str12 = c1 + ' ' + b1 + ' ' + 'in';
                            //$scope.RightArray.push(b1);
                        }
                    }
                }
            }
        }
        else if(a1 != true && b1 == 'Certain'){
            var str11 = a1 + 'rd' + ' ' + ' of';
            $scope.LeftArray.push(str11);
        }
        else{


            console.log('a1 is false');
            console.log(b1);
            console.log(type);
            if(type === 'Day'){
                $scope.disablevalEveryday = false;
                $scope.disablevalEveryonly = false;
            }
            else if(type === 'Month'){
                if(b1 === 'Every Month' || b1 ==='Select these Months'){
                    $scope.disableMonthEvery = false;
                    $scope.disableMonthselective = false;
                    $scope.disableLeftMonthsEditMonth = true;
                }

            }
            else{
                console.log('do nothing');
            }
            //console.log(JSON.stringify($scope.FinalScheduleArray.length));
            console.log(JSON.stringify($scope.LeftArray));
            console.log(JSON.stringify($scope.RightArray));


            /* alternative for splicing starts*/

            var s = $scope.FinalScheduleArray.length;
            var s1 = $scope.LeftArray.length;
            var s2 = $scope.RightArray.length;
            while (s--) {
                if ($scope.FinalScheduleArray[s].indexOf(b1) != -1) {
                    $scope.FinalScheduleArray.splice(s, 1);
                }
            }
            /* splicing the right array starts*/
            while (s1--) {
                if ($scope.LeftArray[s1].indexOf(b1) != -1) {
                    $scope.LeftArray.splice(s1, 1);
                }
            }
            /* splicing the right array ends*/

            /* splicing the left array starts*/
            while (s2--) {
                if ($scope.RightArray[s2].indexOf(b1) != -1) {
                    $scope.RightArray.splice(s2, 1);
                }
            }
            /* splicing the left array ends*/
            /* alternative for splicing ends*/
        }

        console.log($scope.LeftArray);
        console.log($scope.RightArray);
        if($scope.LeftArray.length >0 && $scope.RightArray.length>0 && a1 != false){
            console.log('concatenate the arrays');
            for(var w = 0;w<$scope.RightArray.length;w++){
                if($scope.RightArray[w].indexOf("Select these Months") != -1){
                    $scope.RightArray.splice(i,1)
                }
            }
            $scope.FinalScheduleArray = [];
            for(var p =0 ;p<$scope.LeftArray.length;p++){
                for(var q =0;q<$scope.RightArray.length;q++){
                    var newStr = $scope.LeftArray[p] + ' ' + $scope.RightArray[q];
                    $scope.FinalScheduleArray.push(newStr);

                }
            }
            console.log(JSON.stringify($scope.FinalScheduleArray));

        }


    }
} //end controller

]);



/* inbound outbound modal controller code starts*/
app.controller('InboundOutboundController',['$scope','$http','$uibModal','$uibModalInstance','$timeout','$rootScope','DeviceToAssociate','associationName','Devname' , function($scope,$http,$uibModal,$uibModalInstance,$timeout,$rootScope,DeviceToAssociate,associationName,Devname) {
    $scope.ngShowModalparams = true;
    //alert('inside controller');
    console.log('DeviceToAssociate==' +DeviceToAssociate);
    console.log('associationName===' + associationName);
    console.log('Devname==>>>' + Devname);
    $scope.dismissModalPopup = function(){
        $uibModalInstance.dismiss('cancel');
    }
    $scope.AssociatesubmitParams = function(pname,cname){
        console.log(pname);
        console.log(cname);
        /* api call starts*/
        if(!DeviceToAssociate || DeviceToAssociate ==''){alert('Please enter valid LG name'); return false;}
        console.log('associationName==>>>' +associationName);
        console.log('$scope.LowerOtherDeviceName service==>>>' + $scope.LowerOtherDeviceName);
        console.log('$scope.globalDeviceName name==>>>' + $scope.globalDeviceName);
        /* manisha's code changes associate api starts*/
        var post_url=__env.apiUrl+"/devices/components/associate/"+Devname;
        console.log('post_url------' + post_url);
        var paramObj={
            "devicetype":associationName,
            "devicename":DeviceToAssociate,
            "protocol":pname,
            "communicationtype":cname
        }
        console.log('paramObj===' + JSON.stringify(paramObj));
        $http.post(post_url,paramObj)
            .success(function(data){
                //$scope.$parent.rows = [];
                console.log('$scope.rows before---' + JSON.stringify($scope.rows))
                var compName = $scope.newCompName;
                console.log(data);
                console.log("ssssss");
                alert("<<" +DeviceToAssociate+ '>> is Associated Successfully to '+ associationName);
                $scope.table_loader=false;
                /* refreshing left table code starts */
                console.log('associationName==>>>' + associationName);
                var get_url = __env.apiUrl+'/devices/components/'+Devname+'/'+associationName
                console.log('get_url==>>>>' + get_url);
                $http.get(get_url).success(function(response){
                    /*$scope.$parent.rows =response[associationName];
                     console.log('$scope.rows after==>>>>' + JSON.stringify($scope.rows));
                     $scope.cols = Object.keys($scope.rows[0]);
                     console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));*/
                    /* column change starts*/
                    $scope.cols = [];
                    $scope.rows =response[associationName];
                    console.log('$scope.rows==>>>>' + JSON.stringify($scope.rows));
                    $http.get(__env.apiUrl+'/devices/fields/'+associationName).then(function (response) {
                        $scope.currentfielddata = response.data.fields;
                        console.log('$scope.currentfielddata===>>>' + JSON.stringify($scope.currentfielddata));
                        for ( var currentindex = 0 ; currentindex < $scope.currentfielddata.length ; currentindex++ ) {
                            if ( $scope.currentfielddata[currentindex].showinrelateddata && $scope.currentfielddata[currentindex].showinrelateddata == "yes" ) {
                                $scope.cols.push({"key":$scope.currentfielddata[currentindex].key,"fieldname": $scope.currentfielddata[currentindex].fieldname});
                            }
                        }
                        console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
                        if ( !$scope.cols ) {
                            $scope.cols = Object.keys($scope.rows[0]);
                        }
                        console.log('$scope.cols===>>>>' +JSON.stringify($scope.cols));
                    }).catch( function(response) {
                        $scope.cols = Object.keys($scope.rows[0]);
                    });
                    /* column change ends*/
                    /* call to update related counts starts*/
                    $http.get(__env.apiUrl+'/devices/components/'+Devname+'/relatedcounts').then(function (response) {
                        $scope.relatedCount = response.data;
                        console.log('$scope.relatedCount after associating inbound/outbound' +JSON.stringify($scope.relatedCount))
                        //$scope.$parent.relatedCount = response.data;
                        setRelatedCounts($scope,response.data,$rootScope);
                    }).catch(function(response){
                        $scope.relatedCount = response.data;
                        //$scope.$parent.relatedCount = [];
                    });
                    /* call to update related count ends*/
                    $uibModalInstance.close($scope.rows);
                });
            })
            .error(function (data, status, headers, config) {
                console.log('data===' + data);
                console.log('status===' + status);
                $scope.documentSpinner = false;
                $scope.table_loader = false;
                if ( status == 409 ) {
                    alert("Duplicate Document Name exists<"+DeviceToAssociate+"> Please use unique name");
                    //$rootScope.searchDocumentJson =[];
                } else {
                    alert("Error occurred while updating < "+DeviceToAssociate+" >< "+status);
                }
                console.log('headers===' + headers);
                console.log('config===' + config);
                $uibModalInstance.dismiss('cancel');
            });
        /* api call ends*/
    }
}])
/* inbound outbound modal controller code ends*/


/* controller to swap LD to be associated in case of logical network starts*/
app.controller('SwapAssociationCtrl',['$scope','$http','$uibModal','$uibModalInstance','$timeout','$rootScope','DevTobe','DevName' , function($scope,$http,$uibModal,$uibModalInstance,$timeout,$rootScope,DevTobe,DevName) {
    $scope.ngShowModalSwap = true;
    console.log(DevTobe);
    console.log(DevName);
    $scope.dismissModalPopup = function(){
        $uibModalInstance.dismiss('cancel');
    }
}])
/* controller to swap LD to be associated in case og LN ends*/

/* controller for generating profiledoc in case of search mode starts*/
app.controller('multipleProfileDocController', ['$scope', '$http', '$uibModal', '$uibModalInstance', 'deviceType', 'fieldData', '$rootScope', '$location', '$window','SearchData', function($scope, $http, $uibModal, $uibModalInstance, deviceType, fieldData, $rootScope, $location, $window,SearchData) {
    $scope.ngShowModalSearchProfileDoc = true;

    console.log(SearchData.length);
    $scope.Datalength = SearchData.length;

    $scope.dismissPopup = function() {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.ExportMode = function(mode){
        console.log('exporttt all');
        $uibModalInstance.close(mode);
        //console.log(JSON.stringify(SearchData));
    }

    $scope.ExportWordDoc = function(){
        console.log('export only current record');
    }
}
])
/* controller for generating profiledoc in search mode ends*/
