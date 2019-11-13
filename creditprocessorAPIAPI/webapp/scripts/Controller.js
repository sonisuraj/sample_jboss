/// <reference path="../views/Complaint.html" />
var app = angular.module('AriaMobileApp', []);

app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);

app.controller('PatientListController', function ($scope, $http, $window,$q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var userId = GetUserId();
    var instituteId = GetInstituteId();
    var url = GetRecentPatients.replace('{0}', userId).replace('{1}', instituteId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.patients = { data: data };
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("Failed to get data. Please try later.");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
});

app.controller('ScheduleController', function ($scope, $http, $filter,$q, $timeout) {

    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var physicianId = GetUserId();
    var instituteId = GetInstituteId();
    var url = GetSchedulesUrl.replace('{0}', physicianId).replace('{1}', instituteId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.schedules = data;
        $scope.schedules = transformSchedule($scope.schedules);
        $scope.newGrouping = orderSchedule($scope.newGrouping);
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');

        //angular.element(document.querySelector('#btnPatientList')).removeClass('is-disabled');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("AJAX failed!");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });

    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.differenceInDaysOld = function (dateform) {
        var date = new Date();
        var todayDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        var FromDate = dateform.match(/\S+/g);
        var fromdate = FromDate[0];
        var dt1 = todayDate.split('/'),
            dt2 = fromdate.split('/'),
            one = new Date(dt1[2], dt1[1] - 1, dt1[0]),
            two = new Date(dt2[2], dt2[0] - 1, dt2[1]);
        var timeDiff = Math.abs(two.getTime() - one.getTime());
        var diffDays = timeDiff / (1000 * 3600 * 24);
        // alert(diffDays+"||"+one+"||"+two);
        if (one > two) {
            return true;
        } else {
            return false;
        }
    }
    $scope.differenceInDayspresent = function (dateform) {
        var date = new Date();
        var todayDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        var FromDate = dateform.match(/\S+/g);
        var fromdate = FromDate[0];
        var dt1 = todayDate.split('/'),
            dt2 = fromdate.split('/'),
            one = new Date(dt1[2], dt1[1] - 1, dt1[0]),
            two = new Date(dt2[2], dt2[0] - 1, dt2[1]);
        var timeDiff = Math.abs(two.getTime() - one.getTime());
        var diffDays = timeDiff / (1000 * 3600 * 24);
        if (one <= two && diffDays < 16) {
            return true;
        } else {
            return false;
        }
    }
    $scope.differenceInDaysfuture = function (dateform) {
        var date = new Date();
        var todayDate = $filter('date')(new Date(), 'dd/MM/yyyy');
        var FromDate = dateform.match(/\S+/g);
        var fromdate = FromDate[0];
        var dt1 = todayDate.split('/'),
            dt2 = fromdate.split('/'),
            one = new Date(dt1[2], dt1[1] - 1, dt1[0]),
            two = new Date(dt2[2], dt2[0] - 1, dt2[1] - 1);
        var timeDiff = Math.abs(two.getTime() - one.getTime());
        var diffDays = timeDiff / (1000 * 3600 * 24);
        if (one <= two && diffDays > 16) {
            $scope.hide = 1;
            return true;
        } else {
            return false;
        }
    }

});

app.controller('AppontmentDetailsController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.BackDate-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var physicianId = GetUserId();
    var instituteId = GetInstituteId();
    var appointmentId = GetAppointmentId();
    var url = GetScheduleDetailsUrl.replace('{0}', physicianId).replace('{1}', instituteId).replace('{2}', appointmentId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.appontmentDetail = data;
        $scope.BackDate = ConvetDateFormat($scope.appontmentDetail.FromDate, kwDateFormateMonthDate).substring(0, 3) + " " + ConvetDateFormat($scope.appontmentDetail.FromDate, kwDateFormateMonthDate).match(/\s(.*)/)[1];
        $scope.ConvertedDate = ConvetDateFormat($scope.appontmentDetail.FromDate, kwDateFormateDayMonthDateYear);
        $scope.ConvertedFromDate = ConvetDateFormat($scope.appontmentDetail.FromDate, kwDateFormateHourMinA);
        $scope.ConvertedToDate = ConvetDateFormat($scope.appontmentDetail.ToDate, kwDateFormateHourMinA);
        $scope.appontmentDetail.TypeOfAppointment = GetAppointmentType(parseInt($scope.appontmentDetail.TypeOfAppointment));
        $scope.PhysicianName = GetUserName();
        $scope.BackDate = transformMonthAbbreviation($scope.BackDate);
        //$scope.schedules = transformSchedule($scope.schedules);
        //$scope.newGrouping = orderSchedule($scope.newGrouping);
        readyToBack = true;
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("AJAX failed!");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.appontmentDetail != null) {
            if (link == 'Patient') {
                HandleViewPatientClick($scope.appontmentDetail.PatientId)
                location.href = 'PatientInfo.html';
            }
        }
    }
});

