<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<%@page import="com.ibm.profiles.ScopeSession"%>
<jsp:useBean id="scope" class="com.ibm.profiles.ScopeSession"  scope="session" />
<%@page import="java.util.ArrayList"%>
<%@taglib uri="http://struts.apache.org/tags-html" prefix="html"%>
<%@taglib uri="http://struts.apache.org/tags-bean" prefix="bean"%>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en-US" xml:lang="en-US">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<meta http-equiv="PICS-Label" content='(PICS-1.1 "http://www.icra.org/ratingsv02.html" l gen true r (cz 1 lz 1 nz 1 oz 1 vz 1) "http://www.rsac.org/ratingsv01.html" l gen true r (n 0 s 0 v 0 l 0) "http://www.classify.org/safesurf/" l gen true r (SS~~000 1))' />
<link rel="schema.DC" href="http://purl.org/DC/elements/1.0/"/>
<link rel="SHORTCUT ICON" href="http://www.ibm.com/favicon.ico"/>
<meta name="IBM.DefaultView" content="[REPLACE]"/>
<meta name="IBM.CustomerSize" content="[REPLACE]"/>
<meta name="DC.Publisher" content="[REPLACE]"/>
<meta name="DC.Rights" content="© Copyright IBM Corp. 2007"/>
<meta name="IBM.Industry" scheme="IBM_IndustryTaxonomy" content="[REPLACE]"/>
<meta name="Keywords" content="[REPLACE]"/>
<meta name="DC.Date" scheme="iso8601" content="2008-04-04"/>
<meta name="Source" content="v16 Template Generator, Template 16.12"/>
<meta name="IBM.Destination" content="[REPLACE]"/>
<meta name="IBM.Expires" scheme="W3CDTF" content="[REPLACE]"/>
<meta name="Security" content="Public"/>
<meta name="Abstract" content="[REPLACE]"/>
<meta name="IBM.Effective" scheme="W3CDTF" content="[REPLACE]"/>
<meta name="DC.Subject" scheme="IBM_SubjectTaxonomy" content="[REPLACE]"/>
<meta name="Owner" content="[REPLACE]"/>
<meta name="DC.Language" scheme="rfc1766" content="en-US"/>
<meta name="IBM.SpecialPurpose" content="[REPLACE]"/>
<meta name="Robots" content="index,follow"/>
<meta name="IBM.Country" content="US"/>
<meta name="DC.Type" scheme="IBM_ContentClassTaxonomy" content="[REPLACE]"/>
<meta name="Description" content="[REPLACE]"/>
<base href=".">
<title>Source View</title>
<!-- Page meta data -->
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">


<!-- Bootstrap responsive css -->
<!-- Application Css -->
<link href="css/loginStyle.css" rel="stylesheet" />
<!--<link href="css/Common.css" rel="stylesheet" />-->
<!--<link href="css/style.css" rel="stylesheet" />-->
<link rel="stylesheet" type="text/css" href="css/SourceView.css">



<link href="css/bootstrap/bootstrap.css" rel="stylesheet" />
<!--<link href="css/bootstrap/bootstrap_320.css" rel="stylesheet" />
<link href="css/bootstrap/bootstrap_480.css" rel="stylesheet" />
<link href="css/bootstrap/bootstrap_768.css" rel="stylesheet" />-->
<link rel="stylesheet" href="css/font-awesome.min.css">
<!-- Basic js files -->
<script type ="text/javascript" charset="utf-8" src="scripts/js/jquery.js"></script>
<!--script type ="text/javascript" charset="utf-8" src="scripts/js/colResizable-1.5.min.js"></script-->
<script type ="text/javascript" charset="utf-8" src="scripts/js/angular.min.js"></script>
<script type ="text/javascript" charset="utf-8" src="scripts/js/dirPagination.js"></script>
<script type ="text/javascript" charset="utf-8" src="scripts/js/angular-route.min.js"></script>
<script src="scripts/js/angular-cookies.min.js"></script>
<script src="scripts/js/lodash.min.js"></script>
<script src="scripts/js/underscore.min.js"></script>
<script src="scripts/js/ui-bootstrap-tpls-1.2.5.js"></script>
<script src="scripts/js/alasql.min.js"></script>
<script src="scripts/js/xlsx.core.min.js"></script>
<script src="scripts/js/ng-file-upload-shim.js"></script>
<script src="scripts/js/ng-file-upload.js"></script>
<!--script src="//code.angularjs.org/1.5.6/angular-cookies.js"></script-->
<!--script type ="text/javascript" charset="utf-8" src="scripts/js/angular-cookies.js"></script-->
<link href="/SCOPEWEB/css/all.css" media="all" rel="stylesheet"
	title="www" type="text/css"/>
