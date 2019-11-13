
app.service("callCount", ['$http','__env',function($http,__env){
    var obj = {};
    obj.fetchTotalCount = function(){
        var urlCall =__env.apiUrl+"/devices/count";
        return $http.get(urlCall);
    }
 return obj;
}]);
