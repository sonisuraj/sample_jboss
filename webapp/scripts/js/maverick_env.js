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
  
  window.__env.IPofCognosServer = location.protocol+'//9.193.198.111:9300/bi/v1/disp?b_action=cognosViewer&run.outputFormat=spreadsheetML&run.prompt=true&ui.object=storeID (%22{{storeId}}%22)&ui.action=run&cv.header=false&cv.toolbar=false';

	window.__env.storeIds = {
		"Overview Dashboard": "",
		"Discovery Status as per OS": "i1D42A7E76FA04B36B7008708C166927B",
		"logical device Completeness by Os": "iDD9822D13C384F53BFB6E5BB19281070",
		"Cluster with no cluster resource": "i8E8C240C8D404BF290475D7DB982EBF7",
		"Cluster with no Logical device" : "i970CF7F96F5845EBBDB2F36ED56B03AF",
		"Component with no services" : "i5011464A9C8848C4BCC6785F1D776330",
		"New-Component with no services and no logical devices": "iE34658944D334799B9BFC30A8A9DC165",
		"Component with no logical device": "iA3469D335FD2439F8635D15D78F8E5EB",
		"Component with no Physical Device": "iC740B8E79DF44AB4A6599F85A115913E",
		"Filesystem with not logical device": "iFDDF8309657F4D14B111A8313632949A",
		"Logical Device with no file system": "iEE4FBA88F48D4A3C92F254BA5BAB717C",
		"Logical Device with logical network": "iBC27890DCFA44E4D860FB27EA929B297",
		"Logical Device with no Physical Device": "i51E089A08F254245BB7D561EA0E001D7",
		"Logical Device with No Component": "i4793F6C91DBD46E59DD63D3F6EB2F04B",
		"Logical Device with no Services": "i371BEFCF71DF43D880678660367C1166",
		"New-Logical Device with no Services": "i84825EAA9ABD447E8AF084BA38A57144",
		"Physical Device with no logical device": "iAC7BF864CD1C4D469B7FDE90147C4014",
		"Physical Device with no Component": "iE609380A7CF74A2BA3F7841890654B63",
		"Physical Device with no Services": "i61D4BA9E2F604BD1AD287994DAB75049",
		"Services with no Components": "i22827BEC06534BE18AB7C92444050FD4",
		"New-Services with no Components and no Logical Devices": "i6F1A76A5B961496496BA4EA6364F8598",
		"Services with no Logical Devices": "iAA25B5203AE742B79295CF2D46FB2716",
		"Services with no Physical Devices": "i15F80287FCB74903817AD2FE697DF818",
		"Services with no Stakeholder": "i51BC36D43D934526B2F9B28C00E0677C",
		"Stakeholder with no relationship": "i9890405F2DD54F0EBA77F99A0B317E46",
		"Component by Type": "i6A15929553A648FB9AD8E5ED5E474A5E",
		"Logical Device by Services": "i5626ECC4D5764BB2B42EA13F130856E6",
		"Logical Devies by Site": "i5626ECC4D5764BB2B42EA13F130856E6",
		"Operating Systems by Environment": "i90B836A230414982BC7CCF99840BD179",
		"Physical Devices by Services": "i2E8BE688B6F343ADBF178670D292FA6D",
		"Physical Devices by Site": "i2E8BE688B6F343ADBF178670D292FA6D",
		"Physical Devices by Type": "i17402C1E5DC245ACA1E8EEBF3CB99819",
		"Services by Site": "i6740C97C3BFD433391A85F455E602598",
		"Services by Type": "i652CFA1FA6EE43D79470354F6FBAB66A",
		"Service with OS / Env Count": "i267A3B82BE75421D8365BD30497BDD92",
		"Service with Out of Scope Device": "iA5945900B79944DF8777A71A4458393B",
		"Service": "iE872B95A8D8E46E4AC7C7A621E31C356",
		"Components": "i14A4E42C67764C369F3C89379160B42F",
		"Logical Devices": "iE2BBD0D4759C4C0EBC59578601434C6A",
		"Physical Devices": "iD604BD198DD4491A956AAFA0C9B1CEEB",
		"Logical Networks": "iE1E03E88D84E42A99F82E021D3A48EEC",
		"Clusters": "iC00587D1BF634C08970ED49599C50A8D",
		"File Systems": "i93E71F000C2D4063BBCEB92ACC9C88C6",
		"Interfaces": "iB05AC2D1CD384C97BE23F4184ECF5D3F",
		"Interface Group": "iA2EBC68635BD48DC982E507C0B133C24"
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