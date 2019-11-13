(function (window) {
  window.__env = window.__env || {};

  // API url
  //window.__env.apiUrl = location.protocol+'//9.109.123.149:9081/SCOPEToolsIntegrationServices/api';
  //window.__env.apiUrl = location.protocol+'//9.17.237.107:9082/SCOPEToolsIntegrationServices/api'
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
		"Overview Dashboard": "iAF60BB20DCD44F0696013BE43C852B56",
		"Discovery Status as per OS": "iE95277BDF81240D8B89E9D2309F801A7",
		"logical device Completeness by Os": "iE2A5930CF1964C5893D6F503634C5738",
		"Cluster with no cluster resource": "iBD97696FBD4043D589E1D4FED3B43A55",
		"Cluster with no Logical device" : "i0B0107CA4D8840E18E3D5414495D79B0",
		"Component with no services" : "i2B62457B73734B308D52A20033970645",
		"Component with no logical device": "i15596178FDAC4E99A3162DF1FFE24936",
		"Component with no Physical Device": "iB23D81F7C16A4C1F86631E4BE2ABEE8F",
		"New-Component with no services and no logical devices": "i59DA8A9BFF9544A0A3F6970325194767",
		"Filesystem with not logical device": "i7D62B9B1B7FE4BD888284DFEB4D5CDC3",
		"Logical Device with no file system": "i8AD04375B1014FF381C23DA9071B0728",
		"Logical Device with logical network": "i4953EAAFEF22465E8BBF4308F25EB6DD",
		"Logical Device with no Physical Device": "i28C5AC8349BF43679D3492913C1407A7",
		"Logical Device with No Component": "i14D9CD790D224F08B53E938758AA6317",
		"Logical Device with no Services": "i6675AB63B442416A8E6EB530DD58B3DD",
		"New-Logical Device with no Services": "iECBF6549DFD44E6B8234124157C45402",
		"Physical Device with no logical device": "i52464F1BF41F4CE69086BDF96D042F1B",
		"Physical Device with no Component": "i8D92604DB8954B1293A3731BC06D61C2",
		"Physical Device with no Services": "i12893AF3F8464FCB86A218C5AC5FD3D4",
		"Services with no Components": "iDC4166804FF34EDCA48E5FF70DC7D825",
		"Services with no Logical Devices": "i04874E5A204A4879A01D7D15A258EEAB",
		"New-Services with no Components and no Logical Device": "iB4A77A850D684678913ECE43E314EA0B",
		"Services with no Physical Devices": "i947044CED07D4FC79667774E80C3DC1B",
		"Services with no Stakeholder": "i6766F72D9FB3470693D3584E7F4471C9",
		"Stakeholder with no relationship": "iFAD42BF7434547518325B2413B799E7C",
		"Component by Type": "iAFC06287AD714ED781CB8E81F2AE333C",
		"Logical Device by Services": "i10EDE02D4D2D41D4B03A50434002B490",
		"Logical Devies by Site": "iA67B2760278E4181A6C2FB657A9822D1",
		"Operating Systems by Environment": "i2CFC7F47174E47F6B199D1EB2ECD5BDA",
		"Physical Devices by Services": "i5EF98F2370C148689BECF85890422421",
		"Physical Devices by Site": "i7E314079DB55406CA71CA64C3A5585CA",
		"Physical Devices by Type": "i945C79E9F0C343088576320E31BE4FEE",
		"Services by Site": "i46FDFE6779464CF48D979714EC2232C8",
		"Services by Type": "i548034EE93A94DF7B450CF2F7A40631C",
		"Service with OS / Env Count": "iB8D2B6CAFA534B5EAF10ECA243E8B47C",
		"Service with Out of Scope Device": "iE30D0681142140C885C8E8E240183220",
		"Service": "iA24F4C041F5D4B3F85022BC8B3E873CF",
		"Components": "i16104F3B295E432F9711CF2C72107507",		
		"Logical Devices": "iBE8A4BD990A043C1B882F1AA27148142",
		"Physical Devices": "iD65DD89A86CA4E9F84F165A0BDD3C03C",
		"Logical Networks": "i995F0018DA0D437B92374D697E499877",
		"Clusters": "iE7BE7E9D7ADC47AAA1FCC13AF8BC9B2A",
		"File Systems": "i5006583E3ACA4EE590FDF5BCE7BC5F84",
		"Interfaces": "i8A41B817C0B34CC59070A005ABF93D85",
		"Interface Group": "i476204D09CD14D0BB9EBFFC6DA5E3F2F"

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
