(function (window) {
  window.__env = window.__env || {};

  // API url
  //window.__env.apiUrl = location.protocol+'//9.109.123.149:9081/SCOPEToolsIntegrationServices/api';
  //window.__env.apiUrl = location.protocol+'//9.17.237.36:9082/SCOPEToolsIntegrationServices/api'
  window.__env.apiUrl = window.location.protocol+'//'+window.location.host+'/SCOPEToolsIntegrationServices/api';
  window.__env.maxFileSizeUpload = '1MB';
  // Base url
  window.__env.baseUrl = '/';
  //Records count per page of list view
    window.__env.recordsPP = 20;
  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;

  window.__env.IPofCognosServer = location.protocol+'//9.17.237.53:9300/bi/v1/disp?b_action=cognosViewer&run.outputFormat=spreadsheetML&run.prompt=true&ui.object=storeID (%22{{storeId}}%22)&ui.action=run&cv.header=false&cv.toolbar=false';

  window.__env.storeIds = {
		"Overview Dashboard": "i958FDFDCBF3841F9A0B9B90CFFC7EEE4",
		"Discovery Status as per OS": "i961130C74A634295ABBC2CF9E49E16FD",
		"logical device Completeness by Os": "iBAF7E4870BB34380A635C179DCE63E56",
		"Cluster with no cluster resource": "i58872B1847C446AAA4F74A0420058E20",
		"Cluster with no Logical device" : "iA8AB80EE44E84536AEAF6288AA5F4DC1",
		"Component with no services" : "i2B62457B73734B308D52A20033970645",
		"Component with no logical device": "i4E649C457CA64761ABAE2C7BE4DE21AA",
		"Component with no Physical Device": "iEC7E8AF377BA4B9E8F88C3F21798003A",
		"New-Component with no services and no logical devices": "i364E07696C6D40C1B99199D160D67EB0",
		"Filesystem with not logical device": "i41EA71FEFE0849E1B5690291761D1B29",
		"Logical Device with no file system": "iC5ABDFB339AD419B913087F56A39FCF2",
		"Logical Device with logical network": "iA1947D28116B4CB7B6FB582D586AB621",
		"Logical Device with no Physical Device": "i1EC5AE1937324DDDB6431EB5FAF4B6BC",
		"Logical Device with No Component": "i8CD9670BB5ED4296AE5E61A75A42E597",
		"Logical Device with no Services": "i60F5ACB9F4FD4CB686D0094D3ADF7A24",
		"New-Logical Device with no Services": "i16738B3DA1734015B073233437998CC1",
		"Physical Device with no logical device": "i448C34771D7C43CA89F25F32C9654547",
		"Physical Device with no Component": "iA456C9D5002141499E4C6E96EF3AEDAF",
		"Physical Device with no Services": "i1CAC5DC27DDA43ADAE512818090F3A38",
		"Services with no Components": "iE036C08A8AD24CB48D9D88DF1BE778BC",
		"New-Services with no Components and no Logical Device": "iC0FB57975D9D4932A54372DF554A229F",
		"Services with no Logical Devices": "i38A51633D4734F3993B229CCA655B90D",
		"Services with no Physical Devices": "i7D8C7920BD18416D90A5B96BC6690CF3",
		"Services with no Stakeholder": "iB99157F7372B429CBD2B0AABB1FC41B7",
		"Stakeholder with no relationship": "i85DD636FF0FF4A5F9E7D261CA709DDDE",
		"Component by Type": "i32EF662A7099421FBA9D37AD941037C8",
		"Logical Device by Services": "iD19313FAEA61438DBD882624D4E2406F",
		"Logical Devies by Site": "i406BFB8BC2C44E05BA0B53BD7E5B4EE5",
		"Operating Systems by Environment": "iE29893B698D743A297D119C94AA43F03",
		"Physical Devices by Services": "i0BD76B1326D345E38656B33B4A7ACD90",
		"Physical Devices by Site": "i3E680C917B854C53A72F9EFC3EC1B720",
		"Physical Devices by Type": "i35EDD0FF3FC047E9BC573986ADAA264D",
		"Services by Site": "i3E680C917B854C53A72F9EFC3EC1B720",
		"Services by Type": "i35EDD0FF3FC047E9BC573986ADAA264D",
		"Service with OS / Env Count": "iB87D83A189B947C6B2301A97DF2DC47D",
		"Service with Out of Scope Device": "i7CD8FCBE506A44AE8867C0D3357352AE",
		"Service": "i997431E502A94B41BBCEF3DA6289879D",
		"Components": "i363DA908927243F4A90CF258CFCBDF70",
		"Logical Devices": "i2C4CBAB9A0174830941BE12310DF78FC",
		"Physical Devices": "i439CC09461CD45E8ACAAF655697D922E",
		"Logical Networks": "i212C993A8C214F84A926B6578189C4E4",
		"Clusters": "i636422BFF75040699AC305EBCBE5D426",
		"File Systems": "File System Marked for Reivew",
		"Interfaces": "Device Interfaces set for Review",
		"Interface Group": "i75C05E47EE3E466BA7E5B597A8CAE342"
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