app.controller('ImpressionPlansController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.pname-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var url = GetImpressionPlansUrl.replace('{0}', patientId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    console.log(url);
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.impression_plans = data;
        $scope.responseGot = "response";
        readyToBack = true;
        $scope.impression_plans = transformImpressionPlan($scope.impression_plans);
        $scope.DrName = GetUserName();
        var patientName = GetPatientName();
        $scope.PatientName = patientName;

        if (patientName === 'James R Black') {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }
        else if (patientName === 'Patrice  Flannigan') {
            $scope.image = '../images/CommonImages/Flannigan_patrice_F_h.png';
        }
        else if (patientName === 'Orlando  Peterson') {
            $scope.image = '../images/CommonImages/peterson_orlando_M_h.png';
        }
        else if (patientName === 'Susan T P James') {
            $scope.image = '../images/CommonImages/James_susan_F_h.png';
        }
        else if (patientName === 'Gail R Zarmour') {
            $scope.image = '../images/CommonImages/gill_h.png';
        }
        else {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("AJAX failed!");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = "response";
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
});

app.controller('ImpressionPlanDetailsController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.pname-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var visitId = GetVisitId();
    var groupId = GetGroupId();
    var url = GetImpressionPlanDetailsUrl.replace('{0}', patientId).replace('{1}', groupId).replace('{2}', visitId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    console.log(url);
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.module = data;
        $scope.responseGot = 'response';
        readyToBack = true;
        $scope.module = transformImpressionPlanDetails($scope.module);
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("AJAX failed!");
        }
        
        $scope.responseGot = 'response';
        readyToBack = true;
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
});

app.controller('LoginController', function ($scope, $http, $document,$q, $timeout) {

    $scope.SignBtn = "Sign in";
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    var R_LoginName = GetLoginName();
    var R_Password = GetPassword();
    if (R_LoginName != '' && R_Password != '') {
        console.log("Username: " + R_LoginName + ", Password: " + R_Password);
        $scope.name = R_LoginName;
        $scope.password = R_Password;
    }
    else {
        $scope.name = "drmo";
        $scope.password = "mo";
    }
    $scope.valide = function () {

        $scope.messages = '';

    }
    $scope.submitForm = function () {
        $scope.messages = "";
        if ((typeof ($scope.name) === 'undefined') || $scope.name == null || $scope.name == '') {
            document.getElementById("input_name").focus();
            $scope.messages = "Name is required.";
        }
        else if ((typeof ($scope.password) === 'undefined') || $scope.password == null || $scope.password == '') {
            document.getElementById("input_password").focus();
            $scope.messages = "Password is required.";
        }
        else {
            angular.element(document.querySelector('#ajax-loader')).css('display', '');
            $scope.SignBtn = "Signing in..";

            //ShowAjaxLoader();
            var username = $scope.name;
            var password = $scope.password;
            
            $http.defaults.headers.common[kwApi_Key] = APIKEY;
            $http.defaults.headers.common['username'] = username;
            $http.defaults.headers.common['password'] = password;
            var deferred = $q.defer();
            var httpResponse = $http.get(loginDataURL, { timeout: deferred.promise });
            httpResponse.success(function (data, status, headers, config) {
                deferred.resolve(data);
                var authKey = data;
                if (data !== undefined && data !== null && data !=="") {
                    SetLoginDetails(username, password);
                    SetAuthKey(data);
                    //location.href = "Schedule.html";
                    location.href = "views/Schedule.html";
                }
                else {
                    $('#errorMessage').html(data.ErrorMessage);
                    $scope.SignBtn = "Sign in";
                }
                angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
                //HideAjaxLoader();
            });
            httpResponse.error(function (data, status, headers, config) {
                deferred.resolve(data);

                if (status == 0) {
                    alert("Server Connection failed, please try again");
                }
                if (data !== null || data !== undefined) {
                    //$scope.messages = data.ErrorMessage;
                    $scope.messages = data.ErrorMessage;;
                }
                else {
                    $scope.messages = "Request failed. Please try later.";
                }
                angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
                $scope.SignBtn = "Sign in";
            });

            $timeout(function () {
                deferred.resolve(); // this aborts the request!
            }, 10000);
        }
        SetLastRequestCall();
    }

});

