app.controller('visualEachServiceController', ['$scope','$http','$location','$rootScope','$interval','__env','callCount','Upload', '$timeout','$uibModal','$routeParams','$window',function($scope,$http,$location,$rootScope,$interval,__env,callCount,Upload, $timeout,$uibModal,$routeParams,$window) {
$rootScope.currentlydisplayedservice;
console.log($rootScope.currentlydisplayedservice);
//$scope.data=[];
$scope.data =$rootScope.currentlydisplayedservice;
//$scope.data.push($rootScope.currentlydisplayedservice);
$scope.openGraph = function(t){
  $scope.getData=t['nodes'];
  console.log($scope.getData);
  $rootScope.currentlydisplayedservice= t;
  $scope.node =[];
  for(var i =0; i<$scope.getData.length;i++){
    var group = $scope.getData[i].group;
    if(group == 3){
      type ='square';
      size = 60;
      $scope.node.push({"size":size,"type":type,"id":$scope.getData[i].id,"name":$scope.getData[i].name,"group":$scope.getData[i].group});
    }
    if(group ==1){
      size =70;
        type ='circle';
        $scope.node.push({"size":size,"type":type,"id":$scope.getData[i].id,"name":$scope.getData[i].name,"group":$scope.getData[i].group});
    }
    if(group ==2){
      size =40;
        type ='circle';
        $scope.node.push({"size":size,"type":type,"id":$scope.getData[i].id,"name":$scope.getData[i].name,"group":$scope.getData[i].group});
    }
    if(group==7){
      size =70;
        type ='circle';
        $scope.node.push({"size":size,"type":type,"id":$scope.getData[i].id,"name":$scope.getData[i].name,"group":$scope.getData[i].group,error:true});
    }
    if(group ==4 || group ==5 || group ==6){
      size =60;
        type ='circle';
        $scope.node.push({"size":size,"type":type,"id":$scope.getData[i].id,"name":$scope.getData[i].name,"group":$scope.getData[i].group,error:true});
    }

  }

  $rootScope.currentlydisplayedservice ={
  nodes :$scope.node,
  links:t['links']
};
console.log($rootScope.currentlydisplayedservice);
var t = JSON.stringify($rootScope.currentlydisplayedservice);
$window.sessionStorage.setItem("currentlydisplayedservice",t);
window.open('#/graph');


}
}]);