<link href="/SCOPEWEB/css/screen.css" media="screen,projection"
	rel="stylesheet" title="www" type="text/css"/>
<link href="/SCOPEWEB/css/screen-uas.css" media="screen,projection"
	rel="stylesheet" title="www" type="text/css"/>
<link href="/SCOPEWEB/css/screen-fonts.css" media="screen,projection"
	rel="stylesheet" title="www" type="text/css"/>
<link href="/SCOPEWEB/css/handheld.css" media="handheld"
	rel="stylesheet" title="www" type="text/css"/>
<link href="/SCOPEWEB/css/print.css" media="print" rel="stylesheet"
	title="www" type="text/css"/>
<link href="/SCOPEWEB/css/landing-page.css" media="screen,projection"
	rel="stylesheet" title="www" type="text/css"/>
<link href="/SCOPEWEB/css/lp-invite.css" media="all" rel="stylesheet"
	title="www" type="text/css"/>
<link
	href="/SCOPEWEB/css/systems_migratetoibm_include_ibmliveperson.css"
	media="screen,projection" rel="stylesheet" title="www" type="text/css"/>
<link type="text/css" title="www" rel="stylesheet" media="print" href="//www.ibm.com/common/v16/css/print.css"/>


<link rel="stylesheet" href="/SCOPEWEB/css/jquery-ui.css" />
  <script src="/SCOPEWEB/javascript/jquery-1.8.3.js"></script>
  <script src="/SCOPEWEB/javascript/jquery-ui.js"></script>
  
  <script>
  $(function() {
    $( "input[type=submit]" )
      .button()
      .click(function( event ) {
        event.preventDefault();
      });
  });
  </script>

<style type="css">
.buttonClass{
	background-color:grey;
}
</style>
</head>
<body id="ibm-com" align="center" ng-app="landingApp2" style="background-color:#f7f7f7">
<!-- Start PureCSSMenu.com STYLE -->
<jsp:include page="/jsps/profiles/css.jsp" />
<!-- End PureCSSMenu.com STYLE -->
<script language="JavaScript"> //Common functions for all dropdowns
	
	$(':checkbox').live('click', function () {
		$show=false;
		$('input[type=checkbox]').each(function () {
    		if (this.checked) {
        		$show=true;
    		}
		});
		
    	if($show==false){
    		
    		 document.getElementById("disableDivID").style.display="block";
    		 document.getElementById("enableDivID").style.display="none";
    	    
    	}
    	
    	
    	if($show==true){
    	 	document.getElementById("disableDivID").style.display="none";
    		document.getElementById("enableDivID").style.display="block";
    	}
 	});
	
</script>
<script src="scripts/js/env.js"></script>