app.controller('InsertUpdateImpressionPlanController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    readyToBack = true;
    $scope.submitForm = function () {
        if (((typeof ($scope.Impression) === 'undefined') || $scope.Impression == null || $scope.Impression == '') && ((typeof ($scope.Plan) === 'undefined') || $scope.Plan == null || $scope.Plan == '')) {
            if (!IsValidSession()) {
                location.href = kwStartUpPage;
                return;
            }
            $scope.messages = "Please enter Impression or Plan.";

        }
        else {
            if (($scope.Impression != null && $scope.Impression.length === 0) || ($scope.Plan != null && $scope.Plan.length === 0)) {
                $scope.messages = "Please enter Impression or Plan.";
            }
            else {
                var TextImp = "", TextPlan = "";
                if ((typeof ($scope.Impression) === 'undefined') || $scope.Impression == null || $scope.Impression == '') {
                    TextImp = "";
                }
                else {
                    TextImp = $scope.Impression.replace(/'/g, "''");
                    TextImp = TextImp.replace(/{/g, "{{");
                    TextImp = TextImp.replace(/}/g, "}}");

                }
                if ((typeof ($scope.Plan) === 'undefined') || $scope.Plan == null || $scope.Plan == '') {
                    TextPlan = "";
                }
                else {
                    TextPlan = $scope.Plan.replace(/'/g, "''");
                    TextPlan = TextPlan.replace(/{/g, "{{");
                    TextPlan = TextPlan.replace(/}/g, "}}");
                }
                var dataObj = {
                    Impression: TextImp,
                    Plan: TextPlan
                };

                if (!IsValidSession()) {
                    location.href = kwStartUpPage;
                    return;
                }
                var userId = GetUserId();
                var instituteId = GetInstituteId();
                var patientId = GetPatientId();

                SetLastRequestCall();

                $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
                $http.defaults.headers.common[kwUserId] = GetUserId();
                $http.defaults.headers.common[kwInstituteId] = GetInstituteId();
                $http.defaults.headers.common[kwPatientId] = GetPatientId();
                var deferred = $q.defer();
                var httpResponse = $http.post(insertImpressionPlan, dataObj, { timeout: deferred.promise });
                httpResponse.success(function (data, status, headers, config) {
                    deferred.resolve(data);
                    if (status == 200 || status == 201)
                        location.href = "../views/Impression_plan.html";
                });
                httpResponse.error(function (data, status, headers, config) {
                    deferred.resolve(data);
                    if (status == 0) {
                        alert("Server Connection failed, please try again");
                        Logout();
                    }else if (data !== null || data !== undefined) {
                        alert("failure message: " + JSON.stringify({ data: data }));
                        $scope.messages = data;
                    }else {
                        alert("AJAX failed! Contact support");
                    }
                });
                $timeout(function () {
                    deferred.resolve(); // this aborts the request!
                }, 10000);
            }
        }


    }
    $scope.valide = function () {
        $scope.messages = '';
    }
    $scope.goToLink = function (link) {
            if (($scope.Impression !== undefined && $scope.Impression != null && $scope.Impression != '') || ($scope.Plan !== undefined && $scope.Plan != null && $scope.Plan != '')) {
                readyToBack = false;
                getConfirm(function (result) {
                    if (result) {
                        if (link == 'document') {
                            location.href = 'Documents.html';
                        }
                        if (link == 'imp-plan') {
                            location.href = 'Impression_plan.html';
                        }
                        if (link == 'journal') {
                            location.href = 'Journal.html';
                        }
                        if (link == 'complaint') {
                            location.href = 'Complaint.html';
                        }
                    }
                });

            } else {
                if (link == 'document') {
                    location.href = 'Documents.html';
                }
                if (link == 'imp-plan') {
                    location.href = 'Impression_plan.html';
                }
                if (link == 'journal') {
                    location.href = 'Journal.html';
                }
                if (link == 'complaint') {
                    location.href = 'Complaint.html';
                }
            }
        
    }
});

app.controller('PatientDetailController', function ($scope, $http, $q, $timeout) {
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var physicianId = GetUserId();
    var url = GetPatientsDetailsUrl.replace('{0}', physicianId).replace('{1}', patientId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.patientDetail = data;
        $scope.PatientName = $scope.patientDetail.FirstName + " " + $scope.patientDetail.MiddleName + " " + $scope.patientDetail.LastName;
        $scope.responseGot = 'response';
        readyToBack = true;
      
            if (data.FirstName === 'James') {
                $scope.image = '../images/patient_info/BlackJames_M.jpg';
            }
            else if (data.FirstName === 'Gail') {
                $scope.image = '../images/patient_info/Gail.jpg';
            }
            else if (data.FirstName === 'Susan T') {
                $scope.image = '../images/patient_info/James_susan_F.jpg';
            }
            else if (data.FirstName === 'Patrice') {
                $scope.image = '../images/patient_info/Flannigan_patrice_F.jpg';
            }
            else if (data.FirstName === 'Orlando') {
                $scope.image = '../images/patient_info/peterson_orlando_M.jpg';
            }
            else {
                $scope.image = '../images/patient_info/BlackJames_M.jpg';
            }
        

        if ($scope.patientDetail.Gender == 'M') {
            $scope.Gender = 'Male';
        }
        else if ($scope.patientDetail.Gender == 'F') {
            $scope.Gender = 'Female';
        }
        $scope.CalculatedAge = CalculateAge($scope.patientDetail.DateOfBirth);
        $scope.ConvertedDateOfBirth = ConvetDateFormat($scope.patientDetail.DateOfBirth, kwDateFormateDateMonthYear);
        SetPatientData($scope.patientDetail.PatientId, $scope.patientDetail.FirstName + " " + $scope.patientDetail.MiddleName + " " + $scope.patientDetail.LastName, " ");
        
        for (var iCnt = 0; iCnt < $scope.patientDetail.UpComingAppointments.length; iCnt++) {
            $scope.patientDetail.UpComingAppointments[iCnt].FromDate = ConvetDateFormat($scope.patientDetail.UpComingAppointments[iCnt].FromDate, kwDateFormateMonthDate) + " " + ConvetDateFormat($scope.patientDetail.UpComingAppointments[iCnt].FromDate, kwDateFormateHourMinA);
            $scope.patientDetail.UpComingAppointments[iCnt].CategoryIcon = UpcomingAppointmentsImagePath($scope.patientDetail.UpComingAppointments[iCnt].Comment);
        }
        if ($scope.patientDetail.UpComingAppointments.length <= 4) {
            DetachThis();
        }
        if ($scope.patientDetail.UpComingAppointments.length == 0) {
            $scope.Note = "No upcoming appointments";
        }
        else {
            $('.note').remove();
        }

        angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
        angular.element(document.querySelector('.Pname')).css('display', 'block');
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        angular.element(document.querySelector('#footer')).removeClass('is-disabled');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        }else if (data !== null || data !== undefined) {
            alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
        } else {
            alert("AJAX failed! Contact support");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);

    $scope.responseGot = 'response';
    readyToBack = true;

});

app.controller('PatientListController_Test', function ($scope, $http, $q, $timeout) {

    $http.defaults.headers.common['PhysicianId'] = '00100';
    $http.defaults.headers.common['FilterData'] = 'abc';
    var deferred = $q.defer();
    var httpResponse = $http.get(GetDataURL, config, { timeout: deferred.promise });

    httpResponse.success(function (data, status, headers, config) {
        $scope.patients = data;
    });
    httpResponse.error(function (data, status, headers, config) {

        if (data !== null || data !== undefined)
            alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
        else
            alert("AJAX failed! Contact support");
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
});

app.controller('JournalController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.pname-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var physicianId = GetUserId();
    var userName = GetUserName();
    var url = GetJournal.replace('{0}', physicianId).replace('{1}', patientId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        console.log("data : " + data);
        $scope.journals = data;
        $scope.responseGot = 'response';
        readyToBack = true;
        var patientName = GetPatientName();
        $scope.PatientName = patientName;

        if (patientName === 'James R Black') {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }
        else if (patientName === 'Patrice  Flannigan') {
            $scope.image = '../images/CommonImages/Flannigan_patrice_F_h.png';
        }
        else if (patientName === 'Orlando  Peterson') {
            $scope.image = '../images/CommonImages/peterson_orlando_M_h.png';
        }
        else if (patientName === 'Susan T P James') {
            $scope.image = '../images/CommonImages/James_susan_F_h.png';
        }
        else if (patientName === 'Gail R Zarmour') {
            $scope.image = '../images/CommonImages/gill_h.png';
        }
        else {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }

        for (var count = 0; count < $scope.journals.length; count++) {
            $scope.journals[count].HiddenDate = new Date($scope.journals[count].JournalDate);
            $scope.journals[count].JournalDate = ConvetDateFormat($scope.journals[count].JournalDate, kwDateFormateMonthDate);
            $scope.journals[count].ApprovedFlag = GetStatusfromOldStatus($scope.journals[count].ApprovedFlag);
        }


        $scope.DrName = userName;
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        }else if (data !== null || data !== undefined) {
            alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
        } else {
            alert("AJAX failed! Contact support");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = 'response';
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }


});

app.controller('JournalViewNoteController', function ($scope, $http, $q, $timeout) {
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    ShowAjaxLoader();
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var physicianId = GetUserId();
    var userName = GetUserName();
    var noteId = GetNoteId();
    var url = GetJournalViewNote.replace('{0}', physicianId).replace('{1}', patientId).replace('{2}', noteId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        console.log("data : " + data);
        $scope.journalNote = data;
        $scope.journalNote.JournalDate = ConvetDateFormat($scope.journalNote.JournalDate, kwDateFormateMonthDateYearTime);
        $scope.journalNote.ApprovedFlag = GetStatusfromOldStatus($scope.journalNote.ApprovedFlag);
        $scope.DrName = userName;
        angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = 'response';
        readyToBack = true;
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        }else if (data !== null || data !== undefined) {
            alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
        } else {
            alert("AJAX failed! Contact support");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = 'response';
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
});

app.controller('NewJournalController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    $scope.AddNoteBtn = "Add Journal";
    $scope.journal = {};
    $scope.journal.ApprovedFlag = 'Y';
    $scope.valide = function () {
        $scope.messages = '';
    }
    $scope.HandleChangeEvent = function () {
        $('#NoteId-button span').remove();
        $('#ApprovedFlag-button span').remove();
    }

    $scope.QuickNoteTypes = function () {
        if (!IsValidSession()) {
            location.href = kwStartUpPage;
            return;
        }
        SetLastRequestCall();
        $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
        $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();

        var url = GetQuickNoteTypeUrl;
        var deferred = $q.defer();
        var httpResponse = $http.get(url, { timeout: deferred.promise });
        httpResponse.success(function (data, status, headers, config) {
            deferred.resolve(data);
            console.log(data);
            $scope.QuickNoteTypes = data;
            $scope.journal.NoteId = $scope.QuickNoteTypes[0].Key;
            angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
            $scope.responseGot = 'response';
            readyToBack = true;
        });
        httpResponse.error(function (data, status, headers, config) {
            deferred.resolve(data);
            if (status == 0) {
                alert("Server Connection failed, please try again");
                Logout();
            }else if (data !== null || data !== undefined) {
                alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
            } else {
                alert("AJAX failed! Contact support");
            }
            angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
            $scope.responseGot = 'response';
            readyToBack = true;
            console.log(data);
        });
        $timeout(function () {
            deferred.resolve(); // this aborts the request!
        }, 10000);
    };

    $scope.submitForm = function () {
        $scope.messages = "";
        if ((typeof ($scope.NoteDescription) === 'undefined') || $scope.NoteDescription == null || $scope.NoteDescription == '') {
            if (!IsValidSession()) {
                location.href = kwStartUpPage;
                return;
            }
            $scope.messages = "Please enter note description.";

        }
        else {
            if (!IsValidSession()) {
                location.href = kwStartUpPage;
                return;
            }
            var TextDesc = "";
            if ((typeof ($scope.NoteDescription) === 'undefined') || $scope.NoteDescription == null || $scope.NoteDescription == '') {
                TextDesc = "";
            }
            else {
                TextDesc = $scope.NoteDescription.replace(/'/g, "''");
                TextDesc = TextDesc.replace(/{/g, "{{");
                TextDesc = TextDesc.replace(/}/g, "}}");
            }
            angular.element(document.querySelector('#ajax-loader')).css('display', '');
            var dataObj = {
                PatientId: GetPatientId(),
                NoteId: $scope.journal.NoteId,
                ApprovedFlag: $scope.journal.ApprovedFlag,
                NoteDescription: TextDesc
            };
            SetLastRequestCall();

            $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
            $http.defaults.headers.common[kwUserId] = GetUserId();
            $http.defaults.headers.common[kwInstituteId] = GetInstituteId();
            var deferred = $q.defer();
            var httpResponse = $http.post(InsertJournalUrl, dataObj, { timeout: deferred.promise });
            httpResponse.success(function (data, status, headers, config) {
                deferred.resolve(data);
                if (status == 200 || status == 201) {
                    location.href = "../views/Journal.html";
                }
                angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
            });
            httpResponse.error(function (data, status, headers, config) {
                deferred.resolve(data);
                if (status == 0) {
                    alert("Server Connection failed, please try again");
                    Logout();
                } else if (data !== null || data !== undefined) {
                    $scope.messages = data;
                } else {
                    $scope.messages = "Request failed. Please try later.";
                }
                angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
            });
            $timeout(function () {
                deferred.resolve(); // this aborts the request!
            }, 10000);
        }

    };
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (($scope.NoteDescription !== undefined) && $scope.NoteDescription != null && $scope.NoteDescription != "") {
                readyToBack = false;
                getConfirm(function (result) {
                    if (result) {
                        if (link == 'document') {
                            location.href = 'Documents.html';
                        }
                        if (link == 'imp-plan') {
                            location.href = 'Impression_plan.html';
                        }
                        if (link == 'journal') {
                            location.href = 'Journal.html';
                        }
                        if (link == 'complaint') {
                            location.href = 'Complaint.html';
                        }
                    }
                });
                
            } else {
                if (link == 'document') {
                    location.href = 'Documents.html';
                }
                if (link == 'imp-plan') {
                    location.href = 'Impression_plan.html';
                }
                if (link == 'journal') {
                    location.href = 'Journal.html';
                }
                if (link == 'complaint') {
                    location.href = 'Complaint.html';
                }
            }
        }
    }
});

app.controller('ComplaintHistoryController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.pname-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var physicianId = GetUserId();
    var userName = GetUserName();
    var url = GetComplaintHisory.replace('{0}', physicianId).replace('{1}', patientId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        console.log("data : " + data);
        $scope.complaintHistory = data;
        $scope.responseGot = 'response';
        readyToBack = true;
        $scope.DrName = userName;
        var patientName = GetPatientName();
        $scope.PatientName = patientName;

        if (patientName === 'James R Black') {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }
        else if (patientName === 'Patrice  Flannigan') {
            $scope.image = '../images/CommonImages/Flannigan_patrice_F_h.png';
        }
        else if (patientName === 'Orlando  Peterson') {
            $scope.image = '../images/CommonImages/peterson_orlando_M_h.png';
        }
        else if (patientName === 'Susan T P James') {
            $scope.image = '../images/CommonImages/James_susan_F_h.png';
        }
        else if (patientName === 'Gail R Zarmour') {
            $scope.image = '../images/CommonImages/gill_h.png';
        }
        else {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }

        for (var count = 0; count < $scope.complaintHistory.length; count++) {
            $scope.complaintHistory[count].HiddenDate = new Date($scope.complaintHistory[count].Date);
            $scope.complaintHistory[count].Date = ConvetDateFormat($scope.complaintHistory[count].Date, kwDateFormateMonthDate);
            $scope.complaintHistory[count].Status = GetStatusfromOldStatus($scope.complaintHistory[count].Status);
        }


        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        }else if (data !== null || data !== undefined) {
            alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
        } else {
            alert("AJAX failed! Contact support");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = 'response';
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }

});

