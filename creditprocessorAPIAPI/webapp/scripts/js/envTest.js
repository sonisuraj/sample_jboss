(function (window) {
  window.__env = window.__env || {};

  // API url
  window.__env.apiUrl = 'http://9.17.237.36:9080/SCOPEToolsIntegrationServices/api';

  // Base url
  window.__env.baseUrl = '/';

  // Whether or not to enable debug mode
  // Setting this to false will disable console output
  window.__env.enableDebug = true;
}(this));
var env = {};

// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}