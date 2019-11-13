angular.element(window.document.body).ready(myInit);

 var myInit = function () {
    console.log("Inside getReady function to set focus");
    if (  document.getElementById('username') ) {
	 document.getElementById('username').focus();
	 }

};

app.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService','Base64','$http','$timeout',
    function ($scope, $rootScope, $location, AuthenticationService,Base64,$http,$timeout) {
        // reset login status
		var Login = this;

    Login.focus = function() {
      document.getElementById('username').focus();
    };
/*CLient Local user flag set*/
    $http.get('StaticAPI/Authentication.properties').then(function (response) {
      $rootScope.loginModeValue = response.data.loginMode;
        console.log('LoginMode is ', response.data.loginMode);
        //window.alert('Login Mode in LoginController.js ->' + $rootScope.loginModeValue);
    //$scope.$apply();
      });
/*CLient Local user flag set*/

        AuthenticationService.ClearCredentials();
        /*Local Authentication code*/

	$scope.loginLocalAuth = function (data1,data2) {
		$scope.usernameLocal = data1;
		$scope.passwordLocal = data2;
      $scope.dataLoading = true;
    //var localAuthUrl =__env.apiUrl+"/localLoginAuthenticate/";
        var localAuthUrl =__env.apiUrl+"/localLoginAuthenticate/"+Base64.encode($scope.usernameLocal)+'/'+Base64.encode($scope.passwordLocal);
     //var localAuthUrl = __env.apiUrl+'/localLoginAuthenticate/chander.c/password';
    $http.get(localAuthUrl)
		.then(function (response) {
				//window.alert('success');
        if(response["data"].status == 'success')
        {
                  $scope.roleLocal = response["data"].role;
                  if($scope.roleLocal !=='' && ($scope.roleLocal =='SCOPE+ Admin' || $scope.roleLocal =='SCOPE+ User' || $scope.roleLocal =='Super User'))
                  {
                    $scope.changePassword = response["data"].changePassword;
                    $scope.expiryPassword = response["data"].expiryPassword;
  				          AuthenticationService.SetCredentials($scope.usernameLocal, $scope.passwordLocal,$scope.roleLocal,$scope.changePassword,$scope.expiryPassword);
                    console.log("Inside success case and redirect to index.html after setting cookie for credentials");
                    $scope.dataLoading = false;
                    if($scope.changePassword || $scope.expiryPassword)
                    {
                    $location.url('/forcePassword');
                    }
                    else{$location.url('/index');}
                }
                else {
                  $scope.error = 'Role not defined for user.';
                  $scope.dataLoading = false;
                }

          }
          else{
              //$scope.error = "Error occurred, please try valid username and password";
              $scope.error = response["data"].message;
              $scope.dataLoading = false;
              return false;
          }
          }).catch(function(response) {
              console.log("Inside error case");
              var statusCode = response.status;
              var statusText = (response.statusText);
              console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
              $scope.error = response["data"].message;
              $scope.dataLoading = false;
              return false;
              //Dummy data in case of error
          });

	}
  /*Local Authentication code*/
        $scope.login = function () {
            $scope.dataLoading = true;
            $timeout(function () {
                AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    console.log("Details about authetication :" + response.data + ":" + response.status + ":" + response.message);
                    if (response.data && response.status == 200) {
					    AuthenticationService.SetCredentials($scope.username, $scope.password,'SCOPE+ Admin');
                        console.log("Inside success case and redirect to index.html after setting cookie for credentials");
                        $location.url('/index');
                        $scope.dataLoading = false;
                        /* calling user preference api nd setting the headers code starts*/
                        var associateGetUrl = __env.apiUrl+"/devices/userpreference";
                        // var associateGetUrl = "http://9.193.93.118:9080/SCOPEToolsIntegrationServices/api/devices/userpreference";
                        $http({
                            method: 'GET',
                            url: associateGetUrl,
                            headers: {
                                'email': $scope.username
                            }
                        }).then(function(response) {

                            $scope.sortData = response['data']
                            console.log(JSON.stringify($scope.getData));
                            if ( $scope.sortData ) {
                                console.log('inside sort preference')
                                $http.defaults.headers.common['sortdetails'] = JSON.stringify($scope.sortData); // jshint ignore:line
                            }
                            console.log($http.defaults.headers.common['sortdetails']);
                        })
                            .catch(function(response) {
                                console.log("Inside error case");
                                var statusCode = response.status;
                                var statusText = (response.statusText);
                                console.log("Error received while retreiving data:" + response.statusText + ":" + "Request failed" + ":" + response.status);
                                //Dummy data in case of error
                            });
                        /* calling user preference api nd settting global headers code ends*/
                    } else {
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                        $location.url('/login');
                    }
                });
            },1000);
        };
    }]);