app.controller('ComplaintHistoryDetailController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.pname-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();
    var patientId = GetPatientId();
    var physicianId = GetUserId();
    var userName = GetUserName();
    var visitId = GetVisitd();
    var groupId = GetGroupId();
    var url = GetComplaintHisoryDetails.replace('{0}', physicianId).replace('{1}', patientId).replace('{2}', groupId).replace('{3}', visitId);
    console.log(url);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        console.log("data : " + data);
        $scope.complaintHistoryDetail = data;
        $scope.responseGot = 'response';
        readyToBack = true;
        $scope.complaintHistoryDetail.Date = ConvetDateFormat($scope.complaintHistoryDetail.Date, kwDateFormateMonthDateYear);
        $scope.mydata = "['ABC', 'PQR', 'XYZ','', 'AAA', '', 'BBB']";
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        }else if (data !== null || data !== undefined) {
            alert("AJAX failed!\r\n Status:" + data.StatusCode + " ErrorMessage: " + data.ErrorMessage);
        } else {
            alert("AJAX failed! Contact support");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = 'response';
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
});

app.controller('NewComplaintController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    readyToBack = true;
    $scope.valide = function () {
        $scope.messages = '';
    }
    $scope.submitForm = function () {
        if (((typeof ($scope.Complaint) === 'undefined') || $scope.Complaint == null || $scope.Complaint == '') && ((typeof ($scope.History) === 'undefined') || $scope.History == null || $scope.History == '')) {
            if (!IsValidSession()) {
                location.href = kwStartUpPage;
                return;
            }
            $scope.messages = "Please enter chief complaint or history of present illness.";

        }
        else {
            if (!IsValidSession()) {
                location.href = kwStartUpPage;
                return;
            }
            var TextComp = "", TextHist = "";
            if ((typeof ($scope.Complaint) === 'undefined') || $scope.Complaint == null || $scope.Complaint == '') {
                TextComp = "";
            }
            else {
                TextComp = $scope.Complaint.replace(/'/g, "''");
                TextComp = TextComp.replace(/{/g, "{{");
                TextComp = TextComp.replace(/}/g, "}}");
            }
            if ((typeof ($scope.History) === 'undefined') || $scope.History == null || $scope.History == '') {
                TextHist = "";
            }
            else {
                TextHist = $scope.History.replace(/'/g, "''");
                TextHist = TextHist.replace(/{/g, "{{");
                TextHist = TextHist.replace(/}/g, "}}");
            }
            angular.element(document.querySelector('#ajax-loader')).css('display', '');
            var dataObj = {
                PatientId: GetPatientId(),
                Complaint: TextComp,
                History: TextHist
            };
            SetLastRequestCall();

            $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
            $http.defaults.headers.common[kwUserId] = GetUserId();
            $http.defaults.headers.common[kwInstituteId] = GetInstituteId();
            if ($scope.Complaint || $scope.History) {
                var deferred = $q.defer();
                var httpResponse = $http.post(InsertComplaintHistorylUrl, dataObj, { timeout: deferred.promise });
                httpResponse.success(function (data, status, headers, config) {
                    deferred.resolve(data);
                    if (status == 200 || status == 201) {
                        location.href = "../views/Complaint.html";
                    }
                    angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
                });
                httpResponse.error(function (data, status, headers, config) {
                    deferred.resolve(data);
                    if (status == 0) {
                        alert("Server Connection failed, please try again");
                        Logout();
                    } else if (data !== null || data !== undefined) {
                        $scope.messages = data;
                    } else {
                        $scope.messages = "Request failed. Please try later.";
                    }
                    angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
                });
                $timeout(function () {
                    deferred.resolve(); // this aborts the request!
                }, 10000);
            }
            else {
                $scope.messages = "Please enter chief complaint or history of present illness.";
            }
        }

    };
    $scope.goToLink = function (link) {
            if (($scope.Complaint !== undefined && $scope.Complaint != null && $scope.Complaint != '') || ($scope.History !== undefined && $scope.History != null && $scope.History != '')) {
                readyToBack = false;
                getConfirm(function (result) {
                    if (result) {
                        if (link == 'document') {
                            location.href = 'Documents.html';
                        }
                        if (link == 'imp-plan') {
                            location.href = 'Impression_plan.html';
                        }
                        if (link == 'journal') {
                            location.href = 'Journal.html';
                        }
                        if (link == 'complaint') {
                            location.href = 'Complaint.html';
                        }
                    }
                });

            } else {
                if (link == 'document') {
                    location.href = 'Documents.html';
                }
                if (link == 'imp-plan') {
                    location.href = 'Impression_plan.html';
                }
                if (link == 'journal') {
                    location.href = 'Journal.html';
                }
                if (link == 'complaint') {
                    location.href = 'Complaint.html';
                }
            }
    }
});

//Temp
app.controller('DocumentsController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    angular.element(document.querySelector('.pname-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();

    var physicianId = GetUserId();
    var patientId = GetPatientId();
    var url = GetDocumentsUrl.replace('{0}', physicianId).replace('{1}', patientId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });


    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.PatientName = GetPatientName();
        $scope.documentList = data;
        $scope.responseGot = 'response';
        readyToBack = true;
        var patientName = GetPatientName();
        $scope.PatientName = patientName;

        if (patientName === 'James R Black') {
            $scope.image = '../images/CommonImages/BlackJames_M_h.png';
        }
        else if (patientName === 'Patrice  Flannigan') {
            $scope.image = '../images/CommonImages/Flannigan_patrice_F_h.png';
        }
        else if (patientName === 'Orlando  Peterson') {
            $scope.image = '../images/CommonImages/peterson_orlando_M_h.png';
        }
        else if (patientName === 'Susan T P James') {
            $scope.image = '../images/CommonImages/James_susan_F_h.png';
        }
        else if (patientName === 'Gail R Zarmour') {
            $scope.image = '../images/CommonImages/gill_h.png';
        }
        $scope.documentList = transformDocuments($scope.documentList);
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("AJAX failed!");
        }
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
        $scope.responseGot = 'response';
        readyToBack = true;
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
});

