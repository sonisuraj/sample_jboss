(function (window) {
  window.__env = window.__env || {};

  // API url
  //window.__env.apiUrl = location.protocol+'//9.109.123.149:9081/SCOPEToolsIntegrationServices/api';
  //window.__env.apiUrl = location.protocol+'//9.17.237.36:9082/SCOPEToolsIntegrationServices/api'
  window.__env.apiUrl = window.location.protocol+'//'+window.location.host+'/SCOPEToolsIntegrationServices/api';
  window.__env.maxFileSizeUpload = '2MB';
  // Base url
  window.__env.baseUrl = '/';
  //Records count per page of list view
    window.__env.recordsPP = 20;
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;

  window.__env.IPofCognosServer = location.protocol+'//9.17.237.53:9300/bi/v1/disp?b_action=cognosViewer&run.outputFormat=spreadsheetML&run.prompt=true&ui.object=storeID (%22{{storeId}}%22)&ui.action=run&cv.header=false&cv.toolbar=false';

	window.__env.storeIds = {
		"Overview Dashboard": "i03AA5713BC124E479AAB486120C9D3DF",
		"Discovery Status as per OS": "i50BEA9A0BB2B49C8A36F13536EEF392A",
		"logical device Completeness by Os": "i2A7E62115A024FE6A6F71B12A5AA142D",
		"Cluster with no cluster resource": "i93B9306451544E8387FEC39ED9A332BC",
		"Cluster with no Logical device" : "i569278972BAA4B85A7107AF06B9AB43E",
		"Component with no services" : "i8722ED33E6744FC2BBAC4F54996EE8AE",
		"Component with no logical device": "iA556E93BDEB74B099532F94AEA64F619",
		"Component with no Physical Device": "i86F15BE1D08948F5A743BF0C66BB7E18",
		"New-Component with no services and no logical devices": "iD745FC71518C4DF7B60D626BF66EFAF5",
		"Filesystem with not logical device": "i3F87D68D9DD54213ACE091E1B00E55EF",
		"Logical Device with no file system": "i6FF34DA72406488583D404D267531705",
		"Logical Device with logical network": "i9C36BB420C6F407C8EE1A2D31772FC2D",
		"Logical Device with no Physical Device": "i495ECA40C89443189C226C0DA55547E1",
		"Logical Device with No Component": "i91F8ABBB364A4115AA9F6E30088E6591",
		"Logical Device with no Services": "iB43F86C51947414C852A7BEB8F68282E",
		"New-Logical Device with no Services": "i489CA3C891184B76B13480568A3748C4",
		"Physical Device with no logical device": "i27A97C314507494ABDE0324C9FC9AF52",
		"Physical Device with no Component": "iAAF7E426AD834B29AF08FF2A498F5815",
		"Physical Device with no Services": "iF57C07923D7B4D3297779070CB7C2D68",
		"Services with no Components": "iFB9BAD0DFB8D4F9EA9B16BCFC758397F",
		"New-Services with no Components and no Logical Device": "i2626260A6D73495CAFE699029EE772CA",
		"Services with no Logical Devices": "i6D875ABBB6D8478980B2CFA9841B5E5B",
		"Services with no Physical Devices": "i963DDE42E5CF48D0A6D341151FFA8FF7",
		"Services with no Stakeholder": "iB892E6AD74914494BB8C166D155BD6D7",
		"Stakeholder with no relationship": "i3026039AF23E465C9700EDF17426AA63",
		"Component by Type": "i59652BEFC5214FC683F88C20150B5254",
		"Logical Device by Services": "i670A77BFBFE84002A8D1A07B394F6510",
		"Logical Devies by Site": "i2377D0206D7145EEA6A9F46DB29E08C0",
		"Operating Systems by Environment": "iC6701F468A1E433F809A0CF5E7A8819D",
		"Physical Devices by Services": "iB026E31DF2E240089728A9F38593E11B",
		"Physical Devices by Site": "i8B8A49F0F1F04EA3816378BA70936D7A",
		"Physical Devices by Type": "iAC254DDDF1A94F0B97D201BD894C519E",
		"Services by Site": "i5BB7F659C03E40E8B16067F6C920D34D",
		"Services by Type": "i6D03E4431FA648DDBE82050542B6652E",
		"Service with OS / Env Count": "i81E78FB4208444EEB73DB36F54CD3CD7",
		"Service with Out of Scope Device": "i51000A56CAAE435E852CF6C907AA5784",
		"Service": "iA8DBA6CBBB4747FC9FB4F5AC6359A177",
		"Components": "i05206BADAE6E445B9ECA56876E39BF35",
		"Logical Devices": "iBF0B4AD2243F45A9830D2B8D4F0FD84A",
		"Physical Devices": "iB4B7C625E8AB459680A1E725B23334F3",
		"Logical Networks": "iA7ADBB0F2ABB47419BF47C35490B64F3",
		"Clusters": "i1CEFB0A68AE24AC39DBD34DE4A1B06E3",
		"File Systems": "i4BC7D8D36E1C4E2FA5B62FAADF352BC0",
		"Interfaces": "i17A0D60C8BC3439FBC827D70B165110D",
		"Interface Group": "iE7CF1FDC2340445CB2F1331046559844"
	}

}(this));
var env = {};

// Import variables if present (from env.js)
if(window){
  if ( Object.assign ) {
  Object.assign(env, window.__env);
  } else {
      env = window._env;
  }
} 