app.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore','$rootScope','$timeout','$location','__env',
    function (Base64, $http, $cookieStore,$rootScope,$timeout,$location,__env) {
        var service = {};

        service.Login = function (username, password, callback) {

            /* Dummy authentication for testing, uses $timeout to simulate api call
            $timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);
             ----------------------------------------------*/

            /* Use this for real authentication
             ----------------------------------------------*/

            $http.get(__env.apiUrl+'/authenticate/'+Base64.encode(username)+'/'+Base64.encode(password))
                .then(function (response) {
				    response.message = "Authentiation successful";
                    callback(response);
                }).catch (function (response) {
				  console.log("Inside login error case");
				  $rootScope.statusCode = response.status;
				  $rootScope.statusText = (response.statusText );
				  response.message = "Authenticate failed. Username or password is incorrect with status: "+response.statusText ;
				  console.log("Error received while retreiving data:"+response.statusText +":"+"Request failed"+":"+response.status);
                  callback(response);
			  });

        };

        service.SetCredentials = function (username, password,role,changePassword,expiryPassword) {
		    console.log("Inside service.SetCredentials username and password got is<"+username+"><"+password+">");
            var authdata = Base64.encode(username + ':' + password);
			if(role === 'Super User'){
                role = 'SCOPE+ Admin';
                var newRole = 'Super User';
            }

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
                    role: role,
					newRole : newRole,
                    changePassword:changePassword,
                    expiryPassword:expiryPassword
                }
                //sortdetails : $rootScope.getData
            };

            console.log(JSON.stringify($rootScope.globals));

            console.log("Setting common Header Username to <"+username+">");
			if ( username ) {
			    $http.defaults.headers.common['Username'] = username; // jshint ignore:line
			}
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
			console.log("Inside SetCredentials<"+$rootScope.globals );
            $cookieStore.put('globals', $rootScope.globals);
            $rootScope.globals = $cookieStore.get('globals') || {};
			//console.log("Inside SetCredentials<"+JSON.stringify($rootScope.globals));
           console.log("Inside Sort preference<"+JSON.stringify($rootScope.getData));
        };

        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;
    }]);
app.run(['$rootScope', '$location', '$cookieStore', '$http',
function ($rootScope, $location, $cookieStore, $http) {
	// keep user logged in after page refresh
	$rootScope.globals = $cookieStore.get('globals') || {};
	console.log("Inside app.run<"+$rootScope.globals +":"+$location.path().indexOf('/login'));
	if ($rootScope.globals.currentUser) {
		$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
		if ( $rootScope.globals.currentUser.username ) {
			$http.defaults.headers.common['Username'] = $rootScope.globals.currentUser.username; // jshint ignore:line
		}
	}

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in
    if($location.path().indexOf('forgotPassword') !== -1 && !$rootScope.globals.currentUser)
    {
      $location.url('/forgotPassword');
    }
		else if ($location.path().indexOf('login') == -1  && !$rootScope.globals.currentUser) {
			$location.url('/login');
		}
    else if($rootScope.globals && $rootScope.globals.currentUser && ( $rootScope.globals.currentUser.changePassword || $rootScope.globals.currentUser.expiryPassword) ) {
			$location.url('/forcePassword');
		}
	});
}]);
app.factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-/=';

    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

    /* jshint ignore:end */
});