<script src="controllers/LandingController2.js"></script>
<script src="controllers/AddLogicalDeviceController.js"></script>
<script src="controllers/app.config.js"></script>
<script src="controllers/app.directives.js"></script>
<script src="controllers/CustomAttributeController.js"></script>
<script src="controllers/HomeControler.js"></script>
<script src="controllers/LogoutController.js"></script>
<script src="controllers/LoginController_scope.js"></script>
<script src="controllers/LogicalDeviceListController.js"></script>
<script src="controllers/LogicalDeviceController.js"></script>
<script src="controllers/utilities.js"></script>
<script src="controllers/ServiceController.js"></script>
<!--Start::Defect21651-->
<script src="controllers/ImportDetailsController.js"></script>
<script src="controllers/ImportJobListController.js"></script>
<script src="controllers/ImportLogController.js"></script>
<script src="controllers/modalPopUpController.js"></script>
<script src="controllers/StakeHolderDevicesController.js"></script>
<script src="controllers/ClusterDevicesController.js"></script>
<script src="controllers/DocumentDevicesController.js"></script>
<script src="controllers/ComponentDevicesController.js"></script>
<script src="controllers/ServicesDevicesController.js"></script>

<div id="ibm-top">
<div class="ibm-access"><a href="#ibm-content">Skip to main content</a></div>
<!-- MASTHEAD_BEGIN -->
<div id="ibm-masthead">

<!-- SCOPE Logo begin -->
<div id="ibm-logo"><a href="#"><img style="margin-top: 2px;" width="70"  height="50" src="/SCOPEWEB/images/scope_logo_1.gif" alt="IBM&reg;"/></a></div>
<!-- SCOPE Logo end -->

<!-- SCOPE definition begin -->
<div style="<%=scope.getScopestyle() %>"><%=scope.getScopeheading() %></div>
<!-- SCOPE definition end -->

<!-- IBM Logo begin -->
<div style="clear: right;
    float: right;
    margin: 0 0 -4px; color: #FFFFFF; text-align: left; "><a href="#"><img style="margin-top: -20px;" width="110" src="/SCOPEWEB/images/ibm-logo.gif" height="50" alt="IBM&reg;"/></a></div>
<!-- IBM Logo end -->


<div id="ibm-universal-nav">
<%= scope.generateNav(scope) %>
<div id="ibm-universal-nav" style="background: url('/SCOPEWEB/images/sprites-t1.gif') repeat-x scroll 0 -545px #FFFFFF;
    border: 1px solid #CCCCCC;
    height: 1%;
    margin: 0;
    padding: 3px 5px;
	font-size: 0.70em;
	font-family: arial,sans-serif;
	text-align: left;
	
	">
<li><strong>User : </strong>&nbsp;<%=scope.getUsername() %></li>
<li><strong>Project : </strong>&nbsp;<%=scope.getProject() %></li>
<li><strong>Role : </strong>&nbsp;<%=scope.getRole() %></li>
<li><strong>Database : </strong>&nbsp;<%=scope.getDbName() %></li>
<li><strong>IP Address : </strong>&nbsp;<%=scope.getDbHostname() %></li>
<li><strong>DB Port : </strong>&nbsp;<%=scope.getDbPort() %></li>
<li><img style="vertical-align:text-bottom;" src="/SCOPEWEB/images/log_out.png" />&nbsp;<a class="ibm-anchor-down-em-link" href="/SCOPEWEB/Logout.do"><strong>Log Out</strong></a></li>
</div>
<a id="pcm" href="http://www.purecssmenu.com/">CSS Drop Down Menu by PureCSSMenu.com</a>
<!-- End PureCSSMenu.com MENU -->
</div>
<!-- IBM Navigation End -->
<!-- MASTHEAD_END -->
</div>


<!--End::Defect21651-->
<ng-include src="'views/header_scope.html'"></ng-include>

<div ng-view class="container" ng-controller="landingController2">
    <ng-include  ng-if="statusCode >=200 && statusCode < 300" src="'views/devicescount.html'"></ng-include>
    <ng-include ng-if="statusCode <200 || statusCode > 300 " src="'views/error.html'"></ng-include>
</div>
</body>
<script>
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    })
</script>
</html>
