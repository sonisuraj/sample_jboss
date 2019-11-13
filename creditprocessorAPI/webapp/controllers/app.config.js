
app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
   // templateUrl : 'home.html',
   templateUrl : 'views/devicescount.html',
    controller  : 'HomeController'
  })
  .when('/logout', {
    templateUrl : 'views/login.html',
    controller  : 'LogoutController'
  })
  .when('/register', {
    templateUrl : 'views/register.html',
    controller  : 'registerController'
  })
  .when('/deleteUser', {
    templateUrl : 'views/deleteUser.html',
    controller  : 'deleteUserController'
  })
  .when('/updateUser', {
    templateUrl : 'views/updateUser.html',
    controller  : 'updateUserController'
  })
  .when('/forcePassword', {
    templateUrl : 'views/forcePassword.html',
    controller  : 'forcePasswordController'
  })
  .when('/forgotPassword', {
    templateUrl : 'views/forgotPassword.html',
    controller  : 'forgotPasswordController'
  })
  .when('/changePassword', {
    templateUrl : 'views/changePassword.html',
    controller  : 'changePasswordController'
  })
  .when('/keygen', {
        templateUrl : 'views/generateKey.html',
        controller  : 'generateKeyController'
      })
	  .when('/showKeys', {
        templateUrl : 'views/showKeys.html',
        controller  : 'showgeneratedKeyController'
      })
  .when('/index', {
    templateUrl : 'views/devicescount.html',
    controller  : 'HomeController'
  })
  .when('/addlogicalDevices', {
    templateUrl : 'addlogicalDevices.html',
    controller  : 'addlogicalDevicesController'
  })
  .when('/addotherDevices/:deviceID/', {
  templateUrl : 'addotherDevices.html',
  controller  : 'addotherDevicesController'
})
  .when('/logicalDevices', {
    templateUrl : 'logicalDevices.html',
    controller  : 'logicalDevicesController'
  })
  .when('/otherDevices/:objid/', {
    templateUrl : 'otherDevices.html',
    controller  : 'otherDevicesController'
  })
  .when('/otherDevices/:deviceID/:recordID/:deviceName/:objid/', {
    templateUrl : 'otherDevices.html',
    controller  : 'otherDevicesController'
  })

  .when('/addlogicalDevices/:deviceID/', {
    templateUrl : 'addlogicalDevices.html',
    controller  : 'addlogicalDevicesController'
  })
  .when('/logicalDevices/:deviceID/:recordID/:deviceName/', {
    templateUrl : 'logicalDevices.html',
    controller  : 'logicalDevicesController'
  })
  .when('/logicalDevices/:deviceID/', {
    templateUrl : 'logicalDevices.html',
    controller  : 'logicalDevicesController'
  })
  .when('/custom_attribute/:subSection/', {
      templateUrl : 'custom_attribute.html',
      controller  : 'customAttributeController'
  })
.when('/custom_attribute', {
		templateUrl : 'custom_attribute.html',
		controller  : 'customAttributeController'
	})
  .when('/markForDeletion', {
  		templateUrl : 'markForDeletion.html',
  		controller  : 'markForDeletionController'
  	})
  .when('/markforReview', {
    		templateUrl : 'markForReview.html',
    		controller  : 'markForReviewController'
    })
      .when('/framework', {
        templateUrl : 'framework.html',
        controller  : 'frameworkController'
      })
  .when('/logicalDeviceListView', {
    templateUrl : 'logicalDeviceListView.html',
    controller  : 'logicalDeviceListViewController'
  })
  .when('/logicalDeviceListView/:devicetype/:index', {
    templateUrl : 'logicalDeviceListView.html',
    controller  : 'logicalDeviceListViewController'
  })
  .when('/logicalDeviceListView/:devicetype/:index/:markfordeletion', {
    templateUrl : 'logicalDeviceListView.html',
    controller  : 'logicalDeviceListViewController'
  })
  /*Start::Defect21651*/
.when('/importDetails/:importType/:importID/:importTitle', {
      templateUrl : 'importDetails.html',
      controller  : 'importDetailsController'
})
.when('/importDetails/:importID/:importTitle', {
    templateUrl : 'importDetails.html',
    controller  : 'importDetailsController'
  })
.when('/importDetails', {
  templateUrl : 'importDetails.html',
  controller  : 'importDetailsController'
})
.when('/importJobList', {
  templateUrl : 'importJobList.html',
  controller  : 'importJobListController'
})
.when('/importLog/:importType/:importID/:importTitle', {
    templateUrl : 'importLog.html',
    controller  : 'importLogController'
  })
.when('/importLog/:importID/:importTitle', {
    templateUrl : 'importLog.html',
    controller  : 'importLogController'
  })
  .when('/otherDevices/:objid/:deviceID/:recordID/:deviceName/:associationHeading', {
    templateUrl : 'otherDevices.html',
    controller  : 'otherDevicesController'
  })
  .when('/otherDevices/:objid/:deviceID/:recordID/:deviceName/:associationHeading/:canbeAssociated/', {
    templateUrl : 'otherDevices.html',
    controller  : 'otherDevicesController'
  })
  .when('/otherDevices/:objid/:deviceID/:recordID/:deviceName/:associationHeading/:subHeading/:canbeAssociated/', {
    templateUrl : 'otherDevices.html',
    controller  : 'otherDevicesController'
  })
  .when('/autoload', {
    templateUrl : 'autoload.html',
    controller  : 'autoLoadController'
  })
.when('/importLog', {
  templateUrl : 'importLog.html',
  controller  : 'importLogController'
})
.when('/graph', {
  templateUrl : 'servicegraph.html',
  controller  : 'graphController'
})
.when('/graphservice', {
  templateUrl : 'ret.html',
  controller  : 'graphServiceController'
})
.when('/graph3', {
  templateUrl : 'servicegraph3.html',
  controller  : 'graphController3'
})
.when('/eachgraph3', {
  templateUrl : 'visualeachgraph.html',
  controller  : 'visualEachServiceController'
})
/*End::Defect21651*/
	.when('/login', {
		controller: 'LoginController',
		templateUrl: 'views/login.html'
	})


  .otherwise({redirectTo: '/index'});
});