app.controller('DocumentDetailsController', function ($scope, $http, $q, $timeout) {
    angular.element(document.querySelector('.before-load-hide')).css('display', 'block');
    if (!IsValidSession()) {
        location.href = kwStartUpPage;
        return;
    }
    SetLastRequestCall();
    $http.defaults.headers.common[kwAuthKey] = GetAuthKey();
    $http.defaults.headers.common[kwOncologyDepartment] = GetOncologyDepartment();

    var physicianId = GetUserId();
    var patientId = GetPatientId();
    var documentId = GetDocumentId();
    var url = GetDocumentDetailsUrl.replace('{0}', physicianId).replace('{1}', patientId).replace('{2}', documentId);
    var deferred = $q.defer();
    var httpResponse = $http.get(url, { timeout: deferred.promise });
    httpResponse.success(function (data, status, headers, config) {
        deferred.resolve(data);
        $scope.PhysicianName = GetUserName();
        $scope.module = data;
        $scope.responseGot = 'response';
        readyToBack = true;
        $scope.module = transformDocumentDetails($scope.module);
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    httpResponse.error(function (data, status, headers, config) {
        deferred.resolve(data);
        if (status == 0) {
            alert("Server Connection failed, please try again");
            Logout();
        } else {
            alert("AJAX failed!");
        }
        $scope.responseGot = 'response';
        readyToBack = true;
        angular.element(document.querySelector('#ajax-loader')).css('display', 'none');
    });
    $timeout(function () {
        deferred.resolve(); // this aborts the request!
    }, 10000);
    $scope.goToLink = function (link) {
        if ($scope.responseGot != null) {
            if (link == 'document') {
                location.href = 'Documents.html';
            }
            if (link == 'imp-plan') {
                location.href = 'Impression_plan.html';
            }
            if (link == 'journal') {
                location.href = 'Journal.html';
            }
            if (link == 'complaint') {
                location.href = 'Complaint.html';
            }
        }
    }
});

app.directive('itemsDrag', function () {
    var xPosStartEle = "";
    var yPosStartEle = "";
    var xPosCurEle = "";
    var yPosCurEle = "";
    var isLeft = false;
    var isRight = false;

    return {
        link: function (scope, element, attrs) {
            $(window).on("orientationchange", function () {
                if (window.innerWidth < window.innerHeight) {
                    console.log("Portrait");
                    extraValue = 0;
                    element.attr('style', function (i, style) {
                        var pos = parseInt(style.match(/translate3d\((.*)px,\s/)[1].match(/(.*)px/)[1]);
                        if (pos < 0) {
                            var buff = -86;
                            return style.replace(/translate3d\((.*)px,\s/, "translate3d(" + buff + "px, 0px, ");
                        }
                        else {
                            return style;
                        }
                    });
                }
                else if (window.innerWidth > window.innerHeight) {
                    console.log("Landscape");
                    extraValue = 0;
                    element.attr('style', function (i, style) {
                        var pos = parseInt(style.match(/translate3d\((.*)px,\s/)[1].match(/(.*)px/)[1]);
                        if (pos < 0) {
                            var buff = -86;
                            return style.replace(/translate3d\((.*)px,\s/, "translate3d(" + buff + "px, 0px, ");
                        }
                        else {
                            return style;
                        }
                    });
                }
            });

            element.animate({
                'opacity': '1.0'
            }, {
                step: function (now, fx) {
                    $(this).css({ "transform": "translate3d(0px, 0px, 0px)" });
                },
                duration: 1,
                easing: 'linear',
                queue: false
            }, 'linear');
            element.on('touchstart', function (e) {
                xPosStartEle = e.originalEvent.touches[0].pageX;
                yPosStartEle = e.originalEvent.touches[0].pageY;
            });
            element.on('touchmove', function (e) {
                xPosCurEle = e.originalEvent.touches[e.originalEvent.touches.length - 1].pageX;
                yPosCurEle = e.originalEvent.touches[e.originalEvent.touches.length - 1].pageY;
                if ((Math.abs(xPosCurEle - xPosStartEle) > 20) && (Math.abs(yPosCurEle - yPosStartEle) < 20)) {
                    if (isRight == false && xPosCurEle > (xPosStartEle + 20)) {
                        //isRight = true;
                        isLeft = false;
                        var timer = 87 + extraValue;
                        while (timer > 0) {
                            element.attr('style', function (i, style) {
                                var pos = parseInt(style.match(/translate3d\((.*)px,\s/)[1].match(/(.*)px/)[1]);
                                if (pos + extraValue > -87) {
                                    if (element.siblings(".patient-info-slider").css('visibility') != "hidden") {
                                        console.log("Hide view patient");
                                        element.siblings(".patient-info-slider").css('visibility', 'hidden');
                                    }
                                    return style.replace(/translate3d\((.*)px,\s/, "translate3d(" + timer + "px, 0px, ");
                                }
                                else {
                                    return style;
                                }
                            });
                            timer = timer - 1;
                        }
                    }
                    else if (isLeft == false && xPosStartEle > (xPosCurEle + 20)) {
                        //isLeft = true;
                        isRight = false;
                        var timer = 0;
                        while (timer + extraValue > -87) {
                            element.attr('style', function (i, style) {
                                var pos = parseInt(style.match(/translate3d\((.*)px,\s/)[1].match(/(.*)px/)[1]);
                                if (pos + extraValue > -87) {
                                    if (element.siblings(".patient-info-slider").css('visibility') != "visible") {
                                        console.log("Show view patient");
                                        element.siblings(".patient-info-slider").css('visibility', 'visible');
                                    }
                                    return style.replace(/translate3d\((.*)px,\s/, "translate3d(" + timer + "px, 0px, ");
                                }
                                else {
                                    return style;
                                }
                            });
                            timer = timer - 1;
                        }
                    }
                }
            });
            scope.$on('$destroy', function () {
                element.off('**');
            });
        }
    };
});